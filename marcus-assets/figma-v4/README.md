# V4.1 Figma asset masters (not served)

Masters for Marcus CROSSWITHSWAG V4.1 (`lcZqp5HNaFCPBcWgPzAwUU`, section `21:23`).

| Source | Status |
|---|---|
| [Main V4 pack (Drive)](https://drive.google.com/drive/folders/1BR5pNoL793pmRsFUTcinhKT1hLkMsXUR?usp=sharing) | **Blocked** — `gdown` returns HTTP 401 unless permission is “Anyone with the link”. |
| [Archive photos (Drive)](https://drive.google.com/drive/folders/1kTH9yoamxY8n2VzVTF1taJ9QsF9h2D-T?usp=drive_link) | **Blocked** — same 401. |
| Figma MCP `download_assets` on `21:23` | **Partial** — one section PNG + 20 raw fills before MCP rate limit; staging under `mcp-staging/` is local-only (not committed). |

Web paths live in `public/assets/v4/*`. `lib/v4/assets.ts` lists served paths and `draft-missing` gaps.

## Archive photos: original to web mapping

Resized by `node scripts/optimize-archive.mjs` (long edge 2400px, WebP, metadata stripped, each under 500 KB). Originals stay in the gitignored `marcus-assets/figma-v4/archive/`. Order is filename order, **DRAFT: confirm with Marcus**; slots are in `lib/v4/assets.ts` (photos 01-12 gallery, 13 record/hero, 14-22 extras).

| # | Original | Web file (`public/assets/v4/archive/`) | Size |
|---|---|---|---|
| 01 | _DSC0355.jpg | ed001-dsc0355.webp | 1590x2400, 309 KB |
| 02 | _DSC0403.jpg | ed001-dsc0403.webp | 1590x2400, 421 KB |
| 03 | _DSC0422.jpg | ed001-dsc0422.webp | 1590x2400, 381 KB |
| 04 | _DSC0430.jpg | ed001-dsc0430.webp | 1590x2400, 161 KB |
| 05 | _DSC0586.jpg | ed001-dsc0586.webp | 1590x2400, 480 KB |
| 06 | _DSC0587.jpg | ed001-dsc0587.webp | 1590x2400, 497 KB |
| 07 | _DSC0610.jpg | ed001-dsc0610.webp | 1590x2400, 69 KB |
| 08 | _DSC0614.jpg | ed001-dsc0614.webp | 1590x2400, 177 KB |
| 09 | _DSC0631-3.jpg | ed001-dsc0631-3.webp | 1445x2400, 349 KB |
| 10 | _DSC0632.jpg | ed001-dsc0632.webp | 1590x2400, 294 KB |
| 11 | _DSC0681.jpg | ed001-dsc0681.webp | 1590x2400, 262 KB |
| 12 | _DSC0684.jpg | ed001-dsc0684.webp | 1590x2400, 219 KB |
| 13 | _DSC0699.jpg | ed001-dsc0699.webp | 1590x2400, 139 KB |
| 14 | _DSC0738.jpg | ed001-dsc0738.webp | 1590x2400, 168 KB |
| 15 | _DSC0810.jpg | ed001-dsc0810.webp | 1590x2400, 366 KB |
| 16 | _DSC0836.jpg | ed001-dsc0836.webp | 1590x2400, 210 KB |
| 17 | KSN (11).jpg | ed001-ksn-11.webp | 1991x2400, 482 KB |
| 18 | KSN (17).jpg | ed001-ksn-17.webp | 1590x2400, 495 KB |
| 19 | KSN (23).jpg | ed001-ksn-23.webp | 2400x1590, 324 KB |
| 20 | KSN (27).jpg | ed001-ksn-27.webp | 2400x1590, 340 KB |
| 21 | KSN (28).jpg | ed001-ksn-28.webp | 1576x2400, 379 KB |
| 22 | KSN (42).jpg | ed001-ksn-42.webp | 1590x2400, 386 KB |

## Products (v41-products.zip)

Raw in the gitignored `products/`. Curated 1600w JPGs in `public/assets/v4/shop/`; mapping table in `lib/v4/assets.ts` (`shopZipMapping`).
