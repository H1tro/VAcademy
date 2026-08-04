import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconTrophy, IconBook, IconExternalLink, IconMapPin } from "@/components/icons"
import curriculum from "@/lib/fizika-curriculum"
import { FIZIKA_OLYMPIADS } from "@/lib/fizika-olympiads"

function materialIcon(name: string, url: string) {
  const s = (name + " " + url).toLowerCase()
  if (/ipho|олимпиад/i.test(s)) return IconTrophy
  if (/khan|academy|курс/i.test(s)) return IconBook
  return IconExternalLink
}

export default function FizikaPage() {
  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Физика</h1>
        <p className="mt-1 text-sm text-muted-foreground">Материалы и учебная программа по физике.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {curriculum.map((topic) => (
          <Card key={topic.id} className="card-surface card-hover">
            <CardHeader>
              <CardTitle className="font-headline text-lg font-bold leading-snug">
                {topic.id}. {topic.title}
              </CardTitle>
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
                  {topic.materials.map((m, i) => {
                    const Icon = materialIcon(m.name, m.url)
                    return (
                      <a
                        key={i}
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
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrophy className="h-5 w-5 text-amber" />
            Олимпиадные задачи
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {FIZIKA_OLYMPIADS.map((category) => {
            const CategoryIcon = category.icon === "trophy" ? IconTrophy : category.icon === "globe" ? IconExternalLink : category.icon === "book" ? IconBook : IconMapPin
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