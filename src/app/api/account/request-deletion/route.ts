import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"
import { Resend } from "resend"
import crypto from "crypto"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { uid, email } = await req.json()

    if (!uid || !email) {
      return NextResponse.json({ error: "uid and email required" }, { status: 400 })
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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vacademy-weld.vercel.app"
    const confirmUrl = `${baseUrl}/delete-account?token=${token}&uid=${uid}`

    await resend.emails.send({
      from: "VAcademy <onboarding@resend.dev>",
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Request deletion error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
