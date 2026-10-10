import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requestUser } from "@/lib/server-auth"
import { getSupabaseConfig } from "@/utils/supabase/config"
import { createAdminClient } from "@/utils/supabase/admin"

export async function POST(req: Request) {
  try {
    const uid = await requestUser(req)
    if (!uid) return NextResponse.json({ code: "unauthorized" }, { status: 401 })
    const { password } = await req.json()
    if (typeof password !== "string" || !password || password.length > 1024) {
      return NextResponse.json({ code: "password_required" }, { status: 400 })
    }
    const admin = createAdminClient()
    const { data: { user: account }, error: accountError } = await admin.auth.admin.getUserById(uid)
    if (accountError || !account?.email) return NextResponse.json({ code: "unauthorized" }, { status: 401 })
    const { url, key } = getSupabaseConfig()
    const verifier = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data, error } = await verifier.auth.signInWithPassword({ email: account.email, password })
    if (error || data.user?.id !== uid) {
      if (data.session) await verifier.auth.signOut({ scope: "local" })
      return NextResponse.json({ code: error?.status === 429 ? "rate_limited" : "invalid_password" }, { status: error?.status === 429 ? 429 : 403 })
    }
    try {
      // Database deletion trigger removes account-linked application records.
      const { error: deletionError } = await admin.auth.admin.deleteUser(uid, false)
      if (deletionError) {
        console.error("Password-confirmed account deletion failed", { code: deletionError.code, status: deletionError.status })
        return NextResponse.json({ code: "deletion_failed" }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    } finally {
      // Never retain the temporary password-verification session.
      try { await verifier.auth.signOut({ scope: "local" }) } catch { /* Account may already be deleted. */ }
    }
  } catch {
    return NextResponse.json({ code: "deletion_failed" }, { status: 500 })
  }
}
