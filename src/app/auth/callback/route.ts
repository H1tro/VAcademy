import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const recovery = url.searchParams.get("next") === "/reset-password";
  if (code) {
    const { error } = await createClient(await cookies()).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(recovery ? "/reset-password" : "/dashboard", url.origin), { headers: { "Cache-Control": "private, no-store" } });
  }
  return NextResponse.redirect(new URL(recovery ? "/forgot-password?recovery=failed" : "/resend-confirmation?confirmation=failed", url.origin), { headers: { "Cache-Control": "private, no-store" } });
}
