# VPS deploy (Spring + Postgres)

1. **DNS** — [`DNS_GODADDY.md`](DNS_GODADDY.md): add `api` A → `46.225.208.93` (do not touch root `@`).
2. **Server** — `/opt/crosswithswag`, `bootstrap-vps.sh` once, then `docker compose --env-file deploy/api.env -f docker-compose.prod.yml up -d --build`.
3. **Vercel** — [`VERCEL.md`](VERCEL.md): `NEXT_PUBLIC_API_URL=https://api.crosswithswag.co.za` on V4 preview.
4. **PayFast** — [`PAYFAST_AFTER_VERIFICATION.md`](PAYFAST_AFTER_VERIFICATION.md) when Marcus’s merchant account clears.