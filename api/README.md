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

**Catalog:** `app.catalog-path` defaults to `../packages/catalog/catalog.json` relative to the working directory when you run from `api/`. A classpath copy may replace this later.
