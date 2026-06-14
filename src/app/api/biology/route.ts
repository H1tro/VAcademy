import { NextResponse } from "next/server"
import { getBiologyFilesList, getBiologyFileBlob } from "@/lib/biology-blob"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const file = url.searchParams.get("file")

    // if no file param — return list of files as JSON
    if (!file) {
      try {
        const items = await getBiologyFilesList()
        return new NextResponse(JSON.stringify({ files: items }), { status: 200, headers: { "Content-Type": "application/json" } })
      } catch (e) {
        return new NextResponse("Could not read files list", { status: 500 })
      }
    }

    if (file.includes("..") || file.includes("/")) return new NextResponse("Invalid filename", { status: 400 })

    const buffer = await getBiologyFileBlob(file)

    if (!buffer) return new NextResponse("Not found", { status: 404 })

    const headers = new Headers()
    headers.set("Content-Type", "application/pdf")
    headers.set("Content-Disposition", `inline; filename="${file.replace(/\"/g, "")}"`)

    return new NextResponse(buffer, { status: 200, headers })
  } catch (e) {
    return new NextResponse(String(e), { status: 500 })
  }
}
