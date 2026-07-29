import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-server"

const SUBJECT_PREFIXES: Record<string, string> = {
  math: "mathematics",
  phys: "physics",
  inf: "informatics",
  chem: "chemistry",
  bio: "biology",
}

function getSubjectFromId(id: string): string {
  const prefix = id.split("-")[0]
  return SUBJECT_PREFIXES[prefix] || "other"
}

export async function GET() {
  try {
    const db = getDb()
    const usersSnap = await db.collection("users").orderBy("tasksSolved", "desc").get()

    const leaderboard: Record<string, unknown>[] = []
    for (const doc of usersSnap.docs) {
      const data = doc.data()
      const solvedProblems: string[] = (data.solvedProblems as string[]) || []
      const solvedSubjects: Record<string, number> = {}

      for (const id of solvedProblems) {
        const s = getSubjectFromId(id)
        solvedSubjects[s] = (solvedSubjects[s] || 0) + 1
      }

      const displayName = (data.displayName as string) || ((data.email as string)?.split("@")[0]) || "Ученик"

      leaderboard.push({
        uid: doc.id,
        displayName,
        photoURL: (data.photoURL as string) || "",
        tasksSolved: Number(data.tasksSolved ?? 0),
        solvedSubjects,
      })
    }

    return NextResponse.json(leaderboard)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
