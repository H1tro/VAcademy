import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, localeCookie } from "./config";

export default getRequestConfig(async () => {
  const value = (await cookies()).get(localeCookie)?.value;
  const locale = isLocale(value) ? value : defaultLocale;
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
