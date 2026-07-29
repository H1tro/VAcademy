import { NextResponse } from "next/server"
import { getApps, initializeApp, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"

async function getUidFromRequest(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return null
  const token = authHeader.slice(7)

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || process.env.FIREBASE_PROJECT_ID?.trim() || ""
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim() || ""
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY?.trim() || "").replace(/\\n/g, "\n")

  if (getApps().length === 0) {
    if (clientEmail && privateKey && projectId) {
      initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
    } else {
      initializeApp({ projectId })
    }
  }

  try {
    const decoded = await getAuth().verifyIdToken(token)
    return decoded.uid
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  try {
    const uid = await getUidFromRequest(req)
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const db = getDb()
    const snap = await db.doc(`users/${uid}`).get()
    if (!snap.exists) return NextResponse.json({})

    return NextResponse.json(snap.data())
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const uid = await getUidFromRequest(req)
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()

    const { createdAt: _, updatedAt: __, ...safeBody } = body

    const db = getDb()
    const snap = await db.doc(`users/${uid}`).get()

    await db.doc(`users/${uid}`).set(
      {
        ...safeBody,
        uid,
        createdAt: snap.exists ? (snap.data()!.createdAt || FieldValue.serverTimestamp()) : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
