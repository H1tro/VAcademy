"use client"

import { IconSigma, IconAtom, IconCode, IconFlask, IconDna } from "@/components/icons"
import { cn } from "@/lib/utils"

export type SubjectId = "matematika" | "fizika" | "informatika" | "himiya" | "biology"

export const SUBJECTS: { id: SubjectId; name: string; Icon: typeof IconSigma }[] = [
  { id: "matematika", name: "Математика", Icon: IconSigma },
  { id: "fizika", name: "Физика", Icon: IconAtom },
  { id: "informatika", name: "Информатика", Icon: IconCode },
  { id: "himiya", name: "Химия", Icon: IconFlask },
  { id: "biology", name: "Биология", Icon: IconDna },
]

export function SubjectSelector({
  active,
  onSelect,
}: {
  active: SubjectId
  onSelect: (id: SubjectId) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUBJECTS.map(({ id, name, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "border-cyan/60 bg-cyan/10 text-cyan"
                : "border-border text-muted-foreground hover:border-white/20 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {name}
          </button>
        )
      })}
    </div>
  )
}
