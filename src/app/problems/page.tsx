"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { ProblemCard } from "@/components/problems/problem-card"
import { ProblemModal } from "@/components/problems/problem-modal"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, BookCheck, Filter } from "lucide-react"
import Link from "next/link"
import { problemsData } from "@/lib/problems-data"
import type { Problem, ProblemSubject } from "@/lib/problems-data"

const allSubjects: { value: ProblemSubject | "all"; label: string }[] = [
  { value: "all", label: "Все предметы" },
  { value: "mathematics", label: "Математика" },
  { value: "physics", label: "Физика" },
  { value: "informatics", label: "Информатика" },
  { value: "chemistry", label: "Химия" },
  { value: "biology", label: "Биология" },
]

export default function ProblemsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subjectParam = searchParams.get("subject") as ProblemSubject | null

  const [problems] = useState<Problem[]>(problemsData)
  const [solvedIds, setSolvedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const currentSubject: ProblemSubject | "all" = subjectParam && allSubjects.some(s => s.value === subjectParam)
    ? subjectParam
    : "all"

  const filteredProblems = currentSubject === "all"
    ? problems
    : problems.filter((p) => p.subject === currentSubject)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true)
      try {
        if (user) {
          const profileDoc = await getDoc(doc(db, "users", user.uid))
          if (profileDoc.exists()) {
            const data = profileDoc.data()
            setSolvedIds((data.solvedProblems as string[]) || [])
          }
        }
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleSolved = async (problemId: string) => {
    const user = auth.currentUser
    if (!user) return

    if (solvedIds.includes(problemId)) return

    const newSolvedIds = [...solvedIds, problemId]
    setSolvedIds(newSolvedIds)

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          solvedProblems: newSolvedIds,
          tasksSolved: newSolvedIds.length,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )
    } catch (err) {
      setSolvedIds(solvedIds)
      console.error("Failed to save progress", err)
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
    </div>
  )
}
