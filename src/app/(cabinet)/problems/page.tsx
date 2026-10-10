"use client";

import { authFetch } from '@/lib/auth-fetch';
import { translateLabel } from "@/i18n/labels";
import { useTranslations as useUITranslations } from "next-intl";
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
  const ui = useUITranslations("ui");
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
    authFetch(`/api/profile?uid=${uid}`)
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
          <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">{ui("problems")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ui("solved")} {solvedCount}  {ui("of")} {problemsData.length}  {ui("earnXpForCorrectSolutions")} </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label={ui("filterBySubject")}>
          {[{ value: "all", label: ui("allSubjects") }, ...SUBJECTS.filter((s) => s.key !== "informatics").map((s) => ({ value: s.key, label: translateLabel(s.name, ui) }))].map((s) => (
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
          <div className="flex flex-wrap gap-2" role="group" aria-label={ui("filterByDifficulty")}>
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
                {translateLabel(d.label, ui)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label={ui("filterByStatus")}>
            {[
              { value: "all", label: ui("all") },
              { value: "solved", label: ui("solved2") },
              { value: "unsolved", label: ui("unsolved2") },
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
          <p className="font-headline text-lg font-semibold">{ui("noResults")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{ui("tryChangingTheFilters")}</p>
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
