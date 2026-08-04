import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(req: Request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN || process.env.VAcademy_READ_WRITE_TOKEN
    if (!token) {
      return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN is not set" }, { status: 500 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `avatars/${Date.now()}-${file.name}`

    const blob = await put(filename, buffer, {
      access: "public",
      contentType: file.type,
      token,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
