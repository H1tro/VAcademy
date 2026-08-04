"use client";

import type { Problem, ProblemDifficulty, ProblemSubject } from "@/lib/problems-data";
import { DIFFICULTY_POINTS } from "@/lib/problems-data";
import { subjectByKey } from "@/lib/navigation";
import { IconCheckCircle } from "@/components/icons";
import { cn } from "@/lib/utils";

const SUBJECT_LABELS: Record<string, string> = {
  mathematics: "Математика",
  physics: "Физика",
  informatics: "Информатика",
  chemistry: "Химия",
  biology: "Биология",
};

const DIFFICULTY_META: Record<
  ProblemDifficulty,
  { label: string; badge: string; text: string }
> = {
  easy: { label: "Базовый", badge: "border-mint/30 bg-mint/10 text-mint", text: "text-mint" },
  medium: { label: "Средний", badge: "border-amber/30 bg-amber/10 text-amber", text: "text-amber" },
  hard: { label: "Олимпиадный", badge: "border-sky/30 bg-sky/10 text-sky", text: "text-sky" },
};

export function ProblemCard({
  problem,
  solved,
  onClick,
}: {
  problem: Problem;
  solved: boolean;
  onClick: () => void;
}) {
  const meta = DIFFICULTY_META[problem.difficulty];
  const subject = subjectByKey(problem.subject as ProblemSubject);

  return (
    <button
      type="button"
      onClick={onClick}
      className="card-surface card-hover group w-full p-5 text-left"
      aria-pressed={solved}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", subject?.text ?? "bg-white/40")}
          aria-hidden="true"
        />
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
            meta.badge
          )}
        >
          {meta.label}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          <span className={meta.text}>{DIFFICULTY_POINTS[problem.difficulty]} XP</span>
        </span>
      </div>

      <h3 className="mt-3 font-headline text-base font-bold leading-snug group-hover:text-cyan">
        {problem.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{problem.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {SUBJECT_LABELS[problem.subject] ?? problem.subject}
        </span>
        {solved && (
          <span className="flex items-center gap-1 font-mono text-[11px] text-mint">
            <IconCheckCircle className="h-4 w-4" />
            Решено
          </span>
        )}
      </div>
    </button>
  );
}
