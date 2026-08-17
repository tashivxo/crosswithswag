# Asset Usage Notes

## Wordmark

The cleaned SVG assets are available in:

- Source masters: `marcus-assets/svg/*_clean.svg`
- Web-served copy: `public/assets/*_clean.svg`

For production, prefer using the clean path-only SVG as a CSS mask so the mark can inherit the correct section colour. This avoids needing separate exports for every background.

Current implementation target (V3.1):

- Mask asset `public/assets/SWAG_mark_fill.png` (Group 53 knockout: filled `swag.`, no micro-text)
- Dark sections: filled with Muted Sand `#D6D1C4`
- Light Sand section: same mask, filled with Void Black `#0A0A0A`

Do not use `SWAG_logo_clean.svg` as the live mask — it is stroke-outline only and reads as a hollow wire. Do not use `Frame_6_clean.svg` — it bakes in CROSS WITH SWAG micro-text under the mark.

## Section 6 — kloofstreetnights

Marcus locked:

- Narrative copy in `lib/copy.ts` → `edition.copyLines`
- Sign-off: `-the.director`
- Closing statement: `kloofstreetnights.`
- CTA: `this lives at @crosswithswag.`
- Imagery: void black colourway campaign photography in `public/assets/winter-drop/`

The edition section renders the first three campaign images from `edition.imagery.assets`.
