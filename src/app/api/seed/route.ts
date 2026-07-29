import { getDb } from "@/lib/firebase-server"
import { problemsData } from "@/lib/problems-data"

export async function GET() {
  const db = getDb()

  let seeded = 0
  let errors: string[] = []

  for (const problem of problemsData) {
    try {
      await db.doc(`problems/${problem.id}`).set(problem)
      seeded++
    } catch (err) {
      errors.push(`${problem.id}: ${err instanceof Error ? err.message : "unknown error"}`)
    }
  }

  return Response.json({
    success: errors.length === 0,
    seeded,
    total: problemsData.length,
    errors: errors.length > 0 ? errors : undefined,
  })
}
