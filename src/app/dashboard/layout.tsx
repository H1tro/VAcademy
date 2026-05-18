
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { MainNav } from "@/components/layout/main-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background text-foreground overflow-hidden">
        <MainNav />
        <SidebarInset className="flex flex-col w-full min-h-screen overflow-y-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-md px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Vacademi</span>
              <span className="text-xs text-muted-foreground/50">/</span>
              <span className="text-sm font-semibold">Личный кабинет</span>
            </div>
          </header>
          <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
