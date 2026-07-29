
"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  Clock, 
  Target, 
  Flame, 
  ChevronRight, 
  PlayCircle,
  TrendingUp,
  BookOpen
} from "lucide-react"
import Link from "next/link"

type SubjectProgress = {
  mathematics: number
  physics: number
  informatics: number
  chemistry: number
  biology: number
}

type UserStats = {
  streakDays: number
  maxStreakDays: number
  tasksSolved: number
  studyTimeMinutes: number
  subjectProgress: SubjectProgress
}

export default function DashboardPage() {
  const [displayName, setDisplayName] = useState("Гость")
  const [goal, setGoal] = useState("Подготовка к олимпиадам")
  const [stats, setStats] = useState<UserStats>({
    streakDays: 0,
    maxStreakDays: 0,
    tasksSolved: 0,
    studyTimeMinutes: 0,
    subjectProgress: {
      mathematics: 0,
      physics: 0,
      informatics: 0,
      chemistry: 0,
      biology: 0,
    },
  })
  const [rank, setRank] = useState<number | null>(null)
  const [usersCount, setUsersCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const name = user?.displayName || user?.email?.split("@")[0] || "Гость"
      setDisplayName(name)

      if (!user) {
        setStats({
          streakDays: 0,
          maxStreakDays: 0,
          tasksSolved: 0,
          studyTimeMinutes: 0,
          subjectProgress: {
            mathematics: 0,
            physics: 0,
            informatics: 0,
            chemistry: 0,
            biology: 0,
          },
        })
        setRank(null)
        setUsersCount(0)
        return
      }

      const loadUserStats = async () => {
        const profileRes = await fetch(`/api/profile?uid=${user.uid}`)
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          if (profileData && profileData.school !== undefined) {
            setGoal(profileData.goal || "Подготовка к олимпиадам")
            setStats({
              streakDays: Number(profileData.streakDays ?? 0),
              maxStreakDays: Number(profileData.maxStreakDays ?? 0),
              tasksSolved: Number(profileData.tasksSolved ?? 0),
              studyTimeMinutes: Number(profileData.studyTimeMinutes ?? 0),
              subjectProgress: {
                mathematics: Number((profileData.subjectProgress as any)?.mathematics ?? 0),
                physics: Number((profileData.subjectProgress as any)?.physics ?? 0),
                informatics: Number((profileData.subjectProgress as any)?.informatics ?? 0),
                chemistry: Number((profileData.subjectProgress as any)?.chemistry ?? 0),
                biology: Number((profileData.subjectProgress as any)?.biology ?? 0),
              },
            })
          }
        }

        const leaderRes = await fetch("/api/leaderboard")
        if (leaderRes.ok) {
          const users = await leaderRes.json()
          setUsersCount(users.length)
          const position = users.findIndex((u: any) => u.uid === user.uid)
          setRank(position === -1 ? null : position + 1)
        }
      }

      void loadUserStats()
    })

    return () => unsubscribe()
  }, [])

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}ч ${remainingMinutes}м`
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black tracking-tight">Привет, {displayName}! 👋</h1>
          <p className="text-muted-foreground text-lg mt-2">Ваша текущая цель: {goal}</p>
          {displayName !== "Гость" ? (
            <Link href="/profile/edit" className="text-sm font-medium text-primary hover:underline">
              Редактировать профиль
            </Link>
          ) : null}
        </div>
        <div className="flex gap-4 flex-wrap">
          <Button variant="outline" className="h-12 rounded-full border-border/40 hover:bg-secondary" onClick={() => router.push('/dashboard')}>
            Назад
          </Button>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/courses">
              <BookOpen className="mr-2 h-4 w-4" />
              Перейти к курсам
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Flame className="text-orange-500" />} label="Дни подряд" value={`${stats.streakDays}`} sub={`Рекорд: ${stats.maxStreakDays}`} />
        <StatCard icon={<Target className="text-primary" />} label="Решено задач" value={`${stats.tasksSolved}`} sub="Всего решено" />
        <StatCard icon={<Trophy className="text-yellow-500" />} label="Ранг" value={rank ? `#${rank}` : "—"} sub={rank ? `Место ${rank} из ${usersCount}` : "Нет данных"} />
        <StatCard icon={<Clock className="text-accent" />} label="Время обучения" value={formatStudyTime(stats.studyTimeMinutes)} sub="Всего минут" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 overflow-hidden border-border/40 shadow-xl bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl">Ваш прогресс по предметам</CardTitle>
              <CardDescription>Освоение учебных тем</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <ProgressItem label="Математика" value={stats.subjectProgress.mathematics} color="bg-primary" />
            <ProgressItem label="Физика" value={stats.subjectProgress.physics} color="bg-accent" />
            <ProgressItem label="Информатика" value={stats.subjectProgress.informatics} color="bg-emerald-500" />
            <ProgressItem label="Химия" value={stats.subjectProgress.chemistry} color="bg-yellow-500" />
            <ProgressItem label="Биология" value={stats.subjectProgress.biology} color="bg-fuchsia-500" />
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xl bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">Популярные уроки</CardTitle>
            <CardDescription>Что сейчас изучают другие</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LessonItem title="Векторный метод в геометрии" time="45 мин" category="Математика" />
            <LessonItem title="Динамическое программирование" time="60 мин" category="Информатика" />
            <LessonItem title="Законы Кирхгофа" time="35 мин" category="Физика" />
            <Button variant="ghost" className="w-full text-primary hover:text-primary/80 hover:bg-primary/5 mt-2" asChild>
              <Link href="/courses">Все уроки <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <h2 className="text-3xl font-black font-headline tracking-tight">Библиотека материалов</h2>
          <p className="text-muted-foreground text-lg">
            Вам доступно более 500 видеоуроков и задач по всем STEM предметам. Начните с разделов, которые вызывают наибольшие трудности.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 mt-4 rounded-full" asChild>
            <Link href="/courses">Каталог курсов <ChevronRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) {
  return (
    <Card className="bg-card/50 border-border/40 shadow-lg hover:shadow-primary/5 transition-all">
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-2 rounded-xl bg-secondary">{icon}</div>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-black font-headline">{value}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressItem({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  )
}

function LessonItem({ title, time, category }: { title: string, time: string, category: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors group cursor-pointer">
      <div className="relative flex-shrink-0">
        <PlayCircle className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">{title}</span>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">
          <span>{category}</span>
          <span>•</span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  )
}
