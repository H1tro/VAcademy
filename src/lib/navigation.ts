import type { ComponentType } from "react";
import type { IconProps } from "@/components/icons";
import {
  IconGrid,
  IconSparkles,
  IconClipboard,
  IconBook,
  IconGraduation,
  IconTrophy,
  IconCalendar,
  IconSigma,
  IconAtom,
  IconFlask,
  IconCode,
  IconDna,
  IconCodeforces,
  IconSend,
} from "@/components/icons";
import type { SubjectKey } from "./types";

export type NavIcon = ComponentType<IconProps>;

export interface CabinetNavItem {
  name: string;
  href: string;
  icon: NavIcon;
}

export const CABINET_NAV: CabinetNavItem[] = [
  { name: "dashboard", href: "/dashboard", icon: IconGrid },
  { name: "ai", href: "/ai", icon: IconSparkles },
  { name: "tests", href: "/tests", icon: IconClipboard },
  { name: "courses", href: "/courses", icon: IconBook },
  { name: "strategy", href: "/strategy", icon: IconGraduation },

  { name: "codeforces", href: "/codeforces", icon: IconCodeforces },
  { name: "leaderboard", href: "/leaderboard", icon: IconTrophy },
  { name: "olympiads", href: "/olympiads", icon: IconCalendar },
  { name: "practice", href: "/practice", icon: IconClipboard },
  { name: "simulators", href: "/simulators", icon: IconAtom },
  { name: "teacher", href: "/teacher", icon: IconGraduation },
  { name: "feedback", href: "/feedback", icon: IconSend },
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
  { key: "mathematics", name: "Математика", short: "Math", href: "/matematika", icon: IconSigma, text: "text-violet", bubble: "bg-violet/15 text-violet", cover: "from-violet/30 to-violet/5", materials: 12 },
  { key: "physics", name: "Физика", short: "Phys", href: "/fizika", icon: IconAtom, text: "text-sky", bubble: "bg-sky/15 text-sky", cover: "from-sky/30 to-sky/5", materials: 10 },
  { key: "chemistry", name: "Химия", short: "Chem", href: "/himiya", icon: IconFlask, text: "text-mint", bubble: "bg-mint/15 text-mint", cover: "from-mint/30 to-mint/5", materials: 9 },
  { key: "informatics", name: "Информатика", short: "Inf", href: "/informatika", icon: IconCode, text: "text-cyan", bubble: "bg-cyan/15 text-cyan", cover: "from-cyan/30 to-cyan/5", materials: 11 },
  { key: "biology", name: "Биология", short: "Bio", href: "/biology", icon: IconDna, text: "text-amber", bubble: "bg-amber/15 text-amber", cover: "from-amber/30 to-amber/5", materials: 8 }
];

const ROUTE_TITLES: Record<string, string> = {
  "dashboard/admin": "admin",
  dashboard: "dashboard",
  admin: "admin",
  ai: "ai",
  tests: "tests",
  courses: "courses",
  strategy: "strategy",

  codeforces: "codeforces",
  leaderboard: "leaderboard",
  olympiads: "olympiads",
  profile: "profile",
  practice: "practice",
  simulators: "simulators",
  teacher: "teacher",
  feedback: "feedback",
  matematika: "matematika",
  fizika: "fizika",
  himiya: "himiya",
  informatika: "informatika",
  biology: "biology",
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
  return best ? best.title : "cabinet";
}

export function subjectByKey(key: SubjectKey): SubjectMeta | undefined {
  return SUBJECTS.find((s) => s.key === key);
}
