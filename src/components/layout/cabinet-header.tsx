"use client";

import { usePathname } from "next/navigation";
import { getRouteTitle } from "@/lib/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { VLogo } from "@/components/v-logo";

export function CabinetHeader() {
  const pathname = usePathname();
  const title = getRouteTitle(pathname);

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border px-4 sm:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex min-w-0 items-center gap-2">
        <VLogo className="hidden h-6 w-6 md:block" />
        <span className="truncate text-sm font-medium text-muted-foreground">VAcademy</span>
        <span className="text-xs text-muted-foreground/50">/</span>
        <span className="truncate text-sm font-semibold">{title}</span>
      </div>
    </header>
  );
}
