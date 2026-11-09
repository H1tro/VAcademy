import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch {
    // Last-resort fallback if middleware setup itself fails unexpectedly.
    console.warn("[middleware] Unexpected failure; continuing with the request.");
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: ["/((?!api(?:/|$)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|pdf|css|js|map|woff2?|ttf)$).*)"],
};
