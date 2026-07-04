# Marcus Review Packet
## swag. V1 pre-sign-off review

## Review links

- Vercel deployment: https://crosswithswag-r32lqzxf2-ict-5428s-projects.vercel.app
- Vercel inspect: https://vercel.com/ict-5428s-projects/crosswithswag/HwkhLoYjvC6JbpWLFEZ2k2tT5qzm

Note: this deployment built successfully, but anonymous access is currently gated by Vercel authentication/protection. Share from Vercel or disable deployment protection when Marcus needs to review outside the team.

## What to review

1. **Manifesto + tagline**
   - Is `WEARABLE EDITIONS` locked?
   - Is the Draft 1 manifesto locked?

2. **Screen compositions**
   - Hero: wordmark top-left, quiet entry, ghost `NOTH- / OWE / ING.`
   - Manifesto: body-type pacing, not display-type shouting
   - SWAG sections: bleed word + ghost `CROSS / WITH / SWAG`
   - Section 6: `kloofstreetnights - Wearable Edition` framing
   - Closing: `NOTHING OWING.`

3. **Provisional copy choices**
   - SWAG statement distribution across sections 3, 4, 5, and 7
   - Bleed words: `EXPRESSION`, `AUTHORITY`, `PRESENCE`, `WEIGHT`
   - Section 6 line: `A wearable edition carrying a point of view.`

4. **Motion direction**
   - Lenis smooth scroll is wired
   - GSAP reveal stubs are wired
   - Scroll-linked background infrastructure is wired
   - Final timing, parallax depth, and transition style still need approval

## Stitch handoff

- Stitch semantic design system: `stitch/DESIGN.md`
- Stitch screen prompts: `stitch/screen-prompts.md`

## Verification

- `npm run lint` passes
- `npm run build` passes locally
- Vercel build completed successfully

## Decisions needed before polish

- Lock or revise Wearable Editions manifesto
- Lock or replace Instrument Sans
- Approve or revise SWAG statement distribution
- Approve or revise bleed display words
- Supply Section 6 imagery direction/assets
- Choose final motion pacing
- Choose analytics provider
- Confirm domain/DNS plan
