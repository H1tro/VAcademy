"use client"

import { Sigma, Atom, Code2, FlaskConical, Dna } from "lucide-react"
import { cn } from "@/lib/utils"

export type SubjectId = "matematika" | "fizika" | "informatika" | "himiya" | "biology"

export const SUBJECTS: { id: SubjectId; name: string; Icon: typeof Sigma }[] = [
  { id: "matematika", name: "Математика", Icon: Sigma },
  { id: "fizika", name: "Физика", Icon: Atom },
  { id: "informatika", name: "Информатика", Icon: Code2 },
  { id: "himiya", name: "Химия", Icon: FlaskConical },
  { id: "biology", name: "Биология", Icon: Dna },
]

export function SubjectSelector({
  active,
  onSelect,
}: {
  active: SubjectId
  onSelect: (id: SubjectId) => void
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {SUBJECTS.map(({ id, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-2xl border px-5 py-4 transition-all duration-200",
              isActive
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                : "border-border/40 bg-card/40 hover:border-primary/40 hover:bg-primary/5"
            )}
          >
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                isActive ? "bg-primary text-white" : "bg-secondary text-foreground group-hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
          </button>
        )
      })}
    </div>
  )
}
