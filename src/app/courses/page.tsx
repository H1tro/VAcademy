
"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Youtube, Atom, Code2, Dna, ArrowLeft } from "lucide-react"

type Video = { name: string; url: string }

type SubjectGroup = {
  subject: string
  icon: React.ElementType
  videos: Video[]
}

const videoLessons: SubjectGroup[] = [
  {
    subject: "Физика",
    icon: Atom,
    videos: [
      { name: "Павел Виктор: Кинематика для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Кинематика" },
      { name: "Физика с АВ: Равноускоренное движение", url: "https://www.youtube.com/results?search_query=Физика+с+АВ+Равноускоренное+движение" },
      { name: "Павел Виктор: Движение под углом", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Движение+под+углом+к+горизонту" },
      { name: "Walter Lewin: Projectile Motion", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Projectile+Motion" },
      { name: "Павел Виктор: Законы Ньютона", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Законы+Ньютона" },
      { name: "Walter Lewin: Newton's Laws", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Newton%27s+Laws" },
      { name: "Павел Виктор: Динамика на наклонной плоскости", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Наклонная+плоскость" },
      { name: "Walter Lewin: Friction and Inclined Planes", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Friction+Inclined+Planes" },
      { name: "Павел Виктор: Гравитация и вес", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Закон+всемирного+тяготения" },
      { name: "Walter Lewin: Gravity and Orbits", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Gravity" },
      { name: "Павел Виктор: Орбитальная механика", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Космические+скорости" },
      { name: "Walter Lewin: Orbital Mechanics", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Central+Forces" },
      { name: "Павел Виктор: Идеальный газ для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Идеальный+газ" },
      { name: "Физика с АВ: Молекулярная физика", url: "https://www.youtube.com/results?search_query=Физика+с+АВ+МКТ" },
      { name: "Павел Виктор: Молекулярно-кинетическая теория", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Основное+уравнение+МКТ" },
      { name: "Павел Виктор: Электростатика для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Электростатика" },
      { name: "Walter Lewin: Electrostatics", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Electrostatics" },
      { name: "Павел Виктор: Электрический потенциал", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Потенциал" },
      { name: "Walter Lewin: Electric Potential", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Electric+Potential" },
      { name: "Павел Виктор: Закон Ома для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Закон+Ома" },
      { name: "Walter Lewin: Ohm's Law", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Ohm+Law" },
      { name: "Павел Виктор: Электрические цепи", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Последовательное+параллельное+соединение" },
      { name: "Walter Lewin: Circuits", url: "https://www.youtube.com/results?search_query=Walter+Lewin+DC+Circuits" },
      { name: "Павел Виктор: Гармонические колебания", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Гармонические+колебания" },
      { name: "Павел Виктор: Энергия колебаний", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Превращение+энергии+при+колебаниях" },
      { name: "Павел Виктор: Геометрическая оптика", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Геометрическая+оптика" },
      { name: "Павел Виктор: Линзы и зеркала", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Линзы" },
      { name: "Павел Виктор: Фотоны и фотоэффект", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Фотоэффект" },
      { name: "Павел Виктор: Модель Бора", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Постулаты+Бора" },
    ]
  },
  {
    subject: "Информатика",
    icon: Code2,
    videos: [
      { name: "Алгоритмы — видеоурок", url: "https://youtu.be/cpuRbnWEPio?si=lfWk8C74av8jvucE" },
    ]
  },
  {
    subject: "Биология",
    icon: Dna,
    videos: [
      { name: "Ninja Nerd Official — подробные видеоуроки по биологии, анатомии и физиологии", url: "https://www.youtube.com/@NinjaNerdOfficial" },
      { name: "EdLight Biology — наглядные лекции по биологии", url: "https://www.youtube.com/@edlightbiology7455" },
      { name: "Плейлист: Биология для олимпиадников", url: "https://www.youtube.com/playlist?list=PLJEDjAF9Nb8iM6KHecTjq_PRBl54xQY23" },
    ]
  }
]

export default function CoursesPage() {
  const router = useRouter()

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black tracking-tight">Видео-уроки</h1>
          <p className="text-muted-foreground text-lg">Подборка видео по предметам для подготовки к олимпиадам.</p>
        </div>
        <Button variant="outline" className="h-10" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {videoLessons.map((group) => {
          const Icon = group.icon
          return (
            <Card key={group.subject} className="bg-card/40 border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {group.subject}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {group.videos.map((video, i) => (
                  <a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
                  >
                    <Youtube className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                    <span>{video.name}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
