import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Only run on the routes that actually need an auth check:
     * /dashboard/* (must redirect signed-out users to /auth/login) and
     * /auth/* (must redirect already-signed-in users to /dashboard).
     *
     * Previously this ran on every single route — including the homepage,
     * marketing pages, and every background prefetch Next.js fires for
     * visible <Link>s — which meant a live network round-trip to Supabase
     * before ANY page could respond. That's what made every button/link
     * across the whole site feel slow. Scoping the matcher down removes
     * that unnecessary auth call everywhere it isn't needed.
     */
    "/dashboard/:path*",
    "/auth/:path*",
  ],
}