# POP Card — Digital Professional Identity Platform

> One Card. Every Achievement.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open browser
# http://localhost:3000
```

## Routes

| URL | Page |
|-----|------|
| `/` | Landing page |
| `/auth/login` | Login |
| `/auth/register` | Register |
| `/dashboard` | Dashboard (→ redirects here after login) |
| `/dashboard/profile` | Edit profile |
| `/dashboard/education` | Academic details |
| `/dashboard/certificates` | Manage certificates |
| `/dashboard/achievements` | Manage achievements |
| `/dashboard/verification` | Live camera verification |
| `/dashboard/builder` | POP Card builder |
| `/dashboard/settings` | Account settings |
| `/public/arjun-mehta` | Public POP Card (demo) |

## Tech Stack

- **Next.js 14** — App Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Lucide React** — Icons
- **qrcode.react** — QR code generation
- **Framer Motion** — Animations

## Notes

- Data is now real and persisted (see `BACKEND.md`) — a `data/store.json`
  file is created automatically on first run, seeded with the demo profile.
  Edits you make in the dashboard survive a server restart.
- Login/Register forms redirect to `/dashboard` directly — there's no real
  authentication yet (see `BACKEND.md` for what's stubbed and why).
- Demo public card: `http://localhost:3000/public/arjun-mehta`
- Toggle "Recruiter Mode" on the public card page for interview view
- See `DESIGN_SYSTEM.md` for the theming/token system and `BACKEND.md` for
  the data layer and production migration path (Postgres + Prisma)
