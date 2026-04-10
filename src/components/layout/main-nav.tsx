
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  BookOpen, 
  BrainCircuit, 
  Trophy, 
  BarChart3, 
  Info, 
  Settings,
  Atom,
  ChevronRight
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

const navItems = [
  { name: "Обзор", href: "/dashboard", icon: LayoutDashboard },
  { name: "Курсы", href: "/courses", icon: BookOpen },
  { name: "ИИ Стратегия", href: "/strategy", icon: BrainCircuit },
  { name: "Практика", href: "/practice", icon: Trophy },
  { name: "Рейтинг", href: "/leaderboard", icon: BarChart3 },
  { name: "Олимпиады", href: "/olympiads", icon: Info },
]

const subjects = [
  { name: "Математика", icon: "Σ" },
  { name: "Физика", icon: "Φ" },
  { name: "Информатика", icon: "{" },
  { name: "Химия", icon: "H₂" },
  { name: "Биология", icon: "DNA" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" className="border-r border-border bg-sidebar shadow-xl">
      <SidebarHeader className="p-4 flex flex-row items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Atom className="text-white h-5 w-5" />
        </div>
        <span className="font-headline font-bold text-xl tracking-tight text-primary">Learnova</span>
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
                  <SidebarMenuButton 
                    className="hover:bg-accent/10 text-sidebar-foreground/80 hover:text-accent transition-colors duration-200"
                  >
                    <div className="w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-md bg-secondary border border-border">
                      {subject.icon}
                    </div>
                    <span>{subject.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto border-t border-border/50">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-all cursor-pointer group">
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">Студент 01</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Level 12 Expert</span>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
