"use client"

export const dynamic = "force-dynamic"

import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { ProblemCard } from "@/components/problems/problem-card"
import { ProblemModal } from "@/components/problems/problem-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, BookCheck, ExternalLink, Filter, Trophy } from "lucide-react"
import Link from "next/link"
import { problemsData } from "@/lib/problems-data"
import type { Problem, ProblemSubject } from "@/lib/problems-data"
import { OLYMPIAD_RESOURCES } from "@/lib/olympiad-resources"
import { useToast } from "@/hooks/use-toast"

const allSubjects: { value: ProblemSubject | "all"; label: string }[] = [
  { value: "all", label: "Все предметы" },
  { value: "mathematics", label: "Математика" },
  { value: "physics", label: "Физика" },
  { value: "informatics", label: "Информатика" },
  { value: "chemistry", label: "Химия" },
  { value: "biology", label: "Биология" },
]

function ProblemsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subjectParam = searchParams.get("subject") as ProblemSubject | null
  const { toast } = useToast()

  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const currentSubject: ProblemSubject | "all" = subjectParam && allSubjects.some(s => s.value === subjectParam)
    ? subjectParam
    : "all"

  const filteredProblems = currentSubject === "all"
    ? problemsData
    : problemsData.filter((p) => p.subject === currentSubject)

  const syncing = useRef(false)

  const autoSync = useCallback(async (user: { uid: string }) => {
    if (syncing.current) return
    const last = localStorage.getItem("lastSyncAt")
    if (last && Date.now() - Number(last) < 600_000) return
    syncing.current = true
    try {
      const res = await fetch("/api/sync/codeforces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.synced > 0) {
          const r = await fetch(`/api/profile?uid=${user.uid}`)
          if (r.ok) {
            const p = await r.json()
            setSolvedIds((p.solvedProblems as string[]) || [])
          }
        }
        localStorage.setItem("lastSyncAt", String(Date.now()))
      }
    } catch {
    } finally {
      syncing.current = false
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true)
      try {
        if (user) {
          const res = await fetch(`/api/profile?uid=${user.uid}`)
          if (res.ok) {
            const data = await res.json()
            if (data && data.solvedProblems) {
              setSolvedIds(data.solvedProblems as string[])
            }
          }
        }
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.uid) autoSync(user)
    })
    return () => unsub()
  }, [autoSync])

  const handleSolved = async (problemId: string) => {
    const user = auth.currentUser
    if (!user) return

    if (solvedIds.includes(problemId)) return

    const newSolvedIds = [...solvedIds, problemId]
    setSolvedIds(newSolvedIds)

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          solvedProblems: newSolvedIds,
          tasksSolved: newSolvedIds.length,
        }),
      })
      if (!res.ok) throw new Error("Failed to save progress")
      toast({ title: "Прогресс сохранён" })
    } catch (err) {
      setSolvedIds(solvedIds)
      toast({ title: "Ошибка сохранения", description: "Попробуйте ещё раз", variant: "destructive" })
    }
  }

  const handleSubjectChange = (subject: ProblemSubject | "all") => {
    const params = new URLSearchParams(searchParams.toString())
    if (subject === "all") {
      params.delete("subject")
    } else {
      params.set("subject", subject)
    }
    const query = params.toString()
    router.push(query ? `/problems?${query}` : "/problems")
  }

  const handlePlatformChange = (platform: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (platform === "all") {
      params.delete("platform")
    } else {
      params.set("platform", platform)
    }
    const query = params.toString()
    router.push(query ? `/problems?${query}` : "/problems")
  }

  const unsolvedCount = filteredProblems.filter((p) => !solvedIds.includes(p.id)).length
  const solvedCount = filteredProblems.filter((p) => solvedIds.includes(p.id)).length

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">Дашборд</Link>
            <span className="text-xs">/</span>
            <span className="text-sm text-foreground font-medium">Задачи</span>
          </div>
          <h1 className="text-4xl font-headline font-black tracking-tight">Задачи</h1>
          <p className="text-muted-foreground text-lg">
            Решайте задачи по предметам и отслеживайте свой прогресс
          </p>
        </div>
        <Button variant="outline" className="h-12 rounded-full border-border/40 hover:bg-secondary" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {allSubjects.map((s) => (
          <button
            key={s.value}
            onClick={() => handleSubjectChange(s.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              currentSubject === s.value
                ? "bg-primary text-primary-foreground border-primary shadow-md"
                : "bg-card/50 text-muted-foreground border-border/40 hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <BookCheck className="h-4 w-4" />
        <span>
          {loading ? "Загрузка..." : (
            <>
              Выполнено: <span className="font-bold text-foreground">{solvedCount}</span>
              {" "}из{" "}
              <span className="font-bold text-foreground">{filteredProblems.length}</span>
              {unsolvedCount > 0 && (
                <span className="ml-2 text-muted-foreground/60">
                  (осталось <span className="font-semibold text-amber-400">{unsolvedCount}</span>)
                </span>
              )}
            </>
          )}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-card/40" />
          ))}
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="rounded-3xl border border-border/40 bg-card/40 p-12 text-center space-y-4">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground/40" />
          <h3 className="text-xl font-headline font-bold">Нет задач</h3>
          <p className="text-muted-foreground">По выбранным фильтрам задач не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              solved={solvedIds.includes(problem.id)}
              onClick={() => {
                setSelectedProblem(problem)
                setModalOpen(true)
              }}
            />
          ))}
        </div>
      )}

      <ProblemModal
        problem={selectedProblem}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSolved={handleSolved}
      />

      {(currentSubject === "all" || OLYMPIAD_RESOURCES[currentSubject]) && (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-accent" />
            <div>
              <h2 className="text-3xl font-headline font-black tracking-tight">Олимпиадные задачи</h2>
              <p className="text-muted-foreground text-base">Ссылки на внешние ресурсы с олимпиадными задачами</p>
            </div>
          </div>

          {currentSubject === "all"
            ? Object.entries(OLYMPIAD_RESOURCES).map(([key, categories]) => (
                <div key={key}>
                  <h3 className="text-xl font-headline font-bold mb-4">
                    {key === "mathematics" ? "Математика" :
                     key === "physics" ? "Физика" :
                     key === "informatics" ? "Информатика" :
                     key === "chemistry" ? "Химия" :
                     key === "biology" ? "Биология" : key}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.flatMap((cat) =>
                      cat.links.map((link) => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                          <Card className="bg-card/40 border-border/40 hover:border-primary/30 hover:bg-card/60 transition-all h-full">
                            <CardHeader>
                              <CardTitle className="text-base font-headline font-bold flex items-start gap-2">
                                <ExternalLink className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                                <span>{link.name}</span>
                              </CardTitle>
                            </CardHeader>
                            {link.description && (
                              <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground">{link.description}</p>
                              </CardContent>
                            )}
                          </Card>
                        </a>
                      ))
                    )}
                  </div>
                </div>
              ))
            : OLYMPIAD_RESOURCES[currentSubject]?.map((cat) => (
                <div key={cat.title}>
                  <h3 className="text-xl font-headline font-bold mb-4">{cat.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.links.map((link) => (
                      <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                        <Card className="bg-card/40 border-border/40 hover:border-primary/30 hover:bg-card/60 transition-all h-full">
                          <CardHeader>
                            <CardTitle className="text-base font-headline font-bold flex items-start gap-2">
                              <ExternalLink className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                              <span>{link.name}</span>
                            </CardTitle>
                          </CardHeader>
                          {link.description && (
                            <CardContent className="pt-0">
                              <p className="text-sm text-muted-foreground">{link.description}</p>
                            </CardContent>
                          )}
                        </Card>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  )
}

export default function ProblemsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8 px-6 py-10 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl bg-card/40" />
          ))}
        </div>
      </div>
    }>
      <ProblemsPageContent />
    </Suspense>
  )
}
