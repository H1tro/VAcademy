import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`

const SUBJECT_IDS: Record<string, string> = {
  biology: "biology",
  physics: "physics",
  chemistry: "chemistry",
  math: "math",
  cs: "cs",
}

async function getDeptAdminChatId(department: string): Promise<number | null> {
  try {
    const db = getDb()
    const snap = await db.doc(`admin_config/${department}`).get()
    if (snap.exists) return snap.data()!.chatId as number
  } catch {
    /* ignore */
  }
  return null
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
      department: SUBJECT_IDS[subject] || subject,
      category,
      message,
      fileIds: [] as string[],
      status: "open",
      replies: [],
      createdAt: FieldValue.serverTimestamp(),
    }

    const ticketRef = await db.collection("tickets").add(ticket)

    const deptId = SUBJECT_IDS[subject]
    const adminChatId = deptId ? await getDeptAdminChatId(deptId) : null
    if (adminChatId) {
      const header = [
        `📩 Новая заявка #${ticketRef.id}`,
        "🌐 Источник: сайт",
        `👤 ${userName || "Гость"}`,
        `📖 Предмет: ${subject}`,
        `📂 Категория: ${category}`,
        `💬 ${message}`,
      ].join("\n")

      await fetch(`${TG_API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: header,
          reply_markup: {
            inline_keyboard: [
              [{ text: "✏️ Ответить", callback_data: `reply_ticket:${ticketRef.id}` }],
            ],
          },
        }),
      })
    }

    const departmentName = subject
    return NextResponse.json({ success: true, ticketId: ticketRef.id, department: departmentName })
  } catch (error) {
    console.error("Feedback error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
