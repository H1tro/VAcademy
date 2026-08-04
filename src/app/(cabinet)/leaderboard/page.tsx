"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { SUBJECTS } from "@/lib/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IconCrown, IconTrophy, IconFlame, IconTarget, IconUser } from "@/components/icons";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  tasksSolved: number;
  totalScore: number;
  subjectScore?: number;
}

interface UserProfileData {
  displayName?: string;
  photoURL?: string;
  totalScore?: number;
  tasksSolved?: number;
  solvedProblems?: string[];
}

const MEDAL: Record<number, { className: string; label: string }> = {
  0: { className: "text-amber", label: "Золото" },
  1: { className: "text-muted-foreground", label: "Серебро" },
  2: { className: "text-amber/80", label: "Бронза" },
};

export default function LeaderboardPage() {
  const { uid, user } = useAuth();
  const [subject, setSubject] = useState<string>("all");
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!uid) return;
    fetch(`/api/profile?uid=${uid}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setProfile);
  }, [uid]);

  useEffect(() => {
    setLoaded(false);
    const params = new URLSearchParams();
    if (subject !== "all") params.set("subject", subject);
    fetch(`/api/leaderboard?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: LeaderboardEntry[]) => setData(rows))
      .finally(() => setLoaded(true));
  }, [subject]);

  const sorted = useMemo(
    () =>
      [...data].sort(
        (a, b) => (subject === "all" ? b.totalScore : (b.subjectScore ?? 0)) - (subject === "all" ? a.totalScore : (a.subjectScore ?? 0))
      ),
    [data, subject]
  );

  const myRank = useMemo(() => {
    const idx = sorted.findIndex((e) => e.uid === uid);
    return idx === -1 ? null : idx + 1;
  }, [sorted, uid]);

  const bestSubject = useMemo(() => {
    if (!profile?.solvedProblems?.length) return null;
    const counts: Record<string, number> = {};
    const prefixMap: Record<string, string> = { math: "mathematics", phys: "physics", inf: "informatics", chem: "chemistry", bio: "biology" };
    for (const id of profile.solvedProblems) {
      const s = prefixMap[id.split("-")[0]];
      if (s) counts[s] = (counts[s] || 0) + 1;
    }
    const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return best ? SUBJECTS.find((s) => s.key === best[0]) ?? null : null;
  }, [profile]);

  const stats = [
    {
      label: "Решено задач",
      value: profile?.solvedProblems?.length ?? "—",
      icon: IconTarget,
      tint: "text-cyan",
    },
    {
      label: "Набрано XP",
      value: profile?.totalScore ?? "—",
      icon: IconFlame,
      tint: "text-amber",
    },
    {
      label: "Место в топе",
      value: myRank ? `#${myRank}` : "—",
      icon: IconTrophy,
      tint: "text-mint",
    },
    {
      label: "Сильный предмет",
      value: bestSubject?.name ?? "—",
      icon: IconUser,
      tint: "text-sky",
    },
  ];

  const top = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">Рейтинг</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Соревнуйтесь с учениками академии · обновляется после каждой задачи
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-surface p-4">
            <s.icon className={cn("h-5 w-5", s.tint)} />
            <p className="mt-3 font-headline text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Рейтинг по предметам">
        {[{ value: "all", label: "Общий" }, ...SUBJECTS.map((s) => ({ value: s.key, label: s.name }))].map((s) => (
          <button
            key={s.value}
            type="button"
            aria-pressed={subject === s.value}
            onClick={() => setSubject(s.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              subject === s.value
                ? "border-cyan/60 bg-cyan/10 text-cyan"
                : "border-border text-muted-foreground hover:border-white/20 hover:text-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {!loaded ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl bg-panel" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel/40 p-12 text-center">
          <p className="font-headline text-lg font-semibold">Пока пусто</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Решите первую задачу, чтобы попасть в рейтинг.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {top.map((entry, i) => {
              const isMe = entry.uid === uid;
              const medal = MEDAL[i];
              return (
                <div
                  key={entry.uid}
                  className={cn(
                    "card-surface card-hover relative flex flex-col items-center p-6 text-center",
                    i === 0 && "border-amber/30 bg-gradient-to-b from-amber/5 to-transparent",
                    isMe && "ring-1 ring-cyan/40"
                  )}
                >
                  {i === 0 && <IconCrown className="absolute left-4 top-4 h-6 w-6 text-amber" />}
                  <span className={cn("font-mono text-3xl font-bold", medal.className)}>{i + 1}</span>
                  <Avatar className="mt-4 h-16 w-16 border border-border">
                    <AvatarImage src={entry.photoURL} alt={entry.displayName} />
                    <AvatarFallback>{entry.displayName.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <p className="mt-3 font-semibold leading-tight">
                    {entry.displayName}
                    {isMe && <span className="ml-1.5 text-xs text-cyan">(вы)</span>}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {subject === "all" ? `${entry.totalScore} XP` : `${entry.subjectScore} задач`}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="card-surface overflow-hidden">
            <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span>#</span>
              <span>Ученик</span>
              <span className="text-right">Задачи</span>
              <span className="w-16 text-right">XP</span>
            </div>
            {rest.map((entry, i) => {
              const rank = i + 4;
              const isMe = entry.uid === uid;
              return (
                <div
                  key={entry.uid}
                  className={cn(
                    "grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-border px-5 py-3.5 last:border-0",
                    isMe && "bg-cyan/5"
                  )}
                >
                  <span className="font-mono text-sm text-muted-foreground">{rank}</span>
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.photoURL} alt={entry.displayName} />
                      <AvatarFallback>{entry.displayName.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm font-medium">
                      {entry.displayName}
                      {isMe && <span className="ml-1.5 text-xs text-cyan">(вы)</span>}
                    </span>
                  </div>
                  <span className="text-right font-mono text-sm text-muted-foreground">
                    {subject === "all" ? entry.tasksSolved : entry.subjectScore}
                  </span>
                  <span className="w-16 text-right font-mono text-sm text-foreground">
                    {entry.totalScore}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
