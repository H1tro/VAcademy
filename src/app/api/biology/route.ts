import fs from "fs"
import path from "path"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const file = url.searchParams.get("file")
    const dir = path.join(process.cwd(), "src", "lib", "Biology")
    // if no file param — return list of files as JSON
    if (!file) {
      try {
        const items = fs.readdirSync(dir)
        return new NextResponse(JSON.stringify({ files: items }), { status: 200, headers: { "Content-Type": "application/json" } })
      } catch (e) {
        return new NextResponse("Could not read directory", { status: 500 })
      }
    }

    if (file.includes("..") || file.includes("/")) return new NextResponse("Invalid filename", { status: 400 })

    const filePath = path.join(dir, file)

    if (!fs.existsSync(filePath)) return new NextResponse("Not found", { status: 404 })

    const buffer = fs.readFileSync(filePath)
    const headers = new Headers()
    headers.set("Content-Type", "application/pdf")
    headers.set("Content-Disposition", `inline; filename="${file.replace(/\"/g, "")}"`)

    return new NextResponse(buffer, { status: 200, headers })
  } catch (e) {
    return new NextResponse(String(e), { status: 500 })
  }
}
