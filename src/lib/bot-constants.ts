export const BOT_STEPS = {
  SUBJECT: "subject",
  CATEGORY: "category",
  MESSAGE: "message",
  DONE: "done",
} as const

export const BOT_SUBJECTS = [
  { id: "biology", label: "\uD83E\uDDEC Биология" },
  { id: "physics", label: "\u269B\uFE0F Физика" },
  { id: "chemistry", label: "\uD83E\uDDEA Химия" },
  { id: "math", label: "\u2797 Математика" },
  { id: "cs", label: "\uD83D\uDCBB Информатика" },
]

export const BOT_CATEGORIES = [
  { id: "materials", label: "\uD83D\uDCDA Учебные материалы" },
  { id: "documents", label: "\uD83D\uDCC4 Документы" },
  { id: "homework", label: "\uD83D\uDCDD Домашнее задание" },
  { id: "olympiads", label: "\uD83C\uDF93 Олимпиады" },
  { id: "teacher", label: "\uD83D\uDC68\u200D\uD83C\uDF93 Преподаватель" },
  { id: "technical", label: "\u2699\uFE0F Техническая проблема" },
  { id: "other", label: "\u2753 Другое" },
]

export function subjectKeyboard() {
  return {
    inline_keyboard: BOT_SUBJECTS.map((s) => [{ text: s.label, callback_data: `subject:${s.id}` }]),
  }
}

export function categoryKeyboard() {
  return {
    inline_keyboard: [
      ...BOT_CATEGORIES.map((c) => [{ text: c.label, callback_data: `category:${c.id}` }]),
      [{ text: "\uD83D\uDD19 Назад", callback_data: "back:subject" }],
    ],
  }
}

export function backToCategoryKeyboard() {
  return {
    inline_keyboard: [[{ text: "\uD83D\uDD19 Назад", callback_data: "back:category" }]],
  }
}

export function newTicketKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "\uD83D\uDCDD Создать новую заявку", callback_data: "new_ticket" }],
    ],
  }
}
