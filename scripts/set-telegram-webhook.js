const https = require("https")

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL

if (!BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN not set in environment")
  process.exit(1)
}
if (!WEBHOOK_URL) {
  console.error("❌ TELEGRAM_WEBHOOK_URL not set — pass the full URL e.g. https://sixseven.vercel.app/api/telegram/webhook")
  process.exit(1)
}

const body = JSON.stringify({ url: WEBHOOK_URL })

const req = https.request(
  `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
  { method: "POST", headers: { "Content-Type": "application/json" } },
  (res) => {
    let data = ""
    res.on("data", (chunk) => (data += chunk))
    res.on("end", () => {
      const result = JSON.parse(data)
      if (result.ok) {
        console.log(`✅ Webhook set to: ${WEBHOOK_URL}`)
      } else {
        console.error(`❌ Failed: ${result.description}`)
      }
    })
  }
)

req.write(body)
req.end()