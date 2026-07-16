import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { problemsData } from "@/lib/problems-data"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || "",
}

export async function GET() {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
  const db = getFirestore(app)

  let seeded = 0
  let errors: string[] = []

  for (const problem of problemsData) {
    try {
      await setDoc(doc(db, "problems", problem.id), problem)
      seeded++
    } catch (err) {
      errors.push(`${problem.id}: ${err instanceof Error ? err.message : "unknown error"}`)
    }
  }

  return Response.json({
    success: errors.length === 0,
    seeded,
    total: problemsData.length,
    errors: errors.length > 0 ? errors : undefined,
  })
}
