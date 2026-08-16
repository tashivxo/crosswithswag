# swag. V1 — Stitch Screen Compositions

**Status:** Imported from Stitch via MCP (6 July 2026). Pending Marcus visual review.

## Stitch project

- **Project:** Swag Digital Gallery
- **Project ID:** `13963128826767633115`
- **Manifest:** `stitch-project-files/project-manifest.json`

## Exported assets

| File | Screen |
|------|--------|
| `screens/00-wearable-editions-full-scroll.png` | Full scroll composite |
| `screens/01-hero.png` | Hero / Landing (desktop) |
| `screens/01-hero-mobile.png` | Hero (mobile) |
| `screens/02-manifesto.png` | Manifesto |
| `screens/03-swag-expression.png` | Authentic Expression (Black) |
| `screens/04-swag-authority.png` | Internal Authority (Sand) |
| `screens/05-swag-presence.png` | Presence (Stone Grey) |
| `screens/06-edition-kloofstreetnights.png` | kloofstreetnights Edition (Clay) |
| `screens/07-swag-weight.png` | Density / Weight (Stone Grey) |
| `screens/08-closing.png` | Closing Statement |

HTML exports are in `html/` for agent reference.

## What this folder is for

Screenshots and HTML exported from Stitch for Marcus review and agent reference. The live Next.js site is **not** updated until Marcus approves these compositions.

## Source references

- Design system: `../stitch/DESIGN.md`
- Copy-verified prompts: `../stitch/SCREEN_PROMPTS.md`
- Prompt audit: `../STITCH_PROMPTS_VERIFICATION_SUMMARY.md`
- Locked copy: `../lib/copy.ts`

## Marcus review

See `../STITCH_REVIEW_NOTES.md` at repo root.

## After Marcus approves

Only then: translate approved Stitch layouts into `components/sections/*` and `app/globals.css` polish. Do not skip the review gate.
