import { NextResponse } from "next/server"
import { LRUCache } from "lru-cache"

type Platform = "codeforces" | "leetcode"

const cache = new LRUCache<string, boolean>({ max: 1000, ttl: 60_000 })

async function checkCodeforces(handle: string, externalId: string): Promise<boolean> {
  const cacheKey = `cf:${handle}:${externalId}`
  const cached = cache.get(cacheKey)
  if (cached !== undefined) return cached

  const url = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=50`
  const res = await fetch(url)
  if (!res.ok) return false

  const data = await res.json()
  if (data.status !== "OK") return false

  const [contestId, index] = externalId.split("/")

  const solved = (data.result as any[]).some(
    (s: any) =>
      s.verdict === "OK" &&
      String(s.problem.contestId) === contestId &&
      s.problem.index === index,
  )

  cache.set(cacheKey, solved)
  return solved
}

async function checkLeetcode(username: string, titleSlug: string): Promise<boolean> {
  const cacheKey = `lc:${username}:${titleSlug}`
  const cached = cache.get(cacheKey)
  if (cached !== undefined) return cached

  const query = `
    query ($username: String!) {
      matchedUser(username: $username) {
        submitStats { acSubmissionNum { count } }
        recentSubmissionList { title titleSlug status }
      }
    }
  `

  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { username } }),
  })
  if (!res.ok) return false

  const data = await res.json()
  const submissions = data?.data?.matchedUser?.recentSubmissionList
  if (!Array.isArray(submissions)) return false

  const solved = submissions.some(
    (s: any) =>
      s.status === "AC" && s.titleSlug.toLowerCase() === titleSlug.toLowerCase(),
  )

  cache.set(cacheKey, solved)
  return solved
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { platform, externalId, handle, leetcodeUsername } = body as {
      platform: Platform
      externalId: string
      handle?: string
      leetcodeUsername?: string
    }

    if (!platform || !externalId) {
      return NextResponse.json({ error: "platform and externalId required" }, { status: 400 })
    }

    let solved = false

    if (platform === "codeforces") {
      if (!handle) return NextResponse.json({ error: "handle required for codeforces" }, { status: 400 })
      solved = await checkCodeforces(handle, externalId)
    } else if (platform === "leetcode") {
      if (!leetcodeUsername) return NextResponse.json({ error: "leetcodeUsername required" }, { status: 400 })
      solved = await checkLeetcode(leetcodeUsername, externalId)
    } else {
      return NextResponse.json({ error: "unknown platform" }, { status: 400 })
    }

    return NextResponse.json({ solved })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
