
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Youtube, Atom, Code2, Dna, Calculator, FlaskConical, ArrowLeft, Play, Film, Clock, ChevronDown, ChevronUp } from "lucide-react"

type Video = { name: string; url: string; section?: string }

const videoLessons = [
  {
    subject: "Физика",
    icon: Atom,
    color: "from-sky-500/20 to-blue-600/10",
    border: "border-sky-500/30",
    badge: "bg-sky-500/20 text-sky-300",
    videos: [
      { name: "Павел Виктор: Кинематика для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Кинематика", section: "Механика" },
      { name: "Физика с АВ: Равноускоренное движение", url: "https://www.youtube.com/results?search_query=Физика+с+АВ+Равноускоренное+движение", section: "Механика" },
      { name: "Павел Виктор: Движение под углом", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Движение+под+углом+к+горизонту", section: "Механика" },
      { name: "Walter Lewin: Projectile Motion", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Projectile+Motion", section: "Механика" },
      { name: "Павел Виктор: Законы Ньютона", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Законы+Ньютона", section: "Механика" },
      { name: "Walter Lewin: Newton's Laws", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Newton%27s+Laws", section: "Механика" },
      { name: "Павел Виктор: Динамика на наклонной плоскости", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Наклонная+плоскость", section: "Механика" },
      { name: "Walter Lewin: Friction and Inclined Planes", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Friction+Inclined+Planes", section: "Механика" },
      { name: "Павел Виктор: Гравитация и вес", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Закон+всемирного+тяготения", section: "Механика" },
      { name: "Walter Lewin: Gravity and Orbits", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Gravity", section: "Механика" },
      { name: "Павел Виктор: Орбитальная механика", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Космические+скорости", section: "Механика" },
      { name: "Walter Lewin: Orbital Mechanics", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Central+Forces", section: "Механика" },
      { name: "Павел Виктор: Идеальный газ для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Идеальный+газ", section: "Молекулярная физика" },
      { name: "Физика с АВ: Молекулярная физика", url: "https://www.youtube.com/results?search_query=Физика+с+АВ+МКТ", section: "Молекулярная физика" },
      { name: "Павел Виктор: Молекулярно-кинетическая теория", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Основное+уравнение+МКТ", section: "Молекулярная физика" },
      { name: "Павел Виктор: Электростатика для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Электростатика", section: "Электричество" },
      { name: "Walter Lewin: Electrostatics", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Electrostatics", section: "Электричество" },
      { name: "Павел Виктор: Электрический потенциал", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Потенциал", section: "Электричество" },
      { name: "Walter Lewin: Electric Potential", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Electric+Potential", section: "Электричество" },
      { name: "Павел Виктор: Закон Ома для начинающих", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Закон+Ома", section: "Электричество" },
      { name: "Walter Lewin: Ohm's Law", url: "https://www.youtube.com/results?search_query=Walter+Lewin+Ohm+Law", section: "Электричество" },
      { name: "Павел Виктор: Электрические цепи", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Последовательное+параллельное+соединение", section: "Электричество" },
      { name: "Walter Lewin: Circuits", url: "https://www.youtube.com/results?search_query=Walter+Lewin+DC+Circuits", section: "Электричество" },
      { name: "Павел Виктор: Гармонические колебания", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Гармонические+колебания", section: "Колебания и волны" },
      { name: "Павел Виктор: Энергия колебаний", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Превращение+энергии+при+колебаниях", section: "Колебания и волны" },
      { name: "Павел Виктор: Геометрическая оптика", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Геометрическая+оптика", section: "Оптика" },
      { name: "Павел Виктор: Линзы и зеркала", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Линзы", section: "Оптика" },
      { name: "Павел Виктор: Фотоны и фотоэффект", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Фотоэффект", section: "Квантовая физика" },
      { name: "Павел Виктор: Модель Бора", url: "https://www.youtube.com/results?search_query=Павел+Виктор+Постулаты+Бора", section: "Квантовая физика" },
    ]
  },
  {
    subject: "Информатика",
    icon: Code2,
    color: "from-emerald-500/20 to-green-600/10",
    border: "border-emerald-500/30",
    badge: "bg-emerald-500/20 text-emerald-300",
    videos: [
      { name: "Алгоритмы — видеоурок", url: "https://youtu.be/cpuRbnWEPio?si=lfWk8C74av8jvucE" },
    ]
  },
  {
    subject: "Биология",
    icon: Dna,
    color: "from-rose-500/20 to-pink-600/10",
    border: "border-rose-500/30",
    badge: "bg-rose-500/20 text-rose-300",
    videos: [
      { name: "Ninja Nerd Official — подробные видеоуроки по биологии, анатомии и физиологии", url: "https://www.youtube.com/@NinjaNerdOfficial" },
      { name: "EdLight Biology — наглядные лекции по биологии", url: "https://www.youtube.com/@edlightbiology7455" },
      { name: "Плейлист: Биология для олимпиадников", url: "https://www.youtube.com/playlist?list=PLJEDjAF9Nb8iM6KHecTjq_PRBl54xQY23" },
    ]
  },
  {
    subject: "Математика",
    icon: Calculator,
    color: "from-violet-500/20 to-purple-600/10",
    border: "border-violet-500/30",
    badge: "bg-violet-500/20 text-violet-300",
    videos: []
  },
  {
    subject: "Химия",
    icon: FlaskConical,
    color: "from-amber-500/20 to-yellow-600/10",
    border: "border-amber-500/30",
    badge: "bg-amber-500/20 text-amber-300",
    videos: []
  }
]

export default function CoursesPage() {
  const router = useRouter()
  const [expanded, setExpanded] = useState<string | null>(null)
  const totalVideos = videoLessons.reduce((sum, g) => sum + g.videos.length, 0)

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-red-500/30 to-orange-600/20 border border-red-500/20">
              <Film className="h-6 w-6 text-red-400" />
            </div>
            <h1 className="text-4xl font-headline font-black tracking-tight">Видео-уроки</h1>
          </div>
          <p className="text-muted-foreground text-lg pl-14">
            <span className="text-primary font-semibold">{totalVideos}</span> видео по предметам для подготовки к олимпиадам
          </p>
        </div>
        <Button variant="outline" className="h-10" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {videoLessons.map((group) => {
          const Icon = group.icon
          return (
            <Card
              key={group.subject}
              className={`bg-gradient-to-b ${group.color} ${group.border} overflow-hidden transition-all duration-300 ${expanded === group.subject ? "shadow-xl" : "hover:shadow-xl"}`}
            >
              <button
                onClick={() => setExpanded(expanded === group.subject ? null : group.subject)}
                className="w-full text-left"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <div className="p-1.5 rounded-lg bg-background/50">
                        <Icon className="h-5 w-5" />
                      </div>
                      {group.subject}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${group.badge} border-0 font-mono text-xs`}>
                        <Play className="h-3 w-3 mr-1" />
                        {group.videos.length}
                      </Badge>
                      {expanded === group.subject ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>
              </button>
              {expanded === group.subject && (
                <CardContent className="space-y-0.5">
                  {group.videos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/60">
                      <Clock className="h-8 w-8 mb-2" />
                      <span className="text-sm font-medium">Coming soon</span>
                      <span className="text-xs mt-0.5">Видео-уроки скоро появятся</span>
                    </div>
                  ) : (
                    group.videos.map((video, i) => (
                      <a
                        key={i}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-black/20 rounded-xl transition-all group/link"
                      >
                        <div className="shrink-0 mt-0.5">
                          <Youtube className="h-4 w-4 text-red-500 group-hover/link:text-red-400 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          {video.section && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 block leading-none mb-1">
                              {video.section}
                            </span>
                          )}
                          <span className="leading-snug">{video.name}</span>
                        </div>
                      </a>
                    ))
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
