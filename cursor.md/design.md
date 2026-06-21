# swag. — Visual Identity & Design System
## `design.md` — Developer Reference

> Source of truth for all visual, typographic, and tonal decisions across the swag. website build.
> Read alongside `swag_website_v1_prd.md` (original draft brief) and `brand-copy.md` (confirmed V1 scope + raw copy) before touching any UI code.

---

## 1. Brand Essence

**Brand name:** swag.  
**Instagram / drop handle:** @crosswithswag  
**Tagline:** Wearable Editions *(Draft 1 — supersedes "Quiet Luxury Streetwear")*  
**Creative director:** Marcus ("the director")

### Manifesto — Wearable Editions (Draft 1)

> We stopped explaining ourselves a long time ago.
>
> swag. is not a collection. It is not a drop. It is not content.
>
> Each piece exists once — conceived, made, and released into the world as a singular object. The garment. The image. The frame on your wall. All the same thoughts, held in different forms.
>
> We call them wearable editions because that is what they are. Not a product. Not merch. Objects that carry a point of view — made for the people who already know who they are.
>
> We owe nothing to anyone. We occupy the space of those who have already accepted themselves.
>
> This is not for everyone.
>
> It was never meant to be.
>
> — the director.

This manifesto is **the emotional brief for every UI decision**. If a component feels like it's trying to sell something, simplify it. If a section feels like it's explaining itself, cut it. The site should feel like a statement, not a pitch.

> ⚠️ **Draft status:** Wearable Editions copy is Draft 1 — not yet locked. The identity deck still references "Quiet Luxury Streetwear" in layout comps; build against this draft unless the director supplies a revision.

### Note on Previous Manifesto

The original identity deck manifesto ("We owe nothing to anyone. We stop explaining…") is superseded by the version above. Some deck compositions may still reference the old language — realign once this manifesto is locked. See Section 7 (kloofstreetnights wearable edition framing) and `brand-copy.md` Open Questions.

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

## 3. Website Inspiration Reference

Study these for tone, motion, and composition — not to copy layouts wholesale.

### Brand Tone & Identity

