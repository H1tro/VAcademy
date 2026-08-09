import { NextResponse } from "next/server"

interface GroqCompletionResponse {
  choices?: Array<{ message?: { content?: string } }>
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const question = String(body.question || "").trim()

    if (!question) {
      return NextResponse.json({ error: "Введите вопрос для AI." }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Сервер не настроен: в переменных окружения отсутствует GROQ_API_KEY." }, { status: 500 })
    }

    // Обновленный payload под формат Chat Completions и модель LLaMA
    const payload = {
      model: "llama-3.3-70b-versatile", // Или "llama3-8b-8192" для более быстрой/легкой модели
      messages: [
        {
          role: "system",
          content: "Ты — экспертный помощник по олимпиадам."
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
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `Groq API error: ${response.status} ${errorText}` }, { status: 502 })
    }

    const data = (await response.json()) as GroqCompletionResponse
    
    // В формате Chat Completions ответ всегда лежит здесь
    const answer = data.choices?.[0]?.message?.content?.trim() || null

    if (!answer) {
      return NextResponse.json({ error: "Не удалось разобрать ответ AI. Проверьте формат ответа Groq API." }, { status: 502 })
    }

    return NextResponse.json({ answer })
  } catch (error) {
    return NextResponse.json({ error: "Не удалось получить ответ от AI. Попробуйте позже." }, { status: 500 })
  }
}