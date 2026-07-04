# Asset Usage Notes

## Wordmark

The cleaned SVG assets are available in:

- Source: `assets/*_clean.svg`
- Web-served copy: `public/assets/*_clean.svg`

For production, prefer using the clean path-only SVG as a CSS mask so the mark can inherit the correct section colour. This avoids needing separate exports for every background.

Current implementation target:

- Primary dark sections: mask asset `public/assets/Frame_6_clean.svg`, filled with Muted Sand `#D6D1C4`
- Light Sand section: same mask, filled with Void Black `#0A0A0A`

`SWAG_logo_clean.svg` is stroke-outline only and should not be treated as the production fill wordmark unless Marcus specifically chooses that outline treatment.

## Section 6 Placeholder Strategy

Until Marcus provides campaign photography, the kloofstreetnights section uses:

- Deep Earth / Clay background `#8C5E4A`
- Large edition title as the main visual weight
- A framed placeholder area using low-opacity border and ghost text
- One provisional line: `A wearable edition carrying a point of view.`
- CTA: `@crosswithswag`

Replace the placeholder with high-res portrait and landscape imagery once sourced.
