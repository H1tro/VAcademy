import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-server"
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore"

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
    const snap = await getDoc(doc(db, "admin_config", department))
    if (snap.exists()) return snap.data().chatId as number
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
      createdAt: serverTimestamp(),
    }

    const ticketRef = await addDoc(collection(db, "tickets"), ticket)

    // Notify ONLY the correct department
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
        body: JSON.stringify({ chat_id: adminChatId, text: header }),
      })
    }

    const departmentName = subject
    return NextResponse.json({ success: true, ticketId: ticketRef.id, department: departmentName })
  } catch (error) {
    console.error("Feedback error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