**[fearofgod.com](https://fearofgod.com)** — Closest tonal match in streetwear. Dark, restrained, type-led. No noise, no sale banners. Product and presence only. Study how silence carries the brand.

**[demobaza.com](https://demobaza.com)** — Bulgarian avant-garde fashion with a dark, futuristic editorial site. Feels like fashion that exists "beyond fashion" — similar philosophical positioning to swag. Reference for translating a manifesto into a web experience.

**[studiofreight.com](https://studiofreight.com)** — Celebrated dark typographic site. Oversized type on dark backgrounds, minimal layout, massive confidence. Team behind [Lenis](https://lenis.darkroom.engineering/) — use Lenis for smooth scroll in the build.

**[olafhussein.com](https://www.olafhussein.com/)** — Amsterdam fashion with understated editorial layouts. Collections introduced narratively; "Friends" section builds philosophy through people, not transactions.

**[smalltalkstudio.biz](https://smalltalkstudio.biz/)** — NYC seasonal brand balancing craft with collections. Lookbook/journal presence positions the brand as artistic practice. Minimal product-first approach.

### Scroll Animation & Typographic Motion

**[awwwards.com/awwwards/collections/typography-in-web-design](https://www.awwwards.com/awwwards/collections/typography-in-web-design)** — Curated typography-driven sites with scroll interactions. Primary reference for bleed-text and word-by-word reveals.

**[awwwards.com/inspiration/animated-typography-on-scroll-wearspaces](https://www.awwwards.com/inspiration/animated-typography-on-scroll-wearspaces)** — Streetwear brand (Wearspaces) doing animated type on scroll. Direct reference for "What is SWAG?" motion.

**[awwwards.com/inspiration/typography-principles-scroll-navigation-obys-agency-microsite](https://www.awwwards.com/inspiration/typography-principles-scroll-navigation-obys-agency-microsite)** — Obys Agency microsite. GSAP scroll-triggered sequential reveals — maps to the "What is SWAG?" sections.

**[obys.agency](https://obys.agency)** — Gallery-wall feeling. Full-screen layouts, parallax scroll.

**[scrollytelling.ai/examples](https://www.scrollytelling.ai/examples)** — Scrollytelling examples with performance notes. Balance animation ambition with load speed (Instagram audience).

### Visual Composition

**[awwwards.com/inspiration/togethxr-scrolling-text](https://www.awwwards.com/inspiration/togethxr-scrolling-text)** — Multi-directional scrolling text. Reference for "CROSS WITH SWAG" watermark/marquee treatment.

**[awwwards.com/inspiration/scroll-animations-elements-and-outlined-font](https://www.awwwards.com/inspiration/scroll-animations-elements-and-outlined-font)** — Outlined/ghost type with scroll triggers. Close to the deck's ghost watermark layer.

### Ongoing Galleries

**[siteinspire.com](https://www.siteinspire.com)** — Filter fashion + dark.

**[land-book.com](https://land-book.com)** — Hero and section transition ideas.

**[awwwards.com/inspiration/streetwear](https://www.awwwards.com/inspiration/streetwear)** — Streetwear-tagged inspiration.

### Technical Patterns to Study

- **Lenis** (`@studio-freight/lenis`) — butter-smooth scroll
- **GSAP ScrollTrigger** — word-by-word reveals, section transitions
- **Scroll-linked background colour interpolation** — per-section palette shift (signature swag. move)

---

## 4. Color System

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

- The confirmed site colour sequence is **Black → Black → Black → Sand → Stone → Clay → Stone → Black** (see Section 7). Scroll-driven transitions must follow this order — not the older deck poster sequence.
- Ghost/watermark text (e.g. "CROSS WITH SWAG" running behind foreground type) uses the **background color at ~30–40% opacity** — same hue, lower visibility.
- Foreground text on dark backgrounds: use `--color-muted-sand` for display type.
- Foreground text on light backgrounds (`--color-muted-sand`): use `#0A0A0A` (Void Black).
- On `--color-stone-grey` and `--color-deep-earth` backgrounds: use `--color-muted-sand` for primary display text.

---

## 5. Typography System — Instrument Sans (directional, pending final lock)

**Typeface:** [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) via Google Fonts. Maps the identity deck's 55/65/75 weight system to web weights 400/500/700.

### Implementation (apply at scaffold)

**Global CSS** (`index.css` or `globals.css`) — add at the top:

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
```

**Tailwind** (`tailwind.config.ts`):

```ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', 'sans-serif'],
      },
    },
  },
}
```

`font-sans` resolves to Instrument Sans everywhere. Use `font-normal` (400) for body, `font-medium` (500) for mid-emphasis statements, `font-bold` (700) for headlines and display type.

### Font stack

```css
font-family: 'Instrument Sans', sans-serif;
```

### Weight & Treatment Rules

| Role | Weight | Tailwind | Treatment | Letter-spacing |
|---|---|---|---|---|
| Wordmark / Hero display / Section headlines | 700 Bold | `font-bold` | ALL CAPS | Tight: `-0.04em` to `-0.06em` |
| Medium-emphasis statements | 500 Medium | `font-medium` | ALL CAPS | Tight: `-0.02em` to `-0.03em` |
| Body / manifesto / product copy | 400 Roman | `font-normal` | Sentence case | Normal to open: `0.01em` |
| Small labels / credits / captions | 400 Roman | `font-normal` | ALL CAPS or Sentence case | Slightly open: `+0.05em` |

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

## 6. Wordmark

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

## 7. Site Structure & Scroll Colour Map — ✅ CONFIRMED BY DIRECTOR

> This structure replaces the "proposal" structure in the PRD (section 6 of `swag_website_v1_prd.md`). This is locked. Build against this table.
>
> **Manifesto update:** Director sent Wearable Editions manifesto (Draft 1). Section 6 confirmed as a release showcase reframed as **"kloofstreetnights — Wearable Edition"** — see design notes below.

Single continuous-scroll layout. Each section functions as a **standalone typographic poster** with a defined background. Transitions between sections must be **scroll-driven** (smooth crossfade/interpolation) — never instant cuts.

| # | Section | Background | Key content |
|---|---|---|---|
| 1 | Hero / Landing | Void Black `#0A0A0A` | swag. wordmark (Sand on Black), **"Wearable Editions"** tagline, minimal — nothing else |
| 2 | Manifesto | Void Black `#0A0A0A` | Full Wearable Editions manifesto (Draft 1) as a large typographic moment. Generous whitespace. |
| 3 | "What is SWAG?" — Authentic Expression | Void Black `#0A0A0A` | First identity poster module. Display type bleeds off edges. Ghost "CROSS WITH SWAG" watermark layer behind. |
| 4 | "What is SWAG?" — Internal Authority | Muted Sand `#D6D1C4` | Second poster module. Black type on Sand. |
| 5 | "What is SWAG?" — Presence | Stone Grey `#575D61` | Third poster module. Sand type on Stone. |
| 6 | kloofstreetnights — Wearable Edition | Deep Earth / Clay `#8C5E4A` | Release showcase reframed as wearable edition. Campaign imagery, edition name as display type, CTA to @crosswithswag |
| 7 | "What is SWAG?" — Density / Weight | Stone Grey `#575D61` | Fourth poster module. Closes the identity sequence. |
| 8 | Closing Statement | Void Black `#0A0A0A` | "NOTHING OWING." or equivalent — single large typographic statement. The director's sign-off tone. |
| 9 | Footer | Void Black `#0A0A0A` | @crosswithswag Instagram link, minimal — "the director." credit, no clutter |

**Confirmed colour sequence:** `Black → Black → Black → Sand → Stone → Clay → Stone → Black`

This sequence is the backbone of the scroll experience and should directly drive the scroll-linked background interpolation logic (see Section 8).

### Section 6 Confirmed — Wearable Editions Framing ✅

Director confirmed Section 6 remains a release showcase, but language and framing align with wearable editions philosophy — not traditional "drop" terminology. Section title: **"kloofstreetnights — Wearable Edition"** (exact naming pending final copy pass).

### Section Design Notes

**1 — Hero**
- swag. wordmark (SVG) top-left
- "WEARABLE EDITIONS" — small caps label *(Draft 1)*
- Giant ghost type "NOTH- / OWE / ING." in low-opacity Void Black tone behind wordmark
- Minimal entry — let silence do the work

**2 — Manifesto**
- Full Wearable Editions manifesto (Draft 1) as large body type — NOT display size. Let the words breathe.
- Sign-off line "— the director." sits at the end, separated from the body — can appear as a distinct typographic lockup
- Background: Void Black. Text: Muted Sand.

**3, 4, 5, 7 — "What is SWAG?" Sections**
- Each section has a **hero word that bleeds off the right/bottom edge** (e.g. EXPRESSION, PRESENCE, LIBERA-, ATES)
- "WHAT IS SWAG?" label appears small in the upper left of each section
- Mid-size statements pulled from the confirmed brand statements list (see `brand-copy.md`) appear as headline type
- Supporting phrases (Speaks to be true, not approved / is rebellion / is resilience) appear as small body copy, scattered at organic positions
- "Simply **is.**" appears as a small floating label near the circle element, top-right area
- The ghost "CROSS / WITH / SWAG" watermark runs behind everything at low opacity
- Foreground/background type colour flips per the Colour Roles table in Section 3 above

**6 — kloofstreetnights — Wearable Edition** ✅
- Background: Deep Earth / Clay `#8C5E4A`
- Section positioning: Release showcase reframed with wearable editions language (not traditional drop terminology)
- Campaign imagery (sourcing TBD — awaiting director briefing on edition photography)
- Edition name as display type (e.g. kloofstreetnights)
- Copy approach: Frame the release as a singular wearable edition object — align with manifesto language ("each piece exists once," "objects that carry a point of view")
- CTA directing to @crosswithswag — build the CTA component so it can swap from link-out to email capture in Phase 2 without a rebuild
- Keep layout sparse — let imagery lead, single line of copy max

**8 — Closing Statement**
- Void Black background with low-opacity "NOTH- / OWE / ING." display type (same treatment as hero but reversed)
- "NOTHING OWING." or equivalent single large typographic statement — director's sign-off tone
- No extra copy — close with the statement, not an explanation

**9 — Footer**
- Void Black background
- Instagram link: @crosswithswag
- "the director." credit
- Year / minimal legal if needed
- No decorative elements — clean exit

---

## 8. Animation & Scroll Behaviour — ✅ CONFIRMED IN SCOPE FOR V1

> The director has confirmed the following are **in scope for V1**, not nice-to-haves: scroll-driven background colour transitions, bleed/ghost type compositions matching the deck, and scroll-triggered animation on display type and the ghost layer. The site is built using ReactBits, UIlora, and 21st.dev component libraries, animated with GSAP (ScrollTrigger) and smooth-scrolled with Lenis.

### Principles
- Each section transition should feel like **turning a gallery wall** — purposeful, unhurried, complete.
- Scroll-triggered reveals: type enters **word by word** or **line by line**, not all at once. Build the statement.
- Background color transitions between sections: **smooth crossfade or push**, driven by the confirmed colour sequence in Section 7 — not instant cuts.
- Ghost/watermark text: can **scroll at a different speed** (parallax) from foreground type to create depth.
- Display type that bleeds off screen: consider **revealing on scroll** — letters slide in from off-screen edges.
- **No looping animations unless they serve the message.** Movement should feel earned.

### Recommended Animation Patterns
| Element | Behaviour |
|---|---|
| Section background | Scroll-linked colour interpolation, driven by the Section 7 colour sequence |
| Display/bleed type | Slide in from edge or mask-reveal on scroll entry |
| Manifesto text | Staggered line-by-line fade-up |
| "What is SWAG?" statements | Individual words pop in with slight delay between each |
| Ghost watermark text | Parallax scroll offset (slower than content) |
| Circle element | Scale up from 0 on section entry |
| Wordmark (hero) | Fade in last, after tagline — or instant presence |
| CTA / Instagram link | Underline draw on hover, no button styling |

---

## 9. Component Patterns

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

## 10. Responsive Considerations

- **Mobile-first** — the identity deck compositions were designed portrait-first (they read like phone screens).
- On mobile, bleed text and ghost layers still apply — scale the `clamp()` values to maintain drama at narrow widths.
- The "WHAT IS SWAG?" label in the top-left is a fixed compositional anchor — keep it consistent across breakpoints.
- Section height: aim for **100dvh per section** on desktop. On mobile, allow sections to grow taller than viewport if content requires it — never clip manifesto text.

---

## 11. Assets Needed from Marcus (Blockers)

| Asset | Format needed | Status |
|---|---|---|
| swag. wordmark | SVG, all 4 colour variants | ✅ **Delivered** — `/assets/Frame 6.svg` through `Frame 9.svg` cover Sand-on-Black, Sand-on-Stone, Sand-on-Clay, and Sand-on-Sand backgrounds respectively (white path fill on brand-colour rects). `/assets/Frame 2.svg` is Black-on-Sand (`#0A0A0A` path on light ground). Prefer a single path-only SVG with CSS `fill` for production; strip baked-in background rects. `/assets/SWAG logo.svg` is stroke-outline only — not the production fill mark. |
| Typeface | Instrument Sans (Google Fonts) | ✅ **Directional** — see Section 5; pending final lock |
| kloofstreetnights / wearable edition imagery | High-res JPG/WebP, portrait + landscape | ⚠️ Awaiting director briefing |
| Any additional brand photography | High-res JPG/WebP | ⚠️ TBD |

---

## 12. Quick Reference — Token Summary

```css
/* === COLORS === */
--color-void-black:  #0A0A0A;
--color-stone-grey:  #575D61;
--color-deep-earth:  #8C5E4A;
--color-muted-sand:  #D6D1C4;

/* === TYPOGRAPHY === */
--font-display:      'Instrument Sans', sans-serif;
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
