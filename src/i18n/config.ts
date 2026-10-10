export const locales = ["ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";
export const localeCookie = "next-intl-locale";

export function isLocale(value: unknown): value is Locale {
  return locales.some((locale) => locale === value);
}

export const localeNames: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
};
