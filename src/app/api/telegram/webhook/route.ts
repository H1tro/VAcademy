import { NextResponse } from "next/server"
import { waitUntil } from "@vercel/functions"
import { LRUCache } from "lru-cache"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`

const STEPS = {
  SUBJECT: "subject",
  CATEGORY: "category",
  MESSAGE: "message",
  DONE: "done",
} as const

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

const adminChats = new Map<string, number[]>()

const sessionCache = new LRUCache<number, Record<string, unknown>>({ max: 1000, ttl: 30_000 })

async function getDeptAdminChatIds(department: string): Promise<number[]> {
  if (adminChats.has(department)) return adminChats.get(department)!
  try {
    const db = getDb()
    const snap = await db.doc(`admin_config/${department}`).get()
    if (snap.exists) {
      const data = snap.data()!
      let ids: number[] = []
      if (Array.isArray(data.chatIds)) {
        ids = data.chatIds as number[]
      } else if (data.chatId) {
        ids = [data.chatId as number]
      }
      adminChats.set(department, ids)
      return ids
    }
  } catch {}
  return []
}

function invalidateCache(department: string) {
  adminChats.delete(department)
}

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

async function tgEdit(chatId: number, messageId: number, text: string, opts?: Record<string, unknown>) {
  await fetch(`${TG_API}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, ...opts }),
  })
}

async function getSession(telegramId: number) {
  const cached = sessionCache.get(telegramId)
  if (cached) return cached
  const db = getDb()
  const snap = await db.doc(`bot_sessions/${telegramId}`).get()
  const data = snap.exists ? snap.data() : null
  if (data) sessionCache.set(telegramId, data)
  return data
}

async function saveSession(telegramId: number, data: Record<string, unknown>) {
  const db = getDb()
  await db.doc(`bot_sessions/${telegramId}`).set(data, { merge: true })
  sessionCache.set(telegramId, data)
}

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

async function getAdminDepartments(chatId: number): Promise<string[]> {
  const depts: string[] = []
  for (const s of SUBJECTS) {
    const ids = await getDeptAdminChatIds(s.id)
    if (ids.includes(chatId)) depts.push(s.id)
  }
  return depts
}

async function replyToTicket(ticketId: string, replyText: string, adminChatId: number, adminTelegramId: number, adminName: string) {
  try {
    const db = getDb()
    const snap = await db.doc(`tickets/${ticketId}`).get()
    if (!snap.exists) {
      await tgSend(adminChatId, `❌ Заявка #${ticketId} не найдена.`)
      return
    }

    const ticket = snap.data()!
    const adminDepts = await getAdminDepartments(adminChatId)
    if (!adminDepts.includes(ticket.department as string)) {
      await tgSend(adminChatId, "❌ У вас нет прав отвечать на заявки этого департамента.")
      return
    }

    const reply = {
      from: "admin",
      adminName,
      adminTelegramId,
      text: replyText,
      at: new Date(),
    }

    await db.doc(`tickets/${ticketId}`).update({
      replies: FieldValue.arrayUnion(reply),
      updatedAt: FieldValue.serverTimestamp(),
    })

    const userTgId = ticket.telegramId as number | undefined
    if (userTgId) {
      const userMsg = [
        `📬 *Ответ от поддержки по заявке #${ticketId}*`,
        "",
        replyText,
      ].join("\n")
      await tgSend(userTgId, userMsg, { parse_mode: "Markdown" })
    }

    await tgSend(adminChatId, `✅ Ответ отправлен пользователю по заявке #${ticketId}.`)
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    await tgSend(adminChatId, `❌ Ошибка: ${errMsg}`)
  }
}

