const { TelegramBot } = require("node-telegram-bot-api")
const { initializeApp } = require("firebase/app")
const { getFirestore, doc, getDoc, setDoc, addDoc, collection, serverTimestamp } = require("firebase/firestore")
require("dotenv").config({ path: ".env.local" })

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
if (!BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN not set in .env.local")
  process.exit(1)
}

// ---------- Firebase ----------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || "",
}

let db
try {
  const app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  console.log("✅ Firebase Firestore connected")
} catch (e) {
  console.error("Firebase init failed:", e.message)
  process.exit(1)
}

const STEPS = { SUBJECT: "subject", CATEGORY: "category", MESSAGE: "message", DONE: "done" }

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

const SUBJECT_DEPARTMENTS = {
  biology: "департамент биологии",
  physics: "департамент физики",
  chemistry: "департамент химии",
  math: "департамент математики",
  cs: "департамент информатики",
}

// ---------- Bot setup ----------
const bot = new TelegramBot(BOT_TOKEN, { polling: true })

// adminMessageId -> { studentChatId, studentName, ticketId }
const ticketMessages = new Map()

console.log("🤖 STEM Support Bot is running (polling mode)...")
console.log("Send /start to @VAcademi_Support_Bot to test")

// ---------- Firestore helpers ----------
async function getSession(telegramId) {
  try {
    const snap = await getDoc(doc(db, "bot_sessions", String(telegramId)))
    return snap.exists() ? snap.data() : null
  } catch {
    return null
  }
}

async function saveSession(telegramId, data) {
  try {
    await setDoc(doc(db, "bot_sessions", String(telegramId)), {
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true })
  } catch (e) {
    console.error("saveSession error:", e.message)
  }
}

async function getAdminChatId() {
  try {
    const snap = await getDoc(doc(db, "admin_config", "primary"))
    if (snap.exists()) return snap.data().chatId
  } catch {}
  return null
}

async function saveTicket(ticket) {
  try {
    const ref = await addDoc(collection(db, "tickets"), ticket)
    return ref.id
  } catch (e) {
    console.error("Save ticket error:", e.message)
    return Date.now().toString(36).toUpperCase()
  }
}

async function addMessageToTicket(ticketId, role, text, fileIds) {
  try {
    const msg = {
      role,
      text: text || "(файл)",
      fileIds: fileIds || [],
      createdAt: serverTimestamp(),
    }
    await addDoc(collection(db, "tickets", ticketId, "messages"), msg)
  } catch (e) {
    console.error("Add message error:", e.message)
  }
}

async function updateTicketStatus(ticketId, status) {
  try {
    await setDoc(doc(db, "tickets", ticketId), { status, updatedAt: serverTimestamp() }, { merge: true })
  } catch {}
}

// ---------- Keyboards ----------
function subjectKeyboard() {
  return {
    inline_keyboard: SUBJECTS.map((s) => [{ text: s.label, callback_data: `subject:${s.id}` }]),
  }
}

function categoryKeyboard() {
  return {
    inline_keyboard: [
      ...CATEGORIES.map((c) => [{ text: c.label, callback_data: `category:${c.id}` }]),
      [{ text: "\uD83D\uDD19 Назад", callback_data: "back:subject" }],
    ],
  }
}

function backKeyboard() {
  return {
    inline_keyboard: [[{ text: "\uD83D\uDD19 Назад", callback_data: "back:category" }]],
  }
}

function newTicketKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "\uD83D\uDCDD Создать новую заявку", callback_data: "new_ticket" }],
    ],
  }
}

function adminTicketKeyboard(ticketId, studentChatId) {
  return {
    inline_keyboard: [
      [{ text: `\uD83D\uDCAC Ответить #${ticketId}`, callback_data: `reply:${studentChatId}:${ticketId}` }],
      [{ text: "\uD83D\uDD12 Закрыть заявку", callback_data: `close:${ticketId}` }],
    ],
  }
}

