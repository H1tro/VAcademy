import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconTrophy, IconExternalLink, IconFileText, IconDownload } from "@/components/icons"
import curriculum from "@/lib/biology-curriculum"
import { getBiologyFilesList } from "@/lib/biology-blob"
import { BIOLOGY_OLYMPIAD } from "@/lib/biology-olympiads"

async function findMaterials() {
  try {
    return await getBiologyFilesList()
  } catch (e) {
    return []
  }
}

export default async function BiologyPage() {
  const materials = await findMaterials()

  const findFor = (topic: (typeof curriculum)[number]) => {
    return materials.filter((f) => topic.keywords.some((rx: RegExp) => rx.test(f)))
  }

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Биология</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Материалы и учебная программа по биологии (включая PDF-ресурсы из папки Biology).
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {curriculum.map((topic) => (
          <div key={topic.id} className="card-surface card-hover p-6">
            <h2 className="font-headline text-lg font-bold leading-snug">
              {topic.id}. {topic.title}
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              {topic.sections.map((sec, i) => (
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

            <div className="mt-4 space-y-3 border-t border-border pt-4">
              {topic.books && (
                <div>
                  <p className="font-semibold">Книги</p>
                  <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                    {topic.books.basic && (
                      <p>
                        <span className="font-medium text-foreground">Basic / Intermediate:</span>{" "}
                        {topic.books.basic}
                      </p>
                    )}
                    {topic.books.advanced && (
                      <p>
                        <span className="font-medium text-foreground">Advanced:</span> {topic.books.advanced}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <p className="font-semibold">Материалы</p>
              {findFor(topic).length === 0 && (
                <p className="text-sm text-muted-foreground">Материалы не найдены в папке Biology.</p>
              )}
              {findFor(topic).map((file) => (
                <div key={file} className="flex items-center justify-between gap-4">
                  <span className="flex min-w-0 items-center gap-2 truncate text-sm">
                    <IconFileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{file}</span>
                  </span>
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
              ))}
            </div>
          </div>
        ))}

        <div className="card-surface p-6">
          <h2 className="flex items-center gap-2 font-headline text-lg font-bold">
            <IconTrophy className="h-5 w-5 text-amber" />
            Олимпиадные задачи
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            {BIOLOGY_OLYMPIAD.map((m) => {
              const Icon = /олимпиад/i.test(m.name) ? IconTrophy : IconExternalLink
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
          </div>
        </div>
      </div>
    </div>
  )
}
