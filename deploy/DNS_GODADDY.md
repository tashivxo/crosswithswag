# GoDaddy DNS for `api.crosswithswag.co.za`

The Hetzner VPS is **`46.225.208.93`**. Nameservers are GoDaddy (`ns15/ns16.domaincontrol.com`). Add this record in [GoDaddy DNS](https://dcc.godaddy.com/control/dnsmanagement?domainName=crosswithswag.co.za):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| **A** | `api` | `46.225.208.93` | 600 (or default) |

Do **not** change the root `@` record (that stays on Vercel).

After propagation (usually 5–30 minutes), on the VPS:

```bash
docker compose --env-file deploy/api.env -f docker-compose.prod.yml restart caddy
```

Verify from your machine:

```bash
curl -sS https://api.crosswithswag.co.za/actuator/health
```

Expected: `{"status":"UP"}`. Caddy will obtain Let’s Encrypt automatically once the A record resolves.