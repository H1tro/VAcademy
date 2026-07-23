"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const testCategories = [
  {
    title: "Математика",
    description: "Тесты по комбинаторике, теории чисел, алгебре и геометрии",
    href: "#",
  },
  {
    title: "Физика",
    description: "Тесты по механике, электродинамике, оптике и термодинамике",
    href: "#",
  },
  {
    title: "Информатика",
    description: "Тесты по алгоритмам, структурам данных и программированию",
    href: "#",
  },
  {
    title: "Химия",
    description: "Тесты по неорганической, органической и физической химии",
    href: "#",
  },
  {
    title: "Биология",
    description: "Тесты по молекулярной биологии, генетике и экологии",
    href: "#",
  },
]

export default function TestsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-10 md:px-10 lg:px-12">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-4xl font-headline font-black tracking-tight">Тесты</h1>
          <p className="text-muted-foreground text-lg">Проверьте свои знания по предметам.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testCategories.map((cat) => (
          <Card key={cat.title} className="bg-card/40 border-border/40 hover:border-primary/30 transition-all">
            <CardHeader>
              <CardTitle className="text-xl font-headline font-bold">{cat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
              <Button asChild variant="outline" className="w-full">
                <a href={cat.href}>Начать тест</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}