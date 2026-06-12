# swag. — Visual Identity & Design System
## `design.md` — Developer Reference

> Source of truth for all visual, typographic, and tonal decisions across the swag. website build.
> Read this alongside `swag_website_v1_prd.md` before touching any UI code.

---

## 1. Brand Essence

**Brand name:** swag.  
**Instagram / drop handle:** @crosswithswag  
**Tagline:** Quiet Luxury Streetwear  
**Creative director:** Marcus ("the director")

### Manifesto

> We owe nothing to anyone. We stop explaining.
> We stop convincing. We start being.
> We occupy the space of those who have already accepted themselves.
>
> swag. is not a performance; it is the radical act of refusing to fragment yourself.

This manifesto is **the emotional brief for every UI decision**. If a component feels like it's trying to sell something, simplify it. If a section feels like it's explaining itself, cut it. The site should feel like a statement, not a pitch.

---

## 2. Voice & Tone

| Rule | Implementation |
|---|---|
| Minimal, instinct-driven | Short copy. No filler words. No "discover", "explore", "shop now" language. |
| Cape Town vernacular — grounded, not performative | Tone should feel local without being forced. |
| Statements, not pitches | "Simply is." not "Find your style." |
| No over-explaining | Trust the user. Trust the brand. Let type and space do the work. |
| No commercial/sales framing | This is a gallery, not a shop. |

### Copy Patterns — DO / DON'T

| ✅ DO | ❌ DON'T |
|---|---|
| "Owe nothing." | "Shop the latest drop" |
| "Simply is." | "Explore our collection" |
| "Regain your internal authority." | "Discover what makes us different" |
| "Come as you are." | "Join the swag. family" |

---

## 3. Color System

All four brand colors are used across the identity deck — each with distinct meaning. Use them purposefully, not interchangeably.

```css
:root {
  --color-void-black:   #0A0A0A;  /* Silence, depth — "the foundation" */
  --color-stone-grey:   #575D61;  /* Unshakeable — "the journey" */
  --color-deep-earth:   #8C5E4A;  /* Inner solitude, grounding — "the clarity" */
  --color-muted-sand:   #D6D1C4;  /* Blank canvas, new beginning — "complete focus" */
}
```

### Color Roles

| Color | Primary Use | Meaning |
|---|---|---|
| Void Black `#0A0A0A` | Hero / manifesto backgrounds, primary dark sections | Foundation. Silence. The default ground. |
| Stone Grey `#575D61` | Mid-section backgrounds (e.g. "What is SWAG?" slide 1) | The wall. Unshakeable. Journey. |
| Deep Earth `#8C5E4A` | Accent sections (e.g. "Has Weight" slide) | Desert, grounding, clarity. |
| Muted Sand `#D6D1C4` | Light section backgrounds, large ghost text, wordmark on dark | New beginning. Blank canvas. |

### Usage Notes from Identity Deck

- The identity deck demonstrates **per-section background shifts** — each "What is SWAG?" typographic poster uses a different palette background (Black → Stone → Clay → Sand). Replicate this rhythm in the scroll sections.
- Ghost/watermark text (e.g. "CROSS WITH SWAG" running behind foreground type) uses the **background color at ~30–40% opacity** — same hue, lower visibility.
- Foreground text on dark backgrounds: use `--color-muted-sand` for display type.
- Foreground text on light backgrounds (`--color-muted-sand`): use `#0A0A0A` (Void Black).
- On `--color-stone-grey` and `--color-deep-earth` backgrounds: use `--color-muted-sand` for primary display text.

---

## 4. Typography System

> ⚠️ **Open Question:** The identity deck uses a numeric weight system (55 Roman / 65 Medium / 75 Bold) characteristic of the **Neue Haas Grotesk** or **Helvetica Neue** family. Confirm source files with Marcus before build. Fallback: `'Arial Black', sans-serif` for bold; `Arial, sans-serif` for body — but replace ASAP.

### Suggested font stack (pending confirmation)

```css
/* Primary — confirm with director */
font-family: 'Neue Haas Grotesk Display', 'Helvetica Neue', Arial, sans-serif;

/* If licensing is needed, acceptable alternatives: */
/* - Aktiv Grotesk (similar weight system) */
/* - Haffer (open-source, similar feel) */
/* - ABC Diatype */
```

### Weight & Treatment Rules

| Role | Weight | Treatment | Letter-spacing |
|---|---|---|---|
| Wordmark / Hero display / Section headlines | 75 Bold | ALL CAPS | Tight: `-0.04em` to `-0.06em` |
| Medium-emphasis statements | 65 Medium | ALL CAPS | Tight: `-0.02em` to `-0.03em` |
| Body / manifesto / product copy | 55 Roman | Sentence case | Normal to open: `0.01em` |
| Small labels / credits / captions | 55 Roman | ALL CAPS or Sentence case | Slightly open: `+0.05em` |

