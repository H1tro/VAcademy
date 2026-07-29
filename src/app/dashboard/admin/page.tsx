"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Users, AlertCircle } from "lucide-react"

const SUBJECTS = [
  { id: "biology", label: "Биология" },
  { id: "physics", label: "Физика" },
  { id: "chemistry", label: "Химия" },
  { id: "math", label: "Математика" },
  { id: "cs", label: "Информатика" },
]

type AdminConfig = {
  subject: string
  chatIds: number[]
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [configs, setConfigs] = useState<AdminConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [newChatId, setNewChatId] = useState("")
  const [newSubject, setNewSubject] = useState("biology")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (!u) setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    fetchConfigs()
  }, [user])

  async function fetchConfigs() {
    try {
      const res = await fetch("/api/admin/config")
      const data = await res.json()
      setConfigs(Array.isArray(data) ? data : [])
    } catch {
      setError("Не удалось загрузить конфигурацию")
    } finally {
      setLoading(false)
    }
  }

  async function addAdmin() {
    setError("")
    setSuccess("")
    const chatId = Number(newChatId)
    if (!chatId || isNaN(chatId)) {
      setError("Введите корректный Telegram ID (число)")
      return
    }
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: newSubject, chatId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Ошибка")
        return
      }
      setSuccess("Администратор добавлен")
      setNewChatId("")
      await fetchConfigs()
    } catch {
      setError("Ошибка при добавлении")
    }
  }

  async function removeAdmin(subject: string, chatId: number) {
    setError("")
    setSuccess("")
    try {
      await fetch("/api/admin/config", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, chatId }),
      })
      setSuccess("Администратор удален")
      await fetchConfigs()
    } catch {
      setError("Ошибка при удалении")
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">Войдите в аккаунт, чтобы управлять администраторами</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black font-headline tracking-tight">Управление администраторами</h1>
        <p className="text-muted-foreground mt-2">Добавляйте и удаляйте администраторов Telegram для каждого предмета</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm">
          {success}
        </div>
      )}

      <Card className="border-border/40 shadow-xl bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Администраторы предметов
          </CardTitle>
          <CardDescription>
            Администраторы получают уведомления о новых заявках через Telegram бота
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {configs.map((config) => {
            const subject = SUBJECTS.find((s) => s.id === config.subject)
            return (
              <div key={config.subject} className="flex flex-col gap-2 p-4 rounded-xl bg-secondary/30 border border-border/20">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{subject?.label || config.subject}</span>
                  <span className="text-sm text-muted-foreground">
                    {config.chatIds.length} {config.chatIds.length === 1 ? "администратор" : "администраторов"}
                  </span>
                </div>
                {config.chatIds.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Нет администраторов</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {config.chatIds.map((id) => (
                      <div
                        key={id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border/30 text-sm"
                      >
                        <span className="font-mono">{id}</span>
                        <button
                          onClick={() => removeAdmin(config.subject, id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-xl bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">Добавить администратора</CardTitle>
          <CardDescription>
            Попросите администратора написать боту /myid и введите полученный ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Telegram ID</Label>
              <Input
                placeholder="Например: 123456789"
                value={newChatId}
                onChange={(e) => setNewChatId(e.target.value)}
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label>Предмет</Label>
              <Select value={newSubject} onValueChange={setNewSubject}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addAdmin} className="shrink-0">
              Добавить администратора
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-xl bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">Как это работает</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. Администратор пишет боту команду <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">/myid</code></p>
          <p>2. Копирует свой Telegram ID (число)</p>
          <p>3. Вы вводите этот ID на этой странице и выбираете предмет</p>
          <p>4. Готово! Все заявки по этому предмету будут приходить администратору</p>
          <p className="pt-2 text-xs">Также администраторы могут сами подписаться через бота командой <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">/register</code></p>
        </CardContent>
      </Card>
    </div>
  )
}
