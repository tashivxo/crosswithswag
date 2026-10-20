# Zuki presentation — social links + QR

## Page

- **Source copy:** `presentation/swag-connect.html`
- **Live URL (after deploy):** https://crosswithswag.co.za/presentation/swag-connect.html
- **Served from:** `public/presentation/swag-connect.html` (keep in sync with the source file)

Open the HTML in a browser to preview. Attendees need the **https** URL in the QR code (not a local `file://` path).

Links on the page: website, Instagram, WhatsApp, Facebook, TikTok (`@crosswithswag`). Row icons are local PNGs under `presentation/icons/` (mirrored in `public/presentation/icons/`).

## QR for slides

Use `presentation/swag-connect-qr.png` (points at the live URL above).

Regenerate after URL changes:

```bash
npx --yes qrcode -o presentation/swag-connect-qr.png "https://crosswithswag.co.za/presentation/swag-connect.html"
```

Drop the PNG on Zuki’s deck. Optional: add a short line under the code, e.g. `crosswithswag.co.za/presentation/swag-connect`.

## WhatsApp link

Business click-to-chat: `https://wa.me/27682812891` (display: +27 68 281 2891). Pre-filled opener: “Hi — connecting from swag.”
