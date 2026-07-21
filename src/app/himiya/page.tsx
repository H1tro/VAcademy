import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import curriculum from "@/lib/himiya-curriculum"

export default function HimiyaPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-black tracking-tight">Химия</h1>
          <p className="text-muted-foreground text-lg">Материалы и учебная программа по химии.</p>
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

      <Card className="bg-card/40 border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            Рекомендуемая литература
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-sm">Petrucci — General Chemistry</p>
          <p className="text-sm">Третьяков, Дорохова — ТОХ (Том 1, 2)</p>
          <p className="text-sm">Ахметов — Неорганическая химия</p>
          <p className="text-sm">Clayden — Organic Chemistry</p>
          <p className="text-sm">Васильев — Аналитическая химия</p>
          <p className="text-sm">Skoog — Instrumental Analysis</p>
          <p className="text-sm">Lehninger — Principles of Biochemistry</p>
        </CardContent>
      </Card>
    </div>
  )
}