function closeDialogKeyboard(ticketId) {
  return {
    inline_keyboard: [
      [{ text: "\uD83D\uDD12 Закрыть диалог", callback_data: `close_dialog:${ticketId}` }],
    ],
  }
}

// ---------- Handlers ----------

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  const telegramId = msg.from.id
  const userName = `${msg.from.first_name || ""} ${msg.from.last_name || ""}`.trim() || "Unknown"
  const username = msg.from.username || ""

  await saveSession(telegramId, {
    step: STEPS.SUBJECT,
    telegramId,
    userName,
    username,
  })

  await bot.sendMessage(
    chatId,
    "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.",
    { reply_markup: subjectKeyboard() }
  )
})

bot.onText(/\/register/, async (msg) => {
  const chatId = msg.chat.id
  try {
    await setDoc(doc(db, "admin_config", "primary"), { chatId, updatedAt: serverTimestamp() }, { merge: true })
    adminChatIdCached = chatId
    await bot.sendMessage(chatId, "✅ Этот чат зарегистрирован как чат администратора. Все заявки будут приходить сюда.")
    console.log(`Admin chat registered: ${chatId}`)
  } catch (e) {
    await bot.sendMessage(chatId, "❌ Ошибка регистрации. Попробуйте позже.")
    console.error("Register error:", e.message)
  }
})

bot.on("callback_query", async (query) => {
  const { data, message, from, id: callbackId } = query
  const chatId = message.chat.id
  const messageId = message.message_id
  const telegramId = from.id

  await bot.answerCallbackQuery(callbackId)

  if (data === "new_ticket") {
    await saveSession(telegramId, { step: STEPS.SUBJECT })
    await bot.editMessageText(
      "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.",
      { chat_id: chatId, message_id: messageId, reply_markup: subjectKeyboard() }
    )
    return
  }

  if (data === "back:subject") {
    await saveSession(telegramId, { step: STEPS.SUBJECT })
    await bot.editMessageText(
      "Добро пожаловать в STEM Support!\n\nВыберите предмет, по которому у вас возник вопрос.",
      { chat_id: chatId, message_id: messageId, reply_markup: subjectKeyboard() }
    )
    return
  }

  if (data === "back:category") {
    await saveSession(telegramId, { step: STEPS.CATEGORY })
    await bot.editMessageText("Выберите категорию обращения:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: categoryKeyboard(),
    })
    return
  }

  if (data.startsWith("subject:")) {
    const subjectId = data.slice(8)
    const subject = SUBJECTS.find((s) => s.id === subjectId)
    if (!subject) return

    await saveSession(telegramId, {
      step: STEPS.CATEGORY,
      subject: subjectId,
      subjectLabel: subject.label,
    })

    await bot.editMessageText("Выберите категорию обращения:", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: categoryKeyboard(),
    })
    return
  }

  if (data.startsWith("category:")) {
    const categoryId = data.slice(9)
    const category = CATEGORIES.find((c) => c.id === categoryId)
    if (!category) return

    await saveSession(telegramId, {
      step: STEPS.MESSAGE,
      category: categoryId,
      categoryLabel: category.label,
    })

    await bot.editMessageText(
      "Пожалуйста, подробно опишите ваш вопрос или проблему.\n\nПри необходимости вы можете прикрепить:\n\n• фотографии;\n• PDF-файлы;\n• документы;\n• архивы;\n• другие материалы.",
      { chat_id: chatId, message_id: messageId, reply_markup: backKeyboard() }
    )
    return
  }

  // === ADMIN: Reply to ticket ===
  if (data.startsWith("reply:")) {
    const parts = data.split(":")
    const studentChatId = parseInt(parts[1])
    const ticketId = parts[2]

    await saveSession(telegramId, {
      step: "admin_reply",
      replyToStudent: studentChatId,
      replyTicketId: ticketId,
    })

    await bot.editMessageText(
      `\u2709\uFE0F Напишите ответ для заявки #${ticketId}\n\n(отправьте текст или файл. После ответа диалог продолжится — ученик сможет отвечать)`,
      { chat_id: chatId, message_id: messageId }
    )
    return
  }

  // === ADMIN: Close ticket ===
  if (data.startsWith("close:") || data.startsWith("close_dialog:")) {
    const ticketId = data.includes("close_dialog:") ? data.slice(14) : data.slice(6)
    await updateTicketStatus(ticketId, "closed")

    // Notify the student that the dialog is closed
    const ticketInfo = findTicketByStudent(ticketId)
    if (ticketInfo) {
      try {
        await bot.sendMessage(
          ticketInfo.studentChatId,
          `\uD83D\uDD12 Диалог по заявке #${ticketId} закрыт. Если у вас есть другие вопросы, начните новую заявку через /start`,
          { reply_markup: newTicketKeyboard() }
        )
        await saveSession(ticketInfo.studentChatId, { step: STEPS.DONE, activeTicketId: null })
      } catch {}
    }

    await bot.editMessageText(
      `\uD83D\uDD12 Заявка #${ticketId} закрыта.`,
      { chat_id: chatId, message_id: messageId }
    )
    return
  }
})

