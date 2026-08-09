"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconSpinner, IconRefresh, IconPlus, IconTrash } from "@/components/icons"
import { CFTaskCard, type CFTask } from "@/components/codeforces/cf-task-card"
import { ProgressBar } from "@/components/codeforces/progress-bar"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

export default function CodeforcesPage() {
  const { uid, user } = useAuth()
  const [tasks, setTasks] = useState<CFTask[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [adding, setAdding] = useState(false)
  const [inputId, setInputId] = useState("")
  const [error, setError] = useState("")
  const [cfHandle, setCfHandle] = useState("")

  const fetchTasks = useCallback(async () => {
    if (!uid) return
    setLoading(true)
    try {
      const res = await fetch(`/api/codeforces/tasks?uid=${uid}`)
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } finally {
      setLoading(false)
    }
  }, [uid])

  useEffect(() => {
    if (!uid) return
    fetch(`/api/profile?uid=${uid}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.codeforces) setCfHandle(data.codeforces)
      })
    fetchTasks()
  }, [uid, fetchTasks])

  const handleCheck = async () => {
    if (!uid) return
    setChecking(true)
    setError("")
    try {
      const res = await fetch("/api/codeforces/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Ошибка проверки")
      } else if (data.results) {
        const results: { id: string; status: string; attempts: number }[] = data.results
        setTasks((prev) => {
          const map = new Map(results.map((r) => [r.id, r]))
          return prev.map((t) => {
            const updated = map.get(t.id)
            return updated ? { ...t, status: updated.status as CFTask["status"], attempts: updated.attempts } : t
          })
        })
      }
    } catch {
      setError("Ошибка сети")
    } finally {
      setChecking(false)
    }
  }

  const handleAdd = async () => {
    if (!uid || !inputId.trim()) return
    setAdding(true)
    setError("")
    try {
      const probe = await fetch(`/api/codeforces/problem?id=${encodeURIComponent(inputId.trim())}`)
      if (!probe.ok) {
        const d = await probe.json()
        setError(d.error || "Задача не найдена")
        return
      }
      const info = await probe.json()

      const res = await fetch("/api/codeforces/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, ...info }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || "Не удалось добавить")
        return
      }
      setInputId("")
      await fetchTasks()
    } catch {
      setError("Ошибка сети")
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/codeforces/tasks?id=${id}`, { method: "DELETE" })
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const completedCount = tasks.filter((t) => t.status === "completed").length

  return (
    <div className="animate-fade-up space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Codeforces</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Назначенные задачи и автоматическая проверка решений
          </p>
        </div>
      </div>

      {tasks.length > 0 && <ProgressBar completed={completedCount} total={tasks.length} />}

      {!cfHandle && (
        <div className="rounded-xl bg-amber/10 p-4 text-sm text-amber">
          Укажите ваш <strong>Codeforces Handle</strong> в{" "}
          <a href="/profile/edit" className="underline">
            профиле
          </a>
          , чтобы автоматическая проверка работала.
        </div>
      )}

      {error && <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="cf-id" className="sr-only">
            ID задачи
          </Label>
          <Input
            id="cf-id"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="520A"
            className="w-32 font-mono"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={adding || !inputId.trim()} size="sm" variant="gradient">
            {adding ? <IconSpinner className="h-4 w-4 animate-spin" /> : <IconPlus className="h-4 w-4" />}
            Добавить
          </Button>
        </div>

        <Button onClick={handleCheck} disabled={checking || !uid} size="sm" variant="outline">
          {checking ? (
            <>
              <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
              Проверяем...
            </>
          ) : (
            <>
              <IconRefresh className="mr-2 h-4 w-4" />
              Проверить решения
            </>
          )}
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-panel" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel/40 p-12 text-center">
          <p className="font-headline text-lg font-semibold">Нет назначенных задач</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Добавьте задачу, введя ID в формате <span className="font-mono">520A</span>
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="group relative">
              <CFTaskCard task={task} />
              <button
                type="button"
                onClick={() => handleDelete(task.id)}
                className="absolute right-12 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                aria-label="Удалить задачу"
              >
                <IconTrash className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {checking && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
          <IconSpinner className="h-4 w-4 animate-spin" />
          Проверяем Codeforces...
        </div>
      )}
    </div>
  )
}
