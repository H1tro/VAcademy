import { requestUser } from "@/lib/server-auth"
import { NextResponse } from "next/server"
import { getDb } from "@/lib/database"
import { FieldValue } from "@/lib/database"
import { Resend } from "resend"
import crypto from "crypto"

export async function POST(req: Request) {
  let pendingToken: string | undefined
  try {
    const { uid, email } = await req.json()

    if (typeof uid !== "string" || typeof email !== "string" || !uid || !email) {
      return NextResponse.json({ error: "uid and email required" }, { status: 400 })
    }

    if (await requestUser(req) !== uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { createAdminClient } = await import("@/utils/supabase/admin")
    const { data: { user: account }, error: accountError } = await createAdminClient().auth.admin.getUserById(uid)
    if (accountError || account?.email !== email) return NextResponse.json({ error: "Email does not match account" }, { status: 403 })
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM_EMAIL?.trim()
    if (!apiKey || !from) {
      return NextResponse.json({ code: "mail_not_configured" }, { status: 503 })
    }
    const db = getDb()
    const userSnap = await db.doc(`users/${uid}`).get()
    if (!userSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = userSnap.data()!
    if (userData.email !== email) {
      return NextResponse.json({ error: "Email does not match" }, { status: 403 })
    }

    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await db.doc(`deletion_tokens/${token}`).set({
      uid,
      email,
      expiresAt: expiresAt.toISOString(),
      createdAt: FieldValue.serverTimestamp(),
    })
    pendingToken = token

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vacademy-beta.vercel.app"
    const confirmUrl = `${baseUrl}/delete-account?token=${token}&uid=${uid}`

    const resend = new Resend(apiKey)
    const { data: sentEmail, error: sendError } = await resend.emails.send({
      from,
      to: email,
      subject: "Подтверждение удаления аккаунта VAcademy",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="margin-bottom: 16px;">Удаление аккаунта</h2>
          <p style="margin-bottom: 24px; color: #555;">
            Вы запросили удаление аккаунта. Нажмите кнопку ниже, чтобы подтвердить.
            Ссылка действительна в течение 24 часов.
          </p>
          <a href="${confirmUrl}"
             style="display: inline-block; padding: 12px 24px; background: #ef4444; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Подтвердить удаление
          </a>
          <p style="margin-top: 32px; color: #999; font-size: 12px;">
            Если вы не запрашивали удаление — просто проигнорируйте это письмо.
          </p>
        </div>
      `,
    })

    if (sendError || !sentEmail?.id) {
      await db.doc(`deletion_tokens/${token}`).delete()
      pendingToken = undefined
      // Provider messages can contain recipient addresses; log only safe metadata.
      console.error("Deletion email rejected", { provider: "resend", name: sendError?.name, statusCode: sendError?.statusCode })
      const status = sendError?.statusCode
      return NextResponse.json({ code: status === 429 ? "mail_rate_limited" : status === 401 || status === 403 || status === 422 ? "mail_configuration_error" : "mail_delivery_failed" }, { status: status === 429 ? 429 : 502 })
    }
    pendingToken = undefined
    return NextResponse.json({ success: true })
  } catch (error) {
    if (pendingToken) {
      try { await getDb().doc(`deletion_tokens/${pendingToken}`).delete() }
      catch { console.error("Deletion token cleanup failed") }
    }
    console.error("Request deletion failed", { type: error instanceof Error ? error.name : "unknown" })
    return NextResponse.json({ code: "mail_delivery_failed" }, { status: 500 })
  }
}
