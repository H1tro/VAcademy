import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"
import { BOT_SUBJECTS } from "@/lib/bot-constants"

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`

async function getDeptAdminChatIds(department: string): Promise<number[]> {
  try {
    const db = getDb()
    const snap = await db.doc(`admin_config/${department}`).get()
    if (snap.exists) {
      const data = snap.data()!
      if (Array.isArray(data.chatIds)) return data.chatIds as number[]
      if (data.chatId) return [data.chatId as number]
    }
  } catch {}
  return []
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { subject, category, message, userName } = body

    if (!subject || !category || !message) {
      return NextResponse.json({ error: "subject, category, message are required" }, { status: 400 })
    }

    const db = getDb()
    const ticket = {
      source: "web",
      userId: "",
      userName: userName || "Гость",
      username: "",
      subject,
      subjectLabel: subject,
      department: subject,
      category,
      message,
      fileIds: [] as string[],
      status: "open",
      replies: [],
      createdAt: FieldValue.serverTimestamp(),
    }

    const ticketRef = await db.collection("tickets").add(ticket)

    const adminIds = await getDeptAdminChatIds(subject)
    if (adminIds.length > 0) {
      const header = [
        `\uD83D\uDCE2 Новая заявка #${ticketRef.id}`,
        "\uD83C\uDF10 Источник: сайт",
        `\uD83D\uDC64 ${userName || "Гость"}`,
        `\uD83D\uDCD6 Предмет: ${subject}`,
        `\uD83D\uDCC2 Категория: ${category}`,
        `\uD83D\uDCAC ${message}`,
      ].join("\n")

      for (const adminChatId of adminIds) {
        await fetch(`${TG_API}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: adminChatId,
            text: header,
            reply_markup: {
              inline_keyboard: [
                [{ text: "\u270F\uFE0F Ответить", callback_data: `reply_ticket:${ticketRef.id}` }],
              ],
            },
          }),
        })
      }
    }

    return NextResponse.json({ success: true, ticketId: ticketRef.id, department: subject })
  } catch (error) {
    console.error("Feedback error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
