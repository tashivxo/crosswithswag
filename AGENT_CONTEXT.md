# SWAG Agent Context

Read this before executing any step in this repository. If this file conflicts with an older prompt, `AGENT_CONTEXT.md` wins.

## Project Status

This is the pre-sign-off prototype for `swag.`, a scroll-driven single-page brand site for Marcus.

**Branch split (August 2026):**

- **Production (`main`)** — V2 Canva whiteboard build (eight poster sections). Live at `https://crosswithswag.vercel.app`.
- **`swag_V3_new_branch`** — Marcus V3 rebuild (five continuous-scroll chapters from Figma/HTML handoff). Preview: `https://crosswithswag-git-swagv3newbranch-tashivxos-projects.vercel.app`. Preview-only until Marcus signs off. Do not merge to `main` without explicit approval.

Marcus V3 sources live in `cursor.md/v3/` (`swag-site.html`, `SWAG-engineering-handoff.md`). Figma file `5w6qUwhO5sLBhxJHsqfC0u` is view-only for `tashivxo@gmail.com` — build follows HTML + handoff.

The repository is no longer docs/assets only. Phases 0–5 of the pre-sign-off plan have been implemented, and **Marcus Canva whiteboard feedback (V2)** remains on production:

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
2. `lib/copy.ts` — V3 copy source of truth on `swag_V3_new_branch` (from Marcus engineering handoff + `swag-site.html`). V2 copy preserved in `archive/v2/lib/copy.v2.ts` on this branch (live V2 copy remains on `main`).
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

## Locked Structure (V3 on `swag_V3_new_branch`)

One continuous scroll — five chapters (Figma Page 1 frames), not five routes:

1. **Home** (`#home`) — hero, ticker, current-edition teaser, structure, manifesto teaser, what is swag, clothes grid, archive teaser, waitlist
2. **Current edition** (`#current`) — kloofstreetnights campaign, colourways, spec, clothes, director note
3. **Archive** (`#archive`) — six editions, three rules
4. **Manifesto** (`#manifesto`) — owe nothing, wound, authority blocks
5. **Contact** (`#contact`) — email + Instagram cards, waitlist (no invented form beyond handoff)

Wordmark: lives in the header (not under a frosted bar). The drift layer is laid out at `--wordmark-hero-width`; on load it sits at scale 1 in the viewport centre; on scroll it docks into the top-left nav slot by scaling down (`dock / hero`, never up). Header stays fixed with wordmark + MENU only (chapter links live in the overlay). MENU stays visible while scrolling. MENU opens a panel-reveal overlay (current / archive / manifesto / contact) with hover-grow on the hovered chapter. MENU and CLOSE have a small bounce hover. Hero copy is visible as soon as the preloader ends. Lenis + GSAP; `prefers-reduced-motion` respected.

**Intentionally not invented:** unnamed pink/green colourways (dashed `HEX TBC` swatches); ATM/Octane/Courtside descriptions remain `—`.

## Locked Structure (V2 on `main`)

The production site has **eight sections** after Marcus whiteboard feedback:

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

## Current Implementation Files (V3 branch)

- `app/page.tsx` — five scroll chapters + preloader, header, footer
- `app/globals.css` — V3 typographic system (SAND primary text per Figma handoff)
- `components/v3/*` — chapter components, header, wordmark drift/dock, ticker, reveal
- `components/ui/*` — shared wordmark / watermark primitives
- `lib/copy.ts` — V3 copy
- `lib/editions.ts` — edition data (archive, colourways, campaign artboards)
- `lib/sections.config.ts` — five chapter ids and nav config
- `public/assets/` — web-served clean SVGs + winter-drop JPGs
- `marcus-assets/` — Marcus Figma/export masters (svg + winter-drop; not served)
- `cursor.md/v3/` — Marcus handover attachments (HTML + engineering handoff)
- `archive/v2/` — quarantined V2 sections/motion + `copy.v2.ts` (reference only; live V2 is on `main`)
- `archive/qa/` — visual QA screenshots (kept off repo root)
- `archive/stitch-compositions/` — expanded Stitch pack + zip

