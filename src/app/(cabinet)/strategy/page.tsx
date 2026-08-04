"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SubjectSelector, SUBJECTS, type SubjectId } from "@/components/strategy/subject-selector"
import { IconTrophy, IconBook, IconExternalLink, IconDownload, IconFileText, IconGraduation } from "@/components/icons"
import fizikaCurriculum from "@/lib/fizika-curriculum"
import { curriculum as biologyCurriculum } from "@/lib/biology-curriculum"
import informatikaCurriculum from "@/lib/informatika-curriculum"
import matematikaCurriculum from "@/lib/matematika-curriculum"
import himiyaCurriculum from "@/lib/himiya-curriculum"
import { HIMIYA_DRIVE_URL } from "@/lib/himiya-blob"

const PLACEHOLDER_SUBJECTS: SubjectId[] = []

function materialIcon(name: string, url: string) {
  const s = (name + " " + url).toLowerCase()
  if (/ipho|олимпиад/i.test(s)) return IconTrophy
  if (/khan|academy|курс/i.test(s)) return IconBook
  return IconExternalLink
}

function TopicCard({
  id,
  title,
  section,
  children,
}: {
  id: number
  title: string
  section?: string
  children: React.ReactNode
}) {
  return (
    <div className="card-surface card-hover p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-headline text-lg font-bold leading-snug">
          {title}
        </h3>
        {section && (
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {section}
          </span>
        )}
      </div>
      <div className="mt-4 space-y-3 text-sm">{children}</div>
    </div>
  )
}