// ---------- Main message handler ----------
bot.on("message", async (msg) => {
  const { chat, from, text, reply_to_message } = msg
  const chatId = chat.id
  const telegramId = from.id

  if (text && (text.startsWith("/start") || text.startsWith("/register"))) return

  // === ADMIN: Replying directly to a ticket message in admin chat ===
  if (reply_to_message && adminChatIdCached === chatId) {
    const repliedMsgId = reply_to_message.message_id
    const ticketInfo = ticketMessages.get(repliedMsgId)
    if (ticketInfo) {
      await forwardToStudent(msg, ticketInfo)
      return
    }
  }

  const session = await getSession(telegramId)

  // === CHECK: Admin reply mode (from button) ===
  if (session?.step === "admin_reply" && session.replyToStudent) {
    await handleAdminReply(msg, session)
    return
  }

  // === STUDENT: In active dialog? ===
  if (session?.activeTicketId && session?.step === "in_dialog") {
    // Forward student's message to admin as continuation of the dialog
    await forwardStudentReply(msg, session.activeTicketId, session)
    return
  }

  // === STUDENT: New ticket flow ===
  if (!session) {
    await bot.sendMessage(chatId, "Пожалуйста, начните с команды /start")
    return
  }

  if (session.step === STEPS.MESSAGE) {
    await handleNewTicket(msg, session)
    return
  }

  if (session.step === STEPS.SUBJECT) {
    await bot.sendMessage(chatId, "Пожалуйста, выберите предмет, используя кнопки выше.")
  } else if (session.step === STEPS.CATEGORY) {
    await bot.sendMessage(chatId, "Пожалуйста, выберите категорию обращения, используя кнопки выше.")
  } else {
    await bot.sendMessage(chatId, "Хотите создать новую заявку?", {
      reply_markup: newTicketKeyboard(),
    })
  }
})

// ==================== LOGIC ====================

let adminChatIdCached = null

// ---- Find ticket by student (in-memory fallback) ----
function findTicketByStudent(ticketId) {
  for (const [_, info] of ticketMessages) {
    if (info.ticketId === ticketId) return info
  }
  return null
}

