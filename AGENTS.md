# AGENTS.md

## Project Overview

This repo contains the pre-sign-off V1 prototype for `swag.`, a scroll-driven single-page brand site for Marcus. It is a quiet, type-led digital gallery for `Wearable Editions`, not an ecommerce store.

Before making changes, read `AGENT_CONTEXT.md`. It is the highest-priority project context file.

## Source Of Truth

Use this order when files conflict:

1. `AGENT_CONTEXT.md`
2. `cursor.md/design.md`
3. `cursor.md/brand-copy.md`
4. `cursor.md/marcus-signoff-checklist.md`
5. `cursor.md/marcus-review-packet.md`
6. `cursor.md/swag_website_v1_prd.md`

The PRD is older background. Newer docs win.

## Setup Commands

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Development Workflow

- Use npm; `package-lock.json` is present.
- This is a Next.js App Router project with TypeScript and Tailwind CSS.
- Do not re-run `create-next-app` over the existing app.
- Keep all public preview work on Vercel preview/protected deployments until Marcus signs off.
- Do not add analytics until the provider is chosen.
- Do not assign a custom production domain before Marcus sign-off.

## Design Rules

- Use only the four brand colours: Void Black `#0A0A0A`, Stone Grey `#575D61`, Clay `#8C5E4A`, Sand `#D6D1C4`.
- Use Instrument Sans 400 / 500 / 700.
- Build sections as typographic posters with `min-height: 100dvh`, not fixed viewport traps.
- Let display type bleed off edges intentionally.
- Use text links only for CTAs. No button containers, pills, cards, rounded layout blocks, gradients, stock ecommerce patterns, or generic SaaS sections.
- Respect reduced motion. Static composition must still work without animation.

## Current Architecture

- `app/layout.tsx` - metadata shell and providers.
- `app/page.tsx` - renders all nine sections.
- `app/globals.css` - CSS variables and section composition styles.
- `components/providers/LenisProvider.tsx` - Lenis smooth scroll.
- `components/motion/*` - GSAP/scroll infrastructure.
- `components/sections/*` - section components.
- `components/ui/*` - reusable UI primitives.
- `lib/copy.ts` - copy source.
- `lib/sections.config.ts` - section order and colours.
- `lib/motion.config.ts` - animation constants.
- `stitch/` - Stitch design handoff.
- `cursor.md/` - project documentation and review packets.

## Testing And Verification

No unit/e2e test runner is configured yet. Before finishing code changes, run:

```bash
npm run lint
npm run build
```

After UI edits, use a browser preview or Playwright-style visual check where possible.

## Deployment

Use Vercel preview only until Marcus signs off.

Current known deployment is documented in `AGENT_CONTEXT.md` and `cursor.md/marcus-review-packet.md`. Anonymous access may be blocked by Vercel protection; do not treat the login screen as an app build failure without checking Vercel.

## Agent Notes

- Keep `AGENT_CONTEXT.md` updated when project state changes.
- Do not overwrite the current implementation with an older scaffold-only prompt.
- If a future prompt says the repo has only docs/assets, verify the current tree first; that statement is now stale.
- Preserve user or agent changes in a dirty working tree. Do not revert unrelated files.
