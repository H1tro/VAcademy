import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ExternalLink, FileText } from "lucide-react"
import curriculum from "@/lib/biology-curriculum"
import { getBiologyFilesList } from "@/lib/biology-blob"
import { BIOLOGY_OLYMPIAD } from "@/lib/biology-olympiads"

async function findMaterials() {
  try {
    const files = await getBiologyFilesList()
    return files
  } catch (e) {
    return []
  }
}

export default async function BiologyPage() {
  const materials = await findMaterials()

  const findFor = (topic) => {
    const matches = materials.filter((f) => topic.keywords.some((rx) => rx.test(f)))
    return matches
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-black tracking-tight">Биология</h1>
          <p className="text-muted-foreground text-lg">Материалы и учебная программа по биологии (включая PDF-ресурсы из папки Biology).</p>
        </div>
        <div>
          <Link href="/strategy">
            <Button variant="outline" className="h-10">Назад</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {curriculum.map((topic) => (
          <Card key={topic.id} className="bg-card/40 border-border/40 hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl font-headline font-bold">{topic.id}. {topic.title}</CardTitle>
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
                <h4 className="font-semibold mb-2">Материалы</h4>
                <div className="flex flex-col gap-2">
                  {findFor(topic).length === 0 && <div className="text-sm text-muted-foreground">Материалы не найдены в папке Biology.</div>}
                  {findFor(topic).map((file) => (
                      <div key={file} className="flex items-center justify-between gap-4">
                        <span className="truncate text-sm flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          {file}
                        </span>
                      <div className="flex gap-2">
                        <Link href={`/api/biology?file=${encodeURIComponent(file)}`} target="_blank">
                          <Button variant="outline" className="h-9">Скачать</Button>
                        </Link>
                        <Link href={`/api/biology?file=${encodeURIComponent(file)}`} target="_blank">
                          <Button className="h-9">Открыть</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Олимпиадные задачи
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {BIOLOGY_OLYMPIAD.map((m) => {
              const Icon = /олимпиад/i.test(m.name) ? Trophy : ExternalLink
              return (
                <a
                  key={m.name}
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
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/40 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
              YouTube-каналы
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <a href="https://www.youtube.com/@NinjaNerdOfficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <span>Ninja Nerd Official — подробные видеоуроки по биологии, анатомии и физиологии</span>
            </a>
            <a href="https://www.youtube.com/@edlightbiology7455" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <span>EdLight Biology — наглядные лекции по биологии</span>
            </a>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
