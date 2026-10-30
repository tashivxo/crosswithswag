# SWAG Agent Context

Read this before executing any step in this repository. If this file conflicts with an older prompt, `AGENT_CONTEXT.md` wins.

## Project Status

This is the live production site for `swag.`, a scroll-driven single-page brand gallery for Marcus.

**Branch split (August 2026 cutover):**

- **Production (`main`)** — V3.1 six-route gallery. Live at `https://crosswithswag.co.za` and `https://crosswithswag.vercel.app`. Marcus signed off this cutover (August 2026). Do not attach another custom domain.
- **`aug-2026-website-update`** — branch that shipped V3.1; merged to `main` at `0d84e8f`. Keep for history; production is `main`.
- **`v2-production-freeze`** — frozen snapshot of the pre-cutover V2 Canva whiteboard build (eight poster sections, commit `c18a1c5`). Reference-only for mining layouts, motion, and copy. Not production. Preview: `https://crosswithswag-git-v2-production-freeze-tashivxos-projects.vercel.app`.
- **`swag_V3_new_branch`** — retained git history of the V3 rebuild. It is not a live preview line; production is `main`.

Marcus V3 sources live in `cursor.md/v3/` (`swag-site.html`, `SWAG-engineering-handoff.md`). Figma file `5w6qUwhO5sLBhxJHsqfC0u` is view-only for `tashivxo@gmail.com` — build follows HTML + handoff.

The repository is no longer docs/assets only. Phases 0–5 of the pre-sign-off plan have been implemented. **Marcus Canva whiteboard feedback (V2)** is frozen on `v2-production-freeze` for design mining:

- Phase 0 complete — Marcus sign-off locked copy, motion direction, and Section 6 content.
- **V2 feedback build complete (July 2026)** — Canva board `DAHO-6jJydk` (`V1 Feedback Whiteboard`) implemented: new manifesto/edition copy, Presence section removed, kloofstreetnights on Void Black, clothes showcase + community section added, hero logo scroll choreography, persistent wordmark with Sand-section colour swap, cursor-contrast poster interactivity, edition title marquee.
- Stitch handoff exists in `stitch/`.
- Design token sources exist in `lib/`.
- Next.js + TypeScript + Tailwind scaffold exists.
- Six V3.1 routes render from `app/(gallery)/*` with shared `SiteChrome`. Production is this architecture on `main`.
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

## Locked Structure (V3.1 on `main`)

Six App Router routes with shared `SiteChrome` (preloader, header, footer). Marcus signed off the original five; `/playlists` is the sixth chapter (Spotify embeds only).

1. **Home** (`/`) — first viewport is Figma overlay `214:119`/`214:124`: Void Black with the centered `swag.` mark only. On scroll the mark docks into the nav, MENU fades in, then the Landing hero (`204:53`) is a **two-line** CROSS / WITH SWAG lockup (WITH in Clay) at display size `clamp(44px, 11vw, 168px)`, with edition labels, wearable-editions intro, and **the current edition / the archive CTAs in that same docked viewport**. Home also carries Figma Landing teasers (ticker, current edition, structure, manifesto teaser, authority, clothes grid, archive rows, waitlist, closer). Do not use Figma’s inline CURRENT/ARCHIVE/MANIFESTO/CONTACT header links — MENU overlay stays. No ghost watermark.
2. **Current edition** (`/current`) — kloofstreetnights campaign (artboards 1–3), **After Hours + First Light** colourways in a two-up poster grid (Figma `204:255`), spec, **8 looks / 8 prints** clothes (artboards 2, 3, 4, 6, 7, 8, 10, 11 — garment stills only; not first-edition CROSS.WITH.SWAG boards), director note
3. **Archive** (`/archive`) — six editions, three rules (`atm` description: `all that matters.`); Figma `204:371` layout (no closer lockup)
4. **Manifesto** (`/manifesto`) — OWE NOTHING opener, a home for individuals, the wound, authentic expression, authority, **The Full Manifesto**, Silent Warrior; Figma `204:462`
5. **Playlists** (`/playlists`) — THE MIX. Three stacked editorial Spotify embeds (Dala / Step / Freefall with Swag). Public iframe only; no OAuth, Web Playback SDK, or secrets. `spotifyId: null` keeps a coming-soon path.
6. **Contact** (`/contact`) — two-up email + Instagram cards, waitlist (Figma `204:548`)

