import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-server"
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore"

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`

const STEPS = {
  SUBJECT: "subject",
  CATEGORY: "category",
  MESSAGE: "message",
  DONE: "done",
} as const

// Same subjects as on web form (IDs must match)
const SUBJECTS = [
  { id: "biology", label: "\uD83E\uDDEC Биология" },
  { id: "physics", label: "\u269B\uFE0F Физика" },
  { id: "chemistry", label: "\uD83E\uDDEA Химия" },
  { id: "math", label: "\u2797 Математика" },
  { id: "cs", label: "\uD83D\uDCBB Информатика" },
]

const CATEGORIES = [
  { id: "materials", label: "\uD83D\uDCDA Учебные материалы" },
  { id: "documents", label: "\uD83D\uDCC4 Документы" },
  { id: "homework", label: "\uD83D\uDCDD Домашнее задание" },
  { id: "olympiads", label: "\uD83C\uDF93 Олимпиады" },
  { id: "teacher", label: "\uD83D\uDC68\u200D\uD83C\uDF93 Преподаватель" },
  { id: "technical", label: "\u2699\uFE0F Техническая проблема" },
  { id: "other", label: "\u2753 Другое" },
]

const SUBJECT_DEPARTMENTS: Record<string, string> = {
  biology: "департамент биологии",
  physics: "департамент физики",
  chemistry: "департамент химии",
  math: "департамент математики",
  cs: "департамент информатики",
}

// ---------- helpers ----------

async function tgSend(chatId: number, text: string, opts?: Record<string, unknown>) {
  await fetch(`${TG_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, ...opts }),
  })
}

async function tgAnswer(callbackQueryId: string) {
  await fetch(`${TG_API}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId }),
  })
}

async function tgEdit(
  chatId: number,
  messageId: number,
  text: string,
  opts?: Record<string, unknown>
) {
  await fetch(`${TG_API}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, ...opts }),
  })
}

async function getAdminChatId(): Promise<number | null> {
  try {
    const snap = await getDoc(doc(db, "admin_config", "primary"))
    if (snap.exists()) return snap.data().chatId as number
  } catch {
    /* ignore */
  }
  return null
}

async function getSession(telegramId: number) {
  const snap = await getDoc(doc(db, "bot_sessions", String(telegramId)))
  return snap.exists() ? snap.data() : null
}

async function saveSession(telegramId: number, data: Record<string, unknown>) {
  await setDoc(doc(db, "bot_sessions", String(telegramId)), data, { merge: true })
}

// ---------- keyboards ----------

function subjectKeyboard() {
  return {
    inline_keyboard: SUBJECTS.map((s) => [
      { text: s.label, callback_data: `subject:${s.id}` },
    ]),
  }
}

function categoryKeyboard() {
  return {
    inline_keyboard: [
      ...CATEGORIES.map((c) => [
        { text: c.label, callback_data: `category:${c.id}` },
      ]),
      [{ text: "\uD83D\uDD19 Назад", callback_data: "back:subject" }],
    ],
  }
}

function backToCategoryKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "\uD83D\uDD19 Назад", callback_data: "back:category" }],
    ],
  }
}

function newTicketKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "\uD83D\uDCDD Создать новую заявку", callback_data: "new_ticket" }],
    ],
  }
}

// ---------- handlers ----------

async function handleCallback(query: any) {
  const { data, message, from, id: callbackId } = query
  const chatId: number = message.chat.id
  const messageId: number = message.message_id
  const telegramId: number = from.id

  await tgAnswer(callbackId)

  // new ticket — reset
  if (data === "new_ticket") {
    await saveSession(telegramId, { step: STEPS.SUBJECT, updatedAt: serverTimestamp() })
    await tgEdit(
      chatId,
      messageId,
      "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.",
      { reply_markup: subjectKeyboard() }
    )
    return
  }

  // back to subject
  if (data === "back:subject") {
    await saveSession(telegramId, { step: STEPS.SUBJECT, updatedAt: serverTimestamp() })
    await tgEdit(
      chatId,
      messageId,
      "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.",
      { reply_markup: subjectKeyboard() }
    )
    return
  }

  // back to category
  if (data === "back:category") {
    await saveSession(telegramId, { step: STEPS.CATEGORY, updatedAt: serverTimestamp() })
    await tgEdit(chatId, messageId, "Выберите категорию обращения:", {
      reply_markup: categoryKeyboard(),
    })
    return
  }

  // subject selected
  if (data.startsWith("subject:")) {
    const subjectId = data.slice(8)
    const subject = SUBJECTS.find((s) => s.id === subjectId)
    if (!subject) return

    await saveSession(telegramId, {
      step: STEPS.CATEGORY,
      subject: subjectId,
      subjectLabel: subject.label,
      updatedAt: serverTimestamp(),
    })

    await tgEdit(chatId, messageId, "Выберите категорию обращения:", {
      reply_markup: categoryKeyboard(),
    })
    return
  }

  // category selected
  if (data.startsWith("category:")) {
    const categoryId = data.slice(9)
    const category = CATEGORIES.find((c) => c.id === categoryId)
    if (!category) return

    await saveSession(telegramId, {
      step: STEPS.MESSAGE,
      category: categoryId,
      categoryLabel: category.label,
      updatedAt: serverTimestamp(),
    })

    await tgEdit(
      chatId,
      messageId,
      "Пожалуйста, подробно опишите ваш вопрос или проблему.\n\nПри необходимости вы можете прикрепить:\n\n• фотографии;\n• PDF-файлы;\n• документы;\n• архивы;\n• другие материалы.",
      { reply_markup: backToCategoryKeyboard() }
    )
    return
  }
}

