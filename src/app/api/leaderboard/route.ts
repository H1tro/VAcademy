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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject")

    const db = getDb()
    const usersSnap = await db.collection("users").get()

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
      const totalScore = Number(data.totalScore ?? 0)
      const subjectScore = subject ? (solvedSubjects[subject] ?? 0) : 0

      if (subject && subjectScore === 0) continue

      leaderboard.push({
        uid: doc.id,
        displayName,
        photoURL: (data.photoURL as string) || "",
        tasksSolved: Number(data.tasksSolved ?? 0),
        totalScore,
        subjectScore,
        solvedSubjects,
      })
    }

    leaderboard.sort((a, b) => (b.totalScore as number) - (a.totalScore as number))

    return NextResponse.json(leaderboard)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