Wordmark: lives in the header (not under a frosted bar). After the preloader, first paint is the large centered mark (`--wordmark-hero-width`, Figma overlay ~652 wide at 1440) on Void Black. On scroll it docks into the top-left nav slot by scaling down (`dock / hero`, never up). Docked size: `--wordmark-dock-width: clamp(88px, 11vw, 120px)` (do not use the Figma header’s 72×26 crop). Live mask is `public/assets/SWAG_mark_fill.svg` — filled `swag.` path from Frame_6 with the CROSS WITH SWAG micro-text removed. Aspect `--wordmark-aspect-ratio: 1.426685` (production header padding). Do not use `SWAG_logo_clean.svg` (stroke outline), `Frame_6_clean.svg` (bakes in the micro-text), or the Group 53 PNG as the hero mask (blurry when scaled). Header stays fixed with wordmark + MENU only (chapter links live in the overlay). **MENU chrome starts hidden after the preloader and fades/slides in as the wordmark docks.** MENU opens a panel-reveal overlay (home / current / order / archive / manifesto / playlists / contact) with hover-grow on the hovered chapter. `order` is a MENU action, not a route — it opens the kloofstreetnights Jotform in a new tab. The chapter in view is marked in Clay. MENU and CLOSE have a small bounce hover. Preloader can be skipped. Waitlist errors stay until the address is valid; `received` can be cleared. CROSS WITH SWAG is the second home poster, revealed as the intro scrolls away. Lenis + GSAP; `prefers-reduced-motion` collapses the intro, docks the mark, and shows MENU with no motion. Chapter navigations (MENU, logo, in-page CTAs, footer) use a 200ms opacity + 8px + 3px-blur View Transition on chapter content; header and MENU stay anchored; MENU home and the wordmark home control land on `#home-hero` once the intro has been seen this session (`swag:home-intro-seen`). First visit still plays `#home-intro`. Reverse scroll still reveals the large mark. Forced scroll-to-top on `/` return visits is gone.

August 2026 Figma source: file `5w6qUwhO5sLBhxJHsqfC0u`, WEBSITE page `204:42`. `order this edition` links to Jotform (`https://form.jotform.com/crosswithswag/order-kloofstreetnights`).

**Colourways on Current:** After Hours `#0A0A0A` and First Light `#EDE7D8` only, in a **two-column poster grid** (not the old five-column V3 strip). Unnamed pink/green and swagy dust are not shown.

## Locked Structure (V3.1 routes)

Six App Router routes with shared `SiteChrome` (preloader, header, footer).

| Route | Chapter | Notes |
|-------|---------|-------|
| `/` | Home | Logo-first intro (`#home-intro`), docked hero fold, then Figma Landing teasers only |
| `/current` | Current edition | Wordmark docked immediately; kloofstreetnights `h1` |
| `/archive` | Archive | Docked wordmark; `EVERY EDITION CLOSES.` as `h1` |
| `/manifesto` | Manifesto | Docked wordmark; `OWE NOTHING.` opener as `h1` |
| `/playlists` | Playlists | Docked wordmark; `THE MIX.` as `h1`; three Spotify embeds |
| `/contact` | Contact | Docked wordmark; `NO PERMISSION NEEDED.` as `h1` |

- `components/v3/SiteChrome.tsx` — client island: skip link, session preloader, header, `#content` wrapper, footer, hash redirect on `/`. Inner routes restore scroll to the chapter head (`#current-head` on Current) after MENU close / view transitions; `/` restores to `#home-hero` after the intro has been seen this session, otherwise to `#home-intro`. Manual `history.scrollRestoration` so iOS does not keep the previous offset.
- `lib/sections.config.ts` — `path` per chapter drives nav/footer/CTA hrefs.
- Wordmark mask `SWAG_mark_fill.svg`, dock `clamp(88px, 11vw, 120px)`, aspect `1.426685` (production header padding; no micro-text).
- Home: hero wordmark scrub against `#home-intro`. Inner routes: `mode="docked"` — no ScrollTrigger, mark seated immediately.
- MENU overlay stays; it lists home, current, order (Jotform, new tab), archive, manifesto, playlists, and contact. No inline header chapter links.
- Shared Figma footer on every route (filled wordmark mask + `CROSS WITH SWAG` tagline). Meta bar includes `V3.3.1`.
- Preloader once per browser session (`swag:preloader-seen`); layout persists across client navigations.

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

- `app/(gallery)/*` — six-route gallery (Home, Current, Archive, Manifesto, Playlists, Contact)
- `app/globals.css` — V3 typographic system (SAND primary text per Figma handoff)
- `components/v3/*` — chapter components, header, wordmark drift/dock, ticker, reveal

