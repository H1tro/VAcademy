import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  if (tokenHash && url.searchParams.get("type") === "email") {
    const client = createClient(await cookies());
    const { error } = await client.auth.verifyOtp({ type: "email", token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL("/dashboard", url.origin));
  }
  return NextResponse.redirect(new URL("/login?confirmation=failed", url.origin));
}
