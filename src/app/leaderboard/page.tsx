
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Star, TrendingUp, Search } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const leaderboardData = [
  { rank: 1, name: "Александр П.", score: 15420, level: 42, avatar: "https://picsum.photos/seed/u1/40/40" },
  { rank: 2, name: "Мария К.", score: 14850, level: 40, avatar: "https://picsum.photos/seed/u2/40/40" },
  { rank: 3, name: "Дмитрий С.", score: 14200, level: 39, avatar: "https://picsum.photos/seed/u3/40/40" },
  { rank: 4, name: "Елена В.", score: 13900, level: 38, avatar: "https://picsum.photos/seed/u4/40/40" },
  { rank: 5, name: "Иван Ж.", score: 13500, level: 37, avatar: "https://picsum.photos/seed/u5/40/40" },
  { rank: 6, name: "Артем Б.", score: 12800, level: 35, avatar: "https://picsum.photos/seed/u6/40/40" },
  { rank: 7, name: "Ольга М.", score: 12400, level: 34, avatar: "https://picsum.photos/seed/u7/40/40" },
  { rank: 42, name: "Вы (Студент 01)", score: 8420, level: 12, avatar: "https://picsum.photos/seed/user1/40/40", current: true },
]

export default function LeaderboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-black tracking-tight">Рейтинг Учеников</h1>
        <p className="text-muted-foreground text-lg">Соревнуйтесь с лучшими умами региона и отслеживайте свой путь к вершине.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <TopThreeCard 
          rank={2} 
          name="Мария К." 
          score="14,850" 
          avatar="https://picsum.photos/seed/u2/100/100" 
          color="text-slate-300" 
          medal={<Medal className="h-10 w-10 text-slate-300" />}
        />
        <TopThreeCard 
          rank={1} 
          name="Александр П." 
          score="15,420" 
          avatar="https://picsum.photos/seed/u1/100/100" 
          color="text-yellow-500" 
          medal={<Trophy className="h-12 w-12 text-yellow-500" />}
          featured={true}
        />
        <TopThreeCard 
          rank={3} 
          name="Дмитрий С." 
          score="14,200" 
          avatar="https://picsum.photos/seed/u3/100/100" 
          color="text-amber-600" 
          medal={<Medal className="h-10 w-10 text-amber-600" />}
        />
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
                <TableHead className="text-center">Уровень</TableHead>
                <TableHead className="text-right">Очки (XP)</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((user) => (
                <TableRow 
                  key={user.rank} 
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
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className={cn("font-bold", user.current ? "text-primary" : "")}>{user.name}</span>
                        {user.current && <span className="text-[10px] text-primary/70 uppercase font-black tracking-widest">Ваш текущий ранг</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-code text-xs">LVL {user.level}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-black font-headline text-lg tabular-nums">
                    {user.score.toLocaleString()}
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