async function closeTicket(ticketId: string, adminChatId: number, adminTelegramId: number) {
  try {
    const db = getDb()
    const snap = await db.doc(`tickets/${ticketId}`).get()
    if (!snap.exists) {
      await tgSend(adminChatId, `❌ Заявка #${ticketId} не найдена.`)
      return
    }

    const ticket = snap.data()!
    const adminDepts = await getAdminDepartments(adminChatId)
    if (!adminDepts.includes(ticket.department as string)) {
      await tgSend(adminChatId, "❌ У вас нет прав закрывать заявки этого департамента.")
      return
    }

    await db.doc(`tickets/${ticketId}`).update({
      status: "closed",
      closedAt: FieldValue.serverTimestamp(),
      closedBy: adminTelegramId,
      updatedAt: FieldValue.serverTimestamp(),
    })

    const userTgId = ticket.telegramId as number | undefined
    if (userTgId) {
      await tgSend(userTgId, `✅ Заявка #${ticketId} закрыта.\n\nЕсли у вас остались вопросы, создайте новую заявку через /start`)
    }

    await tgSend(adminChatId, `✅ Заявка #${ticketId} закрыта.`)
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    await tgSend(adminChatId, `❌ Ошибка: ${errMsg}`)
  }
}

async function handleCallback(query: any) {
  const { data, message, from, id: callbackId } = query
  const chatId: number = message.chat.id
  const messageId: number = message.message_id
  const telegramId: number = from.id

  try {
    await tgAnswer(callbackId)

    if (data.startsWith("dept:")) {
      const dept = data.slice(5)
      const subject = SUBJECTS.find((s) => s.id === dept)
      if (!subject) return
      invalidateCache(dept)
      const db = getDb()
      const ref = db.doc(`admin_config/${dept}`)
      const snap = await ref.get()
      if (!snap.exists) {
        await ref.set({ chatIds: [chatId], department: dept, updatedAt: new Date() })
      } else {
        await ref.update({ chatIds: FieldValue.arrayUnion(chatId), updatedAt: new Date() })
      }
      await tgEdit(chatId, messageId, `✅ Вы зарегистрированы как **${subject.label}**.\n\nВсе заявки по этому предмету будут приходить сюда.`, { parse_mode: "Markdown" })
      return
    }

    if (data.startsWith("unreg:")) {
      const dept = data.slice(6)
      const subject = SUBJECTS.find((s) => s.id === dept)
      if (!subject) return
      invalidateCache(dept)
      const db = getDb()
      const ref = db.doc(`admin_config/${dept}`)
      const snap = await ref.get()
      if (snap.exists && snap.data()!.chatIds) {
        await ref.update({ chatIds: FieldValue.arrayRemove(chatId), updatedAt: new Date() })
      } else if (snap.exists && snap.data()!.chatId === chatId) {
        await ref.update({ chatIds: FieldValue.arrayRemove(chatId), chatId: 0, updatedAt: new Date() })
      }
      await tgEdit(chatId, messageId, `✅ Вы отписаны от уведомлений **${subject.label}**.`, { parse_mode: "Markdown" })
      return
    }

    if (data === "new_ticket") {
      await saveSession(telegramId, { step: STEPS.SUBJECT, updatedAt: new Date() })
      await tgEdit(chatId, messageId, "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.", { reply_markup: subjectKeyboard() })
      return
    }

    if (data === "back:subject") {
      await saveSession(telegramId, { step: STEPS.SUBJECT, updatedAt: new Date() })
      await tgEdit(chatId, messageId, "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.", { reply_markup: subjectKeyboard() })
      return
    }

    if (data === "back:category") {
      await saveSession(telegramId, { step: STEPS.CATEGORY, updatedAt: new Date() })
      await tgEdit(chatId, messageId, "Выберите категорию обращения:", { reply_markup: categoryKeyboard() })
      return
    }

    if (data.startsWith("subject:")) {
      const subjectId = data.slice(8)
      const subject = SUBJECTS.find((s) => s.id === subjectId)
      if (!subject) return
      await saveSession(telegramId, { step: STEPS.CATEGORY, subject: subjectId, subjectLabel: subject.label, updatedAt: new Date() })
      await tgEdit(chatId, messageId, "Выберите категорию обращения:", { reply_markup: categoryKeyboard() })
      return
    }

    if (data.startsWith("category:")) {
      const categoryId = data.slice(9)
      const category = CATEGORIES.find((c) => c.id === categoryId)
      if (!category) return
      await saveSession(telegramId, { step: STEPS.MESSAGE, category: categoryId, categoryLabel: category.label, updatedAt: new Date() })
      await tgEdit(chatId, messageId, "Пожалуйста, подробно опишите ваш вопрос или проблему.\n\nПри необходимости вы можете прикрепить:\n\n• фотографии;\n• PDF-файлы;\n• документы;\n• архивы;\n• другие материалы.", { reply_markup: backToCategoryKeyboard() })
      return
    }

    if (data.startsWith("reply_ticket:")) {
      const ticketId = data.slice(13)
      await saveSession(telegramId, { step: "reply", replyTicketId: ticketId, updatedAt: new Date() })
      await tgSend(chatId, `✏️ Напишите текст ответа для заявки #${ticketId}:`)
      return
    }
  } catch (e) {
    console.error("handleCallback error:", e)
    const errMsg = e instanceof Error ? e.message : String(e)
    try {
      await tgSend(chatId, `❌ Ошибка: ${errMsg}`)
    } catch {}
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

  if (text === "/register") {
    await tgSend(chatId, "Выберите ваш департамент:", { reply_markup: { inline_keyboard: SUBJECTS.map((s) => [{ text: s.label, callback_data: `dept:${s.id}` }]) } })
    return
  }

  if (text === "/unregister") {
    const registered: string[] = []
    for (const s of SUBJECTS) {
      const ids = await getDeptAdminChatIds(s.id)
      if (ids.includes(chatId)) registered.push(s.label)
    }
    if (registered.length === 0) {
      await tgSend(chatId, "❌ Вы не зарегистрированы ни по одному предмету.")
      return
    }
    await tgSend(chatId, "Выберите предмет, от которого хотите отписаться:", {
      reply_markup: {
        inline_keyboard: SUBJECTS.filter((s) => registered.includes(s.label)).map((s) => [
          { text: s.label, callback_data: `unreg:${s.id}` },
        ]),
      },
    })
    return
  }

  if (text === "/myid") {
    await tgSend(chatId, `🆔 Ваш Telegram ID: \`${telegramId}\`\n\nПередайте этот ID администратору сайта, чтобы вас добавили как админа предмета.`, { parse_mode: "Markdown" })
    return
  }

  if (text === "/start") {
    await saveSession(telegramId, { step: STEPS.SUBJECT, telegramId, userName, username, updatedAt: new Date() })
    await tgSend(chatId, "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.", { reply_markup: subjectKeyboard() })
    return
  }

  if (text === "/help") {
    const helpText = [
      "📋 *Команды бота:*",
      "",
      "• /start — Создать новую заявку",
      "• /register — Зарегистрироваться как администратор",
      "• /unregister — Отписаться от уведомлений",
      "• /myid — Показать ваш Telegram ID",
      "",
      "*Для администраторов:*",
      "• /reply `ID` `текст` — Ответить на заявку",
      "• /close `ID` — Закрыть заявку",
      "",
      "Пример: `/reply abc123 Всё готово!`",
    ].join("\n")
    await tgSend(chatId, helpText, { parse_mode: "Markdown" })
    return
  }

  if (text?.startsWith("/reply ")) {
    const parts = text.slice(7).trim().split(/\s+/)
    const ticketId = parts[0]
    const replyText = parts.slice(1).join(" ")
    if (!ticketId || !replyText) {
      await tgSend(chatId, "❌ Использование: `/reply <ID заявки> <текст ответа>`", { parse_mode: "Markdown" })
      return
    }
    await replyToTicket(ticketId, replyText, chatId, telegramId, userName)
    return
  }

  if (text?.startsWith("/close ")) {
    const ticketId = text.slice(7).trim()
    if (!ticketId) {
      await tgSend(chatId, "❌ Использование: `/close <ID заявки>`", { parse_mode: "Markdown" })
      return
    }
    await closeTicket(ticketId, chatId, telegramId)
    return
  }

  const session: any = await getSession(telegramId)
  if (!session) {
    await tgSend(chatId, "Пожалуйста, начните с команды /start")
    return
  }

  if (session.step === STEPS.MESSAGE) {
    const hasFiles = (msg.photo && msg.photo.length > 0) || msg.document || msg.voice || msg.video

    if (!text && !hasFiles) {
      await tgSend(chatId, "Пожалуйста, опишите ваш вопрос или прикрепите файлы.")
      return
    }

    const fileIds: string[] = []
    if (msg.photo) {
      const largest = msg.photo[msg.photo.length - 1]
      fileIds.push(largest.file_id)
    }
    if (msg.document) fileIds.push(msg.document.file_id)
    if (msg.voice) fileIds.push(msg.voice.file_id)
    if (msg.video) fileIds.push(msg.video.file_id)

    const subjectId = session.subject
    const subjectLabel = session.subjectLabel || subjectId
    const db = getDb()
    const ticket = {
      source: "telegram",
      telegramId,
      userName,
      username,
      subject: subjectId,
      subjectLabel,
      department: subjectId,
      category: session.categoryLabel || session.category,
      message: text || "(без текста, только файлы)",
      fileIds,
      status: "open",
      replies: [],
      createdAt: FieldValue.serverTimestamp(),
    }

    const ticketRef = await db.collection("tickets").add(ticket)

    const adminIds = await getDeptAdminChatIds(subjectId)
    const header = [
      `📩 Новая заявка #${ticketRef.id}`,
      `👤 ${userName} (@${username}, ID: ${telegramId})`,
      `📖 Предмет: ${subjectLabel}`,
      `📂 Категория: ${session.categoryLabel || session.category}`,
      `💬 ${text || "(без текста, только файлы)"}`,
    ].join("\n")

    for (const adminChatId of adminIds) {
      try {
        const replyKeyboard = {
          inline_keyboard: [
            [{ text: "✏️ Ответить", callback_data: `reply_ticket:${ticketRef.id}` }],
          ],
        }
        await tgSend(adminChatId, header, { reply_markup: replyKeyboard })
        if (msg.document) {
          const fileId = msg.document.file_id
          const fileName = msg.document.file_name || "файл"
          await tgSend(adminChatId, `📎 ${fileName}`)
          await fetch(`${TG_API}/sendDocument`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: adminChatId, document: fileId, caption: `Файл от ${userName} (@${username})` }),
          })
        }
      } catch {}
    }

    await tgSend(chatId, `✅ Ваше обращение успешно отправлено.\n\nДепартамент ${subjectLabel} получил вашу заявку.\n\nМы свяжемся с вами как можно скорее.`, { reply_markup: newTicketKeyboard() })

    await saveSession(telegramId, { step: STEPS.DONE, updatedAt: new Date() })
    return
  }

  if (session.step === "reply" && session.replyTicketId) {
    const ticketId = session.replyTicketId as string
    if (!text) {
      await tgSend(chatId, "Пожалуйста, напишите текст ответа.")
      return
    }
    await replyToTicket(ticketId, text, chatId, telegramId, userName)
    await saveSession(telegramId, { step: STEPS.DONE, replyTicketId: undefined, updatedAt: new Date() })
    return
  }

  if (session.step === STEPS.SUBJECT) {
    await tgSend(chatId, "Пожалуйста, выберите предмет, используя кнопки выше.")
  } else if (session.step === STEPS.CATEGORY) {
    await tgSend(chatId, "Пожалуйста, выберите категорию обращения, используя кнопки выше.")
  } else {
    await tgSend(chatId, "Хотите создать новую заявку?", { reply_markup: newTicketKeyboard() })
  }
}

export async function POST(req: Request) {
  const update = await req.json()
  waitUntil(processUpdate(update).catch((e) => console.error("processUpdate error:", e)))
  return NextResponse.json({ ok: true })
}

async function processUpdate(update: any) {
  try {
    console.log("Processing update:", update.callback_query ? "callback" : update.message ? "message" : "unknown")
    if (update.callback_query) {
      await handleCallback(update.callback_query)
    } else if (update.message) {
      await handleMessage(update.message)
    }
  } catch (error) {
    console.error("processUpdate error:", error)
  }
}
