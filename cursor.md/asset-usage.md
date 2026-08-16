# Asset Usage Notes

## Wordmark

The cleaned SVG assets are available in:

- Source masters: `marcus-assets/svg/*_clean.svg`
- Web-served copy: `public/assets/*_clean.svg`

For production, prefer using the clean path-only SVG as a CSS mask so the mark can inherit the correct section colour. This avoids needing separate exports for every background.

Current implementation target:

- Primary dark sections: mask asset `public/assets/Frame_6_clean.svg`, filled with Muted Sand `#D6D1C4`
- Light Sand section: same mask, filled with Void Black `#0A0A0A`

`SWAG_logo_clean.svg` is stroke-outline only and should not be treated as the production fill wordmark unless Marcus specifically chooses that outline treatment.

## Section 6 — kloofstreetnights

Marcus locked:

- Narrative copy in `lib/copy.ts` → `edition.copyLines`
- Sign-off: `-the.director`
- Closing statement: `kloofstreetnights.`
- CTA: `this lives at @crosswithswag.`
- Imagery: void black colourway campaign photography in `public/assets/winter-drop/`

The edition section renders the first three campaign images from `edition.imagery.assets`.
