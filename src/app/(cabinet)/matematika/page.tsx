import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconExternalLink } from "@/components/icons"
import curriculum from "@/lib/matematika-curriculum"
import { getMatematikaDriveUrl } from "@/lib/matematika-blob"

export default async function MatematikaPage() {
  const driveUrl = await getMatematikaDriveUrl()

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Математика</h1>
        <p className="mt-1 text-sm text-muted-foreground">Материалы и учебная программа по математике.</p>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
