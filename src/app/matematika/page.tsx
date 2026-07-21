import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"
import curriculum from "@/lib/matematika-curriculum"
import { getMatematikaFilesList } from "@/lib/matematika-blob"

async function findMaterials() {
  try {
    const files = await getMatematikaFilesList()
    return files
  } catch (e) {
    return []
  }
}

export default async function MatematikaPage() {
  const materials = await findMaterials()

  const findFor = (topic: (typeof curriculum)[number]) => {
    if (!materials) return []
    return materials.filter((f) => topic.keywords.some((rx) => rx.test(f)))
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-black tracking-tight">Математика</h1>
          <p className="text-muted-foreground text-lg">Материалы и учебная программа по математике.</p>
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
                <h4 className="font-semibold mb-2">PDF-ресурсы</h4>
                {findFor(topic).length === 0 && (
                  <div className="text-sm text-muted-foreground">Материалы не найдены.</div>
                )}
                {findFor(topic).map((file) => (
                  <div key={file} className="flex items-center justify-between gap-4 mb-2">
                    <span className="truncate text-sm flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      {file.split('/').pop() || file}
                    </span>
                    <div className="flex gap-2">
                      <Link href={`/api/matematika?file=${encodeURIComponent(file)}`} target="_blank">
                        <Button variant="outline" className="h-9">
                          <Download className="mr-2 h-4 w-4" /> Скачать
                        </Button>
                      </Link>
                      <Link href={`/api/matematika?file=${encodeURIComponent(file)}`} target="_blank">
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
    </div>
  )
}
