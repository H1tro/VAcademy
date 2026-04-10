
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, PlayCircle, Star, Users, Clock } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Олимпиадная Геометрия: От основ до IMO",
    instructor: "Арман Касымов",
    rating: 4.9,
    students: "1,200",
    duration: "24 часа",
    subject: "Математика",
    level: "Intermediate",
    image: "https://picsum.photos/seed/math1/400/220"
  },
  {
    id: 2,
    title: "Алгоритмы и структуры данных для олимпиадников",
    instructor: "Мария Волкова",
    rating: 4.8,
    students: "3,500",
    duration: "40 часов",
    subject: "Информатика",
    level: "Advanced",
    image: "https://picsum.photos/seed/info1/400/220"
  },
  {
    id: 3,
    title: "Квантовая Физика: Углубленный курс",
    instructor: "Виктор Соловьев",
    rating: 4.7,
    students: "850",
    duration: "18 часов",
    subject: "Физика",
    level: "Advanced",
    image: "https://picsum.photos/seed/phys1/400/220"
  },
  {
    id: 4,
    title: "Органическая химия: Механизмы реакций",
    instructor: "Елена Петрова",
    rating: 4.9,
    students: "600",
    duration: "30 часов",
    subject: "Химия",
    level: "Intermediate",
    image: "https://picsum.photos/seed/chem1/400/220"
  },
  {
    id: 5,
    title: "Генетика и Молекулярная Биология",
    instructor: "Иван Смирнов",
    rating: 4.6,
    students: "450",
    duration: "22 часа",
    subject: "Биология",
    level: "Beginner",
    image: "https://picsum.photos/seed/bio1/400/220"
  },
  {
    id: 6,
    title: "Комбинаторика и теория графов",
    instructor: "Арман Касымов",
    rating: 5.0,
    students: "900",
    duration: "20 часов",
    subject: "Математика",
    level: "Advanced",
    image: "https://picsum.photos/seed/math2/400/220"
  }
]

export default function CoursesPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-4xl font-headline font-black tracking-tight">Интерактивные Курсы</h1>
        <p className="text-muted-foreground text-lg">Выбирайте направление и начинайте путь к победе.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Поиск по курсам, темам или авторам..." 
            className="pl-11 h-12 bg-secondary/50 border-border/40 focus:border-primary/50"
          />
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-xl border-border/40 hover:bg-secondary">
          <Filter className="mr-2 h-4 w-4" />
          Фильтры
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Card key={course.id} className="group border-border/40 bg-card/40 overflow-hidden hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="h-16 w-16 text-white" />
              </div>
              <Badge className="absolute top-4 left-4 bg-primary border-none">{course.subject}</Badge>
            </div>
            <CardHeader className="space-y-1">
              <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                <span>{course.instructor}</span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{course.rating}</span>
                </div>
              </div>
              <CardTitle className="text-xl leading-snug group-hover:text-primary transition-colors">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter">
                  {course.level}
                </Badge>
              </div>
              <Button className="w-full mt-6 bg-secondary hover:bg-primary hover:text-white transition-all rounded-xl">
                Начать обучение
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
