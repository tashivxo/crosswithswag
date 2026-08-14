# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: people already in Marcus’s world — Instagram followers of `@crosswithswag`, Cape Town peers, and anyone who already knows they belong. They arrive to look, not to shop.

Secondary: Marcus (the director) reviewing V3 fidelity against his Figma/HTML handoff before public launch. Collaborators (e.g. Zukiswa) on the rebuild thread.

## Product Purpose

`swag.` is a quiet, type-led digital gallery for Wearable Editions. Each edition is one thought held as garment, campaign image, and framed print — conceived, released, and permanently closed.

Success is Marcus signing off the V3 preview, then a public site that feels like a sequence of typographic posters rather than a store.

## Positioning

Not ecommerce, not a drop calendar, not merch. A continuous-scroll gallery that refuses to explain itself. Neighboring fashion sites sell; this one states.

## Operating Context

- Single-page continuous scroll (five V3 chapters). No routes besides `/`.
- Review happens on Vercel preview until Marcus signs off. Production (`main`) stays the V2 Canva-whiteboard build.
- Motion: Lenis + GSAP, reduced-motion respected.
- Waitlist is currently a local validated acknowledgment only. A real list (and any later Cloudflare Workers/Pages move) is deferred until cost and “no frontend rewrite” are proven. Not this change.

## Capabilities and Constraints

- Five chapters: Home, Current edition, Archive, Manifesto, Contact.
- CTAs are tracked uppercase text in square outlines or underline fields — not pills, filled sales buttons, or card chrome. No analytics until a provider is chosen. No custom production domain before sign-off.
- Four brand colours and Instrument Sans are locked.
- Unnamed colourways stay `HEX TBC`; ATM/Octane/Courtside descriptions stay `—`.
- Open: domain/DNS, analytics, launch date, community-page scope, waitlist backend, possible later Cloudflare hosting.

## Brand Commitments

- Name: `swag.` Handle: `@crosswithswag`. Tagline: `WEARABLE EDITIONS` (locked).
- Creative director credited as `the director.`
- Voice: quiet, type-led, editorial, non-commercial, no over-explaining. Cape Town vernacular without performance.
- Typeface: Instrument Sans 400 / 500 / 700 (locked).
- Colours: Void Black `#0A0A0A`, Stone Grey `#575D61`, Clay `#8C5E4A`, Sand `#D6D1C4` (locked).
- Wordmark is custom SVG lettering, not a font.

## Evidence on Hand

- Copy: `lib/copy.ts` (V3). V2 preserved in `lib/copy.v2.ts`.
- Editions: `lib/editions.ts`. Campaign stills: `public/assets/winter-drop/`.
- Wordmark: `public/assets/Frame_6_clean.svg`.
- Marcus V3 handoff: `cursor.md/v3/`. Identity: `cursor.md/design.md`.
- Do not fabricate testimonials, prices, unnamed colour hexes, or edition stories.

## Product Principles

1. Statements, not pitches.
2. Trust the visitor; do not over-explain.
3. One idea per fold; the garment and the type do the work.
4. Do not invent product facts Marcus has not given.
5. Motion serves orientation and honesty, never decoration for its own sake.

## Accessibility & Inclusion

Respect `prefers-reduced-motion`. Keep primary navigation findable. Do not hide copy behind animation. Body and placeholder contrast must hold on Void Black. Touch targets for MENU/CLOSE stay at least 44px.
