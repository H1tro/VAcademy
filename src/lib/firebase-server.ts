import admin from "firebase-admin"
import { getFirestore, type Firestore } from "firebase-admin/firestore"

let _db: Firestore | null = null

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || ""

function getDb(): Firestore {
  if (_db) return _db

  if (admin.getApps().length === 0) {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim()
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim()

    if (clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      })
    } else {
      admin.initializeApp({ projectId })
    }
  }

  _db = getFirestore()
  return _db
}

export { getDb }
