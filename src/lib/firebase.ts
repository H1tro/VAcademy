import { initializeApp, getApps } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || "",
};

function ensureApp() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}

export const auth = new Proxy({} as Auth, {
  get(_, prop) {
    ensureApp();
    return (getAuth() as any)[prop];
  },
});

export const db = new Proxy({} as Firestore, {
  get(_, prop) {
    ensureApp();
    return (getFirestore() as any)[prop];
  },
});
