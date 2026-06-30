import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

/**
 * Supabase client for use inside Server Components, Server Actions, and
 * Route Handlers. Reads/writes the auth session via Next.js cookies so
 * the signed-in user is available on the server (e.g. inside `db.ts` and
 * `actions.ts`) without re-sending a token from the client on every call.
 *
 * Server Components can't write cookies, so the `set`/`remove` calls are
 * wrapped in try/catch — they're a no-op there and instead get refreshed
 * by `src/middleware.ts` on every request.
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Called from a Server Component — session refresh is handled
            // by middleware.ts instead.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch {
            // Same as above.
          }
        },
      },
    }
  )
}
