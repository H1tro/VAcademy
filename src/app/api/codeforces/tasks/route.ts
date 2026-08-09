import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get("uid")
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 })

    const db = getDb()
    const snap = await db.collection("cf_tasks").where("uid", "==", uid).get()
    const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { uid, contestId, index, name, rating, tags, url } = body
    if (!uid || !contestId || !index) {
      return NextResponse.json({ error: "uid, contestId, index required" }, { status: 400 })
    }

    const db = getDb()

    const existing = await db
      .collection("cf_tasks")
      .where("uid", "==", uid)
      .where("contestId", "==", contestId)
      .where("index", "==", index)
      .get()

    if (!existing.empty) {
      return NextResponse.json({ error: "Task already assigned" }, { status: 409 })
    }

    const doc = await db.collection("cf_tasks").add({
      uid,
      contestId,
      index,
      name: name || "",
      rating: rating || null,
      tags: tags || [],
      url: url || `https://codeforces.com/problemset/problem/${contestId}/${index}`,
      status: "not_completed",
      attempts: 0,
      lastChecked: null,
      createdAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ id: doc.id, success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    const db = getDb()
    await db.doc(`cf_tasks/${id}`).delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
