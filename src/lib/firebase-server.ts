import { initializeApp, getApps } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || "",
}

function getFirebaseApp() {
  if (!getApps().length) {
    initializeApp(firebaseConfig)
  }
  return getApps()[0]
}

export const app = getFirebaseApp()
export const db: Firestore = getFirestore(app)
