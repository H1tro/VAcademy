import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { initializeApp, getApps, cert, getApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

function getFirebaseAdmin() {
  if (getApps().length > 0) return getApp()
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || ""
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim() || ""
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY?.trim() || "").replace(/\\n/g, "\n")
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
}

export async function POST(req: Request) {
  try {
    const { token, uid } = await req.json()

    if (!token || !uid) {
      return NextResponse.json({ error: "token and uid required" }, { status: 400 })
    }

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

    // Delete submissions
    const submissionsSnap = await db.collection("submissions").where("uid", "==", uid).get()
    const batch = db.batch()
    submissionsSnap.docs.forEach((doc) => batch.delete(doc.ref))
    await batch.commit()

    // Delete user document
    await db.doc(`users/${uid}`).delete()

    // Delete deletion token
    await db.doc(`deletion_tokens/${token}`).delete()

    // Delete Firebase Auth user
    try {
      getFirebaseAdmin()
      await getAuth().deleteUser(uid)
    } catch {
      // Auth user may already be deleted or not exist — continue
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Confirm deletion error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
