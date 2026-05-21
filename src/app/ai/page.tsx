"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles } from "lucide-react"

export default function AiAssistantPage() {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const askAssistant = async () => {
    setError(null)
    setAnswer(null)
    const text = question.trim()

    if (!text) {
      setError("Пожалуйста, задайте вопрос.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/ai/olympiad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: text })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || "Ошибка сервера. Попробуйте позже.")
      } else {
        setAnswer(data.answer || "К сожалению, ответ не получен.")
      }
    } catch (err) {
      setError("Не удалось получить ответ. Проверьте подключение и ключ Groq.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black tracking-tight">AI-помощник</h1>
          <p className="text-muted-foreground text-lg">Задавайте вопросы по олимпиадам, подготовке и стратегии.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="h-12 rounded-full border-border/40 hover:bg-secondary" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться
          </Button>
        </div>
      </div>

      <Card className="bg-secondary/10 border-border/40">
        <CardHeader>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              AI для олимпиад
            </div>
            <CardTitle className="text-3xl font-headline font-black">Спросите нашего интеллектуального ассистента</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <Textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Например: Как готовиться к олимпиаде по информатике?"
            rows={6}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={askAssistant} disabled={isLoading}>
              {isLoading ? "Жду ответа..." : "Спросить AI"}
            </Button>
            <Button variant="outline" onClick={() => { setQuestion(""); setAnswer(null); setError(null) }}>
              Очистить
            </Button>
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          {answer ? (
            <div className="rounded-3xl border border-border/30 bg-background p-6">
              <h3 className="text-xl font-semibold">Ответ AI</h3>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{answer}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
