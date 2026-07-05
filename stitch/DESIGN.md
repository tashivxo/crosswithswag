# Design System: swag. Wearable Editions

## 1. Visual Theme & Atmosphere

A dark, restrained digital gallery for a wearable editions brand. The interface should feel like moving through a sequence of typographic posters in a quiet exhibition room: sparse, heavy, self-assured, and non-commercial. The brand speaks in statements, not pitches. Product energy is suppressed; presence, silence, and scale do the work.

**Design dials for Stitch:**

- **Density:** 2 / 10 - art gallery airy, with generous negative space.
- **Variance:** 8 / 10 - asymmetric poster compositions, large bleed type, organic placement of small copy.
- **Motion:** 6 / 10 - fluid scroll choreography, not playful micro-animation.

The site is a single continuous-scroll experience. Every section should feel like a standalone poster, but all sections must belong to one consistent visual language.

## 2. Color Palette & Roles

- **Void Black** (`#0A0A0A`) - Primary foundation. Use for Hero, Manifesto, first SWAG section, Closing Statement, and Footer. Represents silence and depth.
- **Stone Grey** (`#575D61`) - Structural mid-tone for presence and density sections. Represents the stone wall, unshakeable journey.
- **Deep Earth / Clay** (`#8C5E4A`) - Wearable edition showcase background. Represents grounding and clarity.
- **Muted Sand** (`#D6D1C4`) - Primary text on dark backgrounds, light section background, and wordmark colour. Represents blank canvas and complete focus.

**Colour sequence for the whole scroll:**

`Black -> Black -> Black -> Sand -> Stone -> Clay -> Stone -> Black`

Never introduce extra accents, bright colours, neon, gradients, glass effects, or decorative colour shifts. Solids only.

## 3. Typography Rules

- **Typeface:** Instrument Sans.
- **Display / section headlines:** Instrument Sans 700, uppercase, very tight tracking (`-0.04em` to `-0.06em`), oversized enough to bleed off the viewport.
- **Statement type:** Instrument Sans 500, uppercase, tight tracking (`-0.02em` to `-0.03em`).
- **Body / manifesto:** Instrument Sans 400, sentence case, relaxed line height, max 65 characters per line.
- **Small labels:** Instrument Sans 400, uppercase, open tracking (`+0.05em`).

**Scale direction:**

- Display: `clamp(80px, 16vw, 220px)`
- Headline: `clamp(40px, 7vw, 96px)`
- Statement: `clamp(24px, 4vw, 56px)`
- Body: `clamp(16px, 1.5vw, 20px)`
- Label: `clamp(11px, 1vw, 13px)`

Do not use serif fonts. Do not use Inter. Do not use system-font defaults.

## 4. Section System

### 1. Hero / Landing

Void Black background. Place the custom swag. wordmark top-left in Muted Sand. Under or near it: small uppercase label `WEARABLE EDITIONS`. Keep the composition minimal. Add very large low-opacity ghost text behind the foreground, using `NOTH- / OWE / ING.` or equivalent. Nothing should look like a sales hero.

### 2. Manifesto

Void Black background with Muted Sand text. Use the Wearable Editions manifesto as a large body-type moment, not display type. Generous whitespace. The sign-off line should feel separate and deliberate.

### 3. What is SWAG? - Authentic Expression

Void Black background. Bleed the word `EXPRESSION` off the right or bottom edge. Add small top-left `WHAT IS SWAG?` label. Include ghost `CROSS / WITH / SWAG` layer behind all content at low opacity. Use scattered supporting copy.

### 4. What is SWAG? - Internal Authority

Muted Sand background with Void Black foreground type. Bleed the word `AUTHORITY`. Keep the same poster system, but flip the colour relationship.

### 5. What is SWAG? - Presence

Stone Grey background with Muted Sand foreground type. Bleed the word `PRESENCE`. Use statement copy about presence, respect, and not begging to be understood.

### 6. kloofstreetnights - Wearable Edition

Deep Earth / Clay background. This is a release showcase reframed as a wearable edition, not a conventional drop. Use a large display title, one sparse line of copy, and a placeholder image zone if no photography is available. CTA is text-only: `@crosswithswag`.

### 7. What is SWAG? - Density / Weight

Stone Grey background with Muted Sand foreground type. Bleed the word `WEIGHT`. Use density, consistency, rupture, reconstruction, and internal movement statements.

### 8. Closing Statement

Void Black background. Single large statement, `NOTHING OWING.` or equivalent. No explanation. Low-opacity ghost type can echo the hero.

### 9. Footer

Void Black background. Minimal: `@crosswithswag`, `the director.`, year if needed. No decorative elements.

## 5. Component Stylings

- **Wordmark:** Custom SVG mark. Do not approximate with a typed font.
- **CTA:** Text link only. Underline draw on hover. No button container, no pill, no rounded background.
- **Poster sections:** No cards, no borders, no containers. Use type, space, colour, and layers.
- **Ghost text:** Low opacity, oversized, behind foreground content. It should feel like atmosphere, not decoration.
- **Circle element:** If used, large flat CSS circle in a slightly darker/lighter tone of the section background. Keep it spare.
- **Images:** For prototype, use muted monochrome or Clay-toned placeholders. No lifestyle stock energy. No bright ecommerce product grid.

## 6. Layout Principles

- Mobile-first, portrait-poster logic.
- Desktop sections aim for `100dvh`; mobile sections may grow to fit manifesto text.
- Use asymmetric placement. Do not center every section.
- Let display type bleed beyond viewport edges. This is intentional.
- Keep every element in its own clear spatial zone. No illegible overlap.
- Avoid generic layout families: no three-card rows, no product grids, no sale banners.

## 7. Motion & Interaction

Motion should communicate sequence and weight:

- Background transitions are scroll-linked and follow the confirmed colour sequence.
- Manifesto reveals line by line.
- SWAG statements reveal word by word or phrase by phrase.
- Ghost watermark can move slower than foreground content.
- Bleed type can slide in from the edge or reveal through a mask.
- No looping animations unless they serve the message.
- Respect reduced motion; the static composition must still work.

## 8. Anti-Patterns

Never generate:

- E-commerce product grid language.
- Sale banners.
- Buttons that say "Shop now", "Discover", "Explore", or "Learn more".
- Neon colours, purple/blue AI gradients, mesh gradients, or glows.
- Rounded card containers.
- Drop shadows on type.
- Generic stock iconography.
- Emojis.
- Three-column card sections.
- Centered SaaS-style hero layouts.
- Over-explaining copy.
- Extra accent colours beyond the four brand colours.

## 9. Copy Source

Use locked copy from `lib/copy.ts`.

**Hero label:** `WEARABLE EDITIONS`

**Manifesto:**

We stopped explaining ourselves a long time ago.

swag. is not a collection. It is not a drop. It is not content.

Each piece exists once - conceived, made, and released into the world as a singular object. The garment. The image. The frame on your wall. All the same thoughts, held in different forms.

We call them wearable editions because that is what they are. Not a product. Not merch. Objects that carry a point of view - made for the people who already know who they are.

We owe nothing to anyone. We occupy the space of those who have already accepted themselves.

This is not for everyone.

It was never meant to be.

- the director.
