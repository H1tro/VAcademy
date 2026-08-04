"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { IconSparkles, IconSend, IconAlertTriangle } from "@/components/icons";

export const dynamic = "force-dynamic";

export default function AiAssistantPage() {
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config?global=true")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setAiEnabled(data?.aiEnabled ?? true))
      .catch(() => setAiEnabled(true));
  }, []);

  const askAssistant = async () => {
    setError(null);
    setAnswer(null);
    const text = question.trim();

    if (!text) {
      setError("Пожалуйста, задайте вопрос.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/olympiad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Ошибка сервера. Попробуйте позже.");
      } else {
        setAnswer(data.answer || "К сожалению, ответ не получен.");
      }
    } catch {
      setError("Не удалось получить ответ. Проверьте подключение и ключ Groq.");
    } finally {
      setIsLoading(false);
    }
  };

  if (aiEnabled === null) {
    return (
      <div className="animate-fade-up space-y-4">
        <Skeleton className="h-40 rounded-2xl bg-panel" />
        <Skeleton className="h-64 rounded-2xl bg-panel" />
      </div>
    );
  }

  if (!aiEnabled) {
    return (
      <div className="animate-fade-up mx-auto max-w-xl py-12 text-center">
        <div className="rounded-full border border-amber/30 bg-amber/10 p-4 text-amber">
          <IconAlertTriangle className="mx-auto h-8 w-8" />
        </div>
        <h1 className="mt-6 font-headline text-2xl font-bold tracking-tight">AI временно недоступен</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Администратор отключил AI-ассистента. Загляните позже.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">AI-помощник</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Задавайте вопросы по олимпиадам, подготовке и стратегии.
        </p>
      </div>

      <section className="card-surface p-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-1.5 text-sm font-semibold text-white">
          <IconSparkles className="h-4 w-4" />
          AI для олимпиад
        </div>
        <h2 className="mt-4 font-headline text-xl font-bold sm:text-2xl">
          Спросите нашего интеллектуального ассистента
        </h2>

        <div className="mt-5 space-y-4">
          <Textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Например: Как готовиться к олимпиаде по информатике?"
            rows={6}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={askAssistant} disabled={isLoading} variant="gradient">
              <IconSend className="mr-2 h-4 w-4" />
              {isLoading ? "Жду ответа..." : "Спросить AI"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setQuestion("");
                setAnswer(null);
                setError(null);
              }}
            >
              Очистить
            </Button>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {answer && (
            <div className="rounded-2xl border border-border bg-panel/40 p-5">
              <h3 className="flex items-center gap-2 font-headline text-lg font-semibold">
                <IconSparkles className="h-4 w-4 text-amber" />
                Ответ AI
              </h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">{answer}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}