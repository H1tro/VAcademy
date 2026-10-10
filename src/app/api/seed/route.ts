import { requestAdmin } from "@/lib/server-auth"
import { getDb } from "@/lib/database"
import { problemsData } from "@/lib/problems-data"

export async function POST(req: Request) {
  if (!await requestAdmin(req)) return Response.json({ error: "Forbidden" }, { status: 403 })
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
