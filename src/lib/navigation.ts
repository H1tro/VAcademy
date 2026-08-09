import type { ComponentType } from "react";
import type { IconProps } from "@/components/icons";
import {
  IconGrid,
  IconSparkles,
  IconClipboard,
  IconBook,
  IconGraduation,
  IconListCheck,
  IconTrophy,
  IconCalendar,
  IconSigma,
  IconAtom,
  IconFlask,
  IconCode,
  IconDna,
  IconCodeforces,
} from "@/components/icons";
import type { SubjectKey } from "./types";

export type NavIcon = ComponentType<IconProps>;

export interface CabinetNavItem {
  name: string;
  href: string;
  icon: NavIcon;
}

export const CABINET_NAV: CabinetNavItem[] = [
  { name: "Обзор", href: "/dashboard", icon: IconGrid },
  { name: "AI", href: "/ai", icon: IconSparkles },
  { name: "Тесты", href: "/tests", icon: IconClipboard },
  { name: "Курсы", href: "/courses", icon: IconBook },
  { name: "Стратегия", href: "/strategy", icon: IconGraduation },
  { name: "Задачи", href: "/problems", icon: IconListCheck },
  { name: "Codeforces", href: "/codeforces", icon: IconCodeforces },
  { name: "Рейтинг", href: "/leaderboard", icon: IconTrophy },
  { name: "Олимпиады", href: "/olympiads", icon: IconCalendar },
];

export interface SubjectMeta {
  key: SubjectKey;
  name: string;
  short: string;
  href: string;
  icon: NavIcon;
  /** icon tint */
  text: string;
  /** soft bubble behind icon */
  bubble: string;
  /** gradient wash for covers */
  cover: string;
  /** approximate material count */
  materials: number;
}

export const SUBJECTS: SubjectMeta[] = [
  {
    key: "mathematics",
    name: "Математика",
    short: "Math",
    href: "/matematika",
    icon: IconSigma,
    text: "text-violet",
    bubble: "bg-violet/15 text-violet",
    cover: "from-violet/30 to-violet/5",
    materials: 12,
  },
  {
    key: "physics",
    name: "Физика",
    short: "Phys",
    href: "/fizika",
    icon: IconAtom,
    text: "text-sky",
    bubble: "bg-sky/15 text-sky",
    cover: "from-sky/30 to-sky/5",
    materials: 10,
  },
  {
    key: "chemistry",
    name: "Химия",
    short: "Chem",
    href: "/himiya",
    icon: IconFlask,
    text: "text-mint",
    bubble: "bg-mint/15 text-mint",
    cover: "from-mint/30 to-mint/5",
    materials: 9,
  },
  {
    key: "informatics",
    name: "Информатика",
    short: "Inf",
    href: "/informatika",
    icon: IconCode,
    text: "text-cyan",
    bubble: "bg-cyan/15 text-cyan",
    cover: "from-cyan/30 to-cyan/5",
    materials: 11,
  },
  {
    key: "biology",
    name: "Биология",
    short: "Bio",
    href: "/biology",
    icon: IconDna,
    text: "text-amber",
    bubble: "bg-amber/15 text-amber",
    cover: "from-amber/30 to-amber/5",
    materials: 8,
  },
];

const ROUTE_TITLES: Record<string, string> = {
  dashboard: "Обзор",
  admin: "Администрирование",
  ai: "AI-помощник",
  tests: "Тесты",
  courses: "Курсы",
  strategy: "Стратегия",
  problems: "Задачи",
  codeforces: "Codeforces",
  leaderboard: "Рейтинг",
  olympiads: "Олимпиады",
  profile: "Профиль",
  matematika: "Математика",
  fizika: "Физика",
  himiya: "Химия",
  informatika: "Информатика",
  biology: "Биология",
};

/** Longest matching route segment wins (so /dashboard/admin → "Администрирование"). */
export function getRouteTitle(pathname: string): string {
  const entries = Object.entries(ROUTE_TITLES);
  let best: { key: string; title: string } | null = null;
  for (const [key, title] of entries) {
    const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
    if (p === `/${key}` || p.startsWith(`/${key}/`)) {
      if (!best || key.length > best.key.length) best = { key, title };
    }
  }
  return best ? best.title : "Кабинет";
}

export function subjectByKey(key: SubjectKey): SubjectMeta | undefined {
  return SUBJECTS.find((s) => s.key === key);
}
