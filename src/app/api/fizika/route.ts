import { NextResponse } from "next/server"
import { getFizikaFilesList, getFizikaFileBlob } from "@/lib/fizika-blob"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const file = url.searchParams.get("file")

    // if no file param — return list of files as JSON
    if (!file) {
      try {
        const items = await getFizikaFilesList()
        return new NextResponse(JSON.stringify({ files: items }), { status: 200, headers: { "Content-Type": "application/json" } })
      } catch (e) {
        return new NextResponse("Could not read files list", { status: 500 })
      }
    }

    if (file.includes("..") || file.includes("/")) return new NextResponse("Invalid filename", { status: 400 })

    const buffer = await getFizikaFileBlob(file)

    if (!buffer) return new NextResponse("Not found", { status: 404 })

    const headers = new Headers()
    headers.set("Content-Type", "application/pdf")
    headers.set("Content-Disposition", `inline; filename="${file.replace(/\"/g, "")}"`)

    return new NextResponse(new Uint8Array(buffer), { status: 200, headers })
  } catch (e) {
    return new NextResponse(String(e), { status: 500 })
  }
}
