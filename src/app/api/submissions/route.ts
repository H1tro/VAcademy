import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"
import { FieldValue } from "firebase-admin/firestore"
import { problemsData, DIFFICULTY_POINTS } from "@/lib/problems-data"
import type { ProblemSubject } from "@/lib/problems-data"

const SUBJECT_PREFIX: Record<string, ProblemSubject> = {
  math: "mathematics",
  phys: "physics",
  inf: "informatics",
  chem: "chemistry",
  bio: "biology",
}

function getSubject(problemId: string): ProblemSubject | null {
  const prefix = problemId.split("-")[0]
  return SUBJECT_PREFIX[prefix] ?? null
}

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

    const problem = problemsData.find((p) => p.id === problemId)
    if (problem) {
      const userRef = db.doc(`users/${uid}`)
      const userSnap = await userRef.get()
      const userData = userSnap.data() || {}

      const solved: string[] = userData.solvedProblems || []
      if (!solved.includes(problemId)) {
        const xp = DIFFICULTY_POINTS[problem.difficulty] || 1
        const subject = getSubject(problemId)
        const subjectField = subject ? `subjectProgress.${subject}` : null

        const updates: Record<string, unknown> = {
          solvedProblems: FieldValue.arrayUnion(problemId),
          tasksSolved: FieldValue.increment(1),
          totalScore: FieldValue.increment(xp),
        }

        if (subjectField) {
          updates[subjectField] = FieldValue.increment(1)
        }

        await userRef.set(updates, { merge: true })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