## Current Implementation Files (V3.1 six-route gallery)

- `app/(gallery)/layout.tsx` — wraps routes with `SiteChrome`
- `app/(gallery)/template.tsx` — remounts per chapter; wraps content in `ChapterTransition`
- `app/(gallery)/page.tsx` — Home (`HomeChapter` with intro + long landing)
- `app/(gallery)/current/page.tsx` etc. — inner chapter routes including `/playlists`
- `components/v3/SiteChrome.tsx` — shared client chrome island
- `components/v3/ChapterTransition.tsx` — React `ViewTransition` wrapper for chapter enter/exit
- `components/v3/PlaylistBlock.tsx` — editorial Spotify embed block
- `components/v3/chapters/PlaylistsChapter.tsx` — Playlists chapter
- `lib/lenis.ts` — module-level Lenis instance for scroll reset on route change
- `components/ui/*` — shared wordmark / watermark primitives
- `lib/copy.ts` — V3 copy
- `lib/editions.ts` — edition data (archive, colourways, campaign vs clothes artboards)
- `lib/playlists.ts` — playlist data; embed/page URLs derived from `spotifyId`
- `lib/sections.config.ts` — six chapter ids, head ids, hash redirects, and nav config
- `public/assets/` — web-served fill wordmark PNG + winter-drop JPGs + clean SVGs (SVG masters only)
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
- `lib/tokens.css` — unused V2 token sheet (not imported by the live layout). Live CSS tokens live in `app/globals.css`.
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
npm test
npm run lint
npm run build
```

Vitest (`npm test`, `tests/**/*.test.ts`) covers the waitlist/Jotform logic and flags. After UI changes, use browser preview or Playwright for visual QA.

## Coming-soon landing (branch `jotform`, flag `NEXT_PUBLIC_COMING_SOON=1`)

- With the flag on, `HomeChapter` renders `ComingSoonChapter` as `#home-intro` (the first screen) in place of the old logo-first intro spacer, and the old CROSS WITH SWAG hero block is not rendered. Scroll pins `#home` while the poster mark flies into the nav and MENU fades in (see Pin and flight), then the rest of the home (ticker, sections) follows. Flag off = unchanged production behaviour. `isHomeIntroSeen()` is false while the flag is on, so every visit starts on the poster.
- The form posts to `POST /api/waitlist` (`lib/waitlist.ts` validation, `lib/waitlist-handler.ts`, `lib/jotform.ts`). The Jotform API key stays server-side.
- Env: `JOTFORM_API_KEY`, `JOTFORM_FORM_ID`, `JOTFORM_EMAIL_QID`, `JOTFORM_CONSENT_QID`, optional `JOTFORM_CONSENT_VALUE`, `JOTFORM_API_BASE`. Unset = the API returns 503.
- Copy lives in `lib/copy.ts` (`comingSoon`); strings marked `// VERIFY` must be checked against Marcus's Figma copy deck.
- Marcus's Figma overrides the usual rules on this page only: a filled Sand submit button and Clay Light `#C98A70` for errors.

### Pin and flight (flag on only)

