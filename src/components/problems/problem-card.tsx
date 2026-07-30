"use client"

import type { Problem, ExternalProblem } from "@/lib/problems-data"
import { isExternalProblem } from "@/lib/problems-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, ExternalLink } from "lucide-react"

const subjectLabels: Record<string, string> = {
  mathematics: "Математика",
  physics: "Физика",
  informatics: "Информатика",
  chemistry: "Химия",
  biology: "Биология",
}

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  hard: "bg-red-500/15 text-red-500 border-red-500/30",
}

const difficultyLabels: Record<string, string> = {
  easy: "Лёгкая",
  medium: "Средняя",
  hard: "Сложная",
}

const platformLabels: Record<string, string> = {
  codeforces: "Codeforces",
  leetcode: "LeetCode",
}

const platformColors: Record<string, string> = {
  codeforces: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  leetcode: "bg-orange-500/15 text-orange-500 border-orange-500/30",
}

interface ProblemCardProps {
  problem: Problem | ExternalProblem
  solved: boolean
  onClick: (external?: boolean) => void
}

export function ProblemCard({ problem, solved, onClick }: ProblemCardProps) {
  const external = isExternalProblem(problem)
  const subjectLabel = subjectLabels[problem.subject] || problem.subject

  return (
    <Card
      className="border-border/40 bg-card/50 shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
      onClick={() => onClick(external)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5">
                {subjectLabel}
              </Badge>
              <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 ${difficultyColors[problem.difficulty]}`}>
                {difficultyLabels[problem.difficulty]}
              </Badge>
              {external && (
                <Badge variant="outline" className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 ${platformColors[problem.platform]}`}>
                  {platformLabels[problem.platform]}
                </Badge>
              )}
            </div>
            <h3 className="font-headline font-bold text-lg tracking-tight group-hover:text-primary transition-colors truncate">
              {problem.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 flex items-center gap-1">
              {external ? (
                <>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  {problem.platform === "codeforces" ? (
                    <>Задача #{problem.externalId} на Codeforces</>
                  ) : (
                    <>{problem.externalId} на LeetCode</>
                  )}
                </>
              ) : (
                (problem as Problem).description
              )}
            </p>
          </div>
          <div className="flex-shrink-0 mt-1">
            {solved ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
