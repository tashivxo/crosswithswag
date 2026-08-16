# Stitch Prompts Verification Summary

**Date:** 6 July 2026  
**Audited by:** Cursor agent (Stitch prompts finalization)  
**Status:** Ready for manual Stitch generation

---

## Audit scope

Verified `stitch/SCREEN_PROMPTS.md` against:

- `lib/copy.ts` (locked copy source of truth)
- `lib/sections.config.ts` (section colours, bleed words, statement distribution)
- `cursor.md/marcus-signoff-checklist.md` (Marcus sign-off record)
- `public/assets/winter-drop/` (Edition photography)
- `public/assets/SWAG_logo_clean.svg` (wordmark asset)
- Live section components in `components/sections/*`

---

## Results

| Check | Status | Notes |
|-------|--------|-------|
| Hero tagline | PASS | `WEARABLE EDITIONS` from `hero.edition` |
| Hero ghost watermark | PASS (fixed) | Was incorrectly "SWAG"; corrected to `NOTH- / OWE / ING.` per `sections.config.ts` |
| Wordmark | PASS (fixed) | Prompt now references `SWAG_logo_clean.svg`, not typed font |
| Manifesto copy | PASS (fixed) | All 7 paragraphs + sign-off `— the director.` embedded verbatim |
| Manifesto label | PASS (fixed) | Removed erroneous `WHAT IS SWAG?` label; manifesto uses `WEARABLE EDITIONS` heading only |
| SWAG distribution 4-3-3-4 | PASS | Sections 3, 4, 5, 7 match `swagModules` in `lib/copy.ts` |
| Bleed words | PASS | EXPRESSION, AUTHORITY, PRESENCE, WEIGHT |
| Edition copy | PASS (fixed) | Exact dinner story, `****` redaction, `-the.director`, `kloofstreetnights.`, CTA |
| Edition layout order | PASS | Label `WEARABLE EDITION` → title `kloofstreetnights` matches `EditionSection.tsx` |
| Winter Drop photography | PASS | `Artboard1.jpg`, `Artboard2.jpg`, `Artboard3.jpg` exist in `public/assets/winter-drop/` (17 files total) |
| Closing statement | PASS | `NOTHING` / `OWING.` from `close` |
| Brand colours | PASS | `#0A0A0A`, `#575D61`, `#8C5E4A`, `#D6D1C4` only |
| Anti-pattern guardrails | PASS | Global instruction blocks ecommerce/SaaS/gradient patterns |

---

## Changes from previous `SCREEN_PROMPTS.md`

1. **Expanded from 6 to 8 screens** — added Presence (Stone Grey) and Density/Weight (Stone Grey) posters so all four SWAG modules and bleed words are represented.
2. **Embedded exact copy** — no paraphrased placeholders ("the dinner story" removed).
3. **Fixed hero ghost** — `NOTH- / OWE / ING.` not `SWAG`.
4. **Fixed manifesto** — removed wrong label; added full body text and em-dash sign-off.
5. **Edition assets** — named specific Artboard files from `edition.imagery.assets`.
6. **Added global instruction** — design guardrails to reduce AI-slop drift in Stitch output.

---

## Screen inventory (8 desktop + Hero mobile)

| # | Screen | Background | Statements |
|---|--------|------------|------------|
| 1 | Hero | Void Black | — |
| 2 | Manifesto | Void Black | — |
| 3 | Authentic Expression | Void Black | 4 |
| 4 | Internal Authority | Sand | 3 |
| 5 | Presence | Stone Grey | 3 |
| 6 | kloofstreetnights Edition | Clay | — |
| 7 | Density / Weight | Stone Grey | 4 |
| 8 | Closing | Void Black | — |

Colour sequence represented: `Black → Black → Black → Sand → Stone → Clay → Stone → Black`

---

## Known non-blockers

- **Footer** — optional reference prompt only; not required for Marcus visual review.
- **`screen-prompts.md`** — legacy fuller prompt pack; superseded by this file. Safe to delete.
- **`stitch/DESIGN.md` Section 9** — manifesto copy uses em dashes; matches `lib/copy.ts`. Edition sign-off uses `-the.director` (no em dash) — intentional per Marcus sign-off.
- **"Simply is." circle** — optional accent in SWAG poster prompts; present in `SwagPosterSection.tsx`, referenced in `cursor.md/design.md`. Not in `lib/copy.ts` but is established brand language.
- **Stitch MCP tools** — still may not load in Cursor workspace cache; manual Stitch UI is the primary path for Phase 1.

---

## Pre-Stitch checklist (for you)

Before pasting into Stitch:

- [ ] Paste `stitch/DESIGN.md` as design system context first
- [ ] Paste global instruction once
- [ ] Generate screens 1–8 in order
- [ ] Upload Winter Drop photos (`Artboard1–3.jpg`) for Screen 6
- [ ] Use `SWAG_logo_clean.svg` for wordmark on Screen 1
- [ ] Export 2× screenshots to `swag-v1-stitch-compositions/screens/` after generation

---

## Build verification

Run after any further copy changes:

```bash
npm run lint
npm run build
```

---

**Verdict:** Prompts are copy-complete and aligned with Marcus's locked decisions. Safe to send to Stitch.
