# swag. — Brand Copy & Confirmed V1 Scope
## `brand-copy.md` — Developer Reference

> Source: director (Marcus) confirmation, sent direct. This file is the canonical source for (1) manifesto and raw copy used across site sections and (2) the confirmed V1 scope, which **supersedes** the draft scope in `swag_website_v1_prd.md` Section 4/5 and the draft site structure in Section 6.
>
> Read alongside `design.md` (visual/typographic system) and `swag_website_v1_prd.md` (original draft brief).

---

## 1. Manifesto — Wearable Editions (Draft 1)

**Status: Director-sent, not yet locked.**

```
We stopped explaining ourselves a long time ago.

swag. is not a collection. It is not a drop. It is not content.

Each piece exists once — conceived, made, and released into the world as a singular object. The garment. The image. The frame on your wall. All the same thoughts, held in different forms.

We call them wearable editions because that is what they are. Not a product. Not merch. Objects that carry a point of view — made for the people who already know who they are.

We owe nothing to anyone. We occupy the space of those who have already accepted themselves.

This is not for everyone.

It was never meant to be.

— the director.
```

**Hero tagline:** `WEARABLE EDITIONS` (small caps label under wordmark)

**Key difference from identity deck manifesto:** Rejects traditional "drop" framing in favour of wearable editions philosophy — singular objects, not collections or commercial drops. Section 6 (kloofstreetnights) remains a release showcase but is reframed as a **Wearable Edition** presentation to align with this philosophy.

---

## 2. Recurring Brand Statements (raw copy)

Use these as the raw material for "What is SWAG?" section modules. Distribute across sections 3, 4, 5, and 7 per the layout in `design.md` Section 7. Do not invent new brand statements — pull only from this list unless the director supplies more.

```
A home for individuals
Does not seek permission to exist
Speaks to be true, not approved
Represents your internal authority
Emanates presence
Does not beg to be understood
Commands respect without raising a voice
Is daily practice. Is consistency.
Has density. Does not fragment.
Alchemises pain. Uses ruptures to reconstruct.
Has weight. Embodies a new internal movement.
Upholds truth without hesitation
Refuses to negotiate what is essential to you
Says come as you are
```

These pair with the Wearable Editions manifesto (Draft 1) and "Simply is." line documented in `design.md` Section 1.

---

## 3. Goals for V1 — ✅ CONFIRMED

- Establish a digital home for swag. that matches the tone and density of the physical/print brand world
- Communicate the brand ethos through type-led, gallery-style storytelling — not product grids
- Funnel all activity toward **@crosswithswag** (releases remain online/Instagram-only for now)
- Build a clean technical foundation that supports planned v2/v3 features without rework

---

## 4. Scope — In Scope for V1 — ✅ CONFIRMED

This list **replaces** the draft scope in `swag_website_v1_prd.md` Section 4. Key additions from the director are marked **NEW**.

- Single continuous-scroll website (one page, multiple sections)
- Fully responsive — mobile and desktop optimised, mobile-first build
- **NEW** Scroll-driven background colour transitions between sections
- **NEW** Bleed/ghost type compositions matching the visual identity deck poster pattern
- **NEW** Scroll-triggered animations on display type and the ghost layer
- Visual identity applied throughout (colour system, type system, wordmark)
- Brand storytelling sections built from manifesto / "What is SWAG?" copy
- **NEW** kloofstreetnights wearable edition showcase section (see `design.md` Section 7, item #6)
- CTA(s) directing to @crosswithswag Instagram — **NEW**: build this CTA so it can later collect emails once the Phase 2 newsletter is developed, without requiring a rebuild
- Basic SEO essentials (meta titles/descriptions, OG tags, favicon)
- Analytics integration — tool TBD; director response was informal ("Mhmmm"). Do not assume a provider.
- Supabase initialised (minimal v1 usage — structured for Phase 2 newsletter without migration)
- Deployed and live via Vercel, codebase in GitHub

---

## 5. Open Questions — Updated

This supersedes the Open Questions list in `swag_website_v1_prd.md` Section 9.

- ~~Final confirmed section list and order~~ → ✅ **Resolved.** See `design.md` Section 7.
- ~~Typeface family~~ → ✅ **Directional.** Instrument Sans via Google Fonts. See `design.md` Section 5. Pending final lock.
- ~~Wordmark file~~ → ✅ **SVG delivered** in `/assets/` (Frame 2, 6–9). Strip baked-in background rects for production.
- ~~Section 6 naming/positioning~~ → ✅ **Resolved.** Release showcase reframed as **"kloofstreetnights — Wearable Edition"** to align with manifesto language.
- **Wearable Editions manifesto + tagline (Draft 1)** → **Pending lock.** Confirm with director before build.
- **Section 6 copy and imagery brief** → Positioning locked. Copy should frame kloofstreetnights as a singular wearable edition object using manifesto language. Imagery sourcing can proceed once director briefs edition photography.
- **Analytics tool** (Vercel Analytics, Plausible, GA4, etc.) → **Still open.**
- **Domain name / DNS setup** → **Still open.**

---

*Reflects director confirmation sent 21 June 2026. Where this conflicts with `swag_website_v1_prd.md`, this file and `design.md` take precedence.*
