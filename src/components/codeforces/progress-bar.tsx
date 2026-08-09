"use client"

import { cn } from "@/lib/utils"

export function ProgressBar({
  completed,
  total,
  className,
}: {
  completed: number
  total: number
  className?: string
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Выполнено: <span className="font-bold text-foreground">{completed}</span> / {total}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan to-mint transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {completed === total && total > 0 && (
        <p className="text-center text-sm font-bold text-mint">🎉 Все задания выполнены!</p>
      )}
    </div>
  )
}
