import { NextResponse } from "next/server"
import { waitUntil } from "@vercel/functions"
import { LRUCache } from "lru-cache"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"
import {
  BOT_STEPS,
  BOT_SUBJECTS,
  BOT_CATEGORIES,
  subjectKeyboard,
  categoryKeyboard,
  backToCategoryKeyboard,
  newTicketKeyboard,
} from "@/lib/bot-constants"

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`

const adminChats = new LRUCache<string, number[]>({ max: 500, ttl: 300_000 })
const reverseAdminCache = new LRUCache<number, string[]>({ max: 1000, ttl: 300_000 })
const sessionCache = new LRUCache<number, Record<string, unknown>>({ max: 1000, ttl: 30_000 })

async function getDeptAdminChatIds(department: string): Promise<number[]> {
  const cached = adminChats.get(department)
  if (cached) return cached
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
  reverseAdminCache.clear()
}

async function tgSend(chatId: number, text: string, opts?: Record<string, unknown>) {
  try {
    const res = await fetch(`${TG_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, ...opts }),
    })
    if (!res.ok) console.error("tgSend failed:", res.status, await res.text())
  } catch (e) {
    console.error("tgSend error:", e)
  }
}

async function tgAnswer(callbackQueryId: string) {
  try {
    await fetch(`${TG_API}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackQueryId }),
    })
  } catch {}
}

async function tgEdit(chatId: number, messageId: number, text: string, opts?: Record<string, unknown>) {
  try {
    const res = await fetch(`${TG_API}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, ...opts }),
    })
    if (!res.ok) console.error("tgEdit failed:", res.status, await res.text())
  } catch (e) {
    console.error("tgEdit error:", e)
  }
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

async function getAdminDepartments(chatId: number): Promise<string[]> {
  const cached = reverseAdminCache.get(chatId)
  if (cached) return cached
  const depts: string[] = []
  for (const s of BOT_SUBJECTS) {
    const ids = await getDeptAdminChatIds(s.id)
    if (ids.includes(chatId)) depts.push(s.id)
  }
  reverseAdminCache.set(chatId, depts)
  return depts
}

async function replyToTicket(ticketId: string, replyText: string, adminChatId: number, adminTelegramId: number, adminName: string) {
  try {
    const db = getDb()
    const snap = await db.doc(`tickets/${ticketId}`).get()
    if (!snap.exists) {
      await tgSend(adminChatId, `\u274C Заявка #${ticketId} не найдена.`)
      return
    }

    const ticket = snap.data()!
    const adminDepts = await getAdminDepartments(adminChatId)
    if (!adminDepts.includes(ticket.department as string)) {
      await tgSend(adminChatId, "\u274C У вас нет прав отвечать на заявки этого департамента.")
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
        `\uD83D\uDCCC *Ответ от поддержки по заявке #${ticketId}*`,
        "",
        replyText,
      ].join("\n")
      await tgSend(userTgId, userMsg, { parse_mode: "Markdown" })
    }

    await tgSend(adminChatId, `\u2705 Ответ отправлен пользователю по заявке #${ticketId}.`)
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    await tgSend(adminChatId, `\u274C Ошибка: ${errMsg}`)
  }
}

