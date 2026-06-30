import { createBrowserClient } from "@supabase/ssr"

/**
 * Supabase client for use inside Client Components ("use client").
 * Reads the public URL + anon key from env vars — safe to expose to
 * the browser, access is governed by Row Level Security policies
 * (see supabase/schema.sql).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
