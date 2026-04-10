
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Globe, ExternalLink, Info, Bell } from "lucide-react"

const olympiads = [
  {
    title: "Всероссийская олимпиада школьников (ВсОШ)",
    subject: "Математика, Физика, Информатика",
    dates: "Сентябрь 2023 - Апрель 2024",
    location: "Россия (Региональные этапы)",
    description: "Самая престижная олимпиада для школьников в России. Победители получают льготы при поступлении в лучшие ВУЗы.",
    status: "Идет регистрация",
    type: "Государственная",
  },
  {
    title: "International Mathematical Olympiad (IMO)",
    subject: "Математика",
    dates: "Июль 2024",
    location: "Баф, Великобритания",
    description: "Чемпионат мира по математике среди школьников. Самое статусное соревнование планеты.",
    status: "Отбор",
    type: "Международная",
  },
  {
    title: "Олимпиада «Ломоносов»",
    subject: "Все STEM предметы",
    dates: "Ноябрь 2023 - Март 2024",
    location: "МГУ им. Ломоносова (Онлайн/Оффлайн)",
    description: "Проводится МГУ, дает 100 баллов ЕГЭ или БВИ в топовые университеты страны.",
    status: "Скоро начнется",
    type: "Университетская",
  },
  {
    title: "IOI 2024 (International Olympiad in Informatics)",
    subject: "Информатика",
    dates: "Сентябрь 2024",
    location: "Александрия, Египет",
    description: "Главное мировое состязание по программированию и алгоритмам.",
    status: "Подготовка",
    type: "Международная",
  }
]

export default function OlympiadsHub() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black tracking-tight">Olympiad Hub</h1>
          <p className="text-muted-foreground text-lg">Ваш навигатор в мире олимпиад и интеллектуальных соревнований.</p>
        </div>
        <Button variant="outline" className="h-12 border-primary/30 text-primary hover:bg-primary/5 rounded-full">
          <Bell className="mr-2 h-4 w-4" />
          Уведомлять о новых
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {olympiads.map((olimp, i) => (
          <Card key={i} className="bg-card/40 border-border/40 hover:border-primary/30 transition-all group overflow-hidden">
            <div className="h-2 bg-primary/20 group-hover:bg-primary transition-colors" />
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{olimp.type}</Badge>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/20">{olimp.status}</Badge>
              </div>
              <CardTitle className="text-2xl font-headline font-bold leading-tight group-hover:text-primary transition-colors">
                {olimp.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px] mt-1">
                {olimp.subject}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{olimp.dates}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="truncate">{olimp.location}</span>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed text-muted-foreground/90">
                {olimp.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border/20">
                <Button className="flex-1 bg-secondary hover:bg-primary hover:text-white transition-all rounded-xl">
                  Подробнее
                </Button>
                <Button variant="outline" className="flex-1 border-border/40 hover:bg-secondary rounded-xl">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Сайт
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-10 rounded-3xl bg-secondary/20 border border-border/20 text-center space-y-6">
        <Info className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-3xl font-black font-headline">Нужна помощь с регистрацией?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Наши менторы готовы помочь вам с документами, выбором этапа и подготовкой к отборочным турам.
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90 px-10 rounded-full h-14 text-lg">
          Связаться с ментором
        </Button>
      </div>
    </div>
  )
}
