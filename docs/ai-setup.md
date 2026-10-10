# AI assistant (Groq)

Vercel Environment Variables:

- `GROQ_API_KEY`: Secret, valid Groq API key with permission to use the selected model.
- `GROQ_MODEL`: Config, `openai/gpt-oss-20b` by default. Check availability and project permissions in Groq. The previously used `llama-3.3-70b-versatile` is now listed as Enterprise; an existing environment override must be changed if the project does not have access.
- Set variables for Production and Preview if both environments need AI. Redeploy after changing them.

The public GET `/api/ai/olympiad` only checks whether a key is present; `configured: true` does not verify its validity or model access.

POST error codes: `invalid_key` (Groq 401), `permission_denied` (403), `configuration_error` (400/404), `rate_limited` (429), `timeout` and `provider_unavailable`. Configuration errors require checking the key, model and project permissions. Limits require checking usage in Groq. Vercel function logs include only provider status or failure category, never prompts, keys or raw provider responses.

Official references: https://console.groq.com/docs/models and https://console.groq.com/docs/errors.
