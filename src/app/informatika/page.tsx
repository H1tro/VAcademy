import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ExternalLink, FileText, BookOpen, Code2, Sparkles, Globe, Youtube } from "lucide-react"
import curriculum from "@/lib/informatika-curriculum"
import { getInformatikaFilesList } from "@/lib/informatika-blob"
import { INFORMATIKA_OLYMPIADS } from "@/lib/informatika-olympiads"

const ONLINE_PLATFORMS = [
  {
    name: "W3Schools C++ — интерактивная шпаргалка",
    url: "https://www.w3schools.com/cpp/",
    icon: BookOpen,
  },
  {
    name: "LeetCode — тематический тренажёр",
    url: "https://leetcode.com/",
    icon: Code2,
  },
  {
    name: "Codeforces — олимпийский стадион",
    url: "https://codeforces.com/",
    icon: Trophy,
  },
  {
    name: "Алгоритмы — видеоурок",
    url: "https://youtu.be/cpuRbnWEPio?si=lfWk8C74av8jvucE",
    icon: Youtube,
  },
]

async function findMaterials() {
  try {
    const files = await getInformatikaFilesList()
    return files
  } catch {
    return []
  }
}

export default async function InformatikaPage() {
  const materials = await findMaterials()

  const findFor = (topic: (typeof curriculum)[number]) => {
    return materials.filter((f) => topic.keywords.some((rx) => rx.test(f)))
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-black tracking-tight">Информатика</h1>
          <p className="text-muted-foreground text-lg">
            Подготовка к олимпиадам по спортивному программированию. Три уровня: Junior → Middle → Senior.
          </p>
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
                <h4 className="font-semibold mb-2">Материалы</h4>
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

              <div className="pt-4 border-t border-border/20">
                <h4 className="font-semibold mb-2">PDF-ресурсы</h4>
                {findFor(topic).length === 0 && (
                  <div className="text-sm text-muted-foreground">Нет PDF для этого блока.</div>
                )}
                {findFor(topic).map((file) => (
                  <div key={file} className="flex items-center justify-between gap-4 mb-2">
                    <span className="truncate text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      {file}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/api/informatika?file=${encodeURIComponent(file)}`} target="_blank">
                        <Button variant="outline" className="h-9">Скачать</Button>
                      </Link>
                      <Link href={`/api/informatika?file=${encodeURIComponent(file)}`} target="_blank">
                        <Button className="h-9">Открыть</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/40 border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-accent" />
            Онлайн-платформы
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {ONLINE_PLATFORMS.map((m) => {
            const Icon = m.icon
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

      <Card className="bg-card/40 border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Олимпиадные ресурсы
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {INFORMATIKA_OLYMPIADS.map((category) => {
            const CategoryIcon = category.icon === "trophy" ? Trophy : category.icon === "globe" ? Globe : BookOpen
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
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      <span>{item.name}</span>
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
