"use client";

import { useRouter } from "next/navigation";
import { localeNames } from "@/i18n/config";
import { useTranslations } from "next-intl";

export function LocaleSwitcher() {
  const router = useRouter();
  const t = useTranslations("common");

  const switchLocale = (locale: string) => {
    document.cookie = `next-intl-locale=${locale};path=/;max-age=${60 * 60 * 24 * 30}`;
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-panel/60 p-1">
      {(["ru", "en"] as const).map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchLocale(locale)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            locale === "ru" ? "bg-cyan/10 text-cyan" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {localeNames[locale]}
        </button>
      ))}
    </div>
  );
}
