"use client"

import { useTranslations as useUITranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { IconSpinner, IconAlertTriangle } from "@/components/icons"

function DeleteAccountContent() {
  const ui = useUITranslations("ui");
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const uid = searchParams.get("uid")

  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  if (!token || !uid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <IconAlertTriangle className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">{ui("invalidLink")}</h1>
          <p className="text-muted-foreground">{ui("theAccountDeletionLinkIsInvalid")}</p>
          <Button onClick={() => router.push("/")}>{ui("goHome")}</Button>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-full bg-mint/10 flex items-center justify-center">
            <span className="text-mint text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold">{ui("accountDeleted")}</h1>
          <p className="text-muted-foreground">{ui("yourAccountAndAllDataHaveBeenDeleted")}</p>
          <Button onClick={() => router.push("/")}>{ui("goHome")}</Button>
        </div>
      </div>
    )
  }

  const handleDelete = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/account/confirm-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, uid }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || ui("couldNotDeleteAccount2"))
      }

      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : ui("couldNotDeleteAccount"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          <IconAlertTriangle className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="text-2xl font-bold">{ui("accountDeletion")}</h1>
          <p className="text-muted-foreground">
            {ui("thisActionIsIrreversibleYourProfileSolutionsProgressAnd")}
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive text-center">{error}</div>
        )}

        <div className="flex flex-col gap-3">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <IconSpinner className="mr-2 h-4 w-4 animate-spin" />
                {ui("deleting")}
              </>
            ) : (
              ui("yesDeleteAccount")
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/")}
            disabled={loading}
          >
            {ui("cancel")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DeleteAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <IconSpinner className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    }>
      <DeleteAccountContent />
    </Suspense>
  )
}
