import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let _db: Firestore | null = null

function getDb(): Firestore {
  if (_db) return _db

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || process.env.FIREBASE_PROJECT_ID?.trim() || ""
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim() || ""
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY?.trim() || "").replace(/\\n/g, "\n")

  if (getApps().length === 0) {
    if (clientEmail && privateKey && projectId) {
      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      })
    } else {
      initializeApp({ projectId: projectId || undefined })
    }
  }

  _db = getFirestore()
  return _db
}

export { getDb }
