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
  let body: Record<string, unknown>
  try { body = await req.json(); if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error() }
  catch { return NextResponse.json({ code: "invalid_request" }, { status: 400 }) }
  const locale = body.locale === "en" || body.locale === "ru" ? body.locale : await getLocale();
  const t = await getTranslations({ locale, namespace: "cabinet.ai" });
  try {
    const question = typeof body.question === "string" ? body.question.trim() : ""

    if (!question || question.length > 6000) {
      return NextResponse.json({ error: t("pleaseAsk") }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: t("configurationError"), code: "not_configured" }, { status: 503 })
    }

    // Обновленный payload под формат Chat Completions и модель LLaMA
    const payload = {
      model: process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-20b",
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
      // Never log the prompt, API key, or provider body (which can echo input).
      console.error("AI provider rejected request", { provider: "groq", status: response.status })
      if (response.status === 401) return NextResponse.json({ error: t("keyError"), code: "invalid_key" }, { status: 503 })
      if (response.status === 403) return NextResponse.json({ error: t("permissionError"), code: "permission_denied" }, { status: 503 })
      if (response.status === 400 || response.status === 404) return NextResponse.json({ error: t("configurationError"), code: "configuration_error" }, { status: 503 })
      if (response.status === 429) return NextResponse.json({ error: t("rateLimited"), code: "rate_limited" }, { status: 429 })
      return NextResponse.json({ error: t("serverError"), code: "provider_unavailable" }, { status: 502 })
    }

    const data = (await response.json()) as GroqCompletionResponse
    
    // В формате Chat Completions ответ всегда лежит здесь
    const answer = data.choices?.[0]?.message?.content?.trim() || null

    if (!answer) {
      return NextResponse.json({ error: t("serverError") }, { status: 502 })
    }

    return NextResponse.json({ answer })
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")
    console.error("AI request failed", { provider: "groq", reason: timedOut ? "timeout" : "network_or_invalid_response" })
    return NextResponse.json({ error: t(timedOut ? "timeoutError" : "serverError"), code: timedOut ? "timeout" : "provider_unavailable" }, { status: timedOut ? 504 : 502 })
  }
}
