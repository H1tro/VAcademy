
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function MaterialsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-black font-headline tracking-tight">Ваши материалы</h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Здесь будут отображаться ваши сохраненные курсы, задачи и прогресс обучения.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="bg-card/40 border-border/40 hover:border-primary/30 transition-all group">
          <CardHeader>
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Изучаемые курсы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Вы еще не начали ни одного курса. Перейдите в каталог, чтобы выбрать интересную тему.</p>
            <Button className="w-full bg-secondary hover:bg-primary transition-all rounded-xl" asChild>
              <Link href="/courses">Каталог курсов <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/40 hover:border-accent/30 transition-all group">
          <CardHeader>
            <GraduationCap className="h-8 w-8 text-accent mb-2" />
            <CardTitle>Олимпиадные задачи</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Здесь будут храниться задачи, которые вы отметили как важные или сложные.</p>
            <Button variant="outline" className="w-full border-border/40 rounded-xl">
              Открыть практику
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