### Typographic Scale (CSS variables)

```css
:root {
  /* Display — bleeds off screen, fills viewport */
  --type-display:   clamp(80px, 16vw, 220px);

  /* Headline — section anchors */
  --type-headline:  clamp(40px, 7vw, 96px);

  /* Statement — mid-weight phrases */
  --type-statement: clamp(24px, 4vw, 56px);

  /* Body — manifesto, descriptive copy */
  --type-body:      clamp(16px, 1.5vw, 20px);

  /* Label — credits, captions, small UI */
  --type-label:     clamp(11px, 1vw, 13px);
}
```

### Key Typographic Behaviours (from identity deck)

- **Bleed text:** The identity deck's "CROSS / WITH / SWAG" and "EXPRESSION / PRESENCE / LIBERA-" type bleeds off the right/bottom edge. This is intentional — use `overflow: hidden` on sections and let display text exceed the viewport. Triggers density and drama.
- **Ghost / watermark layers:** "CROSS WITH SWAG" appears as a large background layer at low opacity. Position this absolutely behind foreground content.
- **Mixed scales in one composition:** Small body copy ("Speaks to be true, not approved") sits inside a layout dominated by massive display type. Don't fear extreme scale contrast.
- **Mixed weight phrasing:** Mid-size phrases use Roman + Bold within the same sentence — e.g. "Speaks to be **true**, not **approved**". Apply `font-weight: 700` inline on key words.
- **Circular accent element:** A circle (filled with the mid-tone background color, slightly darker) appears as a compositional device. "Simply **is.**" sits inside or near it. Replicate as a CSS `border-radius: 50%` element.

---

## 5. Wordmark

The swag. wordmark is a **custom lettering mark** — a fluid, round, almost bubble-like script treatment. It is **not** typed in any standard font.

- Use as an **SVG asset** (source from Marcus — confirm vector file is production-ready with correct colour variants).
- Required variants:
  - Sand on Black (`#D6D1C4` on `#0A0A0A`) — primary
  - Sand on Stone (`#D6D1C4` on `#575D61`)
  - Sand on Clay (`#D6D1C4` on `#8C5E4A`)
  - Black on Sand (`#0A0A0A` on `#D6D1C4`)
- The wordmark appears in the top-left of identity layouts — position consistently in the hero/nav.
- "CROSS WITH SWAG" in small caps appears directly below the wordmark as a secondary identifier.

---

## 6. Section-by-Section Design Direction

Each scroll section functions as a **standalone typographic poster** that shifts background color as the user moves through the page. The color sequence from the identity deck:

```
Hero         → Void Black    (#0A0A0A)
Manifesto    → Void Black    (#0A0A0A)
SWAG? — 01   → Void Black    (#0A0A0A)   [AUTHENTIC EXPRESSION]
SWAG? — 02   → Muted Sand    (#D6D1C4)   [EMANATES PRESENCE]
SWAG? — 03   → Stone Grey    (#575D61)   [HAS DENSITY / LIBERA-]
SWAG? — 04   → Deep Earth    (#8C5E4A)   [HAS WEIGHT / ATES]
Close-out    → Stone Grey    (#575D61)   [NOTHING OWING — "Owe Nothing."]
Footer       → Void Black    (#0A0A0A)
```

### Section Design Notes

**Hero**
- swag. wordmark (SVG) top-left
- "QUIET LUXURY STREETWEAR" — small caps label
- Giant ghost type "NOTH- / OWE / ING." in low-opacity Void Black tone behind wordmark
- Minimal entry — let silence do the work

**Manifesto**
- Full manifesto as large body type — NOT display size. Let the words breathe.
- "swag. is not a performance; it is the radical act of refusing to fragment yourself." — can appear as a separate typographic lockup
- Background: Void Black. Text: Muted Sand.

**"What is SWAG?" — Sections**
- Each section has a **hero word that bleeds off the right/bottom edge** (e.g. EXPRESSION, PRESENCE, LIBERA-, ATES)
- "WHAT IS SWAG?" label appears small in the upper left of each section
- Mid-size statements (A HOME FOR INDIVIDUALS, DOES NOT SEEK PERMISSION TO EXIST, etc.) appear as headline type
- Supporting phrases (Speaks to be true, not approved / is rebellion / is resilience) appear as small body copy, scattered at organic positions
- "Simply **is.**" appears as a small floating label near the circle element, top-right area
- The ghost "CROSS / WITH / SWAG" watermark runs behind everything at low opacity

**Current Drop / kloofstreetnights**
- Placeholder section for imagery — photography source TBD with Marcus
- CTA to @crosswithswag
- Keep layout sparse — let imagery lead, single line of copy max

