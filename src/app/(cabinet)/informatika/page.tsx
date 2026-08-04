import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconTrophy, IconExternalLink, IconFileText, IconBook, IconCode, IconSparkles } from "@/components/icons"
import curriculum from "@/lib/informatika-curriculum"
import { getInformatikaFilesList } from "@/lib/informatika-blob"
import { INFORMATIKA_OLYMPIADS } from "@/lib/informatika-olympiads"

const ONLINE_PLATFORMS = [
  {
    name: "W3Schools C++ — интерактивная шпаргалка",
    url: "https://www.w3schools.com/cpp/",
    icon: IconBook,
  },
  {
    name: "LeetCode — тематический тренажёр",
    url: "https://leetcode.com/",
    icon: IconCode,
  },
  {
    name: "Codeforces — олимпийский стадион",
    url: "https://codeforces.com/",
    icon: IconTrophy,
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
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Информатика</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Подготовка к олимпиадам по спортивному программированию. Три уровня: Junior → Middle → Senior.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {curriculum.map((topic) => (
          <Card key={topic.id} className="card-surface card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="font-headline text-lg font-bold leading-snug">{topic.id}. {topic.title}</CardTitle>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 mt-1">{topic.section}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {topic.sections.map((sec, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-cyan">{sec.level}</h3>
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
                      className="flex items-center gap-2 text-sm text-cyan hover:underline"
                    >
                      <IconExternalLink className="h-4 w-4 shrink-0" />
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
                      <IconFileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      {file}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/api/informatika?file=${encodeURIComponent(file)}`} target="_blank">
                        <Button variant="outline" className="h-9">Скачать</Button>
                      </Link>
                      <Link href={`/api/informatika?file=${encodeURIComponent(file)}`} target="_blank">
                        <Button variant="gradient" className="h-9">Открыть</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconExternalLink className="h-5 w-5 text-cyan" />
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
                className="flex items-center gap-2 text-sm text-cyan hover:underline"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{m.name}</span>
              </a>
            )
          })}
        </CardContent>
      </Card>

      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconSparkles className="h-5 w-5 text-amber" />
            Олимпиадные ресурсы
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {INFORMATIKA_OLYMPIADS.map((category) => {
            const CategoryIcon = category.icon === "trophy" ? IconTrophy : category.icon === "globe" ? IconExternalLink : IconBook
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