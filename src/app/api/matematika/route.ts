import { NextResponse } from "next/server"
import { getMatematikaDriveUrl } from "@/lib/matematika-blob"

export async function GET() {
  try {
    const driveUrl = await getMatematikaDriveUrl()
    return NextResponse.json({ driveUrl })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}