import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import curriculum from "@/lib/biology-curriculum"
import { getBiologyFilesList } from "@/lib/biology-blob"

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
                      <span className="truncate text-sm">{file}</span>
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
      </div>
    </div>
  )
}
