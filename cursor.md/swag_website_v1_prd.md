# SWAG — Website V1
## Project Requirements Document

**Brand:** swag. (Instagram: @crosswithswag)
**Tagline:** Quiet Luxury Streetwear
**Doc owner:** Marcus (Creative Director / "the director")
**Target launch:** 26 June 2026
**Status:** Draft — for engineering review

---

## 1. Background & Why

This is not a standard e-commerce site. The brief from the director is that the website functions as a **digital gallery** — a single, continuous experience where each section is a **message**, communicating the swag. brand ethos directly. The site should feel like walking through an exhibition of the brand's worldview, not browsing a shop.

Brand manifesto (source: visual identity deck):

> We owe nothing to anyone. We stop explaining. We stop convincing. We start being. We occupy the space of those who have already accepted themselves.

> swag. is not a performance; it is the radical act of refusing to fragment yourself.

The site launches shortly after the **kloofstreetnights** drop (23 June, online-only via @crosswithswag), so v1 should act as a brand home that the drop's audience lands on — reinforcing the world they've just been pulled into, rather than competing with the drop itself.

---

## 2. Brand Foundation (from design.md / visual identity deck)

**Voice & tone**
- Minimal, instinct-driven, rooted in Cape Town vernacular
- No over-explaining, no commercial/sales framing
- Statements, not pitches — "Simply is."

**Typography**
| Use | Weight | Treatment | Tracking |
|---|---|---|---|
| Headline / short phrases / "swag." wordmark text | 75 Bold (or 65 Medium) | ALL CAPS | Tight (-20 to -40) |
| Body / manifesto / product copy | 55 Roman | Sentence case | Normal to slightly open (+10) |

> Note: exact typeface family not specified in the deck — needs confirming/sourcing before build (see Open Questions).

**Color palette**
| Name | Hex | Meaning |
|---|---|---|
| Void Black | `#0A0A0A` | Silence, depth — "the foundation" |
| Stone Grey / Slate | `#575D61` | The stone wall, unshakeable — "the journey" |
| Deep Earth / Clay | `#8C5E4A` | Desert of inner solitude, grounding — "the clarity" |
| Muted Sand | `#D6D1C4` | Blank canvas, new beginning — "complete focus" |

**Recurring brand statements** (raw material for section copy / "What is SWAG?" modules)
- A home for individuals
- Does not seek permission to exist
- Speaks to be true, not approved
- Represents your internal authority
- Emanates presence
- Does not beg to be understood
- Commands respect without raising a voice
- Is daily practice. Is consistency.
- Has density. Does not fragment.
- Alchemises pain. Uses ruptures to reconstruct.
- Has weight. Embodies a new internal movement.
- Upholds truth without hesitation
- Refuses to negotiate what is essential to you
- Says come as you are

---

## 3. Goals for V1

- Establish a digital home for swag. that matches the tone and density of the physical/print brand world
- Communicate the brand ethos through type-led, gallery-style storytelling — not product grids
- Funnel all activity toward **@crosswithswag** (drops remain online/Instagram-only for now)
- Build a clean technical foundation that supports planned v2/v3 features without rework

---

## 4. Scope — In Scope for V1

- Single continuous-scroll website (one page, multiple sections)
- Fully responsive — mobile and desktop optimised, mobile-first build
- Visual identity applied throughout (color system, type system, wordmark)
- Brand storytelling sections built from manifesto / "What is SWAG?" copy
- CTA(s) directing to @crosswithswag (current drop access point)
- Basic SEO essentials (meta titles/descriptions, OG tags, favicon)
- Analytics integration (tool TBD — see Open Questions)
- Deployed and live via Vercel, codebase in GitHub

---

## 5. Out of Scope for V1 (Planned Future Phases)

These are confirmed future directions — structure the codebase so they can be added without major rebuilds, but **do not build them now**.

| Feature | Target phase | Notes |
|---|---|---|
| Newsletter signup / email capture | Phase 2 | Likely Supabase table + email provider integration |
| Interactive colour palette slider (preview SWAG garments in different colourways) | Phase 2 | Needs product imagery assets per colourway, or dynamic colour overlay approach |
| Quicket booking/ticketing integration for events | Phase 3 | Likely embed or API link-out to Quicket |
| Direct e-commerce / checkout | Not yet scoped | Drops remain Instagram-led for now |

---

## 6. Proposed Site Structure (Draft — to be confirmed by the director)

Single-scroll layout, sections below are a starting proposal drawn from the visual identity deck — final section list/order is still TBD per the engineer's notes, but this gives a working skeleton:

1. **Landing / Hero** — swag. wordmark, "Quiet Luxury Streetwear" tagline, Void Black background, minimal entry point
2. **Manifesto** — full manifesto text as a typographic moment (large type, generous whitespace)
3. **"What is SWAG?" — Identity statements** — rotating/scroll-triggered brand statements (rebellion, authentic expression, internal authority, etc.) as bold typographic compositions
4. **Current drop / latest work** — visual showcase tied to current activity (e.g. kloofstreetnights), linking out to @crosswithswag
5. **Brand world / values close-out** — "Owe Nothing." statement section, reinforcing the closing brand tone
6. **Footer** — Instagram link, minimal contact/credit ("the director"), no clutter

> This structure is a proposal only — confirm with the director before locking in development sequencing.

---

## 7. Technical Requirements

- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS
- **Hosting/Deployment:** Vercel
- **Backend/Database:** Supabase (set up now even if minimal in v1, to support Phase 2 newsletter without migration)
- **Version control:** GitHub (single repo)
- **Performance:** Fast load times, optimised images, minimal JS where typography/visuals can carry the experience
- **Accessibility:** Reasonable contrast/legibility checks despite high-contrast brand palette (especially light text on Stone Grey/Slate)

---

## 8. Design Requirements

- `design.md` (visual identity deck) is the source of truth for colour, type, and tone
- Mobile-first, but desktop should feel like a true "gallery wall" — make use of large-format type and whitespace
- Section transitions/scroll behaviour should feel intentional — each section reads as a distinct "piece"
- No stock e-commerce UI patterns (no product carousels, sale banners, etc.) unless explicitly requested later

---

## 9. Open Questions / Decisions Needed

- [ ] Final confirmed section list and order for the single-scroll layout
- [ ] Typeface family — numeric weight system (55/65/75) suggests a specific font; source files needed
- [ ] Confirm wordmark file is production-ready (vector/SVG, correct colour variants)
- [ ] Imagery/photography for drop showcase section — sourcing and format
- [ ] Analytics tool preference (e.g. Vercel Analytics, Plausible, GA4)
- [ ] Domain name / DNS setup
- [ ] Copy for sections beyond manifesto and "What is SWAG?" statements (if any new copy needed)

---

## 10. Timeline (Draft)

| Date | Milestone |
|---|---|
| 12–16 June | Confirm scope, section structure, asset list (type, imagery, wordmark) |
| 17–22 June | Build core sections, responsive pass, Supabase/Vercel/GitHub setup |
| 23 June | kloofstreetnights live drop (parallel — site not yet public) |
| 24–25 June | QA, content polish, performance/SEO pass |
| 26 June | V1 site live |

---

*Some things don't need a brief — but the build does. This document covers the build.*
