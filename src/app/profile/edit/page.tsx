"use client"

import { useEffect, useState, type FormEvent } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ProfileEditPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [school, setSchool] = useState("");
  const [about, setAbout] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      setAuthenticated(true);
      setUserEmail(user.email || "");
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");

      const profileDoc = await getDoc(doc(db, "users", user.uid));
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        setSchool((profileData.school as string) || "");
        setAbout((profileData.about as string) || "");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const user = auth.currentUser;
    if (!user) {
      setError("Пользователь не найден. Пожалуйста, зарегистрируйтесь или войдите.");
      return;
    }

    setSaving(true);

    try {
      await updateProfile(user, {
        displayName,
        photoURL: photoURL || undefined,
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName,
          photoURL,
          school,
          about,
          email: user.email,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSuccess("Профиль успешно обновлен.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить профиль.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-6 py-10 md:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl text-center text-muted-foreground">Загрузка профиля...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background px-6 py-10 md:px-10 lg:px-12">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <h1 className="text-4xl font-headline font-black tracking-tight">Профиль недоступен</h1>
          <p className="text-muted-foreground">
            Вам нужно зарегистрироваться или войти, чтобы редактировать профиль.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button>Регистрация</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">На дашборд</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Профиль</p>
          <h1 className="text-4xl font-headline font-black tracking-tight">Редактирование профиля</h1>
          <p className="text-muted-foreground">Обновите свои данные для персональной учебной стратегии.</p>
        </div>

        <Card className="border-border/40 bg-card/50 shadow-xl">
          <CardHeader className="space-y-1 p-6">
            <CardTitle className="text-2xl">Настройки профиля</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {error ? <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div> : null}
            {success ? <div className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-500">{success}</div> : null}
            <form className="space-y-5" onSubmit={handleSave}>
              <div className="space-y-2">
                <Label htmlFor="displayName">Имя пользователя</Label>
                <Input id="displayName" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Иван Иванов" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={userEmail} disabled />
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
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <Button type="submit" className="w-full md:w-auto" disabled={saving}>
                  {saving ? "Сохраняем..." : "Сохранить профиль"}
                </Button>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">
                  Вернуться в дашборд
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
