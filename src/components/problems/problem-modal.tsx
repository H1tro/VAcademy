"use client"

import { useState } from "react"
import type { Problem, ExternalProblem } from "@/lib/problems-data"
import { isExternalProblem } from "@/lib/problems-data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Lightbulb, ExternalLink, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { auth } from "@/lib/firebase"

const subjectLabels: Record<string, string> = {
  mathematics: "Математика",
  physics: "Физика",
  informatics: "Информатика",
  chemistry: "Химия",
  biology: "Биология",
}

const platformLabels: Record<string, string> = {
  codeforces: "Codeforces",
  leetcode: "LeetCode",
}

interface ProblemModalProps {
  problem: Problem | ExternalProblem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSolved: (problemId: string) => void
}

export function ProblemModal({ problem, open, onOpenChange, onSolved }: ProblemModalProps) {
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null)

  if (!problem) return null

  const external = isExternalProblem(problem)

  const handleCheck = () => {
    const internal = problem as Problem
    const isCorrect = answer.trim().toLowerCase() === internal.correctAnswer.trim().toLowerCase()
    setCorrect(isCorrect)
    setSubmitted(true)
    if (isCorrect) {
      onSolved(problem.id)
    }
  }

  const handleVerify = async () => {
    const user = auth.currentUser
    if (!user) return

    setVerifying(true)
    setVerifyResult(null)
    try {
      const res = await fetch(`/api/profile?uid=${user.uid}`)
      if (!res.ok) return
      const profile = await res.json()
      const ext = problem as ExternalProblem

      const body: Record<string, string> = {
        platform: ext.platform,
        externalId: ext.externalId,
      }

      if (ext.platform === "codeforces") {
        if (!profile.codeforcesHandle) return
        body.handle = profile.codeforcesHandle
      } else {
        if (!profile.leetcodeUsername) return
        body.leetcodeUsername = profile.leetcodeUsername
      }

      const verifyRes = await fetch("/api/verify/external", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!verifyRes.ok) return
      const data = await verifyRes.json()
      setVerifyResult(data.solved as boolean)
      setSubmitted(true)
      if (data.solved) {
        onSolved(problem.id)
      }
    } finally {
      setVerifying(false)
    }
  }

  const handleClose = () => {
    setAnswer("")
    setSubmitted(false)
    setCorrect(false)
    setVerifyResult(null)
    onOpenChange(false)
  }

  const handleTryAgain = () => {
    setAnswer("")
    setSubmitted(false)
    setCorrect(false)
    setVerifyResult(null)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) handleClose()
    }}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold">
              {subjectLabels[problem.subject] || problem.subject}
            </Badge>
            <Badge variant="outline" className={cn(
              "text-[10px] uppercase tracking-wider font-bold",
              problem.difficulty === "easy" && "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
              problem.difficulty === "medium" && "bg-amber-500/15 text-amber-500 border-amber-500/30",
              problem.difficulty === "hard" && "bg-red-500/15 text-red-500 border-red-500/30",
            )}>
              {problem.difficulty === "easy" ? "Лёгкая" : problem.difficulty === "medium" ? "Средняя" : "Сложная"}
            </Badge>
            {external && (
              <Badge variant="outline" className={cn(
                "text-[10px] uppercase tracking-wider font-bold",
                problem.platform === "codeforces" && "bg-blue-500/15 text-blue-500 border-blue-500/30",
                problem.platform === "leetcode" && "bg-orange-500/15 text-orange-500 border-orange-500/30",
              )}>
                {platformLabels[problem.platform]}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-2xl font-headline font-black tracking-tight">
            {problem.title}
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/80 mt-2 leading-relaxed">
            {external
              ? `Решите задачу на ${platformLabels[problem.platform]} и проверьте выполнение`
              : (problem as Problem).description
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {external ? (
            <>
              <div className="flex flex-col gap-3">
                <Button variant="outline" asChild>
                  <a href={problem.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Открыть на {platformLabels[problem.platform]}
                  </a>
                </Button>
                <Button onClick={handleVerify} disabled={verifying} className="w-full" size="lg">
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Проверка...
                    </>
                  ) : (
                    "Проверить решение"
                  )}
                </Button>
              </div>

              {submitted && verifyResult !== null && (
                <div className={cn(
                  "space-y-4 p-6 rounded-2xl border-2",
                  verifyResult
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-red-500/10 border-red-500/30"
                )}>
                  <div className="flex items-center gap-3">
                    {verifyResult ? (
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                    <div>
                      <p className={cn(
                        "text-lg font-bold font-headline",
                        verifyResult ? "text-emerald-500" : "text-red-500"
                      )}>
                        {verifyResult ? "Решено!" : "Ещё не решено"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {verifyResult
                          ? "Задача отмечена как выполненная."
                          : "Решите задачу на внешней платформе и проверьте снова."
                        }
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleClose} className="w-full">
                    Закрыть
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              {!submitted ? (
                <>
                  {(problem as Problem).type === "choice" && (problem as Problem).options ? (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Выберите правильный ответ:</Label>
                      <RadioGroup value={answer} onValueChange={setAnswer} className="gap-2">
                        {(problem as Problem).options!.map((option) => (
                          <div key={option} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:bg-secondary/50 transition-colors cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <RadioGroupItem value={option} id={option} />
                            <Label htmlFor={option} className="cursor-pointer flex-1 text-sm font-medium">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label htmlFor="answer" className="text-sm font-semibold">Введите ваш ответ:</Label>
                      <Textarea
                        id="answer"
                        placeholder="Напишите решение..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handleCheck}
                    disabled={!answer.trim()}
                    className="w-full"
                    size="lg"
                  >
                    Проверить
                  </Button>
                </>
              ) : (
                <div className={cn(
                  "space-y-4 p-6 rounded-2xl border-2",
                  correct
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-red-500/10 border-red-500/30"
                )}>
                  <div className="flex items-center gap-3">
                    {correct ? (
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                    <div>
                      <p className={cn(
                        "text-lg font-bold font-headline",
                        correct ? "text-emerald-500" : "text-red-500"
                      )}>
                        {correct ? "Верно!" : "Неверно"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {correct
                          ? "Отличный результат! Так держать."
                          : `Правильный ответ: ${(problem as Problem).correctAnswer}`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border/40">
                    <Lightbulb className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">Объяснение:</span> {(problem as Problem).explanation}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {!correct && (
                      <Button variant="outline" onClick={handleTryAgain} className="flex-1">
                        Попробовать снова
                      </Button>
                    )}
                    <Button onClick={handleClose} className={cn(correct ? "w-full" : "flex-1")}>
                      {correct ? "Отлично! 🎉" : "Закрыть"}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
