import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Trophy, BookOpen, Globe, Award, Map } from "lucide-react"
import curriculum from "@/lib/fizika-curriculum"
import { FIZIKA_OLYMPIADS } from "@/lib/fizika-olympiads"

function materialIcon(name: string, url: string) {
  const s = (name + " " + url).toLowerCase()
  if (/ipho|олимпиад/i.test(s)) return Trophy
  if (/khan|academy|курс/i.test(s)) return BookOpen
  return ExternalLink
}

export default function FizikaPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-headline font-black tracking-tight">Физика</h1>
          <p className="text-muted-foreground text-lg">Материалы и учебная программа по физике.</p>
        </div>
        <Link href="/strategy">
          <Button variant="outline" className="h-10">Назад</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {curriculum.map((topic) => (
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
                <h4 className="font-semibold mb-2">Материалы</h4>
                <div className="flex flex-col gap-2">
                  {topic.materials.map((m, i) => {
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
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/40 border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Олимпиадные задачи
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {FIZIKA_OLYMPIADS.map((category) => {
            const CategoryIcon = category.icon === "trophy" ? Trophy : category.icon === "globe" ? Globe : category.icon === "book" ? BookOpen : Map
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
