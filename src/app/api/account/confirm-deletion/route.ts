import { createAdminClient } from "@/utils/supabase/admin"
import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"

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

    // The auth.users deletion trigger removes the user's application records atomically.
    const { error } = await createAdminClient().auth.admin.deleteUser(uid)
    if (error) throw error
    return NextResponse.json({ success: true, authDeleted: true })
  } catch (error) {
    console.error("Confirm deletion error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
