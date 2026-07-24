"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, ExternalLink, Trophy, Youtube, BookOpen, Download, FileText } from "lucide-react"
import { SubjectSelector, SUBJECTS, type SubjectId } from "@/components/strategy/subject-selector"
import fizikaCurriculum from "@/lib/fizika-curriculum"
import { curriculum as biologyCurriculum } from "@/lib/biology-curriculum"
import informatikaCurriculum from "@/lib/informatika-curriculum"
import matematikaCurriculum from "@/lib/matematika-curriculum"
import himiyaCurriculum from "@/lib/himiya-curriculum"
import { HIMIYA_DRIVE_URL } from "@/lib/himiya-blob"

const PLACEHOLDER_SUBJECTS: SubjectId[] = []

function materialIcon(name: string, url: string) {
  const s = (name + " " + url).toLowerCase()
  if (/youtube|павел|walter|физика с ав|lew/i.test(s)) return Youtube
  if (/ipho|олимпиад/i.test(s)) return Trophy
  if (/khan|academy|курс/i.test(s)) return BookOpen
  return ExternalLink
}

function SubjectMaterials({ materials }: { materials: { name: string; url: string }[] }) {
  if (!materials.length) return null
  return (
    <div>
      <h4 className="font-semibold mb-2">Материалы</h4>
      <div className="flex flex-col gap-2">
        {materials.map((m, i) => {
          const Icon = materialIcon(m.name, m.url)
          return (
            <a
              key={i}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{m.name}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

function FizikaContent() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fizikaCurriculum.map((topic) => (
          <Card key={topic.id} className="bg-card/40 border-border/40 hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl font-headline font-bold">
                {topic.id}. {topic.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {topic.sections.map((sec, i) => (
                  <div key={i} className="mb-3">
                    <h3 className="font-semibold">{sec.level}</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {sec.items.map((it, j) => (
                        <li key={j}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border/20">
                <SubjectMaterials materials={topic.materials} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
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
    return <div className="text-sm text-muted-foreground">Загрузка материалов...</div>
  if (files.length === 0)
    return <div className="text-sm text-muted-foreground">Материалы не найдены.</div>

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
    <div className="space-y-8">
      <div className="space-y-4">
        {files.map((file) => {
          const meta = matchMeta(file)
          return (
            <div key={file} className="p-4 border border-border rounded-md flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                {file}
              </div>
                <div className="text-sm text-muted-foreground">
                  Урок: {meta.topic} · Подтема: {meta.subtopic}
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/api/biology?file=${encodeURIComponent(file)}`} target="_blank">
                  <Button variant="outline" className="h-9">
                    <Download className="mr-2 h-4 w-4" /> Скачать
                  </Button>
                </Link>
                <Link href={`/api/biology?file=${encodeURIComponent(file)}`} target="_blank">
                  <Button className="h-9">Открыть</Button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>

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
    return () => { mounted = false }
  }, [])

  const findFor = (topic: (typeof informatikaCurriculum)[number]) => {
    if (!files) return []
    return files.filter((f) => topic.keywords.some((rx) => rx.test(f)))
  }

  if (files === null)
    return <div className="text-sm text-muted-foreground">Загрузка материалов...</div>

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {informatikaCurriculum.map((topic) => (
          <Card key={topic.id} className="bg-card/40 border-border/40 hover:border-primary/30 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl font-headline font-bold">{topic.id}. {topic.title}</CardTitle>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 mt-1">{topic.section}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {topic.sections.map((sec, i) => (
                  <div key={i} className="mb-3">
                    <h3 className="font-semibold">{sec.level}</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {sec.items.map((it, j) => (
                        <li key={j}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border/20">
                <h4 className="font-semibold mb-2">Онлайн-ресурсы</h4>
                <div className="flex flex-col gap-2">
                  {topic.materials.map((m, i) => (
                    <a
                      key={i}
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" />
                      <span>{m.name}</span>
                    </a>
                  ))}
                </div>
              </div>
              {findFor(topic).length > 0 && (
                <div className="pt-4 border-t border-border/20">
                  <h4 className="font-semibold mb-2">PDF-ресурсы</h4>
                  {findFor(topic).map((file) => (
                    <div key={file} className="flex items-center justify-between gap-4 mb-2">
                      <span className="truncate text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        {file}
                      </span>
                      <div className="flex gap-2 shrink-0">
                        <Link href={`/api/informatika?file=${encodeURIComponent(file)}`} target="_blank">
                          <Button variant="outline" className="h-9">
                            <Download className="mr-2 h-4 w-4" /> Скачать
                          </Button>
                        </Link>
                        <Link href={`/api/informatika?file=${encodeURIComponent(file)}`} target="_blank">
                          <Button className="h-9">Открыть</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
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
            <Button size="lg" className="gap-2">
              <ExternalLink className="h-5 w-5" />
              Открыть материалы в Google Drive
            </Button>
          </a>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matematikaCurriculum.map((topic) => (
          <Card key={topic.id} className="bg-card/40 border-border/40 hover:border-primary/30 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl font-headline font-bold">{topic.id}. {topic.title}</CardTitle>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 mt-1">{topic.section}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {topic.sections.map((sec, i) => (
                  <div key={i} className="mb-3">
                    <h3 className="font-semibold">{sec.level}</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {sec.items.map((it, j) => (
                        <li key={j}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function HimiyaContent() {
  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <a href={HIMIYA_DRIVE_URL} target="_blank" rel="noopener noreferrer">
          <Button size="lg" className="gap-2">
            <ExternalLink className="h-5 w-5" />
            Открыть материалы в Google Drive
          </Button>
        </a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {himiyaCurriculum.map((topic) => (
          <Card key={topic.id} className="bg-card/40 border-border/40 hover:border-primary/30 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl font-headline font-bold">{topic.id <= 13 ? `Раздел ${topic.id}. ${topic.title}` : topic.title}</CardTitle>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 mt-1">{topic.section}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {topic.sections.map((sec, i) => (
                  <div key={i} className="mb-3">
                    <h3 className="font-semibold">{sec.level}</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {sec.items.map((it, j) => (
                        <li key={j}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function StrategyPage() {
  const router = useRouter()
  const [active, setActive] = useState<SubjectId>("biology")
  const subjectName = SUBJECTS.find((s) => s.id === active)?.name

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-black tracking-tight">Ваши материалы</h1>
          <p className="text-muted-foreground text-lg">
            Выберите предмет, чтобы увидеть программу и материалы.
          </p>
        </div>
        <Button variant="outline" className="h-10" onClick={() => router.push("/dashboard")}>
          Назад
        </Button>
      </div>

      <SubjectSelector active={active} onSelect={setActive} />

      <div className="mt-2">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          {subjectName}
        </h2>

        {active === "biology" && <BiologyContent />}
        {active === "fizika" && <FizikaContent />}
        {active === "informatika" && <InformatikaContent />}
        {active === "matematika" && <MatematikaContent />}
        {active === "himiya" && <HimiyaContent />}
        {PLACEHOLDER_SUBJECTS.includes(active) && (
          <div className="flex items-center justify-center rounded-xl border border-border/40 bg-card/30 py-20">
            <span className="text-lg text-muted-foreground">Coming soon</span>
          </div>
        )}
      </div>
    </div>
  )
}
