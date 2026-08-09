import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"

interface CFSubmission {
  contestId: number
  problem: { contestId: number; index: string; name: string }
  verdict: string
}

interface CFTask {
  id: string
  uid: string
  contestId: number
  index: string
  name: string
  status: string
  attempts: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { uid } = body
    if (!uid) return NextResponse.json({ error: "uid required" }, { status: 400 })

    const db = getDb()

    const userSnap = await db.doc(`users/${uid}`).get()
    const userData = userSnap.data()
    const handle = userData?.codeforces
    if (!handle) return NextResponse.json({ error: "Codeforces handle not set in profile" }, { status: 400 })

    const tasksSnap = await db.collection("cf_tasks").where("uid", "==", uid).get()
    const tasks: CFTask[] = tasksSnap.docs.map((d) => ({ id: d.id, ...d.data() } as CFTask))
    if (tasks.length === 0) return NextResponse.json({ results: [] })

    const cfRes = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`)
    if (!cfRes.ok) return NextResponse.json({ error: "Codeforces API unavailable" }, { status: 502 })

    const cfData = await cfRes.json()
    if (cfData.status !== "OK") return NextResponse.json({ error: "Codeforces API error" }, { status: 502 })

    const submissions: CFSubmission[] = cfData.result

    const results = await Promise.all(
      tasks.map(async (task) => {
        const solved = submissions.some(
          (s) =>
            s.contestId === task.contestId &&
            s.problem.index === task.index &&
            s.verdict === "OK",
        )

        const taskSubmissions = submissions.filter(
          (s) => s.contestId === task.contestId && s.problem.index === task.index,
        )

        const newStatus = solved ? "completed" : "not_completed"
        const attempts = taskSubmissions.length

        if (newStatus !== task.status || attempts !== task.attempts) {
          await db.doc(`cf_tasks/${task.id}`).update({
            status: newStatus,
            attempts,
            lastChecked: FieldValue.serverTimestamp(),
          })
        }

        return {
          id: task.id,
          contestId: task.contestId,
          index: task.index,
          name: task.name,
          status: newStatus,
          attempts,
        }
      }),
    )

    return NextResponse.json({ results, handle })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
