"use client"

import { IconCheckCircle, IconExternalLink, IconClock } from "@/components/icons"
import { cn } from "@/lib/utils"

export interface CFTask {
  id: string
  contestId: number
  index: string
  name: string
  rating: number | null
  tags: string[]
  url: string
  status: "completed" | "not_completed"
  attempts: number
}

export function CFTaskCard({ task }: { task: CFTask }) {
  const completed = task.status === "completed"
  const ratingColor =
    task.rating && task.rating >= 1600
      ? "text-amber"
      : task.rating && task.rating >= 1200
        ? "text-sky"
        : task.rating && task.rating >= 900
          ? "text-mint"
          : "text-muted-foreground"

  return (
    <div
      className={cn(
        "card-surface group flex items-center gap-4 p-4 transition-colors",
        completed && "border-mint/20 bg-mint/5",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold",
          completed ? "bg-mint/15 text-mint" : "bg-white/5 text-muted-foreground",
        )}
      >
        {task.index}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-headline text-sm font-bold leading-snug">{task.name}</h3>
          {task.rating && (
            <span className={cn("shrink-0 font-mono text-xs", ratingColor)}>★ {task.rating}</span>
          )}
        </div>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
          {task.contestId}{task.index}
        </p>
        {task.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {task.attempts > 0 && (
          <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
            <IconClock className="h-3 w-3" />
            {task.attempts}
          </span>
        )}

        {completed ? (
          <span className="flex items-center gap-1.5 rounded-full bg-mint/15 px-3 py-1.5 font-mono text-xs font-bold text-mint">
            <IconCheckCircle className="h-4 w-4" />
            OK
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 font-mono text-xs text-muted-foreground">
            ○ Не выполнено
          </span>
        )}

        <a
          href={task.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          aria-label={`Открыть ${task.contestId}${task.index} на Codeforces`}
        >
          <IconExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
