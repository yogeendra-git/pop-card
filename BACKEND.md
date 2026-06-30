# Backend — Supabase

This app now runs on real Supabase Auth + Postgres instead of the old
single-tenant JSON file store. Every signed-up student gets their own row
in `profiles`, their own `certificates` / `achievements` / `activity` rows,
and Row Level Security makes sure a user can only ever read or write their
own data through the API.

## Setup (one-time)

1. Create a project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor**, paste in
   `supabase/schema.sql` from this repo, and run it. This creates every
   table, the storage buckets (`avatars`, `certificates`, `achievements`),
   and a trigger that auto-creates a `profiles` row (with name/email/phone)
   the moment someone signs up.
3. Copy `.env.local.example` to `.env.local` and fill in your project's
   **Project URL** and **anon public key** (Project Settings → API).
4. (Optional) If you want the "Continue with Google" button on the login
   page to work, enable the Google provider under **Authentication →
   Providers** in Supabase and set the redirect URL to
   `<your-app-url>/auth/callback`.
5. `npm install && npm run dev`.

## Architecture

```
src/lib/supabase/client.ts    ← browser Supabase client ("use client" components)
src/lib/supabase/server.ts    ← server Supabase client (Server Components, Server Actions)
src/lib/supabase/middleware.ts← refreshes the session + protects /dashboard on every request
src/middleware.ts             ← wires the above into Next.js
src/lib/db.ts                 ← the only place that runs Supabase queries. Same exported
                                 function names as before (getStudent, addCertificate, …),
                                 now all `async` and scoped to the signed-in user.
src/lib/actions.ts            ← "use server" wrappers around db.ts, plus file uploads to
                                 Supabase Storage (avatar / certificate / achievement photos)
supabase/schema.sql           ← tables, RLS policies, storage buckets, the
                                 auto-create-profile-on-signup trigger
```

## What's real now

- **Sign up / Sign in**: `/auth/register` calls `supabase.auth.signUp`,
  `/auth/login` calls `supabase.auth.signInWithPassword` (plus Google OAuth
  via `signInWithOAuth`). Sessions are stored in cookies via `@supabase/ssr`
  and refreshed by `src/middleware.ts`, which also redirects signed-out
  visitors away from `/dashboard/*` and signed-in visitors away from
  `/auth/*`.
- **Every signed-up user's name, email, phone, and id is in Supabase**: the
  `handle_new_user` trigger in `supabase/schema.sql` writes a `profiles` row
  the instant `auth.users` gets a new row, copying `full_name` and `phone`
  out of the sign-up form's metadata and `email` from the auth record. Open
  **Table Editor → profiles** in Supabase to see it live.
- **Profile name on the public POP Card**: `/public/[username]` reads
  `fullName` straight from that user's `profiles` row (see
  `getPublicStudentByUsername` in `lib/db.ts`) — there's no hardcoded name
  anywhere in the dashboard or public card. Rename your profile and the new
  name appears immediately on your card and in the dashboard sidebar/header
  (`dashboard-layout-client.tsx` now takes `fullName`/`avatarUrl` as props
  from the real session instead of a fixed "Arjun Mehta" placeholder).
- **Photo uploads**: Profile photo, Certificate photo, and Achievement
  photo all upload to Supabase Storage (`avatars`, `certificates`,
  `achievements` buckets respectively) under a `<user-id>/...` path that
  storage RLS policies restrict to the owning user, and the public URL is
  saved on the row (`avatar_url` / `image_url`).
- **Certificates / Achievements / Education / Builder / Preferences /
  Verification / Profile views**: same as before, just backed by Postgres
  tables instead of a JSON file, and scoped per-user via RLS.

## What's still a placeholder

- **Recruiter Desk** (the second tab on the register page): still a
  "coming soon" panel — recruiter-role accounts are a separate phase, not
  wired to Supabase yet.
- **Settings → Security tab** (change password, active sessions): UI only.
  Wiring "Update Password" to `supabase.auth.updateUser({ password })` is a
  small follow-on if you want it next.
- **Settings → Delete Account**: confirms, but doesn't yet call
  `supabase.auth.admin.deleteUser` (that call needs the service-role key,
  which should run from a server route, not the browser — not added here to
  avoid shipping a service-role key path without you reviewing it first).
- **Resume download**: same as before — `window.print()` with a print
  stylesheet, no dedicated Resume Builder yet.

## Multi-tenant note

Every student now has fully separate data: sign up two different accounts
and you'll see two independent dashboards, two independent public POP Card
URLs (`custom_username` is unique per user, auto-generated from the name
on sign-up and editable in **POP Card Builder**), and two separate rows
in every table — nothing is shared except what each user explicitly makes
public via the `profile_public` / `show*` preference toggles.
