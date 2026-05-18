
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { curriculum } from "@/lib/biology-curriculum"

export default function MaterialsPage() {
  const router = useRouter()
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-black font-headline tracking-tight">Ваши материалы</h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Здесь будут отображаться ваши сохраненные курсы, задачи и прогресс обучения.
        </p>
        <Button variant="outline" className="mx-auto h-12 rounded-full border-border/40 hover:bg-secondary" onClick={() => router.push('/dashboard')}>
          Назад
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="bg-card/40 border-border/40 hover:border-primary/30 transition-all group">
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Изучаемые курсы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Вы еще не начали ни одного курса. Перейдите в каталог, чтобы выбрать интересную тему.</p>
            <Button className="w-full bg-secondary hover:bg-primary transition-all rounded-xl" asChild>
              <Link href="/courses">Каталог курсов <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/40 hover:border-accent/30 transition-all group">
          <CardHeader>
            <GraduationCap className="h-8 w-8 text-accent mb-2" />
            <CardTitle>Олимпиадные задачи</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Здесь будут храниться задачи, которые вы отметили как важные или сложные.</p>
            <Button variant="outline" className="w-full border-border/40 rounded-xl">
              Открыть практику
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Biology — материалы</h2>
        <BiologyMaterials />
      </div>
    </div>
  )
}

function BiologyMaterials() {
  const [files, setFiles] = useState<string[] | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/api/biology')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        setFiles(data?.files || [])
      })
      .catch(() => setFiles([]))
    return () => { mounted = false }
  }, [])

  if (files === null) return <div className="text-sm text-muted-foreground">Загрузка материалов...</div>
  if (files.length === 0) return <div className="text-sm text-muted-foreground">Материалы не найдены.</div>

  const matchMeta = (file: string) => {
    const lc = file.toLowerCase()
    let topic: string | null = null
    let subtopic: string | null = null
    for (const t of curriculum) {
      if (t.keywords.some((rx: RegExp) => rx.test(file))) {
        topic = t.title
        for (const sec of t.sections) {
          for (const it of sec.items) {
            const norm = it.toLowerCase()
            const key = norm.split(/[^a-zа-яё0-9]+/).filter(Boolean).slice(0,3).join(' ')
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
    return { topic: topic || 'Неопределено', subtopic: subtopic || 'Не определено' }
  }

  return (
    <div className="space-y-4">
      {files.map((file) => {
        const meta = matchMeta(file)
        return (
          <div key={file} className="p-4 border border-border rounded-md flex items-center justify-between">
            <div>
              <div className="font-semibold">{file}</div>
              <div className="text-sm text-muted-foreground">Урок: {meta.topic} · Подтема: {meta.subtopic}</div>
            </div>
            <div className="flex gap-2">
              <Link href={`/api/biology?file=${encodeURIComponent(file)}`} target="_blank">
                <Button variant="outline">Скачать</Button>
              </Link>
              <Link href={`/api/biology?file=${encodeURIComponent(file)}`} target="_blank">
                <Button>Открыть</Button>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
