import createNextIntlMiddleware from "next-intl/middleware";

export default createNextIntlMiddleware({
  locales: ["ru", "en"],
  defaultLocale: "ru",
  localeDetection: true,
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*|favicon\\.ico).*)",
  ],
};
