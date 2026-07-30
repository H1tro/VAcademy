import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"
import { DIFFICULTY_POINTS, type ExternalProblem, type Problem } from "@/lib/problems-data"
import { LRUCache } from "lru-cache"

const statusCache = new LRUCache<string, any[]>({ max: 100, ttl: 300_000 })

async function fetchCFStatus(handle: string): Promise<any[]> {
  const cacheKey = `cf:status:${handle}`
  const cached = statusCache.get(cacheKey)
  if (cached) return cached

  const url = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&count=10000`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Codeforces API error: ${res.status}`)

  const data = await res.json()
  if (data.status !== "OK") throw new Error(`Codeforces API: ${data.comment || "unknown error"}`)

  statusCache.set(cacheKey, data.result)
  return data.result
}

export async function POST(req: Request) {
  try {
    const { uid } = await req.json()
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 })

    const db = getDb()
    const userSnap = await db.doc(`users/${uid}`).get()
    if (!userSnap.exists) return NextResponse.json({ error: "user not found" }, { status: 404 })

    const userData = userSnap.data()!
    const handle = userData.codeforcesHandle as string | undefined
    if (!handle) return NextResponse.json({ error: "codeforcesHandle not set" }, { status: 400 })

    const [extSnap, intSnap] = await Promise.all([
      db.collection("externalProblems").get(),
      db.collection("problems").get(),
    ])

    const cfProblems = extSnap.docs
      .map((d) => d.data() as ExternalProblem)
      .filter((p) => p.platform === "codeforces")

    if (cfProblems.length === 0) return NextResponse.json({ synced: 0, totalScore: userData.totalScore || 0 })

    const idByIndex = new Map<string, string>()
    for (const p of cfProblems) idByIndex.set(p.externalId, p.id)

    const submissions = await fetchCFStatus(handle)
    const syncedIds = new Set<string>()
    for (const sub of submissions) {
      if (sub.verdict !== "OK") continue
      const index: string = sub.problem?.index
      if (!index) continue
      const mapped = idByIndex.get(index)
      if (mapped) syncedIds.add(mapped)
    }

    const currentSolved: string[] = (userData.solvedProblems as string[]) || []
    const existingSet = new Set(currentSolved)
    let added = 0
    for (const id of syncedIds) {
      if (!existingSet.has(id)) {
        currentSolved.push(id)
        added++
      }
    }

    if (added === 0) return NextResponse.json({ synced: 0, totalScore: userData.totalScore || 0 })

    const pointsMap = new Map<string, number>()
    for (const p of intSnap.docs) pointsMap.set(p.id, DIFFICULTY_POINTS[(p.data() as Problem).difficulty])
    for (const p of extSnap.docs) pointsMap.set(p.id, DIFFICULTY_POINTS[(p.data() as ExternalProblem).difficulty])
    const totalScore = currentSolved.reduce((sum, id) => sum + (pointsMap.get(id) ?? 1), 0)

    await db.doc(`users/${uid}`).set(
      {
        solvedProblems: currentSolved,
        tasksSolved: currentSolved.length,
        totalScore,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    return NextResponse.json({ synced: added, totalScore })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
