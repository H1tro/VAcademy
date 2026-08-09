import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"

export async function POST(req: Request) {
  try {
    const { token, uid } = await req.json()

    if (!token || !uid) {
      return NextResponse.json({ error: "token and uid required" }, { status: 400 })
    }

    const hasFirebaseCreds = !!(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)

    const db = getDb()
    const tokenSnap = await db.doc(`deletion_tokens/${token}`).get()

    if (!tokenSnap.exists) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    const tokenData = tokenSnap.data()!
    if (tokenData.uid !== uid) {
      return NextResponse.json({ error: "Token does not match user" }, { status: 403 })
    }

    if (new Date(tokenData.expiresAt) < new Date()) {
      await db.doc(`deletion_tokens/${token}`).delete()
      return NextResponse.json({ error: "Token expired" }, { status: 400 })
    }

    const submissionsSnap = await db.collection("submissions").where("uid", "==", uid).get()
    const batch = db.batch()
    submissionsSnap.docs.forEach((doc) => batch.delete(doc.ref))
    await batch.commit()

    await db.doc(`users/${uid}`).delete()
    await db.doc(`deletion_tokens/${token}`).delete()

    let authDeleted = false
    if (hasFirebaseCreds) {
      try {
        const { getAuth } = await import("firebase-admin/auth")
        await getAuth().deleteUser(uid)
        authDeleted = true
      } catch (authErr) {
        console.error("Auth delete failed:", authErr)
      }
    }

    return NextResponse.json({
      success: true,
      authDeleted,
      warning: !hasFirebaseCreds ? "FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY not set — Auth user not deleted" : undefined,
    })
  } catch (error) {
    console.error("Confirm deletion error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
