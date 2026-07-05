# SWAG Agent Context

Read this before executing any step in this repository. If this file conflicts with an older prompt, `AGENT_CONTEXT.md` wins.

## Project Status

This is the pre-sign-off prototype for `swag.`, a scroll-driven single-page brand site for Marcus.

The repository is no longer docs/assets only. Phases 0–5 of the pre-sign-off plan have been implemented:

- Phase 0 complete — Marcus sign-off locked copy, motion direction, and Section 6 content.
- Stitch handoff exists in `stitch/`.
- Design token sources exist in `lib/`.
- Next.js + TypeScript + Tailwind scaffold exists.
- Nine section shells render from `app/page.tsx` with locked copy from `lib/copy.ts`.
- Lenis smooth scroll and GSAP reveal/background infrastructure are wired.
- Vercel deployment is live; anonymous access may be protected by Vercel authentication.

Do not restart from a blank scaffold. Work with the current app.

## Canonical Source Order

1. `AGENT_CONTEXT.md` — current project state and agent rules.
2. `lib/copy.ts` — locked copy source of truth for the build.
3. `cursor.md/design.md` — visual identity, section structure, colour map, animation rules.
4. `cursor.md/brand-copy.md` — manifesto, raw copy, confirmed V1 scope.
5. `cursor.md/marcus-signoff-checklist.md` — filled Marcus sign-off record.
6. `cursor.md/marcus-review-packet.md` — review links and checklist.
7. `cursor.md/swag_website_v1_prd.md` — older PRD. Background only.

Where newer docs conflict with the PRD, newer docs win.

## Brand Direction

- Brand: `swag.`
- Handle: `@crosswithswag`
- Hero tagline: `WEARABLE EDITIONS` — **locked**
- Typeface: Instrument Sans 400 / 500 / 700 — **locked**
- Creative director: Marcus, credited as `the director.`
- Site type: continuous-scroll digital gallery, not ecommerce.
- Tone: quiet, type-led, editorial, non-commercial, no over-explaining.

The site should feel like a sequence of typographic posters, not a product landing page.

## Locked Structure

The V1 site has nine sections:

1. Hero / Landing — Void Black `#0A0A0A`
2. Manifesto — Void Black `#0A0A0A`
3. "What is SWAG?" — Authentic Expression — Void Black `#0A0A0A`
4. "What is SWAG?" — Internal Authority — Muted Sand `#D6D1C4`
5. "What is SWAG?" — Presence — Stone Grey `#575D61`
6. `kloofstreetnights — Wearable Edition` — Deep Earth / Clay `#8C5E4A`
7. "What is SWAG?" — Density / Weight — Stone Grey `#575D61`
8. Closing Statement — Void Black `#0A0A0A`
9. Footer — Void Black `#0A0A0A`

Confirmed colour sequence:

`Black → Black → Black → Sand → Stone → Clay → Stone → Black`

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

- `app/layout.tsx` — metadata shell and Lenis provider.
- `app/page.tsx` — renders all nine sections.
- `app/globals.css` — global styles, CSS variables, section composition rules.
- `components/providers/LenisProvider.tsx` — smooth scroll wrapper.
- `components/motion/ScrollColorController.tsx` — scroll-linked background CSS variable updates.
- `components/motion/Reveal.tsx` — GSAP reveal wrapper.
- `components/sections/*` — section components.
- `components/ui/*` — wordmark, bleed display, CTA, section shell utilities.
- `lib/design-tokens.ts` — TypeScript token source.
- `lib/tokens.css` — CSS token source.
- `lib/copy.ts` — **locked copy source of truth**.
- `lib/sections.config.ts` — section sequence and colour configuration.
- `lib/motion.config.ts` — **locked motion constants**.
- `lib/supabase.ts` — optional Supabase client stub.
- `public/assets/*_clean.svg` — web-served clean SVG assets.
- `public/assets/winter-drop/*.jpg` — kloofstreetnights campaign photography.

## Stitch Context

- `stitch/DESIGN.md` — Stitch-native design system.
- `stitch/SCREEN_PROMPTS.md` — six screen prompts ready for Stitch MCP.
- `stitch/screen-prompts.md` — fuller prompt pack from initial implementation.

There is no Stitch MCP server registered in this Cursor environment right now. Treat these files as the Stitch handoff until an MCP is configured.

## Skills To Keep In Mind

Future agents should consider these Cursor/user skills before working:

- `create-agentsmd` — maintain `AGENTS.md` when project instructions change.
- `frontend-design`, `design-taste-frontend`, `design-taste-frontend-v1` — preserve the high-taste, non-generic frontend direction.
- `stitch-design-taste` — use when regenerating Stitch design guidance.
- `gpt-taste` — use cautiously; do not randomize this fixed 9-poster system.
- `deploy-to-vercel` / Vercel tools — use for preview deployment only until public launch.
- `browser-preview` / Playwright — use for visual QA after UI changes.

## Verification Commands

Use npm.

```bash
npm run lint
npm run build
```

No test runner is configured yet.

## Deployment

Current Vercel deployment:

- Deployment URL: `https://crosswithswag-20x4bss2l-ict-5428s-projects.vercel.app`
- Aliased URL: `https://crosswithswag.vercel.app`
- Inspect URL: `https://vercel.com/ict-5428s-projects/crosswithswag/2hXqs663EmnwSygTL5Ka6vSprcta`

The deployment built successfully, but anonymous access may be gated by Vercel authentication/protection. Do not assign a custom production domain before launch sign-off.

## 9. Current Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| **Phase 0** | ✅ COMPLETE | Marcus approved: manifesto, tagline, statement distribution, bleed words, motion direction, Section 6 copy/imagery/CTA. |
| **Phase 1** | 🔲 READY | Stitch screens ready to generate (`stitch/DESIGN.md` + 6 screen prompts in `stitch/SCREEN_PROMPTS.md`). |
| **Phase 2–3** | ✅ COMPLETE | Tokens, copy, sections config, Next.js scaffold in place. |
| **Phase 4–5** | ✅ COMPLETE | Section shells + motion infrastructure wired. Polish/tuning continues post-Stitch review. |

## 10. Open Questions for Marcus

**Still open (non-blocking for Stitch):**

- Production domain name and DNS access.
- Analytics provider (Vercel Analytics, Plausible, GA4, etc.).
- Public launch date.

**Resolved (do not reopen without Marcus):**

- Manifesto + hero tagline ✅
- Instrument Sans ✅
- SWAG statement distribution ✅
- Bleed display words ✅
- Section 6 copy, imagery direction, and CTA ✅
- Motion direction: scroll-linked interpolation + slow ghost parallax ✅
- Close + footer structure ✅

**Pending visual review (not a copy blocker):**

- Stitch screen compositions / layout fidelity approval.

## Marcus Sign-Off Gate

Before public launch, Marcus should still approve:

- Stitch/composition direction from generated screens.
- Final motion pacing tuning in Phase 5 polish.
- Analytics provider and domain/DNS plan.

## Important Current Gaps

- Vercel preview protection may block anonymous review — share via Vercel or disable protection for Marcus.
- Analytics is intentionally not installed because the provider is not chosen.
- Some section layout polish may still follow Stitch visual review.
