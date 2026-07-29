"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState, type FormEvent, useRef } from "react"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Camera, Save, Shield, User, Loader2, Eye, EyeOff, Upload } from "lucide-react"
import Link from "next/link"

const GRADES = [
  { value: "1", label: "1 класс" },
  { value: "2", label: "2 класс" },
  { value: "3", label: "3 класс" },
  { value: "4", label: "4 класс" },
  { value: "5", label: "5 класс" },
  { value: "6", label: "6 класс" },
  { value: "7", label: "7 класс" },
  { value: "8", label: "8 класс" },
  { value: "9", label: "9 класс" },
  { value: "10", label: "10 класс" },
  { value: "11", label: "11 класс" },
]

export default function ProfileEditPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [userEmail, setUserEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [school, setSchool] = useState("")
  const [grade, setGrade] = useState("")
  const [about, setAbout] = useState("")
  const [authenticated, setAuthenticated] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setAuthenticated(false)
          setLoading(false)
          return
        }

        setAuthenticated(true)
        setUserEmail(user.email || "")
        setDisplayName(user.displayName || "")
        setPhotoURL(user.photoURL || "")

        const profileDoc = await getDoc(doc(db, "users", user.uid))
        if (profileDoc.exists()) {
          const data = profileDoc.data()
          setSchool((data.school as string) || "")
          setGrade((data.grade as string) || "")
          setAbout((data.about as string) || "")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки профиля")
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Можно загружать только изображения")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Размер файла не должен превышать 5MB")
      return
    }

    setUploading(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Ошибка загрузки")
      }

      const { url } = await res.json()
      setPhotoURL(url)
      setSuccess("Аватар загружен")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить аватар")
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleAvatarUpload(file)
    }
  }

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    const user = auth.currentUser
    if (!user) {
      setError("Пользователь не найден. Пожалуйста, зарегистрируйтесь или войдите.")
      return
    }

    setSaving(true)

    try {
      await updateProfile(user, {
        displayName,
        photoURL: photoURL || undefined,
      })

      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName,
          photoURL,
          school,
          grade,
          about,
          email: user.email,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

      setSuccess("Профиль успешно обновлен.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить профиль.")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (newPassword.length < 6) {
      setError("Новый пароль должен содержать минимум 6 символов")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    const user = auth.currentUser
    if (!user || !user.email) {
      setError("Пользователь не найден")
      return
    }

    setChangingPassword(true)

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)

      setSuccess("Пароль успешно изменен")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Не удалось изменить пароль"
      if (message.includes("wrong-password") || message.includes("invalid-credential")) {
        setError("Неверный текущий пароль")
      } else {
        setError(message)
      }
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Загрузка профиля...
        </div>
      </div>
    )
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
    )
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-10 lg:px-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Профиль</p>
          <h1 className="text-4xl font-headline font-black tracking-tight">Настройки профиля</h1>
          <p className="text-muted-foreground">Управляйте личными данными и безопасностью аккаунта.</p>
        </div>

        {error ? (
          <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
        ) : null}
        {success ? (
          <div className="rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-500">{success}</div>
        ) : null}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Личные данные
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Безопасность
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border/40 bg-card/50 shadow-xl">
              <CardHeader className="space-y-1 p-6">
                <CardTitle className="text-2xl">Личные данные</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-2 ring-border">
                      <AvatarImage src={photoURL || undefined} />
                      <AvatarFallback className="text-2xl">
                        {displayName
                          ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <p className="text-lg font-semibold">{displayName || "Без имени"}</p>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                    <p className="text-xs text-muted-foreground">
                      Нажмите на иконку камеры, чтобы загрузить фото
                    </p>
                  </div>
                </div>

                <Separator />

                <form className="space-y-5" onSubmit={handleSaveProfile}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Имя пользователя</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Иван Иванов"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={userEmail} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">Организация / школа</Label>
                      <Input
                        id="school"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder="Школа №123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Класс</Label>
                      <Select value={grade} onValueChange={setGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите класс" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADES.map((g) => (
                            <SelectItem key={g.value} value={g.value}>
                              {g.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about">О себе</Label>
                    <Textarea
                      id="about"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Кратко о целях и планах"
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
                    <Button type="submit" className="w-full md:w-auto" disabled={saving}>
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Сохраняем...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Сохранить профиль
                        </>
                      )}
                    </Button>
                    <Link
                      href="/dashboard"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Вернуться в дашборд
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-border/40 bg-card/50 shadow-xl">
              <CardHeader className="space-y-1 p-6">
                <CardTitle className="text-2xl">Смена пароля</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <form className="space-y-5" onSubmit={handleChangePassword}>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Текущий пароль</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Введите текущий пароль"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Новый пароль</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Минимум 6 символов"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Повторите новый пароль"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
                    <Button type="submit" className="w-full md:w-auto" disabled={changingPassword}>
                      {changingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Изменяем...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Изменить пароль
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
