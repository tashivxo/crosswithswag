# SWAG Agent Context

Read this before executing any step in this repository. If this file conflicts with an older prompt, `AGENT_CONTEXT.md` wins.

## Project Status

This is the pre-sign-off prototype for `swag.`, a scroll-driven single-page brand site for Marcus.

The repository is no longer docs/assets only. Phases 0–5 of the pre-sign-off plan have been implemented, and **Marcus Canva whiteboard feedback (V2)** has been applied to the live build:

- Phase 0 complete — Marcus sign-off locked copy, motion direction, and Section 6 content.
- **V2 feedback build complete (July 2026)** — Canva board `DAHO-6jJydk` (`V1 Feedback Whiteboard`) implemented: new manifesto/edition copy, Presence section removed, kloofstreetnights on Void Black, clothes showcase + community section added, hero logo scroll choreography, persistent wordmark with Sand-section colour swap, cursor-contrast poster interactivity, edition title marquee.
- Stitch handoff exists in `stitch/`.
- Design token sources exist in `lib/`.
- Next.js + TypeScript + Tailwind scaffold exists.
- Eight section shells render from `app/page.tsx` with copy from `lib/copy.ts`.
- Lenis smooth scroll and GSAP reveal/background/wordmark infrastructure are wired.
- Vercel deployment is live; anonymous access may be protected by Vercel authentication.

Do not restart from a blank scaffold. Work with the current app.

## Canonical Source Order

1. `AGENT_CONTEXT.md` — current project state and agent rules.
2. `lib/copy.ts` — copy source of truth for the build (updated for V2 whiteboard feedback).
3. `cursor.md/design.md` — visual identity, section structure, colour map, animation rules.
4. `cursor.md/brand-copy.md` — original manifesto/raw copy (older; V2 whiteboard copy in `lib/copy.ts` wins for build).
5. `cursor.md/marcus-signoff-checklist.md` — filled Marcus sign-off record.
6. `cursor.md/marcus-review-packet.md` — review links and checklist.
7. `cursor.md/swag_website_v1_prd.md` — older PRD. Background only.

Where newer docs conflict with the PRD, newer docs win. Where V2 whiteboard copy conflicts with `brand-copy.md`, `lib/copy.ts` wins.

## Brand Direction

- Brand: `swag.`
- Handle: `@crosswithswag`
- Hero tagline: `WEARABLE EDITIONS` — **locked**
- Typeface: Instrument Sans 400 / 500 / 700 — **locked**
- Creative director: Marcus, credited as `the director.`
- Site type: continuous-scroll digital gallery, not ecommerce.
- Tone: quiet, type-led, editorial, non-commercial, no over-explaining.

The site should feel like a sequence of typographic posters, not a product landing page.

## Locked Structure (V2)

The V1 site now has **eight sections** after Marcus whiteboard feedback:

1. Hero / Landing — Void Black `#0A0A0A` (centered wordmark scrolls to top-left; persistent fixed wordmark after hero)
2. Manifesto — Void Black `#0A0A0A` (new wound/approval copy from whiteboard)
3. "What is SWAG?" — Authentic Expression — Void Black `#0A0A0A` (`AUTHENTIC EXPRESSION.` headline, cursor-contrast interactivity)
4. "What is SWAG?" — Internal Authority — Muted Sand `#D6D1C4` (includes former density/weight statements; cursor-contrast; logo transitions to Black)
5. `kloofstreetnights — Wearable Edition` — Void Black `#0A0A0A` (was Clay; title marquee; imagery links to showcase)
6. Clothes Showcase / Community — Stone Grey `#575D61` (17 winter-drop artboards + community block)
7. Closing Statement — Void Black `#0A0A0A`
8. Footer — Void Black `#0A0A0A`

**Removed per Marcus feedback:** Presence section (red-X on whiteboard), Density/Weight as standalone section (statements folded into Internal Authority).

Confirmed colour sequence:

`Black → Black → Black → Sand → Black → Stone → Black → Black`

## Design Rules

- Use only the four brand colours: Void Black, Stone Grey, Clay, Sand.
- Use Instrument Sans 400 / 500 / 700.
- Display type is uppercase, tight tracked, and allowed to bleed off section edges.
- Sections use `min-height: 100dvh`; avoid fixed `h-screen` patterns.
- Sections should allow growth on mobile where content needs it, especially manifesto and showcase.
- Use `overflow: hidden` on poster sections for bleed type.
- Ghost/watermark layers are oversized, absolute, low opacity, and behind foreground content.
- CTAs are text links only. No button containers, pills, rounded blocks, or card UI.
- No gradients, stock ecommerce layout, sale language, generic SaaS hero, or decorative iconography.
- One horizontal marquee max per page (kloofstreetnights title in edition section).
- All new motion must respect `prefers-reduced-motion`.

## Current Implementation Files

