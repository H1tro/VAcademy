"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { localeCookie } from "@/i18n/config";
export function CookiePreferences() {
  const t = useTranslations("legal");
  const router = useRouter();
  const [status, setStatus] = useState<"cleared" | "clearError" | null>(null);
  function clearPreferences() {
    try {
      localStorage.removeItem("vacademy-practice");
      for (const name of [localeCookie, "sidebar_state"]) document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
      setStatus("cleared");
      router.refresh();
    } catch { setStatus("clearError"); }
  }
  return <div className="mt-6 rounded-xl border border-border p-5">
    <Button onClick={clearPreferences}>{t("clear")}</Button>
    {status && <p role="status" className="mt-3 text-sm text-muted-foreground">{t(status)}</p>}
  </div>;
}
