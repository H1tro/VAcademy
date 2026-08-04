import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { uid, problemId, platform, solution, imageUrl } = body
    if (!uid || !problemId) return NextResponse.json({ error: "uid and problemId required" }, { status: 400 })

    const db = getDb()
    await db.collection("submissions").add({
      uid,
      problemId,
      platform: platform || "internal",
      solution: solution || "",
      imageUrl: imageUrl || "",
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
