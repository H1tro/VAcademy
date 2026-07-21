import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) {
      return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not set" }, { status: 500 })
    }

    const { searchParams } = new URL(req.url)
    const baseUrl = searchParams.get("url") || process.env.NEXT_PUBLIC_BASE_URL
    if (!baseUrl) {
      return NextResponse.json({ error: "Provide ?url= or set NEXT_PUBLIC_BASE_URL" }, { status: 400 })
    }

    const webhookUrl = `${baseUrl.replace(/\/+$/, "")}/api/telegram/webhook`

    const res = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`,
      { method: "POST" }
    )
    const data = await res.json()

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
