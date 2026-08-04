"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { VLogo } from "@/components/v-logo";

const NAV_LINKS = [
  { href: "#courses", label: "Курсы" },
  { href: "#trajectories", label: "Траектории" },
];

export function LandingHeader() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Гость";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((token: string) => token[0].toUpperCase())
      .join("") || "Г";

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6"
        aria-label="Основная навигация"
      >
        <Link href="/" className="flex items-center gap-2.5 rounded-full" aria-label="VAcademy — на главную">
          <VLogo className="h-9 w-9" />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-gradient">VAcademy</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? null : user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Avatar className="h-6 w-6">
                  {user.photoURL ? <AvatarImage src={user.photoURL} /> : <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>}
                </Avatar>
                {displayName}
              </Link>
              <Button className="btn-primary" asChild>
                <Link href="/dashboard">Дашборд</Link>
              </Button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
                title="Выйти"
                aria-label="Выйти из аккаунта"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Войти</Link>
              </Button>
              <Button className="btn-primary" asChild>
                <Link href="/register">Начать обучение</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label="Открыть меню"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="flex flex-col gap-1.5" aria-hidden="true">
            <span className={`h-0.5 w-5 bg-foreground transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-5 bg-foreground transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-5 bg-foreground transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-border px-4 pb-4 pt-2 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2">
            {loading ? null : user ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button className="btn-primary w-full">Дашборд</Button>
                </Link>
                <Button variant="outline" onClick={handleSignOut}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <Button className="btn-primary w-full">Начать обучение</Button>
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Войти</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
