import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get("uid")
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 })

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
    const body = await req.json()
    const uid = body.uid
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 })

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