**Close-out / "Owe Nothing."**
- Stone Grey background with low-opacity "NOTH- / OWE / ING." display type (same treatment as hero but reversed)
- swag. wordmark + "CROSS WITH SWAG" bottom-left
- "QUIET LUXURY STREETWEAR" label
- No extra copy — close with the statement, not an explanation

**Footer**
- Void Black background
- Instagram link: @crosswithswag
- "the director" credit
- Year / minimal legal if needed
- No decorative elements — clean exit

---

## 7. Animation & Scroll Behaviour

> The site is planned as a highly dynamic scroll experience using ReactBits, UIlora, and 21st.dev components.

### Principles
- Each section transition should feel like **turning a gallery wall** — purposeful, unhurried, complete.
- Scroll-triggered reveals: type enters **word by word** or **line by line**, not all at once. Build the statement.
- Background color transitions between sections: **smooth crossfade or push** — not instant cuts.
- Ghost/watermark text: can **scroll at a different speed** (parallax) from foreground type to create depth.
- Display type that bleeds off screen: consider **revealing on scroll** — letters slide in from off-screen edges.
- **No looping animations unless they serve the message.** Movement should feel earned.

### Recommended Animation Patterns
| Element | Behaviour |
|---|---|
| Section background | Fade or smooth scroll-linked color transition |
| Display/bleed type | Slide in from edge or mask-reveal on scroll entry |
| Manifesto text | Staggered line-by-line fade-up |
| "What is SWAG?" statements | Individual words pop in with slight delay between each |
| Ghost watermark text | Parallax scroll offset (slower than content) |
| Circle element | Scale up from 0 on section entry |
| Wordmark (hero) | Fade in last, after tagline — or instant presence |
| CTA / Instagram link | Underline draw on hover, no button styling |

---

## 8. Component Patterns

### Do Use
- `overflow: hidden` on section containers for bleed type effect
- `position: absolute` for ghost watermark layers
- `mix-blend-mode: multiply` or `overlay` for ghost text on coloured backgrounds (test per section)
- Scroll-linked background color interpolation (consider CSS scroll-driven animations or GSAP ScrollTrigger)
- `letter-spacing: -0.04em` on all display/headline type
- `text-transform: uppercase` on all headlines

### Do Not Use
- Drop shadows on type (brand is flat, not skeuomorphic)
- Gradient backgrounds (solid brand colors only)
- Rounded corners on layout containers (this isn't a card-based UI)
- Any stock iconography or emoji
- Hover states that feel "button-like" on text links — underline draw only
- Borders or dividers between sections (color shifts + whitespace do the separation)

---

## 9. Responsive Considerations

- **Mobile-first** — the identity deck compositions were designed portrait-first (they read like phone screens).
- On mobile, bleed text and ghost layers still apply — scale the `clamp()` values to maintain drama at narrow widths.
- The "WHAT IS SWAG?" label in the top-left is a fixed compositional anchor — keep it consistent across breakpoints.
- Section height: aim for **100dvh per section** on desktop. On mobile, allow sections to grow taller than viewport if content requires it — never clip manifesto text.

---

## 10. Assets Needed from Marcus (Blockers)

| Asset | Format needed | Status |
|---|---|---|
| swag. wordmark | SVG, all colour variants | ⚠️ Confirm production-ready |
| Typeface source files / confirmed family name | OTF/TTF or web license | ⚠️ Not yet confirmed |
| kloofstreetnights imagery | High-res JPG/WebP, portrait + landscape | ⚠️ Not yet sourced |
| Any additional brand photography | High-res JPG/WebP | ⚠️ TBD |

---

## 11. Quick Reference — Token Summary

```css
/* === COLORS === */
--color-void-black:  #0A0A0A;
--color-stone-grey:  #575D61;
--color-deep-earth:  #8C5E4A;
--color-muted-sand:  #D6D1C4;

/* === TYPOGRAPHY === */
--font-display:      'Neue Haas Grotesk Display', 'Helvetica Neue', Arial, sans-serif;
--weight-bold:       700;    /* 75 Bold */
--weight-medium:     500;    /* 65 Medium */
--weight-roman:      400;    /* 55 Roman */

--tracking-tight:    -0.04em;
--tracking-normal:   0em;
--tracking-open:     0.05em;

/* === TYPE SCALE === */
--type-display:      clamp(80px, 16vw, 220px);
--type-headline:     clamp(40px, 7vw, 96px);
--type-statement:    clamp(24px, 4vw, 56px);
--type-body:         clamp(16px, 1.5vw, 20px);
--type-label:        clamp(11px, 1vw, 13px);

/* === SPACING === */
--section-pad-x:     clamp(24px, 5vw, 80px);
--section-pad-y:     clamp(48px, 8vh, 120px);
```

---

*This file is generated from the swag. visual identity deck (v26) and the V1 PRD. Keep it updated as design decisions are confirmed by the director.*
