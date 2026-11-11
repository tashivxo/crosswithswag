---
goal: Implement Marcus 11 Nov 2026 Figma V4.1 review comments on CROSSWITHSWAG node 398:262
version: 1.0
date_created: 2026-11-11
last_updated: 2026-11-11
owner: Tashiv / V4_branch
status: Implemented
tags:
  - feature
  - design
  - v4
  - marcus-feedback
---

# Introduction

![Status: Implemented](https://img.shields.io/badge/status-Implemented-brightgreen)

Implement Marcus Sibiya’s 11 November 2026 Figma comments on [CROSSWITHSWAG node 398:262](https://www.figma.com/design/lcZqp5HNaFCPBcWgPzAwUU/CROSSWITHSWAG?node-id=398-262). He compared the live V4.1 prototype to the original V4.1 gallery-home screens. This plan covers only those comments. ZIP extraction is out of scope.

**Review (2026-11-11):** Implemented on `V4_branch`. Review pass pinned cream-surface tokens on `/space` photo islands and the playlist popup (Sand type, Void filled actions), stopped reduced-motion shop-card hover from blanking the front image, and swapped 01 logo tiles off `next/image` (SVG). Marcus Figma comments stay unresolved until he re-reviews.

**Source of truth:** Figma file `lcZqp5HNaFCPBcWgPzAwUU`. Gallery home = frame `398:1268` / original `21:24`. Playlist popup = `398:1568`. Shop cards = live `/` plus hover refs `398:9761` (front full) and `398:9776` (front detail). Footer lockup = Group `398:1562`.

**Branch:** `V4_branch` only. Do not change production `main`.

Marcus’s comments (thedirector, unresolved, 2026-11-11):

| ID | Pin | Verbatim |
|----|-----|----------|
| 2004297643 | `398:1546` live SPACE | SPACE encapsulates who we are in one fell swing. It needs to tell people who we are. thats why the structure is important. |
| 2004303788 | `398:262` hero | first thing is clothes (obviously), both standard edition and archive. |
| 2004306463 | `398:262` 01/02 | Prototype is missing both this and the above section. The logos will most probably be replaced by a hero shot from our recent cavendish shoot. |
| 2004309855 | `398:262` manifesto | Another missing section from the prototype. A short preview of our manifesto. Image treatment remains the same, acts as a dark low apacity background but still kept to high quality. Animations on words hovering applies. |
| 2004313172 | `398:1268` clothes | Set on Prototype has two images whereases the original has 8 images. link click should lead to Archive gallery section. |
| 2004316084 | `398:262` ending | last missing section from the prototype. What's coming next. Image treatment remains the same |
| 2004347139 | `398:262` footer | Logo incomplete. "cross with swag" needs to be like this one below. goes for every footer. |
| 2004353087 | `398:1568` | Pop up needed, only when you enter "SPACE" |
| 2004357630 | `398:262` tees + reply "see right" | Change to single image and add hover effect. Goes for all Tees. |
| 2004366153 | `398:9825` nav | playlist missing |
| 2004368753 | `398:262` lockup | Logo with crosswithswag to be inserted. |

Out of scope (older pins, not this review): Jotform URL, React Bits Dark Veil, breadcrumb note, “BROKE”, playlist page screen `265:262` (already a `/playlists` route).

## 1. Requirements & Constraints

- **REQ-001**: Rebuild `/space` as Figma gallery home `398:1268` / `21:24`. Current `SpaceChapter` (THE SPACE. + three cards + 3 photos + 2-image set) is not the gallery home. `HomeChapter variant="space"` exists but is unused and still V3-ordered (kloofstreetnights first). Do not revive that V3 order.
- **REQ-002**: SPACE section order, top to bottom, must be: docked header → Hero `CROSS` / `WITH SWAG` → ticker → **01 The Standard Edition** → **02 The Space** (SWAG.BASH / BOILER ROOM SESSIONS / ARTIST SPOTLIGHTS) → **03 The Editions** (garment / campaign image / framed print) → **04 Manifesto teaser** → **05 What Is Swag** → **06 eight-look archive grid** → **07 EVERY EDITION CLOSES archive index** → **08 The List** → Closer `CROSS WITH SWAG` → footer.
- **REQ-003**: First content after the hero/ticker is clothes: 01 standard edition, and later 06 archive looks. Do not lead SPACE with only events/photos.
- **REQ-004**: Keep the three SPACE object cards. They are the identity block. Copy already lives in `spacePage.objects` (`lib/copy.ts`).
- **REQ-005**: 01 The Standard Edition ships now using Figma `398:1302` (four logo tiles + “standard edition” copy + `SEE THE RANGE` → `/#shop` and `SHOP THE STANDARD EDITION →` → `/#shop`). Cavendish hero shot is a later image swap in the same slot when Marcus delivers files. Do not block 01 on Cavendish.
- **REQ-006**: 04 Manifesto teaser uses Figma `398:1323` copy (`OWE NOTHING.`, the two body lines, `READ THE MANIFESTO` → `/manifesto`). Background is a high-quality photograph at low opacity / dark scrim (`manifestoPhotos.backdrop` `_DSC0587`). Do not replace the photo with a flat colour.
- **REQ-007**: Manifesto teaser words use hover colour animation (Clay on the emphasized phrases and/or dense lines). Static composition must remain readable with `prefers-reduced-motion: reduce` (no animation, full opacity type).
- **REQ-008**: 06 is an 8-cell look grid (Figma `398:1345`, labels `[ 06 — THE ARCHIVE ]` + `ENTER GALLERY →`). Use the eight kloofstreetnights looks already listed in `clothesArtboards` (`lib/editions.ts`: artboards 2, 3, 4, 6, 7, 8, 10, 11). Remove the live SPACE `ImageSet` “open the set (2)” as the archive preview. The section, the CTA, and each look link to `/archive`.
- **REQ-009**: 07 + 08 + closer are the last missing photo-backed block Marcus labeled “What's coming next”. Same photo treatment as 04 (high-quality image, dark low-opacity overlay). 07 copy from `398:1436` (including “the standard edition never closes”). 08 from `398:1481`. Closer from `398:1492` (`[ NOTHING OWING ]` + `CROSS WITH SWAG`). Reuse `WaitlistForm` for 08; do not add a new waitlist backend.
- **REQ-010**: Playlist popup `398:1566`/`398:1568` appears only after navigation onto `/space` (desktop and mobile). Never on `/`, `/playlists`, or other routes. Dismiss via `[ CLOSE ]`, `NOT NOW`, Escape, and scrim click. `SEE ALL THREE PLAYLISTS →` goes to `/playlists`. Each `LISTEN →` goes to that playlist’s `/playlists#slug` (or live Spotify URL if already used on `/playlists`). Show once per browser session via `sessionStorage` key `swag:space-playlist-popup-seen`.
- **REQ-011**: Desktop nav (≥900px) and mobile overlay MENU must include PLAYLISTS on every route. `desktopNavItems` in `lib/sections.config.ts` already lists it. Figma headers `21:277` and `398:1270` omit it; Marcus’s comment wins — keep PLAYLISTS.
- **REQ-012**: Every footer uses the Group `398:1562` lockup: `swag.` glyph plus `CROSS WITH SWAG` as one artwork (same as `public/assets/Frame_6_clean.svg` / Group 53). Do not leave the footer as fill-only `SWAG_mark_fill.svg` plus a separate Instrument Sans `.foot-tagline`. Header / docked nav mark stays `SWAG_mark_fill.svg` (no micro-text). Keep `@crosswithswag` and the meta bar.
- **REQ-013**: Shop cards (`ShopCard` on `/`) show one front-full image per tee. On `hover: hover` and `pointer: fine`, crossfade to that tee’s front-detail. Applies to all nine `standardProducts`. Default `product.images.card` must be `*_front.jpg`, hover source `*_front-detail.jpg` (all nine files already exist under `public/assets/v4/shop/`). Cart thumbs use the front-full, not the composite `product-X.jpg`.
- **REQ-014**: `/` remains Figma `21:277` shop landing + standard-edition grid. Do not move the 01–08 gallery-home sections onto `/`.
- **CON-001**: Work on `V4_branch`. Figma wins over V3 section composition. Mobile `<900px` overlay MENU stays. Four brand colours only. CTAs stay text links except where Figma `398:1568` specifies filled popup actions (`SEE ALL THREE PLAYLISTS` filled Void, `NOT NOW` outline).
- **CON-002**: `prefers-reduced-motion: reduce` disables shop-card hover swap, manifesto word motion, and popup enter motion. Popup still functions.
- **CON-003**: Cavendish shoot files are not in the repo. 01 ships with the four logo tiles from `398:1302` until Marcus sends the hero.
- **CON-004**: Do not change DNS, Vercel production branch, or `main`.
- **GUD-001**: Instrument Sans 400/500/700. Cream surface on `/space`. Text links, no pills/cards/rounded ecommerce blocks on the gallery home.
- **PAT-001**: Keep V3 shell (`SiteChrome`, Lenis, preloader, docked wordmark). Extend `SpaceChapter`; do not create a parallel `.v4-*` chrome.
- **PAT-002**: Copy for new SPACE sections is taken verbatim from Figma `398:1268` children listed in this plan. Update `lib/copy.ts` (`spacePage`) rather than hardcoding strings in JSX.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Global chrome — footer lockup on every route, PLAYLISTS present in desktop and mobile nav.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Add a footer-only lockup class (e.g. `.foot-lockup`) that masks/paints `public/assets/Frame_6_clean.svg` (Group 53: `swag.` + `CROSS WITH SWAG`). Keep `.wordmark` / `SWAG_mark_fill.svg` for the header dock. Update `.foot-mark` sizing to the lockup aspect (do not crop off `CROSS WITH SWAG`). Remove the duplicate `.foot-tagline` paragraph from `components/v3/SiteFooter.tsx` so the words are not repeated. Leave `footer.handle` and `foot-base` as they are. | yes | 2026-11-11 |
| TASK-002 | Confirm `getDesktopNavItems()` and `navItems` both include `playlists` on `/`, `/space`, `/archive`, `/manifesto`, `/playlists`, `/contact`, `/current`, `/cart`. If any route hides it, restore it. Do not copy Figma `398:1270` (no PLAYLISTS). | yes | 2026-11-11 |
| TASK-003 | Visual check: footer lockup on cream (`/`, `/space`) and photo (`/manifesto`) surfaces. Contrast stays Sand on Void/cream; on manifesto photo, keep the existing cream footer treatment. | yes | 2026-11-11 |

### Implementation Phase 2

- GOAL-002: Shop cards — single front image, hover to front detail, all nine tees.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-004 | In `lib/v4/products.ts`, default `shopImages()` `card` to `*_front.jpg`. Add `hover: string` (the `*_front-detail.jpg`). `productCardImage()` continues to return the front-full for cards, cart, and related thumbs. | yes | 2026-11-11 |
| TASK-005 | Update `components/v4/shop/ShopCard.tsx`: stack two `next/image` layers in `.land-card__media` (front default, detail on hover). CSS in `app/globals.css` under `.land-card__media`: `object-fit: cover`; `@media (hover: hover) and (pointer: fine)` opacity crossfade ~180ms; `@media (prefers-reduced-motion: reduce)` show front only. No hover on coarse pointers. | yes | 2026-11-11 |
| TASK-006 | Delete dependence on composite `product-X.jpg` for cards. Leave those files in `public/assets/v4/shop/` unused. Verify all nine slugs have both `_front.jpg` and `_front-detail.jpg` (they do as of this plan). | yes | 2026-11-11 |

### Implementation Phase 3

- GOAL-003: Rebuild `/space` to Figma gallery home `398:1268`.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-007 | Expand `spacePage` in `lib/copy.ts` with Figma `398:1268` strings: hero labels `[ STANDARD EDITION — 13.11 ]` / `CAPE TOWN — EST. 2026` / `[ MORE THAN CLOTHES ]` / intro already on `spacePage.intro`; hero CTAs `THE STANDARD EDITION` → `/#shop` and `THE ARCHIVE` → `/archive`; ticker items from `398:1296`; 01 from `398:1302`; 02 from existing `spacePage.objects`; 03 from `home.structure` (garment / campaign image / framed print) under `[ 03 — THE EDITIONS ]` / `THREE OBJECTS — ONE THOUGHT`; 04 from `398:1323`; 05 from `home.whatIsSwag` under `[ 05 — AUTHORITY ]`; 06 from `398:1345`; 07 from `398:1436` (update edition 002 name to `crosswithswag — standard edition` on this page only if Figma differs from `lib/editions.ts`); 08 from `398:1481`; closer from `398:1492`. | yes | 2026-11-11 |
| TASK-008 | Rewrite `components/v3/chapters/SpaceChapter.tsx` to render REQ-002 order. Keep `id="space"` and `id="space-head"` on the hero. Do not render `ShopChapter`. Reuse `Ticker`, `Reveal`, `ImageGrid`, `EditionRow`, `WaitlistForm`. Cream surface already on `/space` via `creamSurfaceRoutes`. | yes | 2026-11-11 |
| TASK-009 | 01 Standard Edition layout follows `398:1302`: four-tile logo grid (assets already in Figma; export from `398:1306` if not in `public/assets/v4/`) + copy + outline `SEE THE RANGE` / `SHOP THE STANDARD EDITION →` as `.tlink` to `/#shop`. Comment in code that the tile grid is a Cavendish placeholder (REQ-005). | yes | 2026-11-11 |
| TASK-010 | 04 Manifesto teaser: full-bleed photo (`manifestoPhotos.backdrop`) + dark overlay (low opacity, photo still sharp). Type in Sand. Hover: emphasized words in the body (`owe nothing`, `stop explaining`, `stop convincing`, `start being`) and/or `.dense` lines shift to Clay. Reduced motion: no colour tween. CTA `READ THE MANIFESTO` → `/manifesto`. | yes | 2026-11-11 |
| TASK-011 | 06 eight-look grid: `ImageGrid` with `clothesArtboards`. Head `[ 06 — THE ARCHIVE ]` + `ENTER GALLERY →` (`/archive`). Wrap the grid in a `Link` to `/archive` (or each cell). Remove `ImageSet` extras from SPACE. | yes | 2026-11-11 |
| TASK-012 | 07/08/closer share the same photo treatment as 04 (continuous scrim, no new colour). 07 lists six editions from Figma `398:1436`. 08 uses `WaitlistForm` with Figma body “first access to each drop. the standard edition, swag.bash, the sessions.” Closer is display type `CROSS / WITH / SWAG` with WITH in Clay. | yes | 2026-11-11 |

### Implementation Phase 4

- GOAL-004: SPACE-only playlist popup from Figma `398:1568`.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-013 | Add client component `components/v4/PlaylistPopup.tsx` (or under `components/v3/`) matching `398:1596`: label `[ NEW — PLAYLISTS ]`, close `[ CLOSE ]`, display `SOUND COMES FIRST.`, lede “three playlists for three moments. free to save, always open.”, three rows (STEP / DALA / FREEFALL) with existing covers in `public/assets/playlists/`, `LISTEN →`, filled Void `SEE ALL THREE PLAYLISTS →`, outline `NOT NOW`. Scrim over the SPACE hero. Focus trap + Escape. `aria-modal="true"`. | yes | 2026-11-11 |
| TASK-014 | Mount the popup only from `SpaceChapter` / `/space`. Open on first `/space` enter per session (`sessionStorage` `swag:space-playlist-popup-seen`). Do not open on internal hash changes. After dismiss, do not reopen this session. | yes | 2026-11-11 |
| TASK-015 | Popup header behind the scrim may omit PLAYLISTS in Figma; the real `SiteHeader` stays visible and still includes PLAYLISTS. Do not hide site chrome. | yes | 2026-11-11 |

### Implementation Phase 5

- GOAL-005: Verify, lint, and record.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-016 | Browser-check `/` (nine cards, hover detail, PLAYLISTS, footer lockup), `/space` (full section order, popup once, 8-grid → `/archive`, manifesto photo + hover, 07/08/closer), `/archive`, `/manifesto`, `/playlists`, `/contact`. Desktop ≥900px and a mobile viewport. Reduced-motion: no hover swap, popup still closable. | yes | 2026-11-11 |
| TASK-017 | `npm run lint` and `npm run build`. Add/adjust tests only if popup session key or card image helpers need them (`tests/**`). | yes | 2026-11-11 |
| TASK-018 | Update `AGENT_CONTEXT.md` V4.1 notes: `/space` is gallery home `398:1268`; footer lockup; shop-card hover; SPACE popup. Leave Marcus comments unresolved in Figma until he re-reviews. | yes | 2026-11-11 |

## 3. Alternatives

- **ALT-001**: Point `/space` at unused `HomeChapter variant="space"`. Rejected: that variant still leads with kloofstreetnights as “current edition” and V3 section numbers. Figma 01 is the standard edition.
- **ALT-002**: Put gallery-home sections on `/` under the shop. Rejected: Marcus’s pins are on “gallery home (reached from enter the site)”. `/` stays `21:277` + shop grid (REQ-014).
- **ALT-003**: Keep footer as fill mark + Instrument Sans “CROSS WITH SWAG”. Rejected: Marcus called that incomplete and pointed at Group 53.
- **ALT-004**: Show the playlist popup site-wide. Rejected: “only when you enter SPACE”.
- **ALT-005**: Wait for Cavendish files before building 01. Rejected: Marcus said the logos will “most probably” be replaced; ship the section with the four tiles.

## 4. Dependencies

- **DEP-001**: Figma file `lcZqp5HNaFCPBcWgPzAwUU`, frames `398:1268`, `398:1568`, `398:1302`, `398:1345`, `398:1436`, `398:1562`. REST exports already under `marcus-assets/figma-v4/exports/marcus-feedback/`.
- **DEP-002**: Existing shop front/detail JPEGs in `public/assets/v4/shop/`.
- **DEP-003**: Existing playlist covers in `public/assets/playlists/`.
- **DEP-004**: Existing manifesto/archive photos in `public/assets/v4/archive/` (`_DSC0587` backdrop, eight clothes artboards in `public/assets/winter-drop/`).
- **DEP-005**: `public/assets/Frame_6_clean.svg` for the footer lockup.
- **DEP-006**: Cavendish hero (not in repo) — optional later swap in 01, not a start dependency.
- **DEP-007**: Waitlist API already used by `WaitlistForm` (`POST /api/waitlist`). No new backend.

## 5. Files

- **FILE-001**: `components/v3/SiteFooter.tsx` — lockup mark, drop duplicate tagline.
- **FILE-002**: `app/globals.css` — `.foot-mark` / `.foot-lockup`, `.land-card__media` hover layers, SPACE gallery-home and manifesto-teaser photo/hover, popup.
- **FILE-003**: `lib/v4/products.ts` — card = front, add hover detail path.
- **FILE-004**: `components/v4/shop/ShopCard.tsx` — two-layer hover.
- **FILE-005**: `lib/copy.ts` — expand `spacePage` from Figma `398:1268`.
- **FILE-006**: `components/v3/chapters/SpaceChapter.tsx` — full gallery home.
- **FILE-007**: `components/v4/PlaylistPopup.tsx` — new SPACE popup.
- **FILE-008**: `lib/sections.config.ts` — no PLAYLISTS regression (verify only).
- **FILE-009**: `AGENT_CONTEXT.md` — V4.1 state after implementation.
- **FILE-010**: `components/v3/chapters/HomeChapter.tsx` — leave shop variant as `/`; do not mount space variant.

## 6. Testing

- **TEST-001**: `npm run lint`
- **TEST-002**: `npm run build`
- **TEST-003**: Manual `/` — each of nine cards shows one tee; hover (mouse) shows detail; touch shows front only; cart line image is front-full.
- **TEST-004**: Manual `/space` — section order matches REQ-002; 8 looks; ENTER GALLERY and looks go to `/archive`; manifesto photo visible; 07 lists six editions.
- **TEST-005**: Manual popup — first `/space` visit opens it; Close / Not now / scrim / Escape dismiss; second visit same session does not reopen; `/` never opens it; See all three → `/playlists`.
- **TEST-006**: Manual nav — PLAYLISTS on desktop header and mobile MENU on `/` and `/space`.
- **TEST-007**: Manual footer — lockup includes `CROSS WITH SWAG` as part of the mark on every route, not a second text line of the same words.
- **TEST-008**: `prefers-reduced-motion: reduce` — no card swap, no word tween, popup still usable.

## 7. Risks & Assumptions

- **RISK-001**: Cavendish assets delay 01 polish. Mitigate by shipping logo tiles now.
- **RISK-002**: “What's coming next” is not a named Figma frame. Assumed to be 07+08+closer on the shared photo (last missing block after the 8-grid, same image treatment). If Marcus meant a new unique section, stop and ask before inventing copy.
- **RISK-003**: Footer lockup (`Frame_6_clean.svg`) previously banned for the header because it bakes in micro-text. Using it in the footer only is an explicit override from this review.
- **RISK-004**: Figma popup uses filled buttons. Allowed as a Figma exception on this overlay only.
- **ASSUMPTION-001**: `/` shop landing hero stays `swag.` without the lockup (`21:277`). Lockup is footer-wide (comments 2004347139 and 2004368753).
- **ASSUMPTION-002**: Playlist popup once per session is the right frequency; Marcus did not specify. Reopen every visit would be noisy.
- **ASSUMPTION-003**: Eight looks are the kloofstreetnights clothes artboards already used on `/current`, not a new shoot.
- **ASSUMPTION-004**: ZIP files Marcus could not extract are unrelated to this comment set.

## 8. Related Specifications / Further Reading

- [Figma 398:262 — Marcus review board](https://www.figma.com/design/lcZqp5HNaFCPBcWgPzAwUU/CROSSWITHSWAG?node-id=398-262)
- [Figma 398:1268 — gallery home](https://www.figma.com/design/lcZqp5HNaFCPBcWgPzAwUU/CROSSWITHSWAG?node-id=398-1268)
- [Figma 398:1568 — playlist popup](https://www.figma.com/design/lcZqp5HNaFCPBcWgPzAwUU/CROSSWITHSWAG?node-id=398-1568)
- `AGENT_CONTEXT.md` — V4.1 Figma-wins rule, `V4_branch`
- `cursor.md/design.md` — colour and type
- `lib/copy.ts` — `spacePage`, `home`, `landing`, `footer`
- `marcus-assets/figma-v4/exports/marcus-feedback/` — screenshots of pins used for this plan
