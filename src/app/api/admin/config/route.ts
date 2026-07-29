import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"

const SUBJECTS = ["biology", "physics", "chemistry", "math", "cs"]

async function getConfig(subject: string) {
  const db = getDb()
  const snap = await db.doc(`admin_config/${subject}`).get()
  if (!snap.exists) return { subject, chatIds: [] }
  const data = snap.data()!
  let chatIds: number[] = []
  if (Array.isArray(data.chatIds)) {
    chatIds = data.chatIds as number[]
  } else if (data.chatId) {
    chatIds = [data.chatId as number]
  }
  return { subject, chatIds, updatedAt: data.updatedAt || null }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const subject = searchParams.get("subject")

    if (subject) {
      if (!SUBJECTS.includes(subject)) {
        return NextResponse.json({ error: "Invalid subject" }, { status: 400 })
      }
      return NextResponse.json(await getConfig(subject))
    }

    const results = await Promise.all(SUBJECTS.map(getConfig))
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { subject, chatId } = await req.json()
    if (!subject || !chatId) {
      return NextResponse.json({ error: "subject and chatId required" }, { status: 400 })
    }
    if (!SUBJECTS.includes(subject)) {
      return NextResponse.json({ error: "Invalid subject" }, { status: 400 })
    }

    const db = getDb()
    const ref = db.doc(`admin_config/${subject}`)
    const snap = await ref.get()
    if (!snap.exists) {
      await ref.set({ chatIds: [chatId], department: subject, updatedAt: new Date() })
    } else {
      await ref.update({ chatIds: FieldValue.arrayUnion(chatId), updatedAt: new Date() })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { subject, chatId } = await req.json()
    if (!subject || !chatId) {
      return NextResponse.json({ error: "subject and chatId required" }, { status: 400 })
    }
    if (!SUBJECTS.includes(subject)) {
      return NextResponse.json({ error: "Invalid subject" }, { status: 400 })
    }

    const db = getDb()
    const ref = db.doc(`admin_config/${subject}`)
    const snap = await ref.get()
    if (snap.exists) {
      const data = snap.data()!
      if (data.chatIds) {
        await ref.update({ chatIds: FieldValue.arrayRemove(chatId), updatedAt: new Date() })
      } else if (data.chatId === chatId) {
        await ref.update({ chatIds: [], chatId: 0, updatedAt: new Date() })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
