import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig, isSupabaseConfigured } from "./config";

// Keep middleware network work bounded well below the Edge invocation limit.
const SUPABASE_FETCH_TIMEOUT_MS = 2_500;

async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit) {
  const timeoutSignal = AbortSignal.timeout(SUPABASE_FETCH_TIMEOUT_MS);
  const signal = init?.signal
    ? AbortSignal.any([timeoutSignal, init.signal])
    : timeoutSignal;

  return fetch(input, { ...init, signal });
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  try {
    // Existing Firebase pages also work on deployments without Supabase env values.
    if (!isSupabaseConfigured()) return response;

    const { url, key } = getSupabaseConfig();
    const supabase = createServerClient(url, key, {
      global: { fetch: fetchWithTimeout },
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
  } catch {
    // Middleware should not take down a page when Supabase is temporarily unavailable.
    // Protected data must still be authorized in the page/API/server layer.
    console.warn("[middleware] Supabase session check failed; continuing with the request.");
  }

  return response;
}

// Compatibility with the helper name in the supplied setup example.
export const createClient = updateSession;
