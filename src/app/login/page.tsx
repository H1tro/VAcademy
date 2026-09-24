"use client"

export const dynamic = "force-dynamic"

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations("auth.login");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{t("welcome")}</p>
          <h1 className="text-4xl font-headline font-black tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <Card className="border-border/40 bg-card/50 shadow-xl">
          <CardHeader className="space-y-1 p-6">
            <CardTitle className="text-2xl">{t("authorize")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {error ? <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("emailPlaceholder")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t("passwordPlaceholder")} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t("submitting") : t("submit")}
              </Button>
            </form>
            <div className="text-sm text-muted-foreground">
              {t("noAccount")}{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                {t("register")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
