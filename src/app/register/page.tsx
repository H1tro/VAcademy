"use client"

export const dynamic = "force-dynamic"

import { useTranslations as useUITranslations } from "next-intl";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { auth, authConfigured } from "@/lib/auth-client";
import { createUserWithEmailAndPassword } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { LocaleSwitcher } from "@/i18n/LocaleSwitcher";
import { useTranslations } from "next-intl";
import { AGE_RESTRICTION_KEY, LEGAL_VERSION } from "@/lib/legal-config";

export default function RegisterPage() {
  const ui = useUITranslations("ui");
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const [role, setRole] = useState('student');
  const roles = useTranslations('features.roles');
  const [about, setAbout] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const t = useTranslations("auth.register");
  const legal = useTranslations("legal");
  const [ageRange, setAgeRange] = useState("");
  const [ageReady, setAgeReady] = useState(false);
  const [ageBlocked, setAgeBlocked] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyRead, setPrivacyRead] = useState(false);
  const [guardianPermission, setGuardianPermission] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem(AGE_RESTRICTION_KEY)) { setAgeBlocked(true); setAgeRange("under13"); }
      setAgeReady(true);
    } catch { setError(legal("storageRequired")); }
  }, [legal]);

  function selectAge(value: string) {
    setAgeRange(value);
    setGuardianPermission(false);
    if (value === "under13") {
      setAgeBlocked(true);
      setDisplayName(""); setEmail(""); setPassword(""); setSchool(""); setAbout(""); setPhotoURL("");
      try { sessionStorage.setItem(AGE_RESTRICTION_KEY, "1"); }
      catch { setError(legal("storageRequired")); }
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ageReady || ageBlocked || (ageRange !== "13-17" && ageRange !== "18+")) { setError(legal("acceptanceRequired")); return; }
    if (!termsAccepted || !privacyRead) { setError(legal("acceptanceRequired")); return; }
    if (!guardianPermission) { setError(legal("guardianRequired")); return; }
    if (!authConfigured) { setError(t('notConfigured')); return; }
    setError("");
    setSuccess("");

    if (!email || !password || !displayName) {
      setError(t("fillFields"));
      return;
    }

    if (password.length < 6) {
      setError(t("passwordMin"));
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, {
        displayName, photoURL, school, about, goal: ui("olympiadPreparation"),
        legalAcknowledgement: { version: LEGAL_VERSION, termsAccepted: true, privacyRead: true, ageRange, guardianPermission },
      });
      if (!userCredential.session) { setSuccess(t("checkEmail")); return; }

      setSuccess(t("success"));
      router.push(role === 'teacher' ? '/teacher' : '/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : t("error");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex justify-end"><LocaleSwitcher /></div>
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{t("welcome")}</p>
          <h1 className="text-4xl font-headline font-black tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <Card className="border-border/40 bg-card/50 shadow-xl">
          <CardHeader className="space-y-1 p-6">
            <CardTitle className="text-2xl">{t("register")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {error ? <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}
            {success ? <div className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-500">{success}</div> : null}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="ageRange">{legal("age")}</Label>
                <select id="ageRange" value={ageRange} onChange={event => selectAge(event.target.value)} disabled={!ageReady || ageBlocked || loading}
                  className="w-full rounded-lg border border-border bg-background p-3" aria-describedby="ageNotice">
                  <option value="">{legal("agePlaceholder")}</option><option value="under13">{legal("ageUnder13")}</option>
                  <option value="13-17">{legal("ageTeen")}</option><option value="18+">{legal("ageAdult")}</option>
                </select>
                <p id="ageNotice" className="text-sm text-muted-foreground">{legal("ageNotice")}</p>
              </div>
              {ageBlocked && <p role="alert" className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{legal("ageBlocked")}</p>}
              {ageReady && !ageBlocked && (ageRange === "13-17" || ageRange === "18+") && <>
              <label className="block space-y-2"><span>{roles('account')}</span><select value={role} onChange={e => setRole(e.target.value)} className="w-full rounded-lg border border-border bg-background p-3"><option value="student">{roles('student')}</option><option value="teacher">{roles('teacher')}</option></select></label>
              {role === 'teacher' && <p className="text-sm text-muted-foreground">{roles('approval.registration')}</p>}
              <div className="space-y-2">
                <Label htmlFor="displayName">{t("name")}</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder={t("namePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("emailPlaceholder")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t("passwordPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photoURL">{t("photoUrl")}</Label>
                <Input id="photoURL" value={photoURL} onChange={(event) => setPhotoURL(event.target.value)} placeholder={t("photoUrlPlaceholder")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">{t("school")}</Label>
                <Input id="school" value={school} onChange={(event) => setSchool(event.target.value)} placeholder={t("schoolPlaceholder")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">{t("about")}</Label>
                <Textarea id="about" value={about} onChange={(event) => setAbout(event.target.value)} placeholder={t("aboutPlaceholder")} rows={3} />
              </div>

              <div className="space-y-4 rounded-lg border border-border p-4 text-sm">
                <label className="flex items-start gap-3"><input type="checkbox" required checked={guardianPermission} onChange={event => setGuardianPermission(event.target.checked)} className="mt-1 h-4 w-4 shrink-0" /><span>{ageRange === "13-17" ? legal("guardian") : legal("guardianAdult")}</span></label>
                <label className="flex items-start gap-3"><input type="checkbox" required checked={termsAccepted} onChange={event => setTermsAccepted(event.target.checked)} className="mt-1 h-4 w-4 shrink-0" /><span>{legal("acceptTerms")} <Link href="/terms" target="_blank" className="text-primary underline">{legal("terms")}</Link>.</span></label>
                <label className="flex items-start gap-3"><input type="checkbox" required checked={privacyRead} onChange={event => setPrivacyRead(event.target.checked)} className="mt-1 h-4 w-4 shrink-0" /><span>{legal("readPrivacy")} <Link href="/privacy" target="_blank" className="text-primary underline">{legal("privacyFull")}</Link>.</span></label>
              </div>
              <Button type="submit" className="w-full" disabled={loading || !termsAccepted || !privacyRead || !guardianPermission}>
                {loading ? t("submitting") : t("submit")}
              </Button>
              </>}
            </form>
            <nav aria-label={legal("navigation")} className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <Link href="/privacy" className="hover:underline">{legal("privacy")}</Link><Link href="/terms" className="hover:underline">{legal("terms")}</Link><Link href="/cookies" className="hover:underline">{legal("cookies")}</Link>
            </nav>
            <div className="text-sm text-muted-foreground">
              {t("haveAccount")}{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                {t("login")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
