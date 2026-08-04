import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconBook, IconTrophy, IconExternalLink, IconMapPin } from "@/components/icons"
import curriculum from "@/lib/himiya-curriculum"
import { HIMIYA_OLYMPIADS } from "@/lib/himiya-olympiads"
import { getHimiyaDriveUrl } from "@/lib/himiya-blob"

export default async function HimiyaPage() {
  const driveUrl = await getHimiyaDriveUrl()

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Химия</h1>
        <p className="mt-1 text-sm text-muted-foreground">Материалы и учебная программа по химии.</p>
      </div>

      <div className="flex justify-center">
        <a href={driveUrl} target="_blank" rel="noopener noreferrer">
          <Button size="lg" variant="gradient" className="gap-2">
            <IconExternalLink className="h-5 w-5" />
            Открыть материалы в Google Drive
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {curriculum.map((topic) => (
          <Card key={topic.id} className="card-surface card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="font-headline text-lg font-bold leading-snug">{topic.id <= 13 ? `Раздел ${topic.id}. ${topic.title}` : topic.title}</CardTitle>
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
          {HIMIYA_OLYMPIADS.map((category) => {
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

      <Card className="card-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBook className="h-5 w-5 text-cyan" />
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