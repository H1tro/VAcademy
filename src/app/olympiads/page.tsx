"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, MapPin, CircleDollarSign, ExternalLink, Info, Bell, MessageCircle } from "lucide-react"

type Olympiad = {
  title: string
  subject: "Математика" | "Биология"
  dates: string
  location: string
  description: string
  fee: string
  status: string
  type: string
  sortGroup: 0 | 1 | 2
}

const olympiads: Olympiad[] = [
  // ========== МАТЕМАТИКА ==========
  // Бесплатные
  {
    title: "Олимпиада им. Л. Эйлера I тур",
    subject: "Математика",
    dates: "Начало декабря, 2025 год",
    location: "Кыргызстан, официальное участие",
    fee: "Бесплатно",
    description: "Дистанционный этап. Участие бесплатное, места ограничены. Подробнее об участии будет опубликовано ближе к дате.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Олимпиада им. Л. Эйлера II тур",
    subject: "Математика",
    dates: "Конец января, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "Бесплатно",
    description: "Дистанционный этап. Участие бесплатное, места ограничены. Подробнее об участии будет опубликовано ближе к дате.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Национальная олимпиада по математике Кыргызской Республики",
    subject: "Математика",
    dates: "I этап: январь 2026 | II этап: февраль 2026 | III этап: март 2026 | IV этап: апрель 2026",
    location: "Кыргызстан",
    fee: "Бесплатно",
    description: "Главная официальная олимпиада Кыргызстана по математике. Четыре этапа. Участие бесплатное.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "AIME (American Invitational Mathematics Examination)",
    subject: "Математика",
    dates: "13 февраля, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "Бесплатно",
    description: "По результатам AMC 10/12. Бесплатно для приглашённых участников.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Заключительный этап Олимпиады имени Л. Эйлера",
    subject: "Математика",
    dates: "Конец марта, 2026 год",
    location: "Казахстан, официальное участие",
    fee: "Бесплатно",
    description: "Офлайн. Приглашаются ученики с высокими баллами на АМС 8, финалисты олимпиады Эйлера, Смагулова, IMAS.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Азиатско-Тихоокеанская математическая олимпиада (APMO)",
    subject: "Математика",
    dates: "Март, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "Бесплатно",
    description: "Участники — победители предыдущих этапов Национальной олимпиады по математике.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Международная математическая олимпиада «Шелковый путь»",
    subject: "Математика",
    dates: "Март, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "Бесплатно",
    description: "Участники — победители предыдущих этапов Национальной олимпиады по математике.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "XX Устная олимпиада по геометрии им. И.Ф.Шарыгина",
    subject: "Математика",
    dates: "Апрель, 2026 год",
    location: "Казахстан, официальное участие",
    fee: "Бесплатно",
    description: "Устная олимпиада по геометрии. Участие бесплатное.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  // Платные
  {
    title: "AMC 10/12A (American Mathematics Competitions)",
    subject: "Математика",
    dates: "5 ноября, 2025 год",
    location: "Кыргызстан, официальное участие",
    fee: "1200 сом",
    description: "Американская олимпиада по математике. Для учеников 9–12 классов.",
    status: "Идет регистрация",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "AMC 10/12B (American Mathematics Competitions)",
    subject: "Математика",
    dates: "13 ноября, 2025 год",
    location: "Кыргызстан, официальное участие",
    fee: "1200 сом",
    description: "Американская олимпиада по математике. Для учеников 9–12 классов.",
    status: "Идет регистрация",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "AMC 8 (American Mathematics Competitions)",
    subject: "Математика",
    dates: "24–25 января, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "1200 сом",
    description: "Американская олимпиада по математике. Для учеников 5–8 классов.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "IMAS (International Mathematics Assessment for Schools)",
    subject: "Математика",
    dates: "I этап: середина января, 2026 | II этап: середина марта, 2026",
    location: "Кыргызстан, официальное участие",
    fee: "1500 сом",
    description: "Международная олимпиада по математике для школьников. Два этапа (офлайн).",
    status: "Скоро",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "Smart Kangaroo",
    subject: "Математика",
    dates: "12 февраля, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "250 сом",
    description: "Международная математическая олимпиада для школьников.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "Олимпиада им. Ш. Смагулова",
    subject: "Математика",
    dates: "I этап: февраль 2026 | II этап: апрель 2026 | Финал: июнь 2026",
    location: "Кыргызстан / Казахстан",
    fee: "1200 сом",
    description: "Три этапа. I–II этапы (офлайн) в Кыргызстане, финал (офлайн) в Казахстане.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 1,
  },
  // Взнос уточняется
  {
    title: "XII Иранская олимпиада по геометрии (IGO)",
    subject: "Математика",
    dates: "I тур: 12 октября, 2025 | II тур: 17 октября, 2025",
    location: "Кыргызстан, официальное участие",
    fee: "Уточняется",
    description: "Олимпиада имеет международный статус. Задачи очень сложные. Рекомендуется попробовать порешать задачи прошлых лет.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "EMC (Европейский Математический Кубок – European Mathematical Cup)",
    subject: "Математика",
    dates: "Конец декабря, 2025 год",
    location: "Кыргызстан, официальное участие",
    fee: "Уточняется",
    description: "Подробнее об участии будет опубликовано ближе к дате.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "Международная Жаутыковская олимпиада (IZhO)",
    subject: "Математика",
    dates: "Январь, 2026 год",
    location: "Казахстан, официальное участие",
    fee: "Уточняется",
    description: "Подробнее об участии будет опубликовано ближе к дате.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "Caucasus Mathematical Olympiad (Кавказская математическая олимпиада)",
    subject: "Математика",
    dates: "Март, 2026 год",
    location: "РФ, официальное участие",
    fee: "Уточняется",
    description: "Подробнее об участии будет опубликовано ближе к дате.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "EGMO (European Girls' Mathematical Olympiad)",
    subject: "Математика",
    dates: "Конец апреля, 2026 год",
    location: "Кыргызстан, официальное участие",
    fee: "Уточняется",
    description: "Европейская математическая олимпиада среди девочек.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },
  {
    title: "Балканская Математическая Олимпиада (BMO)",
    subject: "Математика",
    dates: "Май, 2026 год",
    location: "Греция, официальное участие",
    fee: "Уточняется",
    description: "Балканская математическая олимпиада.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 2,
  },

  // ========== БИОЛОГИЯ ==========
  // Бесплатные
  {
    title: "Республиканская олимпиада школьников (Кыргызстан)",
    subject: "Биология",
    dates: "Школьный: октябрь | Районный: декабрь | Областной: январь | Республиканский: март",
    location: "Кыргызстан",
    fee: "Бесплатно",
    description: "Главная официальная олимпиада страны. 7–11 классы. Победители проходят в сборную.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "Областные/городские олимпиады",
    subject: "Биология",
    dates: "Зима–весна (по регионам)",
    location: "Кыргызстан",
    fee: "Бесплатно",
    description: "Отбор на республиканский этап. 7–11 классы.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  {
    title: "Международная биологическая олимпиада (IBO)",
    subject: "Биология",
    dates: "Июль, ежегодно",
    location: "Международное участие",
    fee: "Бесплатно (через сборную)",
    description: "Самая престижная олимпиада мира по биологии. До 20 лет.",
    status: "Отбор",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "IJSO (International Junior Science Olympiad)",
    subject: "Биология",
    dates: "Декабрь",
    location: "Международное участие",
    fee: "Бесплатно (через отбор)",
    description: "Комплексная олимпиада: биология + химия + физика. До 15 лет.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 0,
  },
  {
    title: "Олимпиады вузов России (Ломоносов, СПбГУ)",
    subject: "Биология",
    dates: "Январь–март",
    location: "Россия (онлайн / офлайн)",
    fee: "Бесплатно",
    description: "Дают льготы при поступлении в вузы РФ. 9–11 классы.",
    status: "Скоро",
    type: "Университетская",
    sortGroup: 0,
  },
  {
    title: "Олимпиады Казахстана (РФМШ, НИШ)",
    subject: "Биология",
    dates: "Зима–весна",
    location: "Казахстан",
    fee: "Бесплатно",
    description: "Сильный уровень подготовки. 7–11 классы.",
    status: "Скоро",
    type: "Национальная",
    sortGroup: 0,
  },
  // Платные
  {
    title: "British Biology Olympiad (BBO)",
    subject: "Биология",
    dates: "Ноябрь–февраль",
    location: "Великобритания / онлайн",
    fee: "~£10–15",
    description: "Популярная международная олимпиада из Великобритании. Старшие классы.",
    status: "Идет регистрация",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "International Biology Bowl",
    subject: "Биология",
    dates: "Весна",
    location: "Международное участие",
    fee: "Платно",
    description: "Командная олимпиада по биологии. Для школьников и студентов.",
    status: "Скоро",
    type: "Международная",
    sortGroup: 1,
  },
  {
    title: "Фоксфорд (Foxford)",
    subject: "Биология",
    dates: "Круглый год",
    location: "Онлайн",
    fee: "Платно",
    description: "Онлайн-олимпиады и курсы. 1–11 классы.",
    status: "Круглый год",
    type: "Онлайн",
    sortGroup: 1,
  },
  {
    title: "Coursera / edX олимпиады и курсы",
    subject: "Биология",
    dates: "Круглый год",
    location: "Онлайн",
    fee: "Платно (есть бесплатный доступ)",
    description: "Не классические олимпиады, но полезны для подготовки. Без ограничений по возрасту.",
    status: "Круглый год",
    type: "Онлайн",
    sortGroup: 1,
  },
  {
    title: "Uchi.ru",
    subject: "Биология",
    dates: "Круглый год",
    location: "Онлайн",
    fee: "Бесплатно / Платно",
    description: "Простые школьные олимпиады онлайн. 1–11 классы.",
    status: "Круглый год",
    type: "Онлайн",
    sortGroup: 1,
  },
]

const groupConfig = [
  { key: 0, label: "Бесплатные" },
  { key: 1, label: "Платные" },
  { key: 2, label: "Взнос уточняется" },
] as const

const subjects = ["Математика", "Биология"] as const

export default function OlympiadsHub() {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)



  const grouped: Record<string, Record<number, Olympiad[]>> = {}
  for (const o of olympiads) {
    ;(grouped[o.subject] ??= {})[o.sortGroup] ??= []
    grouped[o.subject][o.sortGroup].push(o)
  }

  const askAssistant = async () => {
    setError(null)
    setAnswer(null)
    const text = question.trim()

    if (!text) {
      setError("Пожалуйста, задайте вопрос.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/ai/olympiad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || "Ошибка сервера. Попробуйте позже.")
      } else {
        setAnswer(data.answer || "К сожалению, ответ не получен.")
      }
    } catch {
      setError("Не удалось получить ответ. Проверьте подключение и ключ Groq.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-black tracking-tight">Olympiad Hub</h1>
          <p className="text-muted-foreground text-lg">Ваш навигатор в мире олимпиад и интеллектуальных соревнований.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-full border-border/40 hover:bg-secondary"
            onClick={() => router.push("/dashboard")}
          >
            Назад
          </Button>
          <Button
            variant="outline"
            className="h-12 border-primary/30 text-primary hover:bg-primary/5 rounded-full"
          >
            <Bell className="mr-2 h-4 w-4" />
            Уведомлять о новых
          </Button>
        </div>
      </div>

      {subjects.map((subject) => {
        const subjectData = grouped[subject]
        if (!subjectData) return null

        const hasAny = Object.values(subjectData).some((arr) => arr.length > 0)
        if (!hasAny) return null

        return (
          <div key={subject}>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-6 py-1 text-sm font-bold font-headline tracking-[0.2em] text-muted-foreground uppercase">
                  {subject}
                </span>
              </div>
            </div>

            {groupConfig.map(({ key, label }) => {
              const items = subjectData[key]
              if (!items || items.length === 0) return null

              return (
                <div key={key} className="mb-10">
                  <h3 className="text-xl font-headline font-bold mb-4">{label}</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {items.map((olimp, i) => (
                      <Card
                        key={i}
                        className="bg-card/40 border-border/40 hover:border-primary/30 transition-all group overflow-hidden"
                      >
                        <div className="h-2 bg-primary/20 group-hover:bg-primary transition-colors" />
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                              {olimp.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-emerald-500 border-emerald-500/20"
                            >
                              {olimp.status}
                            </Badge>
                          </div>
                          <CardTitle className="text-2xl font-headline font-bold leading-tight group-hover:text-primary transition-colors">
                            {olimp.title}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px] mt-1">
                            {olimp.subject}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary shrink-0" />
                              <span>{olimp.dates}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary shrink-0" />
                              <span className="truncate">{olimp.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CircleDollarSign className="h-4 w-4 text-primary shrink-0" />
                              <span>{olimp.fee}</span>
                            </div>
                          </div>

                          <p className="text-sm leading-relaxed text-muted-foreground/90">
                            {olimp.description}
                          </p>

                          <div className="flex flex-wrap gap-3 pt-4 border-t border-border/20">
                            <Button className="flex-1 bg-secondary hover:bg-primary hover:text-white transition-all rounded-xl">
                              Подробнее
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 border-border/40 hover:bg-secondary rounded-xl"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Сайт
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}

      <Card className="bg-secondary/10 border-border/40">
        <CardHeader>
          <div className="space-y-3">
            <h2 className="text-3xl font-headline font-black tracking-tight">AI-ассистент по олимпиадам</h2>
            <p className="text-muted-foreground max-w-3xl text-base">
              Задавайте вопросы по подготовке, стратегиям, расписанию этапов и выбору предметов. Ответ генерируется с
              помощью Groq API.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4">
            <Textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Например: Как лучше подготовиться к олимпиаде по информатике?"
              rows={5}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={askAssistant} disabled={isLoading}>
                {isLoading ? "Жду ответа..." : "Спросить AI"}
              </Button>
              <Button variant="outline" onClick={() => { setQuestion(""); setAnswer(null); setError(null) }}>
                Очистить
              </Button>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {answer ? (
              <div className="rounded-3xl border border-border/30 bg-background p-6">
                <h3 className="text-xl font-semibold">Ответ AI</h3>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground">{answer}</p>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary/10 border-border/40">
        <CardHeader>
          <div className="space-y-3">
            <h2 className="text-3xl font-headline font-black tracking-tight">Обратная связь</h2>
            <p className="text-muted-foreground max-w-3xl text-base">
              По всем вопросам обращайтесь к нашему Telegram-боту.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <a
            href="https://t.me/VAcademi_Support_Bot"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <MessageCircle className="mr-2 h-5 w-5" />
              @VAcademi_Support_Bot
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
