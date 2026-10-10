"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { authConfigured, resendConfirmationEmail, sendPasswordResetEmail } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthEmailRequest({ mode, initialEmail = "", initiallySent = false }: {
  mode: "confirmation" | "recovery"; initialEmail?: string; initiallySent?: boolean;
}) {
  const t = useTranslations("auth.emailRequests");
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(initiallySent ? 60 : 0);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("confirmation") === "failed" || params.get("recovery") === "failed" || params.has("error")) setError(t("invalidLink"));
  }, [t]);
  useEffect(() => {
    if (!remaining) return;
    const timer = window.setTimeout(() => setRemaining(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [remaining]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || remaining) return;
    setError(""); setSent(false);
    if (!authConfigured) { setError(t("notConfigured")); return; }
    setLoading(true);
    try {
      if (mode === "recovery") await sendPasswordResetEmail(email);
      else await resendConfirmationEmail(email);
      setSent(true); setRemaining(60);
    } catch (error) {
      const details = error as { status?: number; code?: string };
      if (details.status === 429 || details.code?.startsWith("over_")) { setError(t("rateLimited")); setRemaining(60); }
      else if (details.code === "email_address_not_authorized") setError(t("deliveryNotConfigured"));
      else setError(t("sendError"));
    } finally { setLoading(false); }
  }

  return <div className="space-y-5">
    <p className="text-sm text-muted-foreground">{t(mode === "recovery" ? "recoveryDescription" : "confirmationDescription")}</p>
    {error && <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}
    {sent && <p role="status" className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-500">{t(mode === "recovery" ? "recoverySent" : "confirmationSent")}</p>}
    <form onSubmit={submit} className="space-y-4">
      <Label htmlFor={`email-${mode}`}>{t("email")}</Label>
      <Input id={`email-${mode}`} type="email" autoComplete="email" required value={email} onChange={event => { setEmail(event.target.value); setSent(false); }} disabled={loading} />
      <Button type="submit" className="w-full" disabled={loading || remaining > 0}>
        {loading ? t("sending") : remaining ? t("wait", { seconds: remaining }) : t(mode === "recovery" ? "sendReset" : "resend")}
      </Button>
    </form>
    <p className="text-xs text-muted-foreground">{t("deliveryHint")}</p>
  </div>;
}
