"use client"

export const dynamic = "force-dynamic"

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const [about, setAbout] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || !displayName) {
      setError("Пожалуйста, заполните имя, email и пароль.");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName,
        photoURL: photoURL || undefined,
      });

      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          displayName,
          email: user.email,
          photoURL: photoURL || "",
          school,
          about,
          goal: "Подготовка к олимпиадам",
          streakDays: 0,
          maxStreakDays: 0,
          tasksSolved: 0,
          solvedProblems: [],
          studyTimeMinutes: 0,
          subjectProgress: {
            mathematics: 0,
            physics: 0,
            informatics: 0,
            chemistry: 0,
            biology: 0,
          },
        }),
      });

      setSuccess("Регистрация прошла успешно!");
      router.push("/profile/edit");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось зарегистрироваться.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Добро пожаловать</p>
          <h1 className="text-4xl font-headline font-black tracking-tight">Создать аккаунт</h1>
          <p className="text-muted-foreground">
            Зарегистрируйтесь в VAcademi, чтобы сохранять прогресс, редактировать профиль и продолжить подготовку.
          </p>
        </div>

        <Card className="border-border/40 bg-card/50 shadow-xl">
          <CardHeader className="space-y-1 p-6">
            <CardTitle className="text-2xl">Регистрация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {error ? <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}
            {success ? <div className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-500">{success}</div> : null}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="displayName">Имя пользователя</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Иван Иванов"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Минимум 6 символов"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photoURL">Фото профиля (URL)</Label>
                <Input id="photoURL" value={photoURL} onChange={(event) => setPhotoURL(event.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">Организация / школа</Label>
                <Input id="school" value={school} onChange={(event) => setSchool(event.target.value)} placeholder="Школа №123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">О себе</Label>
                <Textarea id="about" value={about} onChange={(event) => setAbout(event.target.value)} placeholder="Кратко о целях и планах" />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Сохранение..." : "Зарегистрироваться"}
              </Button>
            </form>
            <div className="text-sm text-muted-foreground">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Войти
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
