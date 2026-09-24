import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "en"],
  defaultLocale: "ru",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/login": "/login",
    "/register": "/register",
    "/delete-account": "/delete-account",
    "/dashboard": "/dashboard",
    "/admin": "/admin",
    "/ai": "/ai",
    "/tests": "/tests",
    "/courses": "/courses",
    "/strategy": "/strategy",
    "/codeforces": "/codeforces",
    "/leaderboard": "/leaderboard",
    "/olympiads": "/olympiads",
    "/profile": "/profile",
    "/profile/edit": "/profile/edit",
    "/matematika": "/matematika",
    "/fizika": "/fizika",
    "/himiya": "/himiya",
    "/informatika": "/informatika",
    "/biology": "/biology",
  },
});

export type Routing = typeof routing;