function SectionList({ sections }: { sections: { level: string; items: string[] }[] }) {
  return (
    <div className="space-y-3">
      {sections.map((sec, i) => (
        <div key={i}>
          <p className="font-semibold text-cyan">{sec.level}</p>
          <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
            {sec.items.map((it, j) => (
              <li key={j}>{it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function MaterialsList({ materials }: { materials: { name: string; url: string }[] }) {
  if (!materials.length) return null
  return (
    <div className="space-y-2 border-t border-border pt-4">
      <p className="font-semibold">Материалы</p>
      {materials.map((m, i) => {
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
  )
}

function FizikaContent() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {fizikaCurriculum.map((topic) => (
        <TopicCard key={topic.id} id={topic.id} title={`${topic.id}. ${topic.title}`}>
          <SectionList sections={topic.sections} />
          <MaterialsList materials={topic.materials} />
        </TopicCard>
      ))}
    </div>
  )
}

function BiologyContent() {
  const [files, setFiles] = useState<string[] | null>(null)

  useEffect(() => {
    let mounted = true
    fetch("/api/biology")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setFiles(data?.files || [])
      })
      .catch(() => setFiles([]))
    return () => {
      mounted = false
    }
  }, [])

  if (files === null)
    return <p className="text-sm text-muted-foreground">Загрузка материалов...</p>
  if (files.length === 0)
    return <p className="text-sm text-muted-foreground">Материалы не найдены.</p>

  const matchMeta = (file: string) => {
    const lc = file.toLowerCase()
    let topic: string | null = null
    let subtopic: string | null = null
    for (const t of biologyCurriculum) {
      if (t.keywords.some((rx: RegExp) => rx.test(file))) {
        topic = t.title
        for (const sec of t.sections) {
          for (const it of sec.items) {
            const norm = it.toLowerCase()
            const key = norm.split(/[^a-zа-яё0-9]+/).filter(Boolean).slice(0, 3).join(" ")
            if (key && lc.includes(key)) {
              subtopic = it
              break
            }
          }
          if (subtopic) break
        }
        break
      }
    }
    return { topic: topic || "Неопределено", subtopic: subtopic || "Не определено" }
  }

  return (
    <div className="space-y-4">
      {files.map((file) => {
        const meta = matchMeta(file)
        return (
          <div key={file} className="card-surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-semibold">
                <IconFileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{file}</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Урок: {meta.topic} · Подтема: {meta.subtopic}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`/api/biology?file=${encodeURIComponent(file)}`} target="_blank" rel="noopener noreferrer">
                  <IconDownload className="mr-2 h-4 w-4" /> Скачать
                </a>
              </Button>
              <Button size="sm" variant="gradient" asChild>
                <a href={`/api/biology?file=${encodeURIComponent(file)}`} target="_blank" rel="noopener noreferrer">
                  Открыть
                </a>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function InformatikaContent() {
  const [files, setFiles] = useState<string[] | null>(null)

  useEffect(() => {
    let mounted = true
    fetch("/api/informatika")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setFiles(data?.files || [])
      })
      .catch(() => setFiles([]))
    return () => {
      mounted = false
    }
  }, [])

  const findFor = (topic: (typeof informatikaCurriculum)[number]) => {
    if (!files) return []
    return files.filter((f) => topic.keywords.some((rx) => rx.test(f)))
  }

  if (files === null)
    return <p className="text-sm text-muted-foreground">Загрузка материалов...</p>

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {informatikaCurriculum.map((topic) => (
        <TopicCard key={topic.id} id={topic.id} title={`${topic.id}. ${topic.title}`} section={topic.section}>
          <SectionList sections={topic.sections} />
          <MaterialsList materials={topic.materials} />
          {findFor(topic).length > 0 && (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="font-semibold">PDF-ресурсы</p>
              {findFor(topic).map((file) => (
                <div key={file} className="flex items-center justify-between gap-4">
                  <span className="flex min-w-0 items-center gap-2 truncate text-sm">
                    <IconFileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{file}</span>
                  </span>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/api/informatika?file=${encodeURIComponent(file)}`} target="_blank" rel="noopener noreferrer">
                        <IconDownload className="mr-2 h-4 w-4" /> Скачать
                      </a>
                    </Button>
                    <Button size="sm" variant="gradient" asChild>
                      <a href={`/api/informatika?file=${encodeURIComponent(file)}`} target="_blank" rel="noopener noreferrer">
                        Открыть
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TopicCard>
      ))}
    </div>
  )
}

function MatematikaContent() {
  const [driveUrl, setDriveUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/matematika")
      .then((r) => r.json())
      .then((data) => setDriveUrl(data?.driveUrl || null))
      .catch(() => setDriveUrl(null))
  }, [])

  return (
    <div className="space-y-6">
      {driveUrl && (
        <div className="flex justify-center">
          <a href={driveUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="gradient" className="gap-2">
              <IconExternalLink className="h-5 w-5" />
              Открыть материалы в Google Drive
            </Button>
          </a>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {matematikaCurriculum.map((topic) => (
          <TopicCard key={topic.id} id={topic.id} title={`${topic.id}. ${topic.title}`} section={topic.section}>
            <SectionList sections={topic.sections} />
          </TopicCard>
        ))}
      </div>
    </div>
  )
}

function HimiyaContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <a href={HIMIYA_DRIVE_URL} target="_blank" rel="noopener noreferrer">
          <Button size="lg" variant="gradient" className="gap-2">
            <IconExternalLink className="h-5 w-5" />
            Открыть материалы в Google Drive
          </Button>
        </a>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {himiyaCurriculum.map((topic) => (
          <TopicCard
            key={topic.id}
            id={topic.id}
            title={topic.id <= 13 ? `Раздел ${topic.id}. ${topic.title}` : topic.title}
            section={topic.section}
          >
            <SectionList sections={topic.sections} />
          </TopicCard>
        ))}
      </div>
    </div>
  )
}

export default function StrategyPage() {
  const [active, setActive] = useState<SubjectId>("biology")
  const subjectName = SUBJECTS.find((s) => s.id === active)?.name

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Стратегия</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Выберите предмет, чтобы увидеть программу подготовки и материалы.
        </p>
      </div>

      <SubjectSelector active={active} onSelect={setActive} />

      <div>
        <h2 className="mb-4 flex items-center gap-2 font-headline text-xl font-bold">
          <IconGraduation className="h-5 w-5 text-cyan" />
          {subjectName}
        </h2>

        {active === "biology" && <BiologyContent />}
        {active === "fizika" && <FizikaContent />}
        {active === "informatika" && <InformatikaContent />}
        {active === "matematika" && <MatematikaContent />}
        {active === "himiya" && <HimiyaContent />}
        {PLACEHOLDER_SUBJECTS.includes(active) && (
          <div className="flex items-center justify-center rounded-2xl border border-border bg-panel/40 py-20">
            <span className="text-lg text-muted-foreground">Coming soon</span>
          </div>
        )}
      </div>
    </div>
  )
}
