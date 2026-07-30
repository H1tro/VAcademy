import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"
import { DIFFICULTY_POINTS, type ExternalProblem, type Problem } from "@/lib/problems-data"

async function getExternalProblems(): Promise<ExternalProblem[]> {
  const db = getDb()
  const snap = await db.collection("externalProblems").get()
  return snap.docs.map((d) => d.data() as ExternalProblem)
}

async function getInternalProblems(): Promise<Problem[]> {
  const db = getDb()
  const snap = await db.collection("problems").get()
  return snap.docs.map((d) => d.data() as Problem)
}

function computeTotalScore(
  solvedIds: string[],
  internalProblems: Problem[],
  externalProblems: ExternalProblem[],
): number {
  const probMap = new Map<string, number>()
  for (const p of internalProblems) probMap.set(p.id, DIFFICULTY_POINTS[p.difficulty])
  for (const p of externalProblems) probMap.set(p.id, DIFFICULTY_POINTS[p.difficulty])

  return solvedIds.reduce((sum, id) => sum + (probMap.get(id) ?? 1), 0)
}

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

    const solvedProblems: string[] = safeBody.solvedProblems || []

    if (solvedProblems.length > 0) {
      const [internalProblems, externalProblems] = await Promise.all([
        getInternalProblems(),
        getExternalProblems(),
      ])
      safeBody.totalScore = computeTotalScore(solvedProblems, internalProblems, externalProblems)
    }

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
