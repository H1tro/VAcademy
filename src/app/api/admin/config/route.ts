import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"

const SUBJECTS = ["biology", "physics", "chemistry", "math", "cs"]

function fdb() { return getDb() }

async function getConfig(subject: string) {
  const snap = await getDoc(doc(fdb(), "admin_config", subject))
  if (!snap.exists()) return { subject, chatIds: [] }
  const data = snap.data()
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

    const ref = doc(fdb(), "admin_config", subject)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, { chatIds: [chatId], department: subject, updatedAt: new Date() })
    } else {
      await updateDoc(ref, { chatIds: arrayUnion(chatId), updatedAt: new Date() })
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

    const ref = doc(fdb(), "admin_config", subject)
    const snap = await getDoc(ref)
    if (snap.exists()) {
      const data = snap.data()
      if (data.chatIds) {
        await updateDoc(ref, { chatIds: arrayRemove(chatId), updatedAt: new Date() })
      } else if (data.chatId === chatId) {
        await updateDoc(ref, { chatIds: [], chatId: 0, updatedAt: new Date() })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
