# Marcus assets (source masters)

Figma / export masters for `swag.` — **not** served by Next.js.

| Folder | Contents |
|---|---|
| `svg/` | Clean wordmark / frame SVGs from Marcus |
| `winter-drop/` | kloofstreetnights campaign stills (source JPGs) |
| `figma-aug-2026/` | August 2026 WEBSITE page exports (1440-wide PNG frames + wordmark). Not served. |

Web-served copies live in `public/assets/` (`*_clean.svg`, `SWAG_mark_fill.png`, `winter-drop/`). Edit masters here, then copy into `public/assets/` when shipping a new export.

## Wordmark (V3.1)

Live mark is a CSS mask of `public/assets/SWAG_mark_fill.png` (653×240, white fill, transparent ground, aspect `2.720833`).

That PNG is a knockout of `figma-aug-2026/wordmark-group-53.png` (filled Sand `swag.` on black, **no** CROSS WITH SWAG micro-text). Regenerate with:

```bash
python scripts/knockout-wordmark.py
```

Do **not** use:

- `Frame_6_clean.svg` — filled, but bakes in the small CROSS WITH SWAG lettering
- `SWAG_logo_clean.svg` — stroke outline only; as a mask it reads as a hollow/grey wire
