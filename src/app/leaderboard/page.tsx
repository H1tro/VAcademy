
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

type LeaderboardUser = {
  uid: string
  displayName: string
  photoURL?: string
  tasksSolved: number
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserId(user?.uid ?? null)
    })

    const loadLeaderboard = async () => {
      const usersQuery = query(collection(db, "users"), orderBy("tasksSolved", "desc"))
      const snapshot = await getDocs(usersQuery)
      const users = snapshot.docs.map((doc, index) => {
        const data = doc.data()
        return {
          uid: doc.id,
          displayName: (data.displayName as string) || ((data.email as string)?.split("@")[0] ?? "Ученик"),
          photoURL: (data.photoURL as string) || "",
          tasksSolved: Number(data.tasksSolved ?? 0),
        }
      })
      setLeaderboardData(users)
    }

    void loadLeaderboard()
    return () => unsubscribe()
  }, [])

  const rankedData = leaderboardData.map((user, index) => ({
    ...user,
    rank: index + 1,
    current: currentUserId === user.uid,
  }))

  const topUsers = rankedData.slice(0, 3)

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black tracking-tight">Рейтинг Учеников</h1>
          <p className="text-muted-foreground text-lg">Соревнуйтесь с лучшими умами региона и отслеживайте свой путь к вершине.</p>
        </div>
        <Button variant="outline" className="h-12 rounded-full border-border/40 hover:bg-secondary" onClick={() => router.back()}>
          Назад
        </Button>
      </div>

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
        {topUsers.length === 0 && (
          <div className="md:col-span-3 rounded-3xl border border-border/40 bg-card/40 p-8 text-center text-muted-foreground">
            Загрузка рейтинга...
          </div>
        )}
      </div>

      <Card className="border-border/40 bg-card/40 shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/20">
          <div>
            <CardTitle>Общий Рейтинг</CardTitle>
            <CardDescription>По всем предметам за текущий сезон</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-4 py-1">Топ 5% региона</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] text-center">Ранг</TableHead>
                <TableHead>Ученик</TableHead>
                <TableHead className="text-right">Решено задач</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedData.map((user) => (
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
    </div>
  )
}

function TopThreeCard({ rank, name, score, avatar, color, medal, featured }: { rank: number, name: string, score: string, avatar: string, color: string, medal: React.ReactNode, featured?: boolean }) {
  return (
    <div className={cn(
      "relative p-8 rounded-3xl flex flex-col items-center text-center space-y-4 transition-all duration-500",
      featured ? "bg-primary/10 border-2 border-primary/30 scale-110 z-10 shadow-2xl shadow-primary/10" : "bg-card/40 border border-border/40 mt-4"
    )}>
      <div className="absolute -top-6">
        {medal}
      </div>
      <Avatar className={cn(
        "h-24 w-24 border-4",
        featured ? "border-primary" : "border-border/50"
      )}>
        <AvatarImage src={avatar} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <h3 className="text-2xl font-black font-headline tracking-tight">{name}</h3>
        <p className="text-muted-foreground font-medium">Ранг #{rank}</p>
      </div>
      <div className="space-y-1">
        <p className={cn("text-3xl font-black font-headline", color)}>{score}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Очков опыта (XP)</p>
      </div>
      {featured && (
        <div className="pt-2">
          <Badge className="bg-primary hover:bg-primary">Мастер Математики</Badge>
        </div>
      )}
    </div>
  )
}
