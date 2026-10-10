import Link from "next/link";
import { useTranslations } from "next-intl";

export function LegalLinks() {
  const t = useTranslations("legal");
  return <nav aria-label={t("navigation")} className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
    <Link href="/privacy" className="hover:text-cyan">{t("privacy")}</Link>
    <Link href="/terms" className="hover:text-cyan">{t("terms")}</Link>
    <Link href="/cookies" className="hover:text-cyan">{t("cookies")}</Link>
  </nav>;
}
