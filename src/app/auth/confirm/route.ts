import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const recovery = type === "recovery";
  if (tokenHash && (type === "email" || recovery)) {
    const client = createClient(await cookies());
    const { error } = await client.auth.verifyOtp({ type: recovery ? "recovery" : "email", token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL(recovery ? "/reset-password" : "/dashboard", url.origin), { headers: { "Cache-Control": "private, no-store" } });
  }
  return NextResponse.redirect(new URL(recovery ? "/forgot-password?recovery=failed" : "/resend-confirmation?confirmation=failed", url.origin), { headers: { "Cache-Control": "private, no-store" } });
}
