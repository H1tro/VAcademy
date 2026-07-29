"use client"

export const dynamic = "force-dynamic"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Medal, TrendingUp, Search, Filter, Crown, BookCheck } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

const SUBJECT_PREFIXES: Record<string, string> = {
  math: "mathematics",
  phys: "physics",
  inf: "informatics",
  chem: "chemistry",
  bio: "biology",
}

type LeaderboardUser = {
  uid: string
  displayName: string
  photoURL?: string
  tasksSolved: number
  solvedSubjects: Record<string, number>
}

const SUBJECTS = [
  { value: "all", label: "Все предметы", icon: Crown },
  { value: "mathematics", label: "Математика", icon: "Σ" },
  { value: "physics", label: "Физика", icon: "Φ" },
  { value: "informatics", label: "Информатика", icon: "{" },
  { value: "chemistry", label: "Химия", icon: "H₂" },
  { value: "biology", label: "Биология", icon: "DNA" },
]

function getSubjectFromId(id: string): string {
  const prefix = id.split("-")[0]
  return SUBJECT_PREFIXES[prefix] || "other"
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user?.uid ?? null)
    })

    const loadLeaderboard = async () => {
      try {
        setLoading(true)
        const usersQuery = query(collection(db, "users"), orderBy("tasksSolved", "desc"))
        const snapshot = await getDocs(usersQuery)
        const users = snapshot.docs.map((doc) => {
          const data = doc.data()
          const solvedProblems = (data.solvedProblems as string[]) || []
          const solvedSubjects: Record<string, number> = {}
          for (const id of solvedProblems) {
            const subject = getSubjectFromId(id)
            solvedSubjects[subject] = (solvedSubjects[subject] || 0) + 1
          }
          return {
            uid: doc.id,
            displayName: (data.displayName as string) || ((data.email as string)?.split("@")[0] ?? "Ученик"),
            photoURL: (data.photoURL as string) || "",
            tasksSolved: Number(data.tasksSolved ?? 0),
            solvedSubjects,
          }
        })
        setLeaderboardData(users)
      } finally {
        setLoading(false)
      }
    }

    void loadLeaderboard()
    return () => unsubscribe()
  }, [])

  const filteredData = useMemo(() => {
    let data = leaderboardData

    if (selectedSubject !== "all") {
      data = data
        .map((u) => ({
          ...u,
          tasksSolved: u.solvedSubjects[selectedSubject] || 0,
        }))
        .filter((u) => u.tasksSolved > 0)
        .sort((a, b) => b.tasksSolved - a.tasksSolved)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      data = data.filter((u) => u.displayName.toLowerCase().includes(q))
    }

    return data.map((user, index) => ({
      ...user,
      rank: index + 1,
      current: currentUserId === user.uid,
    }))
  }, [leaderboardData, currentUserId, searchQuery, selectedSubject])

  const topUsers = filteredData.slice(0, 3)

  const currentUserRank = useMemo(() => {
    if (!currentUserId) return null
    const overall = leaderboardData
      .map((u, i) => ({ ...u, rank: i + 1 }))
      .find((u) => u.uid === currentUserId)
    if (!overall) return null
    const inFiltered = filteredData.find((u) => u.uid === currentUserId)
    return { ...overall, filteredRank: inFiltered?.rank ?? null }
  }, [leaderboardData, filteredData, currentUserId])

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black tracking-tight">Рейтинг Учеников</h1>
          <p className="text-muted-foreground text-lg">Соревнуйтесь с лучшими умами региона и отслеживайте свой путь к вершине.</p>
        </div>
        <Button variant="outline" className="h-12 rounded-full border-border/40 hover:bg-secondary" onClick={() => router.push("/dashboard")}>
          Назад
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {SUBJECTS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSelectedSubject(s.value)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border",
                selectedSubject === s.value
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card/50 text-muted-foreground border-border/40 hover:border-primary/30 hover:text-foreground"
              )}
            >
              {typeof s.icon === "string" ? (
                <span className="text-[10px] font-bold">{s.icon}</span>
              ) : (
                <s.icon className="h-3.5 w-3.5" />
              )}
              {s.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full border-border/40"
          />
        </div>
      </div>

      {loading ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className={cn("h-64 rounded-3xl bg-card/40", i === 0 && "md:scale-110")} />
            ))}
          </div>
          <Skeleton className="h-96 rounded-3xl bg-card/40" />
        </>
      ) : (
        <>
          {filteredData.length === 0 ? (
            <div className="rounded-3xl border border-border/40 bg-card/40 p-12 text-center space-y-4">
              <Crown className="h-12 w-12 mx-auto text-muted-foreground/40" />
              <h3 className="text-xl font-headline font-bold">Нет данных</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Никто не найден по вашему запросу"
                  : selectedSubject !== "all"
                    ? "Ещё никто не решил задачи по этому предмету"
                    : "Ещё никто не решил ни одной задачи"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {topUsers.map((user, index) => (
                  <TopThreeCard
                    key={user.uid}
                    rank={user.rank}
                    name={user.displayName}
                    score={user.tasksSolved.toLocaleString()}
                    avatar={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`}
                    color={index === 0 ? "text-yellow-500" : index === 1 ? "text-slate-300" : "text-amber-600"}
                    medal={index === 0 ? <Trophy className="h-12 w-12 text-yellow-500" /> : <Medal className="h-10 w-10 text-slate-300" />}
                    featured={index === 0}
                  />
                ))}
              </div>

              <Card className="border-border/40 bg-card/40 shadow-xl overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/20">
                  <div>
                    <CardTitle>Общий Рейтинг</CardTitle>
                    <CardDescription>{SUBJECTS.find((s) => s.value === selectedSubject)?.label}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="px-4 py-1">
                    {filteredData.length} {filteredData.length === 1 ? "участник" : "участников"}
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-secondary/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[80px] text-center">Ранг</TableHead>
                        <TableHead>Ученик</TableHead>
                        <TableHead className="text-right">Решено задач</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((user) => (
                        <TableRow
                          key={user.uid}
                          className={cn(
                            "group transition-all",
                            user.current ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-secondary/30"
                          )}
                        >
                          <TableCell className="text-center font-bold text-lg">
                            {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : `#${user.rank}`}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-border/50">
                                {user.photoURL ? <AvatarImage src={user.photoURL} /> : <AvatarFallback>{user.displayName[0]}</AvatarFallback>}
                              </Avatar>
                              <div className="flex flex-col">
                                <span className={cn("font-bold", user.current ? "text-primary" : "")}>{user.displayName}</span>
                                {user.current && <span className="text-[10px] text-primary/70 uppercase font-black tracking-widest">Ваш текущий ранг</span>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-black font-headline text-lg tabular-nums">
                            {user.tasksSolved.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <TrendingUp className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {currentUserRank && !currentUserRank.filteredRank && (
                <Card className="border-primary/30 bg-primary/5 shadow-xl overflow-hidden">
                  <CardHeader className="border-b border-border/20">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookCheck className="h-5 w-5 text-primary" />
                      Ваша позиция
                    </CardTitle>
                    <CardDescription>
                      Вы на #{currentUserRank.rank} месте в общем рейтинге
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border/50">
                          {currentUserRank.photoURL ? <AvatarImage src={currentUserRank.photoURL} /> : <AvatarFallback>{currentUserRank.displayName[0]}</AvatarFallback>}
                        </Avatar>
                        <div>
                          <span className="font-bold text-primary">{currentUserRank.displayName}</span>
                          <p className="text-xs text-muted-foreground">Общий ранг: #{currentUserRank.rank}</p>
                        </div>
                      </div>
                      <span className="font-black font-headline text-lg">{currentUserRank.tasksSolved.toLocaleString()} задач</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

function TopThreeCard({ rank, name, score, avatar, color, medal, featured }: { rank: number; name: string; score: string; avatar: string; color: string; medal: React.ReactNode; featured?: boolean }) {
  return (
    <div className={cn(
      "relative p-8 rounded-3xl flex flex-col items-center text-center space-y-4 transition-all duration-500",
      featured ? "bg-primary/10 border-2 border-primary/30 scale-110 z-10 shadow-2xl shadow-primary/10" : "bg-card/40 border border-border/40 mt-4"
    )}>
      <div className="absolute -top-6">
        {medal}
      </div>
      <Avatar className={cn("h-24 w-24 border-4", featured ? "border-primary" : "border-border/50")}>
        <AvatarImage src={avatar} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h3 className="text-2xl font-black font-headline tracking-tight">{name}</h3>
        <p className="text-muted-foreground font-medium">Ранг #{rank}</p>
      </div>
      <div className="space-y-1">
        <p className={cn("text-3xl font-black font-headline", color)}>{score}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Решено задач</p>
      </div>
    </div>
  )
}
