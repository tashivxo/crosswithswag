# PayFast after merchant verification

The API is live on the VPS **before** PayFast keys exist. Checkout returns a controlled error until credentials are set.

## 1. Sandbox keys on the VPS

Edit `/opt/crosswithswag/deploy/api.env` (never commit):

- `PAYFAST_MERCHANT_ID`
- `PAYFAST_MERCHANT_KEY`
- `PAYFAST_PASSPHRASE`
- `PAYFAST_SANDBOX=true`

Restart:

```bash
cd /opt/crosswithswag
docker compose --env-file deploy/api.env -f docker-compose.prod.yml restart api
```

## 2. PayFast dashboard

- ITN URL: `https://api.crosswithswag.co.za/v1/payfast/itn`
- Enable card + Instant EFT (sandbox)

## 3. End-to-end sandbox

1. Vercel V4 preview with `NEXT_PUBLIC_API_URL=https://api.crosswithswag.co.za`
2. Place a test order → PayFast sandbox → return to `/order/confirmed`
3. Confirm ITN marks order `PAID` in Postgres and mail is sent when `RESEND_API_KEY` is set

## 4. Live money (later)

Only after sandbox is boring:

- `PAYFAST_SANDBOX=false` and live keys
- Update `PAYFAST_RETURN_URL` / `PAYFAST_CANCEL_URL` to production shop URLs on `crosswithswag.co.za` when V4 is promoted