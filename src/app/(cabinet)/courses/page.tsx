"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconPlay, IconExternalLink } from "@/components/icons"
import { SUBJECTS } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface Video {
  name: string
  url: string
  section?: string
}

interface VideoGroup {
  subjectKey: string
  subject: string
  videos: Video[]
}

const videoLessons: VideoGroup[] = [
  {
    subjectKey: "physics",
    subject: "Физика",
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
    ],
  },
  {
    subjectKey: "informatics",
    subject: "Информатика",
    videos: [{ name: "Алгоритмы — видеоурок", url: "https://youtu.be/cpuRbnWEPio?si=lfWk8C74av8jvucE" }],
  },
  {
    subjectKey: "biology",
    subject: "Биология",
    videos: [
      { name: "Ninja Nerd Official — подробные видеоуроки по биологии, анатомии и физиологии", url: "https://www.youtube.com/@NinjaNerdOfficial" },
      { name: "EdLight Biology — наглядные лекции по биологии", url: "https://www.youtube.com/@edlightbiology7455" },
      { name: "Плейлист: Биология для олимпиадников", url: "https://www.youtube.com/playlist?list=PLJEDjAF9Nb8iM6KHecTjq_PRBl54xQY23" },
    ],
  },
  {
    subjectKey: "mathematics",
    subject: "Математика",
    videos: [],
  },
  {
    subjectKey: "chemistry",
    subject: "Химия",
    videos: [],
  },
]

export default function CoursesPage() {
  const [openVideo, setOpenVideo] = useState<string | null>(null)
  const totalVideos = videoLessons.reduce((sum, g) => sum + g.videos.length, 0)

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Курсы</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalVideos}</span> видео по предметам для подготовки к
          олимпиадам
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {videoLessons.map((group) => {
          const meta = SUBJECTS.find((s) => s.key === group.subjectKey)
          const Icon = meta?.icon ?? IconPlay
          return (
            <div key={group.subject} className="card-surface card-hover flex flex-col overflow-hidden">
              <div className={cn("h-1 bg-gradient-to-r", meta?.cover ?? "from-white/20 to-transparent")} />
              <div className="flex items-center justify-between p-5 pb-3">
                <h2 className="flex items-center gap-2 font-headline text-lg font-bold">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", meta?.bubble)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  {group.subject}
                </h2>
                <Badge className="gap-1 font-mono text-xs">
                  <IconPlay className="h-3 w-3" />
                  {group.videos.length}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col px-2 pb-2">
                {group.videos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <IconPlay className="mb-2 h-8 w-8 text-muted-foreground/50" />
                    <span className="text-sm font-medium">Coming soon</span>
                    <span className="mt-0.5 text-xs">Видео-уроки скоро появятся</span>
                  </div>
                ) : (
                  group.videos.map((video, i) => {
                    const key = `${group.subject}-${i}`
                    const isOpen = openVideo === key
                    return (
                      <div key={key}>
                        <button
                          onClick={() => setOpenVideo(isOpen ? null : key)}
                          aria-expanded={isOpen}
                          className="flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                        >
                          <IconPlay className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                          <span className="min-w-0 flex-1">
                            {video.section && (
                              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                                {video.section}
                              </span>
                            )}
                            <span className="leading-snug">{video.name}</span>
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-3 pb-3 pt-1">
                            <Button size="sm" variant="outline" asChild>
                              <a href={video.url} target="_blank" rel="noopener noreferrer">
                                <IconExternalLink className="mr-2 h-3.5 w-3.5" />
                                Смотреть на YouTube
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}