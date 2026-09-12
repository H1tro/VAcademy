"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconTrophy, IconBook, IconExternalLink, IconMapPin } from "@/components/icons"
import curriculum from "@/lib/fizika-curriculum"
import { FIZIKA_OLYMPIADS } from "@/lib/fizika-olympiads"
import { cn } from "@/lib/utils"

type Level = "Beginner" | "Intermediate" | "Advanced"

const LEVELS: { value: Level | "all"; label: string }[] = [
  { value: "all", label: "Все уровни" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
]

const levelColors: Record<Level, string> = {
  Beginner: "border-mint/30 bg-mint/10 text-mint",
  Intermediate: "border-sky/30 bg-sky/10 text-sky",
  Advanced: "border-amber/30 bg-amber/10 text-amber",
}

function materialIcon(name: string, url: string) {
  const s = (name + " " + url).toLowerCase()
  if (/ipho|олимпиад/i.test(s)) return IconTrophy
  if (/khan|academy|курс/i.test(s)) return IconBook
  return IconExternalLink
}

export default function FizikaPage() {
  const [level, setLevel] = useState<Level | "all">("all")

  const filtered = level === "all" ? curriculum : curriculum.filter((t) => t.level === level)

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Физика</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Учебная программа и олимпиадные ресурсы · {curriculum.length} тем
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по уровню">
        {LEVELS.map((l) => (
          <button
            key={l.value}
            type="button"
            aria-pressed={level === l.value}
            onClick={() => setLevel(l.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              level === l.value
                ? "border-cyan/60 bg-cyan/10 text-cyan"
                : "border-border text-muted-foreground hover:border-white/20 hover:text-foreground"
            )}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((topic) => (
          <Card key={topic.id} className="card-surface card-hover">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="font-headline text-lg font-bold leading-snug">
                  {topic.id}. {topic.title}
                </CardTitle>
                <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", levelColors[topic.level])}>
                  {topic.level}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {topic.sections.map((sec, i) => (
                  <div key={i}>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {sec.items.map((it, j) => (
                        <li key={j}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {topic.mathPrerequisites.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/20">
                  <h4 className="font-semibold text-xs text-violet mb-1">Математика перед изучением</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {topic.mathPrerequisites.map((m, i) => (
                      <span key={i} className="rounded-full bg-violet/10 border border-violet/20 px-2 py-0.5 text-xs text-violet">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-border/20">
                <h4 className="font-semibold mb-2">Материалы</h4>
                <div className="flex flex-col gap-2">
                  {topic.materials.map((m, i) => {
                    const Icon = materialIcon(m.name, m.url)
                    return (
                      <a
                        key={i}
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-cyan hover:underline"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{m.name}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrophy className="h-5 w-5 text-amber" />
            Олимпиадные задачи
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {FIZIKA_OLYMPIADS.map((category) => {
            const CategoryIcon = category.icon === "trophy" ? IconTrophy : category.icon === "globe" ? IconExternalLink : category.icon === "book" ? IconBook : IconMapPin
            return (
              <div key={category.title}>
                <h3 className="flex items-center gap-2 font-semibold text-sm mb-2">
                  <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                  {category.title}
                </h3>
                <div className="flex flex-col gap-2 pl-6">
                  {category.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-cyan hover:underline"
                    >
                      <IconExternalLink className="h-3 w-3 shrink-0" />
                      <span>{item.name}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground hidden sm:inline">— {item.description.slice(0, 60)}...</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}