"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { cn } from "@/lib/utils";
import { VLogo } from "@/components/v-logo";
import { CABINET_NAV, SUBJECTS } from "@/lib/navigation";
import { useAuth } from "@/hooks/use-auth";
import { IconSettings, IconLogout } from "@/components/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Гость";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((t: string) => t[0].toUpperCase())
      .join("") || "Г";

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href === "/dashboard" ? "/dashboard" : href + "/");

  return (
    <Sidebar variant="sidebar" className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2.5" aria-label="VAcademy — кабинет">
          <VLogo className="h-9 w-9" />
          <span className="font-headline text-lg font-bold tracking-tight">
            <span className="text-gradient">VAcademy</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Меню
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {CABINET_NAV.map((item) => {
                const isExternal = item.href.startsWith("http");
                const linkProps = isExternal
                  ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
                  : { href: item.href };
                return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={!isExternal && isActive(item.href)}
                    tooltip={item.name}
                    className={cn(
                      "transition-all duration-200",
                      !isExternal && isActive(item.href)
                        ? "bg-v-grad-soft text-foreground"
                        : "text-sidebar-foreground hover:bg-white/5"
                    )}
                  >
                    {isExternal ? (
                      <a {...linkProps}>
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                      </a>
                    ) : (
                      <Link {...linkProps}>
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Предметы
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {SUBJECTS.map((subject) => (
                <SidebarMenuItem key={subject.key}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(subject.href)}
                    className="text-sidebar-foreground/80 hover:bg-white/5"
                  >
                    <Link href={subject.href} className="flex items-center gap-2">
                      <div className={cn("flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold", subject.bubble)}>
                        <subject.icon className="h-3.5 w-3.5" />
                      </div>
                      <span>{subject.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!loading && user ? (
          <div className="space-y-3">
            <Link
              href="/profile/edit"
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5"
            >
              <Avatar className="h-9 w-9 border border-border">
                {user.photoURL ? <AvatarImage src={user.photoURL} /> : <AvatarFallback>{initials}</AvatarFallback>}
              </Avatar>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-semibold">{displayName}</span>
                <span className="font-mono text-[10px] uppercase tracking-tight text-muted-foreground">
                  Редактировать профиль
                </span>
              </div>
              <IconSettings className="h-4 w-4 text-muted-foreground" />
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              <IconLogout className="h-4 w-4" />
              Выйти
            </button>
          </div>
        ) : (
          <div className="grid gap-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground hover:border-cyan/60 hover:text-cyan"
            >
              Войти
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-gradient-brand px-3 py-2 text-sm font-semibold text-white shadow-glow-sm hover:shadow-glow"
            >
              Регистрация
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}