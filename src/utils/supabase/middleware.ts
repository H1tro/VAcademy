import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig, isSupabaseConfigured } from "./config";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  // Existing Firebase pages also work on deployments without Supabase env values.
  if (!isSupabaseConfigured()) return response;
  const { url, key } = getSupabaseConfig();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        const previousCookies = response.cookies.getAll();
        const previousCacheHeaders = ["cache-control", "expires", "pragma"].map(name => [name, response.headers.get(name)] as const);
        response = NextResponse.next({ request });
        previousCookies.forEach(cookie => response.cookies.set(cookie));
        previousCacheHeaders.forEach(([name, value]) => { if (value) response.headers.set(name, value); });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        // Session responses must not be cached and replayed to another visitor.
        Object.entries(headers ?? {}).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });
  // Creating a client alone does not refresh tokens. Never use getSession for authorization.
  await supabase.auth.getClaims();
  return response;
}

// Compatibility with the helper name in the supplied setup example.
export const createClient = updateSession;
