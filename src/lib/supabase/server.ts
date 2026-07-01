import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Supabase client for use inside Server Components, Server Actions, and
 * Route Handlers. Reads/writes the auth session via Next.js cookies so
 * the signed-in user is available on the server (e.g. inside `db.ts` and
 * `actions.ts`) without re-sending a token from the client on every call.
 *
 * Uses the getAll/setAll cookie API required by @supabase/ssr >=0.5.x.
 * The old get/set/remove pattern is deprecated and causes MIDDLEWARE_
 * INVOCATION_FAILED on Vercel's edge runtime with this version.
 *
 * setAll is wrapped in try/catch because Server Components can't write
 * cookies — session refresh is handled by middleware.ts instead.
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — session refresh is handled
            // by middleware.ts instead.
          }
        },
      },
    }
  )
}