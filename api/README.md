# SWAG API (Spring Boot)

Shop checkout backend for V4. Gallery stays on Vercel; this service does not host product images. Do not proxy PayFast through Next.js `app/api`.

**Requirements:** Java 21, Docker (for local Postgres).

## Local Postgres

From the repository root:

```bash
docker compose up -d
```

Compose service: `postgres` (Postgres 16, database `swag`, port `5432`). Default credentials match `application.yaml` local defaults (`swag` / `swag_local`) — **local Docker only**, not for production.

## Run tests

```bash
cd api
./mvnw test
```

On Windows:

```powershell
.\mvnw.cmd test
```

`ApiApplicationTests` is disabled until JPA entities exist and a DB test strategy is in place.

## Run the API

```bash
./mvnw spring-boot:run
```

Server listens on `http://localhost:8080`.

## Configuration

See repository root `.env.example` for PayFast, Resend, shipping, and datasource overrides. Secrets stay in environment variables, not in git.

Set `RESEND_API_KEY` to send buyer confirmation and an `orders@` CSV on ITN `PAID`. Without the key, mail is recorded only (`RecordingMailPort`). PayFast `return_url` is signed with `?ref=SWAG-XXXXXX`.

**Catalog:** `app.catalog-path` defaults to `../packages/catalog/catalog.json` relative to the working directory when you run from `api/`. In the Docker image it is `/app/catalog/catalog.json`.

## Production (Hetzner VPS)

Stack: **Postgres 16** + **Spring API** + **Caddy** (TLS) at `https://api.crosswithswag.co.za`.

| File | Purpose |
|------|---------|
| [`docker-compose.prod.yml`](../docker-compose.prod.yml) | Production Compose |
| [`api/Dockerfile`](Dockerfile) | Multi-stage Java 21 image |
| [`deploy/Caddyfile`](../deploy/Caddyfile) | Reverse proxy + Let's Encrypt |
| [`deploy/api.env.example`](../deploy/api.env.example) | Env template (copy to `deploy/api.env`) |
| [`deploy/bootstrap-vps.sh`](../deploy/bootstrap-vps.sh) | One-time Docker + UFW on Ubuntu |
| [`deploy/DNS_GODADDY.md`](../deploy/DNS_GODADDY.md) | A record for `api` → VPS IP |
| [`deploy/PAYFAST_AFTER_VERIFICATION.md`](../deploy/PAYFAST_AFTER_VERIFICATION.md) | Keys + ITN after PayFast KYC |
| [`deploy/VERCEL.md`](../deploy/VERCEL.md) | `NEXT_PUBLIC_API_URL` on Vercel |

On the VPS (repo at `/opt/crosswithswag`):

```bash
cp deploy/api.env.example deploy/api.env   # set POSTGRES_PASSWORD and secrets
chmod 600 deploy/api.env
docker compose --env-file deploy/api.env -f docker-compose.prod.yml up -d --build
```

Health (after DNS + TLS): `curl -sS https://api.crosswithswag.co.za/actuator/health`

Postgres is **not** published to the host; only Caddy exposes `80`/`443`.
