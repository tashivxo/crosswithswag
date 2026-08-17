# SWAG Agent Context

Read this before executing any step in this repository. If this file conflicts with an older prompt, `AGENT_CONTEXT.md` wins.

## Project Status

This is the live production site for `swag.`, a scroll-driven single-page brand gallery for Marcus.

**Branch split (August 2026 cutover):**

- **Production (`main`)** — V3 five-chapter continuous-scroll site. Live at `https://crosswithswag.co.za` and `https://crosswithswag.vercel.app`. Marcus signed off the V3 cutover; that gate is lifted. Do not attach another custom domain.
- **`v2-production-freeze`** — frozen snapshot of the pre-cutover V2 Canva whiteboard build (eight poster sections, commit `c18a1c5`). Reference-only for mining layouts, motion, and copy. Not production. Preview: `https://crosswithswag-git-v2-production-freeze-tashivxos-projects.vercel.app`.
- **`swag_V3_new_branch`** — retained git history of the V3 rebuild. It is not a live preview line; production is `main`.

Marcus V3 sources live in `cursor.md/v3/` (`swag-site.html`, `SWAG-engineering-handoff.md`). Figma file `5w6qUwhO5sLBhxJHsqfC0u` is view-only for `tashivxo@gmail.com` — build follows HTML + handoff.

The repository is no longer docs/assets only. Phases 0–5 of the pre-sign-off plan have been implemented. **Marcus Canva whiteboard feedback (V2)** is frozen on `v2-production-freeze` for design mining:

- Phase 0 complete — Marcus sign-off locked copy, motion direction, and Section 6 content.
- **V2 feedback build complete (July 2026)** — Canva board `DAHO-6jJydk` (`V1 Feedback Whiteboard`) implemented: new manifesto/edition copy, Presence section removed, kloofstreetnights on Void Black, clothes showcase + community section added, hero logo scroll choreography, persistent wordmark with Sand-section colour swap, cursor-contrast poster interactivity, edition title marquee.
- Stitch handoff exists in `stitch/`.
- Design token sources exist in `lib/`.
- Next.js + TypeScript + Tailwind scaffold exists.
- Five V3 chapters render from `app/page.tsx` with copy from `lib/copy.ts`.
- Lenis smooth scroll and GSAP reveal/wordmark infrastructure are wired.
- Vercel production is live at the custom domain; Authentication is currently off.

Do not restart from a blank scaffold. Work with the current app.

## Canonical Source Order

1. `AGENT_CONTEXT.md` — current project state and agent rules.
2. `lib/copy.ts` — V3 copy source of truth on `main` (from Marcus engineering handoff + `swag-site.html`). V2 copy is quarantined in `archive/v2/lib/copy.v2.ts` on `main`; live V2 source of truth is the `v2-production-freeze` branch.
3. `cursor.md/design.md` — visual identity, section structure, colour map, animation rules.
4. `cursor.md/brand-copy.md` — original manifesto/raw copy (older; V3 `lib/copy.ts` on `main` wins for the live build).
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

## Locked Structure (V3 on `main`)

One continuous scroll — five chapters (Figma Page 1 frames), not five routes:

1. **Home** (`#home`) — first viewport is Figma overlay `214:119`/`214:124`: Void Black with the centered `swag.` mark only. On scroll the mark docks into the nav, MENU fades in, then the Landing hero (`204:53`) CROSS / WITH SWAG, edition labels, intro, and CTAs. No ghost watermark.
2. **Current edition** (`#current`) — kloofstreetnights campaign, **After Hours + First Light** colourways only, spec, clothes, director note
3. **Archive** (`#archive`) — six editions, three rules (`atm` description: `all that matters.`)
4. **Manifesto** (`#manifesto`) — owe nothing, wound, authority, **The Full Manifesto**, Silent Warrior
5. **Contact** (`#contact`) — email + Instagram cards, waitlist (no invented form beyond handoff)

Wordmark: lives in the header (not under a frosted bar). After the preloader, first paint is the large centered mark (`--wordmark-hero-width`, Figma overlay ~652 wide at 1440) on Void Black. On scroll it docks into the top-left nav slot by scaling down (`dock / hero`, never up). Docked size matches production: `--wordmark-dock-width: clamp(88px, 11vw, 120px)` with Frame_6 aspect `1.426685` (do not use the Figma header’s 72×26 crop). Header stays fixed with wordmark + MENU only (chapter links live in the overlay). **MENU chrome starts hidden after the preloader and fades/slides in as the wordmark docks.** MENU opens a panel-reveal overlay (current / archive / manifesto / contact) with hover-grow on the hovered chapter. MENU and CLOSE have a small bounce hover. CROSS WITH SWAG is the second home poster, revealed as the intro scrolls away. Lenis + GSAP; `prefers-reduced-motion` collapses the intro, docks the mark, and shows MENU with no motion.

August 2026 Figma source: file `5w6qUwhO5sLBhxJHsqfC0u`, WEBSITE page `204:42`. `order this edition` links to Jotform (`https://form.jotform.com/crosswithswag/order-kloofstreetnights`).

**Colourways on Current:** After Hours `#0A0A0A` and First Light `#EDE7D8` only. Unnamed pink/green and swagy dust are not shown.

## Locked Structure (V2 on `v2-production-freeze`)

