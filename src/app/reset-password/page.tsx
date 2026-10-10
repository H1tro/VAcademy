"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { auth, authConfigured, onAuthStateChanged, updatePassword, signOut, type User } from "@/lib/auth-client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocaleSwitcher } from "@/i18n/LocaleSwitcher";
import { LegalLinks } from "@/components/legal/legal-links";

export default function ResetPasswordPage() {
  const t = useTranslations("auth.emailRequests");
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!authConfigured) { setChecking(false); return; }
    let revision = 0;
    const unsubscribe = onAuthStateChanged(auth, async candidate => {
      const current = ++revision;
      if (!candidate) { setUser(null); setChecking(false); return; }
      try {
        const { data, error } = await createClient().auth.getUser();
        if (current === revision) setUser(!error && data.user?.id === candidate.uid ? candidate : null);
      } catch { if (current === revision) setUser(null); }
      finally { if (current === revision) setChecking(false); }
    });
    return () => { revision++; unsubscribe(); };
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || loading) return;
    setError("");
    if (password.length < 6) { setError(t("passwordMin")); return; }
    if (password !== confirm) { setError(t("passwordMismatch")); return; }
    setLoading(true);
    try {
      await updatePassword(user, password);
      setPassword(""); setConfirm(""); setDone(true);
      await signOut(auth).catch(() => undefined);
    } catch (error) {
      const code = (error as { code?: string }).code;
      setError(t(code === "same_password" ? "samePassword" : code === "weak_password" ? "weakPassword" : "updateError"));
    } finally { setLoading(false); }
  }
  return <div className="min-h-screen bg-background px-6 py-10"><div className="mx-auto max-w-lg space-y-6">
    <div className="flex justify-end"><LocaleSwitcher /></div>
    <Card><CardHeader><CardTitle>{t("resetTitle")}</CardTitle></CardHeader><CardContent className="space-y-5">
      {done ? <><p role="status" className="text-emerald-500">{t("resetSuccess")}</p><Button asChild><Link href="/login">{t("backToLogin")}</Link></Button></>
        : checking ? <p role="status">{t("checkingLink")}</p>
          : !user ? <><p role="alert">{t(authConfigured ? "invalidLink" : "notConfigured")}</p><Button asChild><Link href="/forgot-password">{t("sendReset")}</Link></Button></>
            : <form onSubmit={submit} className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("newPasswordDescription")}</p>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <div className="space-y-2"><Label htmlFor="new-password">{t("newPassword")}</Label><Input id="new-password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={event => setPassword(event.target.value)} disabled={loading} /></div>
              <div className="space-y-2"><Label htmlFor="confirm-password">{t("confirmPassword")}</Label><Input id="confirm-password" type="password" autoComplete="new-password" minLength={6} required value={confirm} onChange={event => setConfirm(event.target.value)} disabled={loading} /></div>
              <Button type="submit" className="w-full" disabled={loading}>{t(loading ? "saving" : "savePassword")}</Button>
            </form>}
    </CardContent></Card><LegalLinks />
  </div></div>;
}