// ---- Handle admin writing a reply (after clicking "Reply" button) ----
async function handleAdminReply(msg, session) {
  const { chat, from, text } = msg
  const studentChatId = session.replyToStudent
  const ticketId = session.replyTicketId
  const adminName = `${from.first_name || ""} ${from.last_name || ""}`.trim() || "Администратор"
  const adminId = from.id

  const fileIds = []
  if (msg.photo) fileIds.push(msg.photo[msg.photo.length - 1].file_id)
  if (msg.document) fileIds.push(msg.document.file_id)
  if (msg.voice) fileIds.push(msg.voice.file_id)

  const replyText = text || ""
  const header = replyText
    ? `\uD83D\uDCE8 Ответ от департамента (заявка #${ticketId}):\n\n${replyText}`
    : `\uD83D\uDCE8 Ответ от департамента (заявка #${ticketId})`

  try {
    await bot.sendMessage(studentChatId, header)

    if (msg.document) {
      await bot.sendDocument(studentChatId, msg.document.file_id, {
        caption: `Файл от ${adminName}`,
      })
    }
    if (msg.photo) {
      await bot.sendPhoto(studentChatId, msg.photo[msg.photo.length - 1].file_id, {
        caption: `Фото от ${adminName}`,
      })
    }

    // Switch student to dialog mode
    await saveSession(studentChatId, {
      step: "in_dialog",
      activeTicketId: ticketId,
    })

    // Save message to ticket
    await addMessageToTicket(ticketId, "admin", replyText || "(файл)", fileIds)
    await updateTicketStatus(ticketId, "in_progress")

    await bot.sendMessage(
      chat.id,
      `✅ Ответ отправлен. Теперь ученик может отвечать — все сообщения будут приходить сюда как продолжение диалога.`,
      { reply_markup: closeDialogKeyboard(ticketId) }
    )
  } catch (e) {
    await bot.sendMessage(chat.id, `❌ Не удалось отправить ответ. Ученик должен написать /start боту. (${e.message})`)
  }

  await saveSession(adminId, { step: STEPS.DONE, replyToStudent: null, replyTicketId: null })
}

// ---- Forward student's reply to admin ----
async function forwardStudentReply(msg, ticketId, session) {
  const { chat, from, text } = msg
  const studentName = `${from.first_name || ""} ${from.last_name || ""}`.trim() || "Ученик"
  const username = from.username || ""

  const fileIds = []
  if (msg.photo) fileIds.push(msg.photo[msg.photo.length - 1].file_id)
  if (msg.document) fileIds.push(msg.document.file_id)
  if (msg.voice) fileIds.push(msg.voice.file_id)

  // Save to Firestore
  await addMessageToTicket(ticketId, "student", text || "(файл)", fileIds)

  // Forward to admin
  if (adminChatIdCached) {
    const header = `\uD83D\uDCE9 Ответ от ${studentName} (@${username}) по заявке #${ticketId}:\n\n${text || ""}`
    const sent = await bot.sendMessage(adminChatIdCached, header, {
      reply_markup: adminTicketKeyboard(ticketId, chat.id),
    })

    ticketMessages.set(sent.message_id, {
      studentChatId: chat.id,
      studentName,
      ticketId,
    })

    if (msg.document) {
      await bot.sendDocument(adminChatIdCached, msg.document.file_id, {
        caption: `Файл от ${studentName} (@${username})`,
      })
    }
    if (msg.photo) {
      await bot.sendPhoto(adminChatIdCached, msg.photo[msg.photo.length - 1].file_id, {
        caption: `Фото от ${studentName} (@${username})`,
      })
    }

    // Confirm to student
    await bot.sendMessage(chat.id, `\u2705 Ваш ответ отправлен в заявку #${ticketId}. Ожидайте ответа от департамента.`)
  } else {
    await bot.sendMessage(chat.id, "Извините, администратор пока не доступен.")
  }
}

