# SWAG Agent Context

Read this before executing any step in this repository. If this file conflicts with an older prompt, `AGENT_CONTEXT.md` wins.

## Project Status

This is the pre-sign-off prototype for `swag.`, a scroll-driven single-page brand site for Marcus.

The repository is no longer docs/assets only. Phases 1-5 of the pre-sign-off plan have already been implemented:

- Stitch handoff exists in `stitch/`.
- Design token sources exist in `lib/`.
- Next.js + TypeScript + Tailwind scaffold exists.
- Nine static section shells exist and render from `app/page.tsx`.
- Lenis smooth scroll and GSAP reveal/background infrastructure are wired.
- Vercel deployment has succeeded, but anonymous access is protected by Vercel authentication.

Do not restart from a blank scaffold. Work with the current app.

## Canonical Source Order

1. `AGENT_CONTEXT.md` - current project state and agent rules.
2. `cursor.md/design.md` - visual identity, section structure, colour map, animation rules.
3. `cursor.md/brand-copy.md` - manifesto, raw copy, confirmed V1 scope, open questions.
4. `cursor.md/marcus-signoff-checklist.md` - decisions needed from Marcus.
5. `cursor.md/marcus-review-packet.md` - current review links and review checklist.
6. `cursor.md/swag_website_v1_prd.md` - older PRD. Use only for background where newer docs are silent.

Where newer docs conflict with the PRD, newer docs win.

## Brand Direction

- Brand: `swag.`
- Handle: `@crosswithswag`
- Current tagline: `WEARABLE EDITIONS` (Draft 1, pending Marcus lock)
- Creative director: Marcus, credited as `the director.`
- Site type: continuous-scroll digital gallery, not ecommerce.
- Tone: quiet, type-led, editorial, non-commercial, no over-explaining.

The site should feel like a sequence of typographic posters, not a product landing page.

## Locked Structure

The V1 site has nine sections:

1. Hero / Landing - Void Black `#0A0A0A`
2. Manifesto - Void Black `#0A0A0A`
3. "What is SWAG?" - Authentic Expression - Void Black `#0A0A0A`
4. "What is SWAG?" - Internal Authority - Muted Sand `#D6D1C4`
5. "What is SWAG?" - Presence - Stone Grey `#575D61`
6. `kloofstreetnights - Wearable Edition` - Deep Earth / Clay `#8C5E4A`
7. "What is SWAG?" - Density / Weight - Stone Grey `#575D61`
8. Closing Statement - Void Black `#0A0A0A`
9. Footer - Void Black `#0A0A0A`

Confirmed colour sequence:

`Black -> Black -> Black -> Sand -> Stone -> Clay -> Stone -> Black`

## Design Rules

- Use only the four brand colours: Void Black, Stone Grey, Clay, Sand.
- Use Instrument Sans 400 / 500 / 700.
- Display type is uppercase, tight tracked, and allowed to bleed off section edges.
- Sections use `min-height: 100dvh`; avoid fixed `h-screen` patterns.
- Sections should allow growth on mobile where content needs it, especially manifesto.
- Use `overflow: hidden` on poster sections for bleed type.
- Ghost/watermark layers are oversized, absolute, low opacity, and behind foreground content.
- CTAs are text links only. No button containers, pills, rounded blocks, or card UI.
- No gradients, stock ecommerce layout, sale language, generic SaaS hero, or decorative iconography.

## Current Implementation Files

- `app/layout.tsx` - metadata shell and Lenis provider.
- `app/page.tsx` - renders all nine sections.
- `app/globals.css` - global styles, CSS variables, section composition rules.
- `components/providers/LenisProvider.tsx` - smooth scroll wrapper.
- `components/motion/ScrollColorController.tsx` - scroll-linked background CSS variable updates.
- `components/motion/Reveal.tsx` - GSAP reveal wrapper.
- `components/sections/*` - section components.
- `components/ui/*` - wordmark, bleed display, CTA, section shell utilities.
- `lib/design-tokens.ts` - TypeScript token source.
- `lib/tokens.css` - CSS token source for agent prompt compatibility.
- `lib/copy.ts` - copy source of truth.
- `lib/sections.config.ts` - section sequence and colour configuration.
- `lib/motion.config.ts` - motion constants.
- `lib/supabase.ts` - optional Supabase client stub.
- `public/assets/*_clean.svg` - web-served clean SVG assets.

## Stitch Context

- `stitch/DESIGN.md` - Stitch-native design system.
- `stitch/SCREEN_PROMPTS.md` - six prompt screens from the phase prompt.
- `stitch/screen-prompts.md` - fuller prompt pack from the initial implementation.

There is no Stitch MCP server registered in this Cursor environment right now. Treat these files as the Stitch handoff until an MCP is configured.

## Skills To Keep In Mind

Future agents should consider these Cursor/user skills before working:

- `create-agentsmd` - maintain `AGENTS.md` when project instructions change.
- `frontend-design`, `design-taste-frontend`, `design-taste-frontend-v1` - preserve the high-taste, non-generic frontend direction.
- `stitch-design-taste` - use when regenerating Stitch design guidance.
- `gpt-taste` - use cautiously; do not randomize this fixed 9-poster system.
- `deploy-to-vercel` / Vercel tools - use for preview deployment only until Marcus signs off.
- `browser-preview` / Playwright - use for visual QA after UI changes.

## Verification Commands

Use npm.

```bash
npm run lint
npm run build
```

No test runner is configured yet.

## Deployment

Current Vercel deployment:

- Deployment URL: `https://crosswithswag-r32lqzxf2-ict-5428s-projects.vercel.app`
- Inspect URL: `https://vercel.com/ict-5428s-projects/crosswithswag/HwkhLoYjvC6JbpWLFEZ2k2tT5qzm`

The deployment built successfully, but anonymous access is currently gated by Vercel authentication/protection. Do not assign a custom production domain before Marcus sign-off.

## Marcus Sign-Off Gate

Do not polish for public launch until Marcus approves:

- Wearable Editions manifesto + tagline.
- Instrument Sans final lock.
- Stitch/composition direction.
- SWAG statement distribution.
- Bleed display words.
- Section 6 copy line and imagery direction/assets.
- Motion pacing and transition behaviour.
- Analytics provider.
- Domain/DNS plan.

## Important Current Gaps

- Some static UI labels still live in JSX from the first implementation. Future copy cleanup should consolidate those into `lib/copy.ts` before final polish.
- Vercel preview protection needs to be handled before Marcus can review outside the team.
- Analytics is intentionally not installed because the provider is not chosen.
- Section 6 imagery is still a placeholder.
