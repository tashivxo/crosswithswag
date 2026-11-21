# Vercel frontend → VPS API

After `https://api.crosswithswag.co.za/actuator/health` returns `{"status":"UP"}`, set on the **crosswithswag** Vercel project (V4 preview first):

| Variable | Value | Environments |
|----------|--------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://api.crosswithswag.co.za` | Preview (branch `V4_branch`) |

Redeploy the preview. Production `main` stays gallery-only until V4 is promoted and Marcus sign-off.

CORS on the VPS already allows `crosswithswag.co.za`, `www`, and the V4 preview host (see `deploy/api.env.example`).