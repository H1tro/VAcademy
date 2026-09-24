import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  if (!routing.locales.includes(locale as string)) {
    return { messages: {} };
  }

  const [ru, en] = await Promise.all([
    import("./messages/ru.json"),
    import("./messages/en.json"),
  ]);

  return {
    messages: locale === "ru" ? ru.default : en.default,
  };
});
