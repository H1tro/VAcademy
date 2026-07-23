
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  BarChart3,
  Info,
  Settings,
  Atom,
  GraduationCap,
  ListChecks,
  ClipboardCheck
} from "lucide-react"

import { cn } from "@/lib/utils"
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
  SidebarGroupContent
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut, type User } from "firebase/auth"

const navItems = [
  { name: "Обзор", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI", href: "/ai", icon: Atom },
  { name: "Тесты", href: "/tests", icon: ClipboardCheck },
  { name: "Курсы", href: "/courses", icon: BookOpen },
  { name: "Материалы", href: "/strategy", icon: GraduationCap },
  { name: "Задачи", href: "/problems", icon: ListChecks },
  { name: "Рейтинг", href: "/leaderboard", icon: BarChart3 },
  { name: "Олимпиады", href: "/olympiads", icon: Info },
]

const subjects = [
  { name: "Математика", icon: "Σ", href: "/matematika" },
  { name: "Физика", icon: "Φ", href: "/fizika" },
  { name: "Информатика", icon: "{", href: "/informatika" },
  { name: "Химия", icon: "H₂", href: "/himiya" },
  { name: "Биология", icon: "DNA", href: "/biology" },
]

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Гость"
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token[0].toUpperCase())
    .join("") || "Г"

  const handleSignOut = async () => {
    await signOut(auth)
    router.push("/login")
  }

  return (
    <Sidebar variant="sidebar" className="border-r border-border bg-sidebar shadow-xl">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Atom className="text-white h-5 w-5" />
        </div>
        <span className="font-headline font-bold text-xl tracking-tight text-primary">VAcademi</span>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Меню
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.name}
                    className={cn(
                      "transition-all duration-200 hover:bg-primary/10",
                      pathname === item.href ? "text-primary bg-primary/10" : "text-sidebar-foreground"
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Предметы
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {subjects.map((subject) => (
                <SidebarMenuItem key={subject.name}>
                  {subject.href ? (
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === subject.href}
                      className="hover:bg-accent/10 text-sidebar-foreground/80 hover:text-accent transition-colors duration-200"
                    >
                      <Link href={subject.href} className="flex items-center gap-2">
                        <div className="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-md bg-secondary border border-border">
                          {subject.icon}
                        </div>
                        <span>{subject.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton className="hover:bg-accent/10 text-sidebar-foreground/80 hover:text-accent transition-colors duration-200">
                      <div className="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-md bg-secondary border border-border">
                        {subject.icon}
                      </div>
                      <span>{subject.name}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-border/50">
        {user ? (
          <div className="space-y-3">
            <Link href="/profile/edit" className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-all group">
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                {user.photoURL ? <AvatarImage src={user.photoURL} /> : <AvatarFallback>{initials}</AvatarFallback>}
              </Avatar>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{displayName}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Редактировать профиль</span>
              </div>
              <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border/30 bg-background px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
            >
              Выйти
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/40">
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarFallback>Г</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">Гость</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">Войдите или зарегистрируйтесь</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-border/30 bg-background px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/5">
                Войти
              </Link>
              <Link href="/register" className="inline-flex items-center justify-center rounded-full border border-primary bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/20">
                Регистрация
              </Link>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