- `app/layout.tsx` — metadata shell and Lenis provider.
- `app/page.tsx` — renders all eight sections + motion controllers.
- `app/globals.css` — global styles, CSS variables, section composition rules, wordmark/cursor-contrast/showcase styles.
- `components/providers/LenisProvider.tsx` — smooth scroll wrapper.
- `components/motion/ScrollColorController.tsx` — scroll-linked background CSS variable updates.
- `components/motion/WordmarkController.tsx` — persistent fixed wordmark + Sand-section colour swap.
- `components/motion/HeroWordmarkScroll.tsx` — hero center-to-top-left wordmark choreography.
- `components/motion/CursorContrast.tsx` — pointer contrast lens for poster sections.
- `components/motion/EditionMarquee.tsx` — kloofstreetnights title marquee.
- `components/motion/Reveal.tsx` — GSAP reveal wrapper.
- `components/sections/*` — section components (includes `ShowcaseSection.tsx`).
- `components/ui/*` — wordmark, bleed display, CTA, section shell utilities.
- `lib/design-tokens.ts` — TypeScript token source.
- `lib/tokens.css` — CSS token source.
- `lib/copy.ts` — **copy source of truth** (V2 whiteboard updates).
- `lib/sections.config.ts` — section sequence and colour configuration.
- `lib/motion.config.ts` — motion constants.
- `lib/supabase.ts` — optional Supabase client stub.
- `public/assets/*_clean.svg` — web-served clean SVG assets.
- `public/assets/winter-drop/*.jpg` — kloofstreetnights campaign photography.

## Marcus V2 Feedback Status

Source: Canva `V1 Feedback Whiteboard` (`https://canva.link/4a0tv4obf1x8mfc`, design `DAHO-6jJydk`).

| Feedback | Status |
|----------|--------|
| Hero as landing page; logo on black | ✅ Implemented |
| Logo scroll center → top-left | ✅ `HeroWordmarkScroll` |
| Persistent logo; transitions to black on Sand | ✅ `WordmarkController` |
| New manifesto copy (wound/approval) | ✅ `lib/copy.ts` |
| `AUTHENTIC EXPRESSION.` headline | ✅ `displayHeadline` on section 3 |
| Cursor-contrast interactivity on posters | ✅ `CursorContrast` on sections 3–4 |
| Remove Presence section | ✅ Removed |
| kloofstreetnights black background + marquee | ✅ Edition section |
| Clickable edition imagery → clothes showcase | ✅ Links to `#showcase` |
| Clothes showcase section | ✅ `ShowcaseSection` (17 images) |
| Community section | ✅ Community block in showcase |
| No blue/orange palette | ✅ Four-colour palette only |

**Still open from Marcus:** Community page may expand beyond the current in-page block (early thought on whiteboard). Confirm at next review.

## Stitch Context

- `stitch/DESIGN.md` — Stitch-native design system (pre-V2; section count/colours may differ).
- `stitch/SCREEN_PROMPTS.md` — eight copy-verified screen prompts.

Stitch screens predate V2 feedback. Use live build + Canva whiteboard as current visual direction unless Marcus re-approves Stitch exports.

## Verification Commands

Use npm.

```bash
npm run lint
npm run build
```

No test runner is configured yet. After UI changes, use browser preview or Playwright for visual QA.

## Deployment

Current Vercel deployment:

- Deployment URL: `https://crosswithswag-20x4bss2l-ict-5428s-projects.vercel.app`
- Aliased URL: `https://crosswithswag.vercel.app`

The deployment built successfully, but anonymous access may be gated by Vercel authentication/protection. Do not assign a custom production domain before launch sign-off.

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| **Phase 0** | ✅ COMPLETE | Marcus approved original copy/motion/Section 6. |
| **V2 Feedback** | ✅ COMPLETE | Canva whiteboard feedback implemented in code. |
| **Phase 1 Stitch** | ⏸ SUPERSEDED | Stitch screens predate V2; live build is current review target. |
| **Phase 2–5** | ✅ COMPLETE | Scaffold, sections, motion infrastructure. |
| **Marcus re-review** | ⏸ PENDING | Review updated Vercel preview against whiteboard intent. |

## Open Questions for Marcus

**Still open:**

- Production domain name and DNS access.
- Analytics provider (Vercel Analytics, Plausible, GA4, etc.).
- Public launch date.
- Whether community block should become a dedicated page/section expansion.

**Resolved (V2):**

- Presence section removed ✅
- kloofstreetnights on black (not Clay) ✅
- New whiteboard copy applied ✅
- Clothes showcase + community block added ✅
- Logo choreography and interactivity ✅

## Marcus Sign-Off Gate

Before public launch, Marcus should still approve:

- V2 build fidelity against Canva whiteboard feedback.
- Final motion pacing and interactivity feel.
- Community section scope (in-page vs dedicated page).
- Analytics provider and domain/DNS plan.

## Important Current Gaps

- Vercel preview protection may block anonymous review — share via Vercel or disable protection for Marcus.
- Analytics is intentionally not installed because the provider is not chosen.
- `cursor.md/brand-copy.md` and Stitch docs still describe the pre-V2 nine-section structure; `lib/copy.ts` and this file are authoritative for the build.
