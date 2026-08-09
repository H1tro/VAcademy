import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required (e.g. 520A)" }, { status: 400 })

    const match = id.match(/^(\d+)([A-Z])$/i)
    if (!match) return NextResponse.json({ error: "Invalid format. Use: contestId + index (e.g. 520A)" }, { status: 400 })

    const contestId = parseInt(match[1])
    const index = match[2].toUpperCase()

    const res = await fetch("https://codeforces.com/api/problemset.problems", { next: { revalidate: 3600 } })
    if (!res.ok) return NextResponse.json({ error: "Codeforces API unavailable" }, { status: 502 })

    const data = await res.json()
    if (data.status !== "OK") return NextResponse.json({ error: "Codeforces API error" }, { status: 502 })

    const problem = data.result.problems.find(
      (p: { contestId: number; index: string }) => p.contestId === contestId && p.index === index,
    )

    if (!problem) return NextResponse.json({ error: `Problem ${contestId}${index} not found` }, { status: 404 })

    return NextResponse.json({
      contestId: problem.contestId,
      index: problem.index,
      name: problem.name,
      rating: problem.rating || null,
      tags: problem.tags || [],
      url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
