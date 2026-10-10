"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/i18n/LocaleSwitcher";
import { LegalLinks } from "@/components/legal/legal-links";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthEmailRequest } from "./auth-email-request";

export function AuthEmailPage({ mode }: { mode: "recovery" | "confirmation" }) {
  const t = useTranslations("auth.emailRequests");
  return <div className="min-h-screen bg-background px-6 py-10">
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex justify-end"><LocaleSwitcher /></div>
      <Card><CardHeader><CardTitle>{t(mode === "recovery" ? "forgotTitle" : "confirmationTitle")}</CardTitle></CardHeader>
        <CardContent className="space-y-6"><AuthEmailRequest mode={mode} />
          <Link href="/login" className="block text-sm text-primary hover:underline">{t("backToLogin")}</Link>
        </CardContent>
      </Card><LegalLinks />
    </div>
  </div>;
}
