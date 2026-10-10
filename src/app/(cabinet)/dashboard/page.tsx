"use client"

export const dynamic = "force-dynamic"

import { authFetch } from '@/lib/auth-fetch';
import { useTranslations as useUITranslations } from "next-intl";
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { IconFlame, IconTarget, IconTrophy, IconClock, IconChevronRight, IconBook, IconSparkles, IconCodeforces } from "@/components/icons"
import Link from "next/link"
import { SUBJECTS } from "@/lib/navigation"

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

const zeroStats: UserStats = {
  streakDays: 0,
  maxStreakDays: 0,
  tasksSolved: 0,
  studyTimeMinutes: 0,
  subjectProgress: { mathematics: 0, physics: 0, informatics: 0, chemistry: 0, biology: 0 },
}

export default function DashboardPage() {
  const ui = useUITranslations("ui");
  const subjects = useTranslations("nav");
  const common = useTranslations("common");
  const t = useTranslations('cabinet.dashboard')
  const { uid, user } = useAuth()
  const [displayName, setDisplayName] = useState("")
  const [goal, setGoal] = useState("")
  const [stats, setStats] = useState<UserStats>(zeroStats)
  const [rank, setRank] = useState<number | null>(null)
  const [usersCount, setUsersCount] = useState(0)
  const [cfCompleted, setCfCompleted] = useState(0)
  const [cfTotal, setCfTotal] = useState(0)

  useEffect(() => {
    const name = user?.displayName || user?.email?.split("@")[0] || ""
    setDisplayName(name)
    if (!uid) return

    const loadUserStats = async () => {
      const profileRes = await authFetch(`/api/profile?uid=${uid}`)
      if (profileRes.ok) {
        const d = await profileRes.json()
        if (d && d.goal) setGoal(d.goal || "")
        setStats({
          streakDays: Number(d?.streakDays ?? 0),
          maxStreakDays: Number(d?.maxStreakDays ?? 0),
          tasksSolved: Number(d?.solvedProblems?.length ?? d?.tasksSolved ?? 0),
          studyTimeMinutes: Number(d?.studyTimeMinutes ?? 0),
          subjectProgress: {
            mathematics: Number(d?.subjectProgress?.mathematics ?? 0),
            physics: Number(d?.subjectProgress?.physics ?? 0),
            informatics: Number(d?.subjectProgress?.informatics ?? 0),
            chemistry: Number(d?.subjectProgress?.chemistry ?? 0),
            biology: Number(d?.subjectProgress?.biology ?? 0),
          },
        })
      }

      const leaderRes = await fetch("/api/leaderboard")
      if (leaderRes.ok) {
        const users = await leaderRes.json()
        setUsersCount(users.length)
        const position = users.findIndex((u: { uid: string }) => u.uid === uid)
        setRank(position === -1 ? null : position + 1)
      }

      const cfRes = await fetch(`/api/codeforces/tasks?uid=${uid}`)
      if (cfRes.ok) {
        const tasks = await cfRes.json()
        setCfTotal(tasks.length)
        setCfCompleted(tasks.filter((t: { status: string }) => t.status === "completed").length)
      }
    }

    void loadUserStats()
  }, [uid, user])

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return t("duration", {hours, minutes: remainingMinutes})
  }

  const subjectProgressPairs = SUBJECTS.map((s) => ({
    key: s.key,
    label: subjects(s.key),
    value: stats.subjectProgress[s.key as keyof SubjectProgress],
    tint: s.text,
  }))

  return (
    <div className="animate-fade-up space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">
            {t('greeting', {name: displayName || common("guest")})} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('yourGoal')}: {goal || common("defaultGoal")}</p>
          {displayName && (
            <Link href="/profile/edit" className="mt-1 inline-block text-sm font-medium text-cyan hover:underline">
              {t('editProfile')}
            </Link>
          )}
        </div>
        <Button variant="gradient" asChild>
          <Link href="/courses">
            <IconBook className="mr-2 h-4 w-4" />
            {t('goToCourses')}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={<IconFlame className="text-amber" />} label={t('daysStreak')} value={`${stats.streakDays}`} sub={t("record", {count: stats.maxStreakDays})} />
        <StatCard icon={<IconTarget className="text-cyan" />} label={t('problemsSolved')} value={`${stats.tasksSolved}`} sub={t("totalSolved")} />
        <StatCard icon={<IconTrophy className="text-amber" />} label={t('rank')} value={rank ? `#${rank}` : "—"} sub={rank ? t("position", {rank, total: usersCount}) : t("noData")} />
        <StatCard icon={<IconClock className="text-sky" />} label={t('studyTime')} value={formatStudyTime(stats.studyTimeMinutes)} sub={t('totalMinutes')} />
        <Link href="/codeforces" className="block">
          <StatCard icon={<IconCodeforces className="text-sky" />} label={t('codeforces')} value={`${cfCompleted}/${cfTotal}`} sub={cfTotal > 0 ? t('noSolved') : t('noSolved')} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="card-surface lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="font-headline text-lg font-bold">{t('yourProgress')}</CardTitle>
              <CardDescription>{t('progressDescription')}</CardDescription>
            </div>
            <IconSparkles className="h-5 w-5 text-cyan" />
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {subjectProgressPairs.map((p) => (
              <div key={p.key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <span className={`h-2 w-2 rounded-full ${p.tint}`} />
                    {p.label}
                  </span>
                  <span className="text-muted-foreground">{p.value}%</span>
                </div>
                <Progress value={p.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="font-headline text-lg font-bold">{t('quickActions')}</CardTitle>
            <CardDescription>{ui("startRightNow")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/tests" className="flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors hover:bg-white/5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                <IconTarget className="h-4 w-4" />
              </span>
              {t('solveProblems')}
            </Link>
            <Link href="/codeforces" className="flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors hover:bg-white/5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky/10 text-sky">
                <IconCodeforces className="h-4 w-4" />
              </span>
              Codeforces
            </Link>
            <Link href="/courses" className="flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors hover:bg-white/5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet/10 text-violet">
                <IconBook className="h-4 w-4" />
              </span>
              {t('viewCourses')}
            </Link>
            <Link href="/leaderboard" className="flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-colors hover:bg-white/5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber/10 text-amber">
                <IconTrophy className="h-4 w-4" />
              </span>
              {t('leaderboard')}
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="bg-v-grad-soft relative overflow-hidden rounded-3xl border border-border/20 p-8">
        <div className="relative z-10 max-w-2xl space-y-4">
          <h2 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">
            {t('materialsLibrary')}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            {t('materialsDescription')}
          </p>
          <Button size="lg" variant="gradient" className="rounded-full" asChild>
            <Link href="/courses">
              {t('catalogCourses')} <IconChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <Card className="card-surface card-hover">
      <CardContent className="pt-6">
        <div className="mb-3 flex items-center gap-4">
          <div className="p-2 rounded-xl bg-panel">{icon}</div>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <div className="space-y-1">
          <p className="font-headline text-3xl font-extrabold">{value}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </CardContent>
    </Card>
  )
}