## Current Implementation Files (V2 production)

On **`main`**, V2 lives under `components/sections/*` and `components/motion/*`. On **`swag_V3_new_branch`**, that tree is quarantined at `archive/v2/` (not imported by the V3 page).

- `app/layout.tsx` — metadata shell and Lenis provider.
- `app/page.tsx` — renders all eight sections + motion controllers.
- `app/globals.css` — global styles, CSS variables, section composition rules, wordmark/cursor-contrast/showcase styles.
- `components/providers/LenisProvider.tsx` — smooth scroll wrapper.
- `components/motion/*` / `archive/v2/components/motion/*` — scroll colour, wordmark, marquee, reveal, cursor contrast.
- `components/sections/*` / `archive/v2/components/sections/*` — eight V2 section components.
- `components/ui/*` — wordmark, bleed display, CTA, section shell utilities.
- `lib/design-tokens.ts` — TypeScript token source.
- `lib/tokens.css` — CSS token source.
- `lib/copy.ts` (on `main`) / `archive/v2/lib/copy.v2.ts` (this branch) — V2 whiteboard copy.
- `lib/sections.config.ts` — section sequence and colour configuration (V3 chapters on this branch).
- `lib/motion.config.ts` — motion constants.
- `lib/supabase.ts` — optional Supabase client stub.
- `public/assets/*_clean.svg` — web-served clean SVG assets.
- `public/assets/winter-drop/*.jpg` — kloofstreetnights campaign photography.
- `marcus-assets/` — Figma/export masters (not served).

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

Current Vercel deployment (personal account `tashivxo`, team `tashivxos-projects`):

- Production alias: `https://crosswithswag.vercel.app`
- Latest production deployment: `https://crosswithswag-rf245lomw-tashivxos-projects.vercel.app`
- Dashboard: `https://vercel.com/tashivxos-projects/crosswithswag`
- Inspect: `https://vercel.com/tashivxos-projects/crosswithswag/2rKxnqhyUFoLK9VLUHxruU2Fh57P`

Previously deployed to work account `ict-5428s-projects`; that project was removed July 2026.

The deployment built successfully. Vercel Authentication is disabled for this project so Marcus can open the V3 preview without a login screen. Do not assign a custom production domain before launch sign-off.

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| **Phase 0** | ✅ COMPLETE | Marcus approved original copy/motion/Section 6. |
| **V2 Feedback** | ✅ COMPLETE | Canva whiteboard feedback implemented in code. |
| **Phase 1 Stitch** | ⏸ SUPERSEDED | Stitch screens predate V2; live build is current review target. |
| **Phase 2–5** | ✅ COMPLETE | Scaffold, sections, motion infrastructure. |
| **V3 rebuild** | 🚧 ON BRANCH | `swag_V3_new_branch` — five-chapter scroll from Marcus Aug 2026 handoff. Preview pending Marcus sign-off. |
| **Marcus re-review** | ⏸ PENDING | Review V3 preview against Figma/HTML; production stays V2 until sign-off. |

## Open Questions for Marcus

**Still open:**

- Production domain name and DNS access.
- Analytics provider (Vercel Analytics, Plausible, GA4, etc.).
- Public launch date.
- Whether community block should become a dedicated page/section expansion.
- Waitlist backend and possible later Cloudflare (Workers/Pages) move. Not now. Frontend stays on the current Next.js/Vercel stack until a move is proven cheaper and requires no frontend rewrite.

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

- Vercel Authentication is off so the V3 preview is publicly viewable. Re-enable before public launch only if Marcus wants the preview gated again.
- Analytics is intentionally not installed because the provider is not chosen.
- `cursor.md/brand-copy.md` and Stitch docs still describe the pre-V2 nine-section structure; `lib/copy.ts` and this file are authoritative for the build.
