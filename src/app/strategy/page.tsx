
"use client"

import * as React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  generatePersonalLearningStrategy, 
  type GeneratePersonalLearningStrategyOutput 
} from "@/ai/flows/generate-personal-learning-strategy"
import { Button } from "@/components/ui/button"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  BrainCircuit, 
  Sparkles, 
  Loader2, 
  BookOpen, 
  Video, 
  ClipboardCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const subjectsList = [
  { id: "mathematics", label: "Математика" },
  { id: "physics", label: "Физика" },
  { id: "informatics", label: "Информатика" },
  { id: "chemistry", label: "Химия" },
  { id: "biology", label: "Биология" },
]

const formSchema = z.object({
  subjects: z.array(z.string()).min(1, "Выберите хотя бы один предмет"),
  targetOlympiadOrExam: z.string().min(2, "Укажите цель (например, IMO 2024)"),
  knowledgeLevelSelfAssessment: z.string().min(10, "Пожалуйста, опишите ваш уровень подробнее (минимум 10 символов)"),
})

export default function StrategyPage() {
  const [loading, setLoading] = useState(false)
  const [strategy, setStrategy] = useState<GeneratePersonalLearningStrategyOutput | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subjects: [],
      targetOlympiadOrExam: "",
      knowledgeLevelSelfAssessment: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const result = await generatePersonalLearningStrategy(values)
      setStrategy(result)
    } catch (error) {
      console.error("Failed to generate strategy:", error)
    } finally {
      setLoading(false)
    }
  }

  if (strategy) {
    return (
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-black tracking-tight flex items-center gap-3">
              <Sparkles className="text-primary h-8 w-8" />
              Ваша ИИ Стратегия
            </h1>
            <p className="text-muted-foreground text-lg">Подготовлена на основе вашего профиля</p>
          </div>
          <Button variant="outline" onClick={() => setStrategy(null)} className="rounded-full">
            Создать новую
          </Button>
        </div>

        <Card className="bg-primary/5 border-primary/20 shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              Обзор стратегии
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{strategy.strategyOverview}</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-bold">
                <BookOpen className="text-accent h-6 w-6" />
                Рекомендуемые темы
              </div>
              <div className="grid gap-4">
                {strategy.recommendedTopics.map((topic, i) => (
                  <Card key={i} className="bg-card/50 border-border/40 hover:border-primary/30 transition-all">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-primary">{topic.title}</h3>
                        <Badge variant="secondary" className="font-code">{topic.estimatedStudyTimeHours} ч</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{topic.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-bold">
                <ClipboardCheck className="text-emerald-500 h-6 w-6" />
                Практические задания
              </div>
              <div className="grid gap-4">
                {strategy.recommendedPracticeAssignments.map((assignment, i) => (
                  <Card key={i} className="bg-card/50 border-border/40 group cursor-pointer hover:bg-emerald-500/5 transition-all">
                    <CardContent className="p-6 flex items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">{assignment.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              assignment.difficulty === 'Beginner' ? 'text-blue-400 border-blue-400/20' :
                              assignment.difficulty === 'Intermediate' ? 'text-yellow-400 border-yellow-400/20' :
                              'text-red-400 border-red-400/20'
                            )}
                          >
                            {assignment.difficulty}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{assignment.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="flex items-center gap-2 text-xl font-bold px-1">
              <Video className="text-red-500 h-6 w-6" />
              Видео-уроки
            </div>
            <div className="space-y-4">
              {strategy.recommendedVideoLessons.map((video, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/20 hover:bg-secondary/50 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center flex-shrink-0 group-hover:text-primary transition-colors">
                    <Video className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold truncate">{video.title}</span>
                    <span className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold tracking-widest">{video.durationMinutes} минут</span>
                  </div>
                </div>
              ))}
            </div>

            <Card className="bg-emerald-500/10 border-emerald-500/20 mt-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Совет от ИИ</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-emerald-100/80 italic">
                "Концентрация на фундаменте геометрии поможет вам быстрее освоить более сложные задачи. Рекомендую начать именно с этого блока."
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <BrainCircuit className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-black font-headline tracking-tight">Персональная Стратегия</h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Расскажите о своих целях, и наш ИИ построит идеальный путь к вашей победе в олимпиаде.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card/40 p-8 rounded-3xl border border-border/40 shadow-2xl backdrop-blur-sm">
          <FormField
            control={form.control}
            name="subjects"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-lg font-bold">Выберите предметы</FormLabel>
                  <FormDescription>Выберите один или несколько предметов для подготовки.</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {subjectsList.map((subject) => (
                    <FormField
                      key={subject.id}
                      control={form.control}
                      name="subjects"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={subject.id}
                            className="flex flex-row items-center space-x-3 space-y-0 p-4 border border-border/40 rounded-xl hover:bg-primary/5 transition-colors cursor-pointer"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(subject.label)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, subject.label])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== subject.label
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-medium cursor-pointer flex-1">
                              {subject.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetOlympiadOrExam"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-bold">Целевая олимпиада или экзамен</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Например: IMO 2024, Всероссийская олимпиада по физике, AP Physics..." 
                    {...field} 
                    className="h-12 bg-background border-border/40 focus:border-primary/50 text-lg px-4"
                  />
                </FormControl>
                <FormDescription>Укажите конкретную цель для более точных рекомендаций.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="knowledgeLevelSelfAssessment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-bold">Опишите ваш текущий уровень</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Какие темы вы знаете хорошо? В чем испытываете трудности? Был ли опыт участия в олимпиадах ранее?"
                    className="min-h-[150px] bg-background border-border/40 focus:border-primary/50 text-base p-4 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-2xl" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Генерируем магию...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Сгенерировать стратегию
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
