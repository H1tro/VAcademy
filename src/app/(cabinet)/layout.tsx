import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MainNav } from "@/components/layout/main-nav";
import { CabinetHeader } from "@/components/layout/cabinet-header";
import { Orbs } from "@/components/landing/orbs";
import { LegalLinks } from "@/components/legal/legal-links";

export default function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full overflow-hidden bg-background text-foreground">
        <MainNav />
        <SidebarInset className="isolate flex min-h-screen w-full flex-col">
          <Orbs />
          <CabinetHeader />
          <main id="main" className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <footer className="border-t border-border px-4 py-5"><LegalLinks /></footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
