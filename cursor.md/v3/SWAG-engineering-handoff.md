# SWAG — Engineering Handoff

**Project:** crosswithswag.co.za rebuild
**Prepared:** 13 August 2026
**Design source of truth:** Figma → [SWAG.](https://www.figma.com/design/5w6qUwhO5sLBhxJHsqfC0u/SWAG.?node-id=176-30)
**Working prototype:** `swag-site.html` (single file, open in any browser)

The prototype is the behavioural reference — motion, routing, hover states. Figma is the visual reference — spacing, type sizes, colour bindings. Where they disagree, **Figma wins on layout, the prototype wins on interaction.**

---

## 1. Scope

Five routes, one visual system.

| Route | Figma frame | Purpose |
|---|---|---|
| `/` | [SWAG — Landing](https://www.figma.com/design/5w6qUwhO5sLBhxJHsqfC0u/SWAG.?node-id=176-30) | Hero, current edition, structure, manifesto, what is swag, clothes, archive, list |
| `/current` | [SWAG — Current](https://www.figma.com/design/5w6qUwhO5sLBhxJHsqfC0u/SWAG.?node-id=194-14) | kloofstreetnights — campaign, colourways, spec, clothes, director's note |
| `/archive` | [SWAG — Archive](https://www.figma.com/design/5w6qUwhO5sLBhxJHsqfC0u/SWAG.?node-id=194-24) | Six editions with state, the three rules |
| `/manifesto` | [SWAG — Manifesto](https://www.figma.com/design/5w6qUwhO5sLBhxJHsqfC0u/SWAG.?node-id=194-34) | OWE NOTHING, a home for individuals, the wound, authority |
| `/contact` | [SWAG — Contact](https://www.figma.com/design/5w6qUwhO5sLBhxJHsqfC0u/SWAG.?node-id=194-44) | Email + Instagram, waitlist |

**Not in scope:** cart, checkout, product pages, user accounts. There is no storefront. Orders arrive by email. Do not add commerce scaffolding "for later" — the absence of a shop is a brand decision, not a gap.

---

## 2. Recommended stack

Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel. This matches the existing site and keeps the static-first model.

Every page is static. There is no dynamic data, no CMS calls at request time, no auth. Render everything at build time.

**Editions should be data, not markup.** Put them in one typed file and drive the archive, the ticker, and the current-edition block from it. Adding edition 007 should be a one-object change.

```ts
// src/data/editions.ts
export type EditionState = 'live' | 'in-development' | 'closed';

export interface Colourway {
  name: string;
  hex: string | null;   // null = not yet locked
  locked: boolean;
}

export interface Edition {
  no: string;              // '001'
  slug: string;            // 'kloofstreetnights'
  name: string;            // display name, lowercase
  description: string;
  state: EditionState;
  colourways?: Colourway[];
  images?: string[];
}
```

---

## 3. Design tokens

All four colours already exist as Figma variables in the file. Mirror them exactly — do not add shades, tints, or a grey ramp.

| Token | Hex | Figma variable | Usage |
|---|---|---|---|
| `--void` | `#0A0A0A` | VOID BLACK | Page background, inverted text on sand |
| `--stone` | `#575D61` | SLATE GREY | Labels, hairlines, secondary text, borders |
| `--clay` | `#8C5E4A` | CLAY | Accent only — CTA borders, active states, section arrows |
| `--sand` | `#D6D1C4` | SAND | Primary text, display type, orb fill |

**Hard rule: these four only.** No white, no pure black, no hover tints outside this set. Opacity variants of sand are permitted for text hierarchy (`rgba(214,209,196,.74)` for body copy) — new hex values are not.

> ⚠️ **One live inconsistency.** The HTML prototype uses `#EDE7D8` (FIRST LIGHT, an edition-001 colourway) as primary text; the Figma build uses SAND `#D6D1C4`. **Build with SAND.** Flagged to Marcus for a final call — if he chooses FIRST LIGHT, add it as a fifth variable in Figma first so the two stay in sync.

### Edition colourways

These are content, not system tokens. They only ever appear as swatches on `/current`. Keep them in `editions.ts`.

| Name | Hex | Status |
|---|---|---|
| after hours | `#0A0A0A` | locked |
| *(pink — unnamed)* | — | **blocked: no name, no hex** |
| *(green — unnamed)* | `#2B3626` | **blocked: no name** |
| swagy dust | `#4A3226` | locked |
| first light | `#EDE7D8` | locked |

`after hours` is Void Black on a Void Black page and reads as an empty box. Give that swatch a 1px `--stone` hairline so it's legibly a deliberate black. The pink swatch renders as a dashed empty frame with `HEX TBC` until Marcus supplies it — do not substitute a guess.

### Typography

Brand typeface is **Neue Haas Grotesk Display Pro**. Web build uses **Instrument Sans** (Google Fonts) as the licensed substitute. Do not introduce a third family — including a monospace for the bracket labels. The technical feel comes from tracking and the `[ ]` syntax, not from a mono.

From the brand bible, non-negotiable:

| Role | Weight | Case | Tracking | Line height |
|---|---|---|---|---|
| Display / headline | 700 | UPPERCASE | **−0.035 to −0.045em** | 0.82–0.92 |
| Dense list (*what is swag*) | 700 | UPPERCASE | **−0.038em** | 0.98 |
| Label / eyebrow | 600 | UPPERCASE | **+0.16em** | 1.0 |
| Body | 400 | sentence case | 0 to +0.01em | 1.55–1.62 |

The bible states tracking of −20 to −40 for headlines: *"Squeeze the letters slightly. This creates that 'dense' feeling."* The *what is swag* block depends on this — at default tracking it stops working. If you change one value in this table, the design breaks.

### Spacing & layout

- Design width **1440**, gutter **56px**
- Fluid gutter: `clamp(18px, 4vw, 56px)`
- Section padding: `clamp(64px, 9vw, 132px)` vertical
- Hairlines: 1px, `rgba(214,209,196,.14)`; stronger borders `.28`
- Grid: 12-col conceptually, but most sections are 2-col splits or 4-col image grids — plain CSS Grid is fine, no framework needed

---

## 4. Components

| Component | Props | Notes |
|---|---|---|
| `<Header>` | `active: Route` | Fixed, blurred backdrop, hides on scroll down / shows on scroll up. Clay underline on active item. |
| `<Ticker>` | `items: string[]` | Duplicate the array so the CSS translate loop is seamless. Pauses under `prefers-reduced-motion`. |
| `<SectionHead>` | `label`, `meta?`, `href?` | The `[ 0N — NAME ]` row. Used ~15 times. |
| `<Display>` | `as`, `size` | Headline type with the tracking rules baked in. Do not let callers pass arbitrary tracking. |
| `<DenseList>` | `items: string[]` | The *what is swag* block. Index number on hover, clay colour shift. |
| `<ObjectCard>` | `numeral`, `title`, `body` | Three-object cards. Component exists in Figma: `SWAG / Object Card`. |
| `<EditionRow>` | `edition: Edition` | Archive row. Indents 16px and gains a clay gradient wash on hover. |
| `<StateChip>` | `state: EditionState` | `live` → sand border · `in-development` → clay · `closed` → stone |
| `<AssetSlot>` | `label`, `ratio` | Placeholder frame until real imagery lands. **Delete once assets are in.** |
| `<Button>` | `variant: 'default' \| 'clay'` | Inverts to solid sand (or clay) on hover. |
| `<SignatureBlock>` | `body`, `edition` | Clay left border. **Locked format — see §7.** |
| `<Footer>` | — | Wordmark, two link columns, meta row. |

---

## 5. Motion

Restrained by decision. The brand does not perform, so the site should not either. No 3D tilt nav, no cursor-follow effects, no parallax.

| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Preloader | First load only | Counter 000→100, hairline fills, fade out | ~1.2s, 0.7s fade | `cubic-bezier(.16,1,.3,1)` |
| Section blocks | Enter viewport | Fade + 24px rise, once | 0.95s | `cubic-bezier(.16,1,.3,1)` |
| Header | Scroll down / up | Translate ±100% | 0.5s | same |
| Ticker | Continuous | `translateX(-50%)` loop | 46s linear | linear |
| Image frame | Hover | `scale(1.035)`, grayscale .18→0 | 1.1s / 0.8s | same |
| Edition row | Hover | `padding-left` 0→16px + clay gradient | 0.5s | same |
| Dense list item | Hover | Colour → clay, index fades in | 0.35s | same |
| Button | Hover | Fill inverts | 0.35s | same |

Gate everything behind `prefers-reduced-motion: reduce` — reveals resolve instantly, ticker and preloader animation stop. Use `IntersectionObserver` with `rootMargin: '0px 0px -8% 0px'`, and unobserve after firing. Preloader shows once per session, not per route change.

---

## 6. Responsive

| Breakpoint | Behaviour |
|---|---|
| >1024px | Default. 4-col image grid, 5-col colourways, 2-col splits. |
| 861–1024px | 3-col image grid, 3-col colourways. Contact cards 2-up. |
| ≤860px | Nav → full-screen overlay menu. All splits stack. Object cards stack. Archive rows reflow to 2-col (number + content) with the chip below. Dense list drops to `clamp(19px,6.4vw,32px)`, tracking eases to −0.032em, index numbers hidden. |
| ≤560px | 2-col image grid, 2-col colourways. |

Display type is `clamp()`-driven throughout — it should never need a manual mobile override.

---

## 7. Content rules

These are brand constraints, not preferences. Breaking them is a bug.

1. **Voice is lowercase.** Body copy, edition names, navigation. Uppercase is reserved for display headlines, labels, and the *what is swag* block. `kloofstreetnights` is never `Kloofstreetnights`.
2. **The signature format is locked:** narrative body → `— the.director` → edition name on its own line. Never reorder, never drop the edition line.
3. **The descriptor is "Wearable Editions."** The brand bible still says "Quiet Luxury Streetwear" — that line is superseded. If you see it anywhere, it's stale.
4. **Manifesto copy is verbatim** from the brand bible. `We owe nothing to anyone. We stop explaining. We stop convincing. We start being. We occupy the space of those who have already accepted themselves.` Bold weights on `owe nothing`, `stop explaining`, `stop convincing`, `start being` are part of the typesetting. Do not paraphrase, do not fix the sentence-case-to-lowercase mismatch — the manifesto is sentence case by design while the rest of the voice is lowercase.
5. **No hype language.** No countdowns, no "selling fast", no scarcity timers. Scarcity is structural — editions close because they close.

---

## 8. Edge cases

- **No live edition.** If every edition is `in-development`, the homepage current-edition block must not render an empty frame. Fall back to the most recent closed edition with a `closed` chip.
- **Unnamed colourways.** Render `[ pink — unnamed ]` with a dashed border and `HEX TBC`. Never substitute a guessed colour.
- **Missing images.** `<AssetSlot>` renders a labelled Void Black frame with a stone hairline. Never a broken `<img>`, never a grey box.
- **Long edition names.** `courtside club culture` is the current longest. Rows must wrap, not truncate — the name is the content.
- **Waitlist submit.** Prototype fakes success. Wire to a real endpoint; show inline `received` on success and a plain sand error line on failure. No modals, no toasts.
- **Empty archive descriptions.** Three editions currently have `—` as their description. Either supply copy or hide the column — an em dash on a public archive reads as unfinished.

---

## 9. Accessibility

- Contrast: sand `#D6D1C4` on void `#0A0A0A` ≈ 12.6:1 — passes AAA. Stone `#575D61` on void ≈ 3.1:1 — **fails AA for body text.** Stone is safe for large text, hairlines, and borders. Any stone text below 18px needs to move up to sand at reduced opacity instead.
- Focus rings must be visible — 1px clay outline with 2px offset. Do not `outline: none`.
- Mobile menu: trap focus while open, close on `Escape`, restore focus to the trigger.
- Ticker: `aria-hidden="true"`. It is decorative and its content is repeated elsewhere.
- Preloader: `aria-busy` on the container, and never block screen-reader access to content for more than ~1.2s.
- Every `<AssetSlot>` becomes an `<img>` with real alt text describing the garment and colourway — not "campaign image 1".
- Heading order: one `<h1>` per route, no skipped levels. The `[ 0N — ]` labels are not headings.

---

## 10. Assets outstanding

| Asset | Status | Blocking |
|---|---|---|
| *swag.* wordmark SVG | In Figma, **not in the HTML prototype** | Header + footer |
| kloofstreetnights artboards | On the live site at `/assets/winter-drop/Artboard{N}.jpg` | 9 slots landing, 15 on `/current` |
| Pink colourway hex + name | **Missing** | `/current` colourway strip |
| Green colourway name | **Missing** | `/current` colourway strip |
| Descriptions for ATM, Octane, Courtside | **Missing** | `/archive` |
| Instrument Sans licence check | Confirm Google Fonts terms cover use | Whole site |

---

## 11. Open decisions for Marcus

1. **Primary text colour** — SAND `#D6D1C4` (current Figma build) or FIRST LIGHT `#EDE7D8` (current HTML build)?
2. **White in the footer** — the `OWE NOTHING` lockup component in the Figma footer is filled white, which is outside the four-colour palette. Intentional or should it be sand?
3. **Edition 003+ visibility** — should unreleased editions be public on `/archive` at all, or only appear once they open?
4. **Waitlist backend** — where do email and WhatsApp signups go?

---

## Files

- `swag-site.html` — behavioural prototype, all five routes, single file
- Figma [SWAG.](https://www.figma.com/design/5w6qUwhO5sLBhxJHsqfC0u/SWAG.?node-id=176-30) — Page 1, five frames left to right, all fills bound to brand variables
