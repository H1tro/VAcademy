"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "./icons";
import { Reveal, SectionHeading } from "./reveal";
import { problemsData, type ProblemSubject } from "@/lib/problems-data";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Course = {
  title: string;
  level: string;
  subject: ProblemSubject;
  meta: string;
  cover: string;
  tag: string;
};

const COURSES: Course[] = [
  {
    title: "Математика: олимпиадный путь",
    level: "Начальный",
    subject: "mathematics",
    meta: "8–11 класс",
    tag: "MATH",
    cover: "from-violet to-cyan",
  },
  {
    title: "Информатика и алгоритмы",
    level: "Продвинутый",
    subject: "informatics",
    meta: "9–11 класс",
    tag: "INF",
    cover: "from-cyan to-mint",
  },
  {
    title: "Физика: от теории к решению",
    level: "Средний",
    subject: "physics",
    meta: "8–10 класс",
    tag: "PHY",
    cover: "from-mint to-violet",
  },
  {
    title: "Химия: структура и реакции",
    level: "Начальный",
    subject: "chemistry",
    meta: "8–10 класс",
    tag: "CHM",
    cover: "from-violet to-mint",
  },
];

function CourseCard({ course, index }: { course: Course; index: number }) {
  const t = useTranslations("landing.courses");

  return (
    <Reveal delay={index * 90} className="h-full">
      <article
        className="card-lift flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-panel/60"
      >
        <div className={cn("relative flex h-32 items-end justify-between bg-gradient-to-br p-5", course.cover)}>
          <span className="font-mono text-xs font-semibold tracking-[0.25em] text-white/90">{course.tag}</span>
          <span className="rounded-full bg-background/60 px-3 py-1 font-mono text-[11px] text-foreground backdrop-blur">
            {t(`cards.${index}.level`)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="font-mono text-xs text-muted-foreground">{t(`cards.${index}.meta`)}</p>
          <h3 className="mt-1.5 text-lg font-bold leading-snug">{t(`cards.${index}.title`)}</h3>

          <div className="mt-5 rounded-xl border border-border bg-background/40 p-3 text-sm text-muted-foreground">
            {t('taskCount', { count: problemsData.filter(p => p.subject === course.subject).length })}
          </div>

          <div className="mt-auto flex items-center justify-between pt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 font-mono text-sm font-semibold text-mint">
              {t("free")}
            </span>
            <Button variant="outline" size="sm" className="rounded-full border-border hover:bg-white/5" asChild>
              <Link href="/courses">
                {t("goToCourse")}
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function Courses() {
  const t = useTranslations("landing.courses");

  return (
    <section id="courses" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28" aria-labelledby="courses-title">
      <SectionHeading
        eyebrow={t("eyebrow")}
        id="courses-title"
        title={
          <>
            {t("title")}
          </>
        }
        subtitle={t("subtitle")}
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {COURSES.map((course, i) => (
          <CourseCard key={course.title} course={course} index={i} />
        ))}
      </div>

      <Reveal className="mt-10 text-center">
        <Button variant="outline" className="h-12 rounded-full border-border px-8 hover:bg-white/5" asChild>
          <Link href="/courses">
            {t("viewAll")}
            <IconArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}
