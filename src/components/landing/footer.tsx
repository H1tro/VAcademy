import Link from "next/link";
import { VLogo } from "@/components/v-logo";
import { useTranslations } from "next-intl";

const LINK_GROUPS = [
  {
    titleKey: "platform",
    links: [
      { href: "/courses", labelKey: "courses" },
      { href: "/dashboard", labelKey: "dashboard" },
      { href: "/leaderboard", labelKey: "leaderboard" },
      { href: "/register", labelKey: "register" },
    ],
  },
  {
    titleKey: "subjects",
    links: [
      { href: "/matematika", labelKey: "mathematics" },
      { href: "/informatika", labelKey: "informatika" },
      { href: "/fizika", labelKey: "physics" },
      { href: "/himiya", labelKey: "chemistry" },
    ],
  },
  {
    titleKey: "help",
    links: [
      { href: "/login", labelKey: "login" },
      { href: "#advantages", labelKey: "aboutPlatform" },
      { href: "#courses", labelKey: "courses" },
    ],
  },
];

export function Footer() {
  const t = useTranslations("landing.footer");

  return (
    <footer className="border-t border-border bg-panel/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5" aria-label="VAcademy — на главную">
              <VLogo className="h-9 w-9" />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-gradient">VAcademy</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Премиальная платформа подготовки к STEM-олимпиадам. Рост измерим — с первого дня.
            </p>
          </div>

          {LINK_GROUPS.map((group) => (
            <nav key={group.titleKey} aria-label={t(group.titleKey)}>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{t(group.titleKey)}</h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-cyan"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            V-GROWTH · <span className="text-cyan">{t("tagline")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
