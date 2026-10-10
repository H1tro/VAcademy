import { NextResponse } from "next/server"
import { getLocale, getTranslations } from "next-intl/server"
import { SUBJECTS } from '@/lib/navigation'

export async function GET() {
  return NextResponse.json({ configured: Boolean(process.env.GROQ_API_KEY) });
}

interface GroqCompletionResponse {
  choices?: Array<{ message?: { content?: string } }>
}

export async function POST(req: Request) {
  const locale = await getLocale();
  const t = await getTranslations("cabinet.ai");
  try {
    const body = await req.json()
    const question = String(body.question || "").trim()

    if (!question || question.length > 6000) {
      return NextResponse.json({ error: t("pleaseAsk") }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: t("aiUnavailable") }, { status: 503 })
    }

    // Обновленный payload под формат Chat Completions и модель LLaMA
    const payload = {
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Ты — учебный помощник VAcademy для STEM. Предмет: ${SUBJECTS.find(s => s.key === body.subject)?.name || 'STEM'}. Режим: ${body.mode === 'plan' ? 'составь конкретный план занятий с упражнениями' : body.mode === 'review' ? 'проверь рассуждение и объясни ошибки' : 'дай одну подсказку и наводящий вопрос, не выдавай готовый ответ сразу'}. Язык ответа: ${locale === 'en' ? 'английский' : 'русский'}. Объясняй по шагам и проверяй расчёты. Не выдумывай расписания олимпиад, регистрацию, ссылки, достижения или источники. Направляй за датами к официальному организатору.`
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0,
      max_tokens: 2048,
    }

    // Правильный эндпоинт Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
      ,signal: AbortSignal.timeout(30000)
    })

    if (!response.ok) {
      return NextResponse.json({ error: t("serverError") }, { status: 502 })
    }

    const data = (await response.json()) as GroqCompletionResponse
    
    // В формате Chat Completions ответ всегда лежит здесь
    const answer = data.choices?.[0]?.message?.content?.trim() || null

    if (!answer) {
      return NextResponse.json({ error: t("serverError") }, { status: 502 })
    }

    return NextResponse.json({ answer })
  } catch (error) {
    return NextResponse.json({ error: t("serverError") }, { status: 500 })
  }
}