// ---- Handle new ticket creation ----
async function handleNewTicket(msg, session) {
  const { chat, from, text } = msg
  const chatId = chat.id
  const telegramId = from.id

  const hasFiles = (msg.photo && msg.photo.length > 0) || msg.document || msg.voice || msg.video
  if (!text && !hasFiles) {
    await bot.sendMessage(chatId, "Пожалуйста, опишите ваш вопрос или прикрепите файлы.")
    return
  }

  const userName = `${from.first_name || ""} ${from.last_name || ""}`.trim() || "Unknown"
  const username = from.username || ""

  const fileIds = []
  if (msg.photo) fileIds.push(msg.photo[msg.photo.length - 1].file_id)
  if (msg.document) fileIds.push(msg.document.file_id)
  if (msg.voice) fileIds.push(msg.voice.file_id)
  if (msg.video) fileIds.push(msg.video.file_id)

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
  const ticketId = await saveTicket(ticket)

  await addMessageToTicket(ticketId, "student", text || "(без текста, только файлы)", fileIds)

  console.log(`\n📩 Новая заявка #${ticketId} от ${userName} (@${username})`)

  if (!adminChatIdCached) adminChatIdCached = await getAdminChatId()
  if (adminChatIdCached) {
    const header = [
      `📩 Заявка #${ticketId}`,
      `👤 ${userName} (@${username})`,
      `📖 ${session.subjectLabel || session.subject}`,
      `📂 ${session.categoryLabel || session.category}`,
      `💬 ${text || "(без текста, только файлы)"}`,
    ].join("\n")

    const sent = await bot.sendMessage(adminChatIdCached, header, {
      reply_markup: adminTicketKeyboard(ticketId, chatId),
    })

    ticketMessages.set(sent.message_id, {
      studentChatId: chatId,
      studentName: userName,
      ticketId,
    })

    if (msg.document) {
      await bot.sendDocument(adminChatIdCached, msg.document.file_id, {
        caption: `Файл от ${userName} (@${username})`,
      })
    }
  }

  const departmentName = SUBJECT_DEPARTMENTS[session.subject] || session.subjectLabel || session.subject
  await bot.sendMessage(
    chatId,
    `✅ Ваше обращение успешно отправлено.\n\nДепартамент ${departmentName} получил вашу заявку.\n\nМы свяжемся с вами как можно скорее.`,
    { reply_markup: newTicketKeyboard() }
  )

  await saveSession(telegramId, { step: STEPS.DONE })
}

// ---- Forward admin reply to student (when admin replies directly to a message) ----
async function forwardToStudent(msg, ticketInfo) {
  const { chat, from, text } = msg
  const { studentChatId, studentName, ticketId } = ticketInfo
  const adminName = `${from.first_name || ""} ${from.last_name || ""}`.trim() || "Администратор"

  if (!text && !msg.document && !msg.photo) {
    await bot.sendMessage(chat.id, "Отправьте текст или файл для ответа ученику.")
    return
  }

  const fileIds = []
  if (msg.document) fileIds.push(msg.document.file_id)
  if (msg.photo) fileIds.push(msg.photo[msg.photo.length - 1].file_id)

  const replyText = text || ""
  const header = replyText
    ? `\uD83D\uDCE8 Ответ от департамента (заявка #${ticketId}):\n\n${replyText}`
    : `\uD83D\uDCE8 Ответ от департамента (заявка #${ticketId})`

  try {
    await bot.sendMessage(studentChatId, header)

    if (msg.document) {
      await bot.sendDocument(studentChatId, msg.document.file_id, {
        caption: `Файл от ${adminName}`,
      })
    }
    if (msg.photo) {
      await bot.sendPhoto(studentChatId, msg.photo[msg.photo.length - 1].file_id, {
        caption: `Фото от ${adminName}`,
      })
    }

    // Switch student to dialog mode
    await saveSession(studentChatId, {
      step: "in_dialog",
      activeTicketId: ticketId,
    })

    await addMessageToTicket(ticketId, "admin", replyText || "(файл)", fileIds)
    await updateTicketStatus(ticketId, "in_progress")

    await bot.sendMessage(
      chat.id,
      `✅ Ответ отправлен ${studentName}. Теперь ученик может отвечать — сообщения будут приходить сюда.`,
      { reply_markup: closeDialogKeyboard(ticketId) }
    )
  } catch (e) {
    await bot.sendMessage(chat.id, `❌ Не удалось отправить ответ. Ученик должен написать /start боту. (${e.message})`)
  }
}

// Cache admin chat ID on startup
getAdminChatId().then((id) => {
  adminChatIdCached = id
  if (id) console.log(`Admin chat: ${id}`)
})
