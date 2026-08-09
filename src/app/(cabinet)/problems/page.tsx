"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { problemsData } from "@/lib/problems-data";
import type { Problem, ProblemDifficulty } from "@/lib/problems-data";
import { SUBJECTS } from "@/lib/navigation";
import { ProblemCard } from "@/components/problems/problem-card";
import { ProblemModal } from "@/components/problems/problem-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type SubjectFilter = "all" | string;
type DifficultyFilter = "all" | ProblemDifficulty;
type StatusFilter = "all" | "solved" | "unsolved";

const DIFFICULTIES: { value: DifficultyFilter; label: string }[] = [
  { value: "all", label: "Все уровни" },
  { value: "easy", label: "Базовый" },
  { value: "medium", label: "Средний" },
  { value: "hard", label: "Олимпиадный" },
];

export default function ProblemsPage() {
  const { uid, user } = useAuth();
  const [subject, setSubject] = useState<SubjectFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!uid) {
      setLoaded(true);
      return;
    }
    fetch(`/api/profile?uid=${uid}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const ids = Array.isArray(data?.solvedProblems) ? data.solvedProblems : [];
        setSolvedIds(new Set(ids));
      })
      .finally(() => setLoaded(true));
  }, [uid]);

  const handleSolved = useCallback((problemId: string) => {
    setSolvedIds((prev) => new Set(prev).add(problemId));
  }, []);

  const filtered = useMemo(() => {
    return problemsData.filter((p) => {
      if (subject !== "all" && p.subject !== subject) return false;
      if (difficulty !== "all" && p.difficulty !== difficulty) return false;
      const solved = solvedIds.has(p.id);
      if (status === "solved" && !solved) return false;
      if (status === "unsolved" && solved) return false;
      return true;
    });
  }, [subject, difficulty, status, solvedIds]);

  const solvedCount = problemsData.filter((p) => solvedIds.has(p.id)).length;

  return (
    <div className="animate-fade-up space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Задачи</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Решено {solvedCount} из {problemsData.length} · наберите XP за правильные решения
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по предмету">
          {[{ value: "all", label: "Все предметы" }, ...SUBJECTS.filter((s) => s.key !== "informatics").map((s) => ({ value: s.key, label: s.name }))].map((s) => (
            <button
              key={s.value}
              type="button"
              aria-pressed={subject === s.value}
              onClick={() => setSubject(s.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                subject === s.value
                  ? "border-cyan/60 bg-cyan/10 text-cyan"
                  : "border-border text-muted-foreground hover:border-white/20 hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по сложности">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                type="button"
                aria-pressed={difficulty === d.value}
                onClick={() => setDifficulty(d.value)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  difficulty === d.value
                    ? "border-white/20 bg-white/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-white/20 hover:text-foreground"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по статусу">
            {[
              { value: "all", label: "Все" },
              { value: "solved", label: "Решённые" },
              { value: "unsolved", label: "Не решённые" },
            ].map((s) => (
              <button
                key={s.value}
                type="button"
                aria-pressed={status === s.value}
                onClick={() => setStatus(s.value as StatusFilter)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  status === s.value
                    ? "border-white/20 bg-white/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-white/20 hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loaded ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl bg-panel" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel/40 p-12 text-center">
          <p className="font-headline text-lg font-semibold">Ничего не найдено</p>
          <p className="mt-1 text-sm text-muted-foreground">Попробуйте изменить фильтры.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              solved={solvedIds.has(problem.id)}
              onClick={() => setActiveProblem(problem)}
            />
          ))}
        </div>
      )}

      <ProblemModal
        problem={activeProblem}
        open={!!activeProblem}
        onOpenChange={(o) => {
          if (!o) setActiveProblem(null);
        }}
        onSolved={handleSolved}
        uid={uid}
      />
    </div>
  );
}
