"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { problemsData } from "@/lib/problems-data";
import type { Problem, ProblemDifficulty } from "@/lib/problems-data";
import { SUBJECTS } from "@/lib/navigation";
import { ProblemCard } from "@/components/problems/problem-card";
import { ProblemModal } from "@/components/problems/problem-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconFileText, IconArrowRight } from "@/components/icons";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface TestItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  href: string;
}

const pdfTests: TestItem[] = [
  {
    id: "math-1",
    title: "Математика",
    subject: "mathematics",
    description: "Тесты по комбинаторике, теории чисел, алгебре и геометрии",
    href: "/tests/matematika/olympiad_math_test.pdf",
  },
  {
    id: "phys-1",
    title: "Химия 10-11 класс (2023/24)",
    subject: "chemistry",
    description: "Задачи по химии для 10-11 класса",
    href: "/tests/himiya/practika_10_11.pdf",
  },
  {
    id: "phys-2",
    title: "Задачи для практики",
    subject: "chemistry",
    description: "Сборник задач по химии для отработки навыков",
    href: "/tests/himiya/zadachi_dlya_praktiki.pdf",
  },
  {
    id: "inf-1",
    title: "Информатика",
    subject: "informatics",
    description: "Тесты по алгоритмам, структурам данных и программированию",
    href: "/tests/informatika/olympiad_cs_test.pdf",
  },
  {
    id: "chem-1",
    title: "Химия",
    subject: "chemistry",
    description: "Тесты по неорганической, органической и физической химии",
    href: "/tests/himiya/olympiad_chemistry_test.pdf",
  },
  {
    id: "bio-campbell",
    title: "Campbell Biology — Test Bank",
    subject: "biology",
    description: "Официальный тест-банк к учебнику Campbell Biology 10-е издание (2155 вопросов, 384 страницы)",
    href: "/tests/biology/Campbell_Biology_10th_Edition_Test_Bank.pdf",
  },
  {
    id: "phys-extra",
    title: "Дополнительный план подготовки к олимпиадам",
    subject: "physics",
    description: "Сборник тестов для подготовки к олимпиадам по физике",
    href: "/tests/fizika/itogovyj_proverochnyj_test.pdf",
  },
];

type SubjectFilter = "all" | string;
type DifficultyFilter = "all" | ProblemDifficulty;
type StatusFilter = "all" | "solved" | "unsolved";
type TabFilter = "all" | "pdf" | "interactive";

const DIFFICULTIES: { value: DifficultyFilter; label: string }[] = [
  { value: "all", label: "Все уровни" },
  { value: "easy", label: "Базовый" },
  { value: "medium", label: "Средний" },
  { value: "hard", label: "Олимпиадный" },
];

const subjectBadge: Record<string, string> = {
  mathematics: "border-cyan/30 bg-cyan/10 text-cyan",
  physics: "border-sky/30 bg-sky/10 text-sky",
  informatics: "border-violet/30 bg-violet/10 text-violet-300",
  chemistry: "border-mint/30 bg-mint/10 text-mint",
  biology: "border-amber/30 bg-amber/10 text-amber",
};

export default function TestsPage() {
  const { uid } = useAuth();
  const [subject, setSubject] = useState<SubjectFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [tab, setTab] = useState<TabFilter>("all");
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!uid) { setLoaded(true); return; }
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

  const visiblePdf = useMemo(() => {
    return subject === "all" ? pdfTests : pdfTests.filter((t) => t.subject === subject);
  }, [subject]);

  const filteredProblems = useMemo(() => {
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

  const showPdf = tab === "all" || tab === "pdf";
  const showInteractive = tab === "all" || tab === "interactive";

  return (
    <div className="animate-fade-up space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Тесты и задачи</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            PDF-тесты для скачивания и интерактивные задачи · Решено {solvedCount} из {problemsData.length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по типу">
          {([
            { value: "all", label: "Все" },
            { value: "pdf", label: "PDF-тесты" },
            { value: "interactive", label: "Задачи" },
          ] as const).map((t) => (
            <button
              key={t.value}
              type="button"
              aria-pressed={tab === t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                tab === t.value
                  ? "border-cyan/60 bg-cyan/10 text-cyan"
                  : "border-border text-muted-foreground hover:border-white/20 hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по предмету">
          {[{ value: "all", label: "Все предметы" }, ...SUBJECTS.map((s) => ({ value: s.key, label: s.name }))].map((s) => (
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

        {showInteractive && (
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
        )}
      </div>

      {showPdf && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visiblePdf.map((test) => (
            <div key={test.id} className="card-surface card-hover flex flex-col p-6">
              <div className="flex items-center justify-between gap-2">
                <Badge className={cn(subjectBadge[test.subject])}>
                  {SUBJECTS.find((s) => s.key === test.subject)?.name ?? test.subject}
                </Badge>
                <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <IconFileText className="h-3.5 w-3.5" />
                  PDF
                </span>
              </div>
              <h3 className="mt-4 font-headline text-lg font-bold leading-snug">{test.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{test.description}</p>
              <Button variant="gradient" size="sm" className="mt-5 w-full" asChild>
                <a href={test.href} download>
                  Открыть тест
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      )}

      {showPdf && showInteractive && <div className="border-t border-border" />}

      {showInteractive && (
        <>
          {!loaded ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl bg-panel" />
              ))}
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="rounded-2xl border border-border bg-panel/40 p-12 text-center">
              <p className="font-headline text-lg font-semibold">Ничего не найдено</p>
              <p className="mt-1 text-sm text-muted-foreground">Попробуйте изменить фильтры.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProblems.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  solved={solvedIds.has(problem.id)}
                  onClick={() => setActiveProblem(problem)}
                />
              ))}
            </div>
          )}
        </>
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