async function handleMessage(msg: any) {
  const { chat, from, text, message_id } = msg
  const chatId: number = chat.id
  const telegramId: number = from.id
  const firstName: string = from.first_name || ""
  const lastName: string = from.last_name || ""
  const userName = `${firstName} ${lastName}`.trim() || "Unknown"
  const username: string = from.username || ""

  // ---- /register ----
  if (text === "/register") {
    await setDoc(
      doc(db, "admin_config", "primary"),
      { chatId, updatedAt: serverTimestamp() },
      { merge: true }
    )
    await tgSend(
      chatId,
      "✅ Этот чат зарегистрирован как чат администратора. Все заявки будут приходить сюда."
    )
    return
  }

  // ---- /start ----
  if (text === "/start") {
    await saveSession(telegramId, {
      step: STEPS.SUBJECT,
      telegramId,
      userName,
      username,
      updatedAt: serverTimestamp(),
    })

    await tgSend(
      chatId,
      "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.",
      { reply_markup: subjectKeyboard() }
    )
    return
  }

  // ---- session check ----
  const session: any = await getSession(telegramId)
  if (!session) {
    await tgSend(chatId, "Пожалуйста, начните с команды /start")
    return
  }

  // ---- step: MESSAGE ----
  if (session.step === STEPS.MESSAGE) {
    const hasFiles =
      (msg.photo && msg.photo.length > 0) || msg.document || msg.voice || msg.video

    if (!text && !hasFiles) {
      await tgSend(chatId, "Пожалуйста, опишите ваш вопрос или прикрепите файлы.")
      return
    }

    // collect file_ids
    const fileIds: string[] = []
    if (msg.photo) {
      const largest = msg.photo[msg.photo.length - 1]
      fileIds.push(largest.file_id)
    }
    if (msg.document) fileIds.push(msg.document.file_id)
    if (msg.voice) fileIds.push(msg.voice.file_id)
    if (msg.video) fileIds.push(msg.video.file_id)

    // create ticket
    const ticket = {
      source: "telegram",
      telegramId,
      userName,
      username,
      subject: session.subjectLabel || session.subject,
      category: session.categoryLabel || session.category,
      message: text || "(без текста, только файлы)",
      fileIds,
      status: "open",
      createdAt: serverTimestamp(),
    }

    const ticketRef = await addDoc(collection(db, "tickets"), ticket)

    // forward to admin
    const adminChatId = await getAdminChatId()
    if (adminChatId) {
      const header = [
        `📩 Новая заявка #${ticketRef.id}`,
        `👤 ${userName} (@${username}, ID: ${telegramId})`,
        `📖 Предмет: ${session.subjectLabel || session.subject}`,
        `📂 Категория: ${session.categoryLabel || session.category}`,
        `💬 ${text || "(без текста, только файлы)"}`,
      ].join("\n")

      await tgSend(adminChatId, header)

      // forward file
      if (msg.document) {
        const fileId = msg.document.file_id
        const fileName = msg.document.file_name || "файл"
        await tgSend(adminChatId, `📎 ${fileName}`)
        await fetch(`${TG_API}/sendDocument`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: adminChatId,
            document: fileId,
            caption: `Файл от ${userName} (@${username})`,
          }),
        })
      }
    }

    // confirm
    const departmentName =
      SUBJECT_DEPARTMENTS[session.subject] || session.subjectLabel || session.subject
    await tgSend(
      chatId,
      `✅ Ваше обращение успешно отправлено.\n\nДепартамент ${departmentName} получил вашу заявку.\n\nМы свяжемся с вами как можно скорее.`,
      { reply_markup: newTicketKeyboard() }
    )

    await saveSession(telegramId, { step: STEPS.DONE, updatedAt: serverTimestamp() })
    return
  }

  // guide user back
  if (session.step === STEPS.SUBJECT) {
    await tgSend(chatId, "Пожалуйста, выберите предмет, используя кнопки выше.")
  } else if (session.step === STEPS.CATEGORY) {
    await tgSend(chatId, "Пожалуйста, выберите категорию обращения, используя кнопки выше.")
  } else {
    await tgSend(chatId, "Хотите создать новую заявку?", {
      reply_markup: newTicketKeyboard(),
    })
  }
}

// ---------- main ----------

export async function POST(req: Request) {
  try {
    const update = await req.json()

    if (update.callback_query) {
      await handleCallback(update.callback_query)
    } else if (update.message) {
      await handleMessage(update.message)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ ok: false })
  }
}
