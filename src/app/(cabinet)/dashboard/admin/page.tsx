"use client"

import { translateLabel } from "@/i18n/labels";
import { authFetch } from '@/lib/auth-fetch';
import Link from 'next/link';
import { useTranslations as useUITranslations } from "next-intl";
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "@/lib/auth-client"
import { auth, authConfigured } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconX, IconUser, IconAlertTriangle } from "@/components/icons"

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
  const ui = useUITranslations("ui");
  const access = useUITranslations('features.roles.approval');
  const [allowed, setAllowed] = useState(false);
  const [user, setUser] = useState<any>(null)
  const [configs, setConfigs] = useState<AdminConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [newChatId, setNewChatId] = useState("")
  const [newSubject, setNewSubject] = useState("biology")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (!authConfigured) return;
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
      const res = await authFetch("/api/admin/config")
      if (!res.ok) { setAllowed(false); setError(access('adminOnly')); return; }
      setAllowed(true);
      const data = await res.json()
      setConfigs(Array.isArray(data) ? data : [])
    } catch {
      setError(ui("couldNotLoadConfiguration"))
    } finally {
      setLoading(false)
    }
  }

  async function addAdmin() {
    setError("")
    setSuccess("")
    const chatId = Number(newChatId)
    if (!chatId || isNaN(chatId)) {
      setError(ui("enterAValidNumericTelegramId"))
      return
    }
    try {
      const res = await authFetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: newSubject, chatId }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || ui("error"))
        return
      }
      setSuccess(ui("administratorAdded"))
      setNewChatId("")
      await fetchConfigs()
    } catch {
      setError(ui("couldNotAddAdministrator"))
    }
  }

  async function removeAdmin(subject: string, chatId: number) {
    setError("")
    setSuccess("")
    try {
      const res = await authFetch("/api/admin/config", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, chatId }),
      })
      if (!res.ok) throw new Error();
      setSuccess(ui("administratorRemoved"))
      await fetchConfigs()
    } catch {
      setError(ui("couldNotRemoveAdministrator"))
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <IconAlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">{ui("signInToManageAdministrators")}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">{ui("loading")}</p>
      </div>
    )
  }

  if (!allowed) return <p role="alert">{error || access('adminOnly')}</p>;
  return (
    <div className="animate-fade-up space-y-8">
      <Button asChild><Link href="/dashboard/admin/teachers">{access('reviewTitle')}</Link></Button>
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">{ui("manageAdministrators")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{ui("addOrRemoveTelegramAdministratorsForEachSubject")}</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-mint/10 border border-mint/20 text-mint text-sm">
          {success}
        </div>
      )}

      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <IconUser className="h-5 w-5 text-cyan" />
            {ui("subjectAdministrators")} </CardTitle>
          <CardDescription>
            {ui("administratorsReceiveNewRequestsThroughTheTelegramBot")} </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {configs.map((config) => {
            const subject = SUBJECTS.find((s) => s.id === config.subject)
            return (
              <div key={config.subject} className="flex flex-col gap-2 p-4 rounded-xl bg-secondary/30 border border-border/20">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{translateLabel(subject?.label || config.subject, ui)}</span>
                  <span className="text-sm text-muted-foreground">
                    {config.chatIds.length} {config.chatIds.length === 1 ? ui("administrator") : ui("administrators")}
                  </span>
                </div>
                {config.chatIds.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">{ui("noAdministrators")}</p>
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
                          <IconX className="h-3.5 w-3.5" />
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

      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-xl">{ui("addAdministrator")}</CardTitle>
          <CardDescription>
            {ui("askTheAdministratorToSendMyidToTheBot")} </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Telegram ID</Label>
              <Input
                placeholder={ui("forExample123456789")}
                value={newChatId}
                onChange={(e) => setNewChatId(e.target.value)}
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label>{ui("subject")}</Label>
              <Select value={newSubject} onValueChange={setNewSubject}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{translateLabel(s.label, ui)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addAdmin} variant="gradient" className="shrink-0">
              {ui("addAdministrator")} </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="text-xl">{ui("howItWorks")}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>{ui("1TheAdministratorSendsTheBotTheCommand")} <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">/myid</code></p>
          <p>{ui("2CopiesTheirNumericTelegramId")}</p>
          <p>{ui("3EnterThisIdOnThisPageAndSelect")}</p>
          <p>{ui("4DoneRequestsForThisSubjectWillBeSent")}</p>
          <p className="pt-2 text-xs">{ui("administratorsCanAlsoSubscribeThroughTheBotUsingThe")} <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">/register</code></p>
        </CardContent>
      </Card>
    </div>
  )
}
