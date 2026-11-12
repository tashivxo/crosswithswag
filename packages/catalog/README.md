# Shared merchandising catalog

`catalog.json` is the single merchandising bible for Standard Wearable Editions on V4. It describes what is sold, at what price, in which sizes, and which image URLs the gallery should use. It does **not** track inventory (`quantity_on_hand` is intentionally absent in v1).

## Source of truth today

Until the P1 generate/sync script lands, `lib/v4/products.ts` (`standardProducts`) is what the Next gallery reads at runtime. This file was hand-aligned to that module on branch `V4_branch`. When merchandising changes, update **both** until the sync script exists, or treat this JSON as canonical and regenerate `products.ts` from it (planned P1).

## Next.js (gallery / PDP)

- **Purpose:** Display names, colourways, prices, size availability, and image paths.
- **How to load:** Read `packages/catalog/catalog.json` at build time, via a small import/copy step, or eventually from a generated `lib/v4/products.ts`. The gallery must not invent SKUs or prices that are not in this file.
- **Images:** Paths are site-relative URLs under `/assets/v4/...` on the frontend origin (`public/`). Next serves them as static files; the API does not host product photos.
- **Checkout UX:** The browser may send `sku`, `size`, and quantity to the API, but **must not** trust client-side price or availability for payment. Use API responses from Spring for anything that affects money.

## Spring Boot (pay path)

- **Purpose:** Authoritative catalog for checkout validation, line-item pricing, and (optionally) seeding a `product` table on boot.
- **How to load:** Copy or classpath-load `packages/catalog/catalog.json` (or a resource copied from it in `api/src/main/resources/`). Reload on deploy when the file changes.
- **Pay path rule:** **`POST /v1/checkout` and PayFast ITN handling always use Spring’s loaded copy of this catalog**, not the browser and not a live fetch to the Next deployment. Reject unknown SKUs, sizes with `offered: false`, and mismatched `price_cents`.
- **Pricing:** Use each product’s `price_cents` from JSON. Top-level `currency` is `ZAR`. See `edition` for VAT note until Marcus confirms otherwise.

## Fields (per product)

| Field | Notes |
|-------|--------|
| `sku` / `id` | Same value; stable id e.g. `express-dispatch-black` |
| `slug` | PDP route slug e.g. `product-express-dispatch-black` |
| `family` | `express` \| `halo` \| `super` \| `daily` |
| `shirtName` / `colourwayName` | Display merchandising copy |
| `price_cents` | Integer ZAR cents (VAT-inclusive per `edition` note) |
| `sizes[]` | `{ "code", "offered" }` — availability flag only, not stock count |
| `images` | `main`, `thumbs`, `card`, `hover`, optional `printClose` |
| `shirt_index` | Figma / landing display order (1–9) |

## What this package is not

- Not a stock system — only `offered` per size.
- Not generated `products.ts` — that sync is P1 (`cursor.md/backend-plan.md` §6, §11).
- Not delivery options or product spec tables — those stay in `lib/v4/products.ts` / copy until folded into catalog later if needed.

## Repo layout

```
packages/catalog/
  catalog.json   ← edit merchandising here
  README.md      ← this file
```

Spring lives in `api/`; Next lives at the repo root. The catalog sits between them as the only shared package (no Turbo/Nx required).
