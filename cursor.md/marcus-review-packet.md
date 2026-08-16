# Marcus Review Packet
## swag. V3 production

## Review links

- Production (V3): https://crosswithswag.co.za
- Production alias: https://crosswithswag.vercel.app
- Vercel inspect (current production): https://vercel.com/tashivxos-projects/crosswithswag/CjUfoZ46aAePpPkFnj7eQpMdEZpy
- Frozen V2 (design mining only): https://crosswithswag-git-v2-production-freeze-tashivxos-projects.vercel.app

Vercel Authentication is currently off, so these URLs are publicly viewable. Do not treat a login screen as a build failure without checking Vercel.

## What to review

1. **Live V3 production** — five-chapter scroll (Home / Current / Archive / Manifesto / Contact). Wordmark + MENU header, chapter overlay, kloofstreetnights current edition, archive, manifesto, contact/waitlist.
2. **Frozen V2** — eight-section Canva whiteboard build on `v2-production-freeze`. Reference-only for mining layouts, motion, and copy. Not production.
3. **Stitch screen compositions (historical)** — 8 desktop screens in Stitch. Checklist: `cursor.md/archive/STITCH_REVIEW_NOTES.md`. Export folder: `archive/stitch-compositions/swag-v1-stitch-compositions/screens/`.

## Stitch handoff

- Stitch semantic design system: `stitch/DESIGN.md`
- Copy-verified prompts used: `stitch/SCREEN_PROMPTS.md`
- Prompt audit: `cursor.md/archive/STITCH_PROMPTS_VERIFICATION_SUMMARY.md`
- Marcus review checklist: `cursor.md/archive/STITCH_REVIEW_NOTES.md`

## Verification

- `npm run lint` passes
- `npm run build` passes
- Vercel production build completed successfully (August 2026 V3 cutover)

## Decisions still pending

- Analytics provider
- Public launch announcement
- Community-page scope
