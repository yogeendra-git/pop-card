# Design System — Theming Foundation

This app now uses a token-driven theme system instead of hardcoded colors.
Everything below is wired through CSS variables in `src/app/globals.css` and
exposed as Tailwind classes in `tailwind.config.js`.

## How it works

1. `globals.css` defines HSL triplets for every token, once under `:root`
   (light) and once under `.dark` (dark).
2. `tailwind.config.js` maps each token to a Tailwind color, e.g.
   `primary: "hsl(var(--primary) / <alpha-value>)"`.
3. `next-themes` (see `src/components/theme-provider.tsx`) toggles the
   `.dark` class on `<html>`. Every component automatically repaints —
   **no `dark:` variants needed** for tokenized colors.
4. `<ThemeToggle />` (`src/components/theme-toggle.tsx`) is the global
   Light / Dark / System switcher. It's already wired into the landing
   page nav and the dashboard header.

## Tokens → Tailwind classes

| Purpose | Class | Light | Dark |
|---|---|---|---|
| Page background | `bg-background` | `#FFFFFF` | `#020617` |
| Section/secondary surface | `bg-surface` | `#F8FAFC` | `#0F172A` |
| Card / elevated panel | `bg-card` | `#FFFFFF` | `#0F172A` |
| Body text | `text-foreground` | `#0F172A` | `#F8FAFC` |
| Secondary text | `text-muted-foreground` | slate-500-ish | slate-400-ish |
| Borders | `border-border` | `#E2E8F0` | `#1E293B` |
| Brand / CTAs | `bg-primary` / `text-primary` | `#4F46E5` | `#6366F1` |
| Decorative accent (gradients) | `bg-secondary` | violet | violet (lighter) |
| Verified / success states | `bg-success` / `text-success` | `#10B981` | `#10B981` |
| Pending states | `bg-warning` / `text-warning` | amber | amber |
| "In review" states | `bg-info` / `text-info` | blue | blue |
| Rejected / destructive | `bg-destructive` / `text-destructive` | red | red |

All of the above support Tailwind opacity modifiers, e.g. `bg-primary/10`,
`border-destructive/20`.

## Typography scale

`text-hero`, `text-heading`, `text-subheading`, `text-body`, `text-caption`
are registered in `tailwind.config.js` (`theme.extend.fontSize`). Pair with
a weight utility, e.g. `className="text-hero font-extrabold tracking-tight"`.

Font is Inter, loaded via `next/font/google` in `src/app/layout.tsx` and
exposed as the CSS variable `--font-inter` → `font-sans`.

## Rules going forward

- **Never** use raw Tailwind palette classes (`slate-900`, `indigo-600`,
  `emerald-500`, etc.) or a manual `dark:` pair for color. Use a semantic
  token instead — if the right one doesn't exist yet, add it to both the
  `:root` and `.dark` blocks in `globals.css`, not inline in a component.
- `.glass` (in `globals.css`) is intentionally reserved for hero/feature
  moments only — most cards should just use `bg-card border border-border`.

## What changed in this pass

- `tailwind.config.js` — full semantic token system (was hardcoded hex
  for `background`/`foreground`/`primary`, no `surface`/`success`/`warning`
  /`info` tokens, no opacity-modifier support).
- `globals.css` — token values now match the POP Card brand spec exactly,
  plus a `@layer base` reset so `body` inherits `bg-background text-foreground`.
- `next-themes` is now actually wired in (`theme-provider.tsx`), with a
  working `<ThemeToggle />`. Previously the dependency was installed but
  unused — dark mode did not work at all.
- Every page under `src/app` had its hardcoded `slate-*`/`indigo-*`/etc.
  classes migrated to semantic tokens.
- Fixed two unrelated pre-existing bugs found during the build verification
  pass: `autoprefixer` was referenced in `postcss.config.js` but missing
  from `package.json` (the app couldn't actually build before this), and
  `next` was pinned to a version with a known security advisory (bumped
  `14.2.5` → `14.2.35`, same major version, low risk).

## Recommended next phases

The product spec calls for a much larger platform (Postgres + Prisma,
Auth.js, role-based portals, verification workflows, employability scoring,
resume export, recruiter search). Suggested order, each as its own pass:

1. Prisma schema + database models (replacing `src/lib/mockData.ts`)
2. Auth.js + role-based access control
3. Student profile builder + public POP Card wired to real data
4. Verification workflow + employability score engine
5. Resume builder (PDF export)
6. Recruiter / College / Admin portals
7. Next.js 15 upgrade (separate from this pass — touches routing/async
   request APIs and deserves its own test cycle)