async function closeTicket(ticketId: string, adminChatId: number, adminTelegramId: number) {
  try {
    const db = getDb()
    const snap = await db.doc(`tickets/${ticketId}`).get()
    if (!snap.exists) {
      await tgSend(adminChatId, `\u274C Заявка #${ticketId} не найдена.`)
      return
    }

    const ticket = snap.data()!
    const adminDepts = await getAdminDepartments(adminChatId)
    if (!adminDepts.includes(ticket.department as string)) {
      await tgSend(adminChatId, "\u274C У вас нет прав закрывать заявки этого департамента.")
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
      await tgSend(userTgId, `\u2705 Заявка #${ticketId} закрыта.\n\nЕсли у вас остались вопросы, создайте новую заявку через /start`)
    }

    await tgSend(adminChatId, `\u2705 Заявка #${ticketId} закрыта.`)
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    await tgSend(adminChatId, `\u274C Ошибка: ${errMsg}`)
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
      const subject = BOT_SUBJECTS.find((s) => s.id === dept)
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
      await tgEdit(chatId, messageId, `\u2705 Вы зарегистрированы как **${subject.label}**.\n\nВсе заявки по этому предмету будут приходить сюда.`, { parse_mode: "Markdown" })
      return
    }

    if (data.startsWith("unreg:")) {
      const dept = data.slice(6)
      const subject = BOT_SUBJECTS.find((s) => s.id === dept)
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
      await tgEdit(chatId, messageId, `\u2705 Вы отписаны от уведомлений **${subject.label}**.`, { parse_mode: "Markdown" })
      return
    }

    if (data === "new_ticket") {
      await saveSession(telegramId, { step: BOT_STEPS.SUBJECT, updatedAt: new Date() })
      await tgEdit(chatId, messageId, "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.", { reply_markup: subjectKeyboard() })
      return
    }

    if (data === "back:subject") {
      await saveSession(telegramId, { step: BOT_STEPS.SUBJECT, updatedAt: new Date() })
      await tgEdit(chatId, messageId, "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.", { reply_markup: subjectKeyboard() })
      return
    }

    if (data === "back:category") {
      await saveSession(telegramId, { step: BOT_STEPS.CATEGORY, updatedAt: new Date() })
      await tgEdit(chatId, messageId, "Выберите категорию обращения:", { reply_markup: categoryKeyboard() })
      return
    }

    if (data.startsWith("subject:")) {
      const subjectId = data.slice(8)
      const subject = BOT_SUBJECTS.find((s) => s.id === subjectId)
      if (!subject) return
      await saveSession(telegramId, { step: BOT_STEPS.CATEGORY, subject: subjectId, subjectLabel: subject.label, updatedAt: new Date() })
      await tgEdit(chatId, messageId, "Выберите категорию обращения:", { reply_markup: categoryKeyboard() })
      return
    }

    if (data.startsWith("category:")) {
      const categoryId = data.slice(9)
      const category = BOT_CATEGORIES.find((c) => c.id === categoryId)
      if (!category) return
      await saveSession(telegramId, { step: BOT_STEPS.MESSAGE, category: categoryId, categoryLabel: category.label, updatedAt: new Date() })
      await tgEdit(chatId, messageId, "Пожалуйста, подробно опишите ваш вопрос или проблему.\n\nПри необходимости вы можете прикрепить:\n\n• фотографии;\n• PDF-файлы;\n• документы;\n• архивы;\n• другие материалы.", { reply_markup: backToCategoryKeyboard() })
      return
    }

    if (data.startsWith("reply_ticket:")) {
      const ticketId = data.slice(13)
      await saveSession(telegramId, { step: "reply", replyTicketId: ticketId, updatedAt: new Date() })
      await tgSend(chatId, `\u270F\uFE0F Напишите текст ответа для заявки #${ticketId}:`)
      return
    }
  } catch (e) {
    console.error("handleCallback error:", e)
    const errMsg = e instanceof Error ? e.message : String(e)
    try {
      await tgSend(chatId, `\u274C Ошибка: ${errMsg}`)
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
    await tgSend(chatId, "Выберите ваш департамент:", { reply_markup: { inline_keyboard: BOT_SUBJECTS.map((s) => [{ text: s.label, callback_data: `dept:${s.id}` }]) } })
    return
  }

  if (text === "/unregister") {
    const registered: string[] = []
    for (const s of BOT_SUBJECTS) {
      const ids = await getDeptAdminChatIds(s.id)
      if (ids.includes(chatId)) registered.push(s.label)
    }
    if (registered.length === 0) {
      await tgSend(chatId, "\u274C Вы не зарегистрированы ни по одному предмету.")
      return
    }
    await tgSend(chatId, "Выберите предмет, от которого хотите отписаться:", {
      reply_markup: {
        inline_keyboard: BOT_SUBJECTS.filter((s) => registered.includes(s.label)).map((s) => [
          { text: s.label, callback_data: `unreg:${s.id}` },
        ]),
      },
    })
    return
  }

  if (text === "/myid") {
    await tgSend(chatId, `\uD83C\uDD94 Ваш Telegram ID: \`${telegramId}\`\n\nПередайте этот ID администратору сайта, чтобы вас добавили как админа предмета.`, { parse_mode: "Markdown" })
    return
  }

  if (text === "/start") {
    await saveSession(telegramId, { step: BOT_STEPS.SUBJECT, telegramId, userName, username, updatedAt: new Date() })
    await tgSend(chatId, "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.", { reply_markup: subjectKeyboard() })
    return
  }

  if (text === "/help") {
    const helpText = [
      "\uD83D\uDCCB *Команды бота:*",
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
      await tgSend(chatId, "\u274C Использование: `/reply <ID заявки> <текст ответа>`", { parse_mode: "Markdown" })
      return
    }
    await replyToTicket(ticketId, replyText, chatId, telegramId, userName)
    return
  }

  if (text?.startsWith("/close ")) {
    const ticketId = text.slice(7).trim()
    if (!ticketId) {
      await tgSend(chatId, "\u274C Использование: `/close <ID заявки>`", { parse_mode: "Markdown" })
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

  if (session.step === BOT_STEPS.MESSAGE) {
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
      `\uD83D\uDCE2 Новая заявка #${ticketRef.id}`,
      `\uD83D\uDC64 ${userName} (@${username}, ID: ${telegramId})`,
      `\uD83D\uDCD6 Предмет: ${subjectLabel}`,
      `\uD83D\uDCC2 Категория: ${session.categoryLabel || session.category}`,
      `\uD83D\uDCAC ${text || "(без текста, только файлы)"}`,
    ].join("\n")

    for (const adminChatId of adminIds) {
      try {
        const replyKeyboard = {
          inline_keyboard: [
            [{ text: "\u270F\uFE0F Ответить", callback_data: `reply_ticket:${ticketRef.id}` }],
          ],
        }
        await tgSend(adminChatId, header, { reply_markup: replyKeyboard })
        if (msg.document) {
          const fileId = msg.document.file_id
          const fileName = msg.document.file_name || "файл"
          await fetch(`${TG_API}/sendDocument`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: adminChatId, document: fileId, caption: `Файл от ${userName} (@${username})` }),
          })
        }
      } catch {}
    }

    await tgSend(chatId, `\u2705 Ваше обращение успешно отправлено.\n\nДепартамент ${subjectLabel} получил вашу заявку.\n\nМы свяжемся с вами как можно скорее.`, { reply_markup: newTicketKeyboard() })

    await saveSession(telegramId, { step: BOT_STEPS.DONE, updatedAt: new Date() })
    return
  }

  if (session.step === "reply" && session.replyTicketId) {
    const ticketId = session.replyTicketId as string
    if (!text) {
      await tgSend(chatId, "Пожалуйста, напишите текст ответа.")
      return
    }
    await replyToTicket(ticketId, text, chatId, telegramId, userName)
    await saveSession(telegramId, { step: BOT_STEPS.DONE, replyTicketId: undefined, updatedAt: new Date() })
    return
  }

  if (session.step === BOT_STEPS.DONE) {
    await saveSession(telegramId, { step: BOT_STEPS.SUBJECT, updatedAt: new Date() })
    await tgSend(chatId, "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.", { reply_markup: subjectKeyboard() })
    return
  }

  if (session.step === BOT_STEPS.SUBJECT) {
    await tgSend(chatId, "Пожалуйста, выберите предмет, используя кнопки выше.")
  } else if (session.step === BOT_STEPS.CATEGORY) {
    await tgSend(chatId, "Пожалуйста, выберите категорию обращения, используя кнопки выше.")
  }
}

export async function POST(req: Request) {
  const update = await req.json()
  waitUntil(processUpdate(update).catch((e) => console.error("processUpdate error:", e)))
  return NextResponse.json({ ok: true })
}

async function processUpdate(update: any) {
  try {
    if (update.callback_query) {
      await handleCallback(update.callback_query)
    } else if (update.message) {
      await handleMessage(update.message)
    }
  } catch (error) {
    console.error("processUpdate error:", error)
  }
}