- `lib/coming-soon-dock.ts` owns the single pin: one scrubbed GSAP timeline with a ScrollTrigger on `#home` (`top top`, `+=0.6 * innerHeight`, `pin`, `pinSpacing`, `anticipatePin: 1`). `WordmarkDriftDock` (mark flight) and `SiteHeader` (MENU, header line, header solid) only add tweens to that timeline. Never add a second pin or trigger for this sequence.
- The header mark flies from the `.cs-wordmark` rect to the nav slot and ends at the usual dock scale. `html[data-cs-dock]` is `idle` at progress 0 (poster mark visible, header mark hidden) and `flying` after (poster mark `visibility: hidden`, so it keeps its layout box, header mark visible). Scroll back up reverses it. When the flight ends the pin releases and the ticker scrolls normally.
- The header is fully transparent (`--header-solid`) for the whole flight so the "COMING SOON" label and any veil stay visible, then fills solid over the final 5% of the timeline, after the mark lands (`COMING_SOON_LANDING`). It must stay above content (z-index 120). Inner routes keep the solid Void header.
- The "COMING SOON" label (`.cs-label--top`) fades out and drifts up 5px on the same timeline. The fade always lasts 15% of the flight and ends by 70% at the latest; the end is pulled earlier (about 59% on desktop, so it runs about 44% to 59%) so the label is never visible while the mark's glyph box overlaps the label's box. Re-measured on ScrollTrigger refresh.
- Poster scaled to the viewport height: `.cs` carries `--cs-*` tokens (mark width, margins, padding, form gap) that run from their natural size down to a floor as `svh` drops below the height where poster + form + 58px of validation-error headroom just fits (`--cs-ref`: 860px stacked, 902px at 1100px wide and up, 900px under 390px wide). Every floor is reached at 626px tall, so `#home` fits one screen and the pin and flight run on laptops and phones. `svh`, never `vh`/`dvh`, with a `100vh` fallback via `@supports`. `tests/coming-soon-fit.test.ts` evaluates the real CSS expressions at common sizes. Known limit: under about 340px wide the consent text wraps further and the footer note can clip between 621 and about 640px tall.
- Nav already docked (reduced motion, or a screen 620px tall or less): no pin, no flight, the poster mark and label are `display: none`, `--cs-fit: 0` restores the natural sizes, and the header mark and MENU are docked, all in CSS before any script runs. Reduced motion is a live media query. The short-screen decision is NOT: a raw `max-height` media query follows the mobile URL bar immediately. An inline head script (`components/ShortScreenScript.tsx`, flag on only) evaluates `SHORT_SCREEN_QUERY` once into `html[data-cs-short]` ("1" or "0") before first paint; the CSS keys off that attribute and the dock (`lib/short-screen.ts`, `useShortScreen`) reads and updates the same one, re-evaluating only on a width change or a height change of more than 100px from the last evaluated height (the pin is rebuilt only when the decision flips). On the home route, when the nav does not start docked, the same script also sets `data-cs-dock="idle"` (the dock's own attribute and value), so only the poster mark shows before any app script runs; the docked CSS restores header-mark visibility and the dock clears a stale idle if it ends up with no pin. `<html>` has `suppressHydrationWarning` with the flag on. Flag off: no script, no attribute.
- A ResizeObserver on `.cs` refreshes ScrollTrigger. Lenis needs no scrollerProxy (it scrolls the window). The pin is torn down with `scrollTrigger.kill(true)` before the DOM goes, so React never sees GSAP's pin-spacer.
- iOS Safari: `.cs-veil` is `100lvh` on coarse pointers so the URL bar cannot shrink the WebGL layer. DarkVeil skips a height-only canvas realloc on touch (`lib/veil-canvas-size.ts`); the settle gate still holds only `ScrollTrigger.refresh`. The pin scrubs `true` (not `0.25`) and `normalizeScroll` is on for the coming-soon pin only. Lenis stays desktop-only.

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
| **V3.1 Figma restyle** | ✅ PRODUCTION | Marcus August 2026 WEBSITE reworkings: five routes, filled SVG wordmark, docked landing fold, two-up colourways, kloofstreetnights 8-look clothes grid. Merged to `main` at `0d84e8f`. |
| **V3.2.0** | ✅ SHIPPED | Mobile wordmark dock smoothness (cached metrics, compositor hints, header line via `::after`) + footer version label `V3.2.0`. Five-route V3.1 architecture unchanged. |
| **V3.2.2** | ✅ PRODUCTION | Current intake / Home mobile spacing, MENU overlay navigation reliability, Home MENU/wordmark lands on `#home-hero` (CROSS WITH SWAG) after the intro has been seen; `#home-intro` remains reverse-scroll only; footer label `V3.2.2`. |
| **V3.3.0** | ✅ SHIPPED | Sixth route `/playlists`. Spotify embeds, curator credits, local covers. No OAuth / Web Playback SDK / secrets. Footer `V3.3.0`. |
| **V3.3.1** | 🛠 THIS BRANCH | Current intake scoped poster CTA: larger Clay order control, shortened helper, new-tab cue. Home `.btn`s and MENU `order` unchanged. Footer `V3.3.1`. |

## Open Questions for Marcus

**Still open:**

- Analytics provider (Vercel Analytics, Plausible, GA4, etc.).
- Public launch date / further announcement.
- Whether community block should become a dedicated page/section expansion.
- Waitlist backend and possible later Cloudflare (Workers/Pages) move. Not now. Frontend stays on the current Next.js/Vercel stack until a move is proven cheaper and requires no frontend rewrite.
**Resolved (cutover):**

- Jotform order form wired for `order this edition` on Current and `order` in the MENU overlay (`https://form.jotform.com/crosswithswag/order-kloofstreetnights`).

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
