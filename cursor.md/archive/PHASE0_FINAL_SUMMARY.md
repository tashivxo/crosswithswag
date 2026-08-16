# Phase 0 — Finalization Complete

**Date:** 5 July 2026  
**Marcus sign-off received:** yes

## Locked Decisions

### Copy
- [x] Manifesto (final — original Wearable Editions text locked)
- [x] Hero tagline: `WEARABLE EDITIONS`
- [x] 14 SWAG statements (grouped by section and thematic arc)
- [x] Bleed display words (`EXPRESSION` / `AUTHORITY` / `PRESENCE` / `WEIGHT`)
- [x] Meta descriptions (no draft labels)
- [x] Section 6 kloofstreetnights copy, sign-off, closing statement, CTA, and campaign photography

### Design
- [x] Typeface: Instrument Sans (400, 500, 700)
- [x] Brand colours (Void Black, Stone Grey, Clay, Sand)
- [x] Scroll colour map (`Black → Black → Black → Sand → Stone → Clay → Stone → Black`)
- [x] Bleed display system (oversized type, low opacity, clipped at section edges)

### Motion
- [x] Transition style: scroll-linked interpolation (not crossfade, not push)
- [x] Ghost watermark: slow parallax (`0.3x` scroll speed)
- [x] Reveal animations: configured in `lib/motion.config.ts`; applied via GSAP stubs
- [x] Principle: restraint-as-strategy (no kinetic effects, no hype)

### Build
- [x] `npm run build` passes
- [x] `npm run lint` clean
- [x] Vercel preview live at: `https://crosswithswag.vercel.app`
- [x] All Draft 1 labels removed from code and active docs
- [x] `lib/copy.ts` updated with final values
- [x] `lib/motion.config.ts` locked to scroll-linked
- [x] `AGENT_CONTEXT.md` Phase 0 marked COMPLETE

## Pending (non-blocking)

- [ ] Stitch screen compositions — visual review pending
- [ ] Production domain name (async)
- [ ] Analytics provider selection (async)
- [ ] Public launch date (async)

## Next: Stitch Screen Generation (Phase 1)

All prerequisites met. Ready to:

1. Paste `stitch/DESIGN.md` into Stitch MCP
2. Generate 5–6 screen compositions (Hero, Manifesto, SWAG on Black, SWAG on Sand, Edition, Close)
3. Review screen outputs for layout fidelity, type hierarchy, colour accuracy
4. Share screenshots with Marcus for visual approval

**Timeline:** Stitch generation ~2–3 hours (including visual review)

---

**Signed off:** Phase 0 finalization complete. Proceeding to Phase 1 Stitch generation.
