"use client";

import { useRouter } from "next/navigation";
import { localeNames, locales, localeCookie, type Locale } from "@/i18n/config";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations("common");
  const [pending, startTransition] = useTransition();

  const switchLocale = (locale: Locale) => {
    if (locale === currentLocale) return;
    document.cookie = `${localeCookie}=${locale};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax${location.protocol === "https:" ? ";Secure" : ""}`;
    startTransition(() => router.refresh());
  };

  return (
    <div role="group" aria-label={t("language")} aria-busy={pending} className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-panel/60 p-1">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchLocale(locale)}
          aria-pressed={locale === currentLocale}
          aria-label={localeNames[locale]}
          lang={locale}
          disabled={pending}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            locale === currentLocale ? "bg-cyan/10 text-cyan" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
