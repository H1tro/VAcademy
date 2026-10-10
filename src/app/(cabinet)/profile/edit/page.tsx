"use client"

export const dynamic = "force-dynamic"

import { authFetch } from '@/lib/auth-fetch';
import { useTranslations as useUITranslations } from "next-intl";
import { useEffect, useState, type FormEvent, useRef } from "react"
import { auth, firebaseConfigured } from "@/lib/firebase"
import { signOut, onAuthStateChanged, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { IconCamera, IconSave, IconShield, IconUser, IconSpinner, IconEye, IconEyeOff } from "@/components/icons"
import Link from "next/link"
import { useTranslations } from "next-intl"

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

function DeleteAccountSection({ email, uid }: { email: string; uid: string }) {
  const ui = useUITranslations("ui");
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleRequest = async () => {
    setSending(true)
    setError("")

    try {
      const user = auth.currentUser;
      if (!user) throw new Error(ui("userNotFoundPleaseSignUpOrSignIn"));
      const res = await fetch("/api/account/request-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await user.getIdToken()}` },
        body: JSON.stringify({ uid, email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || ui("failedToSend"))
      }

      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : ui("couldNotSendEmail"))
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl bg-mint/10 p-4 text-sm text-mint">
        {ui("aConfirmationLinkHasBeenSentTo")} <strong>{email}</strong>{ui("checkYourInbox2")}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}
      <Button variant="destructive" onClick={handleRequest} disabled={sending}>
        {sending ? (
          <>
            <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
            {ui("sending")}
          </>
        ) : (
          ui("deleteAccount")
        )}
      </Button>
    </div>
  )
}

export default function ProfileEditPage() {
  const ui = useUITranslations("ui");
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const t = useTranslations("cabinet.profile")
  const errT = useTranslations("errors")
  const [userEmail, setUserEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [photoURL, setPhotoURL] = useState("")
  const [school, setSchool] = useState("")
  const [grade, setGrade] = useState("")
  const [about, setAbout] = useState("")
  const [codeforces, setCodeforces] = useState("")
  const [leetcode, setLeetcode] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [uid, setUid] = useState("")

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!firebaseConfigured) { setLoading(false); return; }
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setAuthenticated(false)
          setLoading(false)
          return
        }

        setAuthenticated(true)
        setUid(user.uid)
        setUserEmail(user.email || "")
        setDisplayName(user.displayName || "")
        setPhotoURL(user.photoURL || "")

        const res = await authFetch(`/api/profile?uid=${user.uid}`)
        if (res.ok) {
          const data = await res.json()
          if (data && data.school !== undefined) {
            setSchool(data.school as string || "")
            setGrade(data.grade as string || "")
            setAbout(data.about as string || "")
            setCodeforces(data.codeforces as string || "")
            setLeetcode(data.leetcode as string || "")
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : ui("couldNotLoadProfile"))
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(ui("onlyImagesCanBeUploaded"))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(ui("fileSizeMustNotExceed5Mb"))
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
        throw new Error(err.error || ui("uploadFailed"))
      }

      const { url } = await res.json()
      setPhotoURL(url)
      setSuccess(ui("avatarUploaded"))
    } catch (err) {
      setError(err instanceof Error ? err.message : ui("couldNotUploadAvatar"))
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
      setError(ui("userNotFoundPleaseSignUpOrSignIn"))
      return
    }

    setSaving(true)

    try {
      await updateProfile(user, {
        displayName,
        photoURL: photoURL || undefined,
      })

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${await user.getIdToken()}` },
        body: JSON.stringify({
          uid: user.uid,
          displayName,
          photoURL,
          school,
          grade,
          about,
          codeforces,
          leetcode,
          email: user.email,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || ui("couldNotSaveProfile"))
      }

      setSuccess(ui("profileUpdatedSuccessfully"))
    } catch (err) {
      setError(err instanceof Error ? err.message : ui("couldNotSaveProfile2"))
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (newPassword.length < 6) {
      setError(ui("newPasswordMustContainAtLeast6Characters"))
      return
    }

    if (newPassword !== confirmPassword) {
      setError(ui("passwordsDoNotMatch"))
      return
    }

    const user = auth.currentUser
    if (!user || !user.email) {
      setError(ui("userNotFound"))
      return
    }

    setChangingPassword(true)

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)

      setSuccess(ui("passwordChangedSuccessfully"))
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      const message = err instanceof Error ? err.message : ui("couldNotChangePassword")
      if (message.includes("wrong-password") || message.includes("invalid-credential")) {
        setError(ui("incorrectCurrentPassword"))
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
          <IconSpinner className="h-5 w-5 animate-spin" />
          {ui("loadingProfile")}
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="animate-fade-up py-10 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-headline font-black tracking-tight">{ui("profileUnavailable")}</h1>
          <p className="text-muted-foreground">
            {ui("signUpOrSignInToEditYourProfile")}
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button>{ui("registration")}</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline">{ui("goToDashboard")}</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-up space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">{t('section')}</p>
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {error ? (
        <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      ) : null}
      {success ? (
        <div className="rounded-xl bg-mint/10 p-4 text-sm text-mint">{success}</div>
      ) : null}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <IconUser className="h-4 w-4" />
              {t('personalData')}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <IconShield className="h-4 w-4" />
              {t('security')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="card-surface">
              <CardHeader className="space-y-1 p-6">
                <CardTitle className="text-2xl">{ui("personalDetails")}</CardTitle>
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
                      className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-white shadow-glow-sm transition-[box-shadow,filter,transform] hover:brightness-110 disabled:opacity-50"
                    >
                      {uploading ? (
                        <IconSpinner className="h-4 w-4 animate-spin" />
                      ) : (
                        <IconCamera className="h-4 w-4" />
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
                    <p className="text-lg font-semibold">{displayName || ui("unnamed")}</p>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                    <p className="text-xs text-muted-foreground">
                      {ui("clickTheCameraIconToUploadAPhoto")}
                    </p>
                  </div>
                </div>

                <Separator />

                <form className="space-y-5" onSubmit={handleSaveProfile}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">{ui("username")}</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder={ui("johnDoe")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={userEmail} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">{ui("organizationSchool")}</Label>
                      <Input
                        id="school"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        placeholder={ui("school123")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">{ui("grade")}</Label>
                      <Select value={grade} onValueChange={setGrade}>
                        <SelectTrigger>
                          <SelectValue placeholder={ui("selectYourGrade")} />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADES.map((g) => (
                            <SelectItem key={g.value} value={g.value}>
                              {ui("grade", {grade: g.value})}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about">{ui("aboutYou")}</Label>
                    <Textarea
                      id="about"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder={ui("brieflyDescribeYourGoalsAndPlans")}
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <p className="text-sm font-medium text-muted-foreground">{ui("competitivePlatforms")}</p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="codeforces">Codeforces</Label>
                      <Input
                        id="codeforces"
                        value={codeforces}
                        onChange={(e) => setCodeforces(e.target.value)}
                        placeholder={ui("codeforcesHandle")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leetcode">LeetCode</Label>
                      <Input
                        id="leetcode"
                        value={leetcode}
                        onChange={(e) => setLeetcode(e.target.value)}
                        placeholder={ui("leetcodeUsername")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
                    <Button type="submit" variant="gradient" className="w-full md:w-auto" disabled={saving}>
                      {saving ? (
                        <>
                          <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
                          {ui("saving")}
                        </>
                      ) : (
                        <>
                          <IconSave className="mr-2 h-4 w-4" />
                          {ui("saveProfile")}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="card-surface">
              <CardHeader className="space-y-1 p-6">
                <CardTitle className="text-2xl">{ui("changePassword")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <form className="space-y-5" onSubmit={handleChangePassword}>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{ui("currentPassword")}</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrent ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder={ui("enterCurrentPassword")}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent(!showCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showCurrent ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{ui("newPassword")}</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNew ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder={ui("atLeast6Characters")}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNew ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{ui("confirmPassword")}</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={ui("repeatNewPassword")}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirm ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
                    <Button type="submit" variant="gradient" className="w-full md:w-auto" disabled={changingPassword}>
                      {changingPassword ? (
                        <>
                          <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
                          {ui("changing")}
                        </>
                      ) : (
                        <>
                          <IconShield className="mr-2 h-4 w-4" />
                          {ui("changePassword2")}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="card-surface border-destructive/20">
              <CardHeader className="space-y-1 p-6">
                <CardTitle className="text-2xl text-destructive">{ui("accountDeletion")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <p className="text-sm text-muted-foreground">
                  {ui("requestAccountDeletionAConfirmationLinkWillBeSent")} </p>
                <DeleteAccountSection email={userEmail} uid={uid} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