The frozen V2 site has **eight sections** after Marcus whiteboard feedback. Mine this branch for layout/motion/copy only; do not treat it as production:

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
- Use Instrument Sans 400 / 500 / 600 / 700.
- Display type is uppercase, tight tracked, and allowed to bleed off section edges.
- Sections use `min-height: 100dvh`; avoid fixed `h-screen` patterns.
- Sections should allow growth on mobile where content needs it, especially manifesto and showcase.
- Use `overflow: hidden` on poster sections for bleed type.
- Ghost/watermark layers are oversized, absolute, low opacity, and behind foreground content.
- CTAs are text links only. No button containers, pills, rounded blocks, or card UI.
- No gradients, stock ecommerce layout, sale language, generic SaaS hero, or decorative iconography.
- One horizontal marquee max per page (kloofstreetnights title in edition section).
- All new motion must respect `prefers-reduced-motion`.

## Current Implementation Files (V3 production on `main`)

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
- `archive/v2/` — quarantined V2 sections/motion + `copy.v2.ts` (reference only on `main`; live V2 source of truth is `v2-production-freeze`)
- `archive/qa/` — visual QA screenshots (kept off repo root)
- `archive/stitch-compositions/` — expanded Stitch pack + zip

## Current Implementation Files (V2 freeze)

On **`v2-production-freeze`**, V2 lives under `components/sections/*` and `components/motion/*`. On **`main`**, that tree is quarantined at `archive/v2/` (not imported by the V3 page).

- `app/layout.tsx` — metadata shell and Lenis provider.
- `app/page.tsx` — renders all eight sections + motion controllers.
- `app/globals.css` — global styles, CSS variables, section composition rules, wordmark/cursor-contrast/showcase styles.
- `components/providers/LenisProvider.tsx` — smooth scroll wrapper.
- `components/motion/*` / `archive/v2/components/motion/*` — scroll colour, wordmark, marquee, reveal, cursor contrast.
- `components/sections/*` / `archive/v2/components/sections/*` — eight V2 section components.
- `components/ui/*` — wordmark, bleed display, CTA, section shell utilities.
- `lib/design-tokens.ts` — TypeScript token source.
- `lib/tokens.css` — CSS token source.
- `lib/copy.ts` (on `v2-production-freeze`) / `archive/v2/lib/copy.v2.ts` (on `main`) — V2 whiteboard copy.
- `lib/sections.config.ts` — section sequence and colour configuration (V3 chapters on `main`).
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

Current Vercel project (personal account `tashivxo`, team `tashivxos-projects`, project `crosswithswag`, id `prj_9aDUfbyTr9qEaCWkqJo1k385x7aR`):

- Production (`main`, V3): `https://crosswithswag.co.za` and `https://crosswithswag.vercel.app`
- Latest production deployment: `https://crosswithswag-l45nyaxcx-tashivxos-projects.vercel.app`
- Dashboard: `https://vercel.com/tashivxos-projects/crosswithswag`
- Inspect: `https://vercel.com/tashivxos-projects/crosswithswag/CjUfoZ46aAePpPkFnj7eQpMdEZpy`
- Frozen V2 preview (`v2-production-freeze`): `https://crosswithswag-git-v2-production-freeze-tashivxos-projects.vercel.app`

Custom domain `crosswithswag.co.za` (and `www`) is already attached to this project. Do not change DNS. Do not buy or attach another domain.

Previously deployed to work account `ict-5428s-projects`; that project was removed July 2026.

Vercel Authentication is disabled so public URLs are viewable. Leave that as-is unless Marcus wants it gated again. Do not add analytics until a provider is chosen.

## Phase Status

| Phase | Status | Notes |
|-------|--------|-------|
| **Phase 0** | ✅ COMPLETE | Marcus approved original copy/motion/Section 6. |
| **V2 Feedback** | ✅ COMPLETE | Canva whiteboard feedback implemented in code. |
| **Phase 1 Stitch** | ⏸ SUPERSEDED | Stitch screens predate V2; live build is current review target. |
| **Phase 2–5** | ✅ COMPLETE | Scaffold, sections, motion infrastructure. |
| **V3 rebuild** | ✅ PRODUCTION | Five-chapter scroll from Marcus Aug 2026 handoff. Live on `main` at `crosswithswag.co.za`. |
| **V3 production cutover** | ✅ COMPLETE | August 2026. V2 frozen on `v2-production-freeze`. Sign-off and domain-assignment gates for this cutover are lifted. |

## Open Questions for Marcus

**Still open:**

- Analytics provider (Vercel Analytics, Plausible, GA4, etc.).
- Public launch date / further announcement.
- Whether community block should become a dedicated page/section expansion.
- Waitlist backend and possible later Cloudflare (Workers/Pages) move. Not now. Frontend stays on the current Next.js/Vercel stack until a move is proven cheaper and requires no frontend rewrite.
**Resolved (cutover):**

- Jotform order form wired for `order this edition` on Current (`https://form.jotform.com/crosswithswag/order-kloofstreetnights`).

- Custom production domain `crosswithswag.co.za` is attached and serving V3. Do not add another.
- V3 is production on `main`. V2 is frozen for design mining only.

**Resolved (V2):**

- Presence section removed ✅
- kloofstreetnights on black (not Clay) ✅
- New whiteboard copy applied ✅
- Clothes showcase + community block added ✅
- Logo choreography and interactivity ✅

## Marcus Sign-Off Gate

The V3-to-production cutover is signed off. Do not re-impose “do not merge V3 to main” or “do not assign a custom production domain” for this launch.

Still open after cutover:

- Final motion pacing and interactivity feel on live V3.
- Community section scope (in-page vs dedicated page).
- Analytics provider.

## Important Current Gaps

- Vercel Authentication is off so production and the V2 freeze preview are publicly viewable. Re-enable only if Marcus wants URLs gated again.
- Analytics is intentionally not installed because the provider is not chosen.
- `cursor.md/brand-copy.md` and Stitch docs still describe the pre-V2 nine-section structure; `lib/copy.ts` and this file are authoritative for the live V3 build. V2 live source is `v2-production-freeze`.
