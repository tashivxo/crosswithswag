# Marcus assets (source masters)

Figma / export masters for `swag.` — **not** served by Next.js.

| Folder | Contents |
|---|---|
| `svg/` | Clean wordmark / frame SVGs from Marcus |
| `winter-drop/` | kloofstreetnights campaign stills (source JPGs) |
| `figma-aug-2026/` | August 2026 WEBSITE page exports (1440-wide PNG frames + wordmark). Not served. |

Web-served copies live in `public/assets/` (`*_clean.svg`, `SWAG_mark_fill.svg`, `winter-drop/`). Edit masters here, then copy into `public/assets/` when shipping a new export.

## Wordmark (V3.1)

Live mark is a CSS mask of `public/assets/SWAG_mark_fill.svg` — the filled `swag.` path from `Frame_6_clean.svg` with the CROSS WITH SWAG micro-text removed. Aspect `--wordmark-aspect-ratio: 1.426685` matches production so the header keeps the same padding. Regenerate with:

```bash
python scripts/extract-wordmark-fill.py
```

Do **not** use:

- `Frame_6_clean.svg` as the live mask — it bakes in the small CROSS WITH SWAG lettering
- `SWAG_logo_clean.svg` — stroke outline only; as a mask it reads as a hollow/grey wire
- `SWAG_mark_fill.png` — Group 53 raster; sharp at nav size, blurry when scaled to the hero
