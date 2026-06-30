import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * Handles the redirect back from Supabase OAuth providers (e.g. Google,
 * see the "Continue with Google" button on /auth/login). Exchanges the
 * one-time `code` for a real session, then sends the user on to the
 * dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
