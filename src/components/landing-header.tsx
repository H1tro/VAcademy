"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Atom, LogOut } from "lucide-react"

export function LandingHeader() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Гость"
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((token: string) => token[0].toUpperCase())
    .join("") || "Г"

  const handleSignOut = async () => {
    await signOut(auth)
    router.push("/")
  }

  return (
    <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full border-b border-border/10">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-[#26A3E5] flex items-center justify-center">
          <Atom className="text-white h-6 w-6" />
        </div>
        <span className="text-2xl font-headline font-bold tracking-tight text-[#26A3E5]">VAcademi</span>
      </Link>
      <div className="flex items-center gap-4">
        {loading ? null : user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Avatar className="h-6 w-6">
                {user.photoURL ? <AvatarImage src={user.photoURL} /> : <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>}
              </Avatar>
              {displayName}
            </Link>
            <Link href="/dashboard">
              <Button className="bg-[#26A3E5] hover:bg-[#26A3E5]/90">
                Дашборд
              </Button>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/20 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors"
              title="Выйти"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/login">Войти</Link>
            </Button>
            <Button className="bg-[#26A3E5] hover:bg-[#26A3E5]/90" asChild>
              <Link href="/register">Регистрация</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}
