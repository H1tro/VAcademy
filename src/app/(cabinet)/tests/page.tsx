"use client";

import { useState } from "react";
import { SUBJECTS } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconClock, IconFileText, IconArrowRight } from "@/components/icons";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface TestItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  href: string;
  isPdf: boolean;
}

const tests: TestItem[] = [
  {
    id: "math-1",
    title: "Математика",
    subject: "mathematics",
    description: "Тесты по комбинаторике, теории чисел, алгебре и геометрии",
    href: "/tests/matematika/olympiad_math_test.pdf",
    isPdf: true,
  },
  {
    id: "phys-1",
    title: "Физика",
    subject: "physics",
    description: "Тесты по механике, электродинамике, оптике и термодинамике",
    href: "#",
    isPdf: false,
  },
  {
    id: "inf-1",
    title: "Информатика",
    subject: "informatics",
    description: "Тесты по алгоритмам, структурам данных и программированию",
    href: "/tests/informatika/olympiad_cs_test.pdf",
    isPdf: true,
  },
  {
    id: "chem-1",
    title: "Химия",
    subject: "chemistry",
    description: "Тесты по неорганической, органической и физической химии",
    href: "/tests/himiya/olympiad_chemistry_test.pdf",
    isPdf: true,
  },
  {
    id: "chem-vso-10",
    title: "ВсОШ Химия — 10 класс (2023/24)",
    subject: "chemistry",
    description: "Школьный этап ВсОШ по химии для 10 класса. 12 заданий, макс. 50 баллов. Органическая и неорганическая химия.",
    href: "#",
    isPdf: false,
  },
  {
    id: "chem-vso-9",
    title: "ВсОШ Химия — 9 класс (2023/24)",
    subject: "chemistry",
    description: "Школьный этап ВсОШ по химии для 9 класса. 12 заданий, макс. 50 баллов. Неорганическая химия и расчёты.",
    href: "#",
    isPdf: false,
  },

  {
    id: "bio-campbell",
    title: "Campbell Biology — Test Bank",
    subject: "biology",
    description: "Официальный тест-банк к учебнику Campbell Biology 10-е издание (2155 вопросов, 384 страницы)",
    href: "/tests/biology/Campbell_Biology_10th_Edition_Test_Bank.pdf",
    isPdf: true,
  },
  {
    id: "bio-diagnostic",
    title: "Biology Diagnostic Test",
    subject: "biology",
    description: "Диагностический тест по биологии для проверки знаний",
    href: "/tests/biology/Biology_Diagnostic_Test_Full.pdf",
    isPdf: true,
  },
  {
    id: "phys-extra",
    title: "Дополнительный план подготовки к олимпиадам",
    subject: "physics",
    description: "Сборник тестов для подготовки к олимпиадам по физике",
    href: "/tests/fizika/Итоговый_проверочный_тест_по_материалам_плана_подготовки_к_физическим_олимпиадам.pdf",
    isPdf: true,
  },
];

const subjectBadge: Record<string, string> = {
  mathematics: "border-cyan/30 bg-cyan/10 text-cyan",
  physics: "border-sky/30 bg-sky/10 text-sky",
  informatics: "border-violet/30 bg-violet/10 text-violet-300",
  chemistry: "border-mint/30 bg-mint/10 text-mint",
  biology: "border-amber/30 bg-amber/10 text-amber",
};

export default function TestsPage() {
  const [subject, setSubject] = useState("all");

  const visible = subject === "all" ? tests : tests.filter((t) => t.subject === subject);

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Тесты</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Проверьте знания по предметам · олимпиадные и экзаменационные варианты
        </p>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((test) => (
          <div key={test.id} className="card-surface card-hover flex flex-col p-6">
            <div className="flex items-center justify-between gap-2">
              <Badge className={cn(subjectBadge[test.subject])}>
                {SUBJECTS.find((s) => s.key === test.subject)?.name ?? test.subject}
              </Badge>
              {test.isPdf ? (
                <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <IconFileText className="h-3.5 w-3.5" />
                  PDF
                </span>
              ) : (
                <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <IconClock className="h-3.5 w-3.5" />
                  Скоро
                </span>
              )}
            </div>
            <h3 className="mt-4 font-headline text-lg font-bold leading-snug">{test.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{test.description}</p>
            <Button
              variant={test.isPdf ? "gradient" : "outline"}
              size="sm"
              disabled={!test.isPdf}
              className="mt-5 w-full"
              asChild={test.isPdf}
            >
              {test.isPdf ? (
                <a href={test.href} download>
                  Открыть тест
                  <IconArrowRight className="ml-2 h-4 w-4" />
                </a>
              ) : (
                <span>Скоро</span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
