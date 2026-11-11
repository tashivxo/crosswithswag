# SWAG Backend Plan (v1)

Status: **agreed, not implemented.** Frontend stays on Vercel. Spring + Postgres run locally until a VPS is purchased. Live PayFast money does not happen before that VPS + `api.*` DNS.

Canonical for this plan. If this file conflicts with older “gallery not ecommerce” copy, this file wins for **V4 shop checkout**. Production V3.3.3 gallery behaviour is unchanged until V4 is promoted.

---

## 1. Audit summary

The repo today is a **Next.js App Router frontend at the repository root**. V4 shop, cart, and checkout are UI only.

| Surface | Today | Problem |
|---|---|---|
| Catalog | `lib/v4/products.ts` (R350 placeholder, sizes, sold-out flags) | Browser cannot be trusted at pay time |
| Cart | `lib/v4/cart/CartProvider.tsx` (client) | Lost on refresh/device; fine for v1 |
| Pay | `lib/v4/order.ts` stub → `sessionStorage` | No money, no order record |
| Checkout form | Guest name / email / phone / address | No Paxi collect point, no shipping method |
| Waitlist | `POST /api/waitlist` → Jotform | V3.3.3 only; **not in V4 prod** |
| KSN order | Jotform `order-kloofstreetnights` | V3 only; **not in the new edition** |
| Images | `public/assets/v4/` | Stay on Vercel; API does not host photos |
| Hosting | Vercel project `crosswithswag`, domain `crosswithswag.co.za` | Do not attach API to this Vercel project |

Pain points for a Java API: no `apps/` split, no shared catalog file, Next `app/api` is not the commerce backend, no Postgres, no payment webhook, fulfilment is undefined in code.

---

## 2. What v1 is

Made-to-order **standard-edition shop**.

1. Guest fills checkout (no accounts).
2. Chooses **PEP Paxi collect** (official locator embed) **or private ship**.
3. Spring re-prices from the shared catalog, creates `CREATED` order, redirects to **PayFast** (card + Instant EFT).
4. PayFast ITN marks `PAID`.
5. Spring emails the **buyer** (`orders@crosswithswag.co.za` via Resend/Postmark/SES) and emails **you** at `orders@` with a **CSV attachment**.
6. You forward the job to the manufacturer (WhatsApp/email). Spring never talks to the factory.
7. You move the order `IN_PRODUCTION` → `DISPATCHED` later (script or admin). Second buyer email when you have a trigger.

Not in v1: customer accounts, staff admin UI, numeric warehouse stock, courier booking APIs, Yoco, Apple Pay on-site, PayFast Onsite/modal, Spring-triggered refunds, waitlist, Jotform, Redis, Mongo.

---

## 3. Decision log

| Decision | Choice | Why |
|---|---|---|
| Job of v1 | Commerce + take payment | V4 checkout stub is the gap; gallery CMS is not |
| Processor | PayFast now; Yoco + Apple Pay later | Instant EFT + card in SA; interface the PSP |
| Pay UX | Hosted redirect now; onsite later | EFT will leave the site anyway |
| Customer | Guest now; `customer_id` nullable for later | Matches current form; no Spring Security shop |
| Staff | Email + CSV now; admin later | Low volume; do not build a dashboard first |
| Stock | Made-to-order; “sold out” = not offered | You cut after the order |
| Factory | You forward; API stores SKU/size/qty/address | No factory integration |
| Ship | `PAXI_COLLECT` + flat fee, or `PRIVATE_SHIP` garment-only | Paxi is customer-facing; private is off-platform |
| Paxi | Official iframe `map.paxi.co.za`; store point on order | No PAXI booking API until volume |
| Courier APIs | Later | You drop at PEP / book private yourself |
| Spring scope | Shop checkout only | Waitlist/Jotform stay on archived V3.3.3 |
| Catalog | One shared file in the monorepo | Next + Spring; no CMS; no qty-on-hand |
| Price | `price_cents` in catalog; do not hard-code 350 | Marcus still confirming |
| Currency | ZAR. Treat catalog prices as VAT-inclusive until Marcus says otherwise | No VAT line in v1 |
| Buyer mail | Our confirmation, not PayFast-only | Brand + made-to-order expectation |
| Human mail | GoDaddy forward + Gmail filters | One inbox (`crosswithswag@gmail.com`) |
| App mail | Resend/Postmark/SES + DKIM as `orders@` | Gmail SMTP will look like spam |
| Cart | Browser until Pay | No abandoned-cart tables |
| Refunds | PayFast dashboard + you email; `REFUNDED` later | Volume is low |
| Statuses | `CREATED` `PAID` `IN_PRODUCTION` `DISPATCHED` `CANCELLED` (+ `REFUNDED` later) | Manufacturing is real even without admin |
| Repo now | Next at root; Spring in `api/`; catalog in `packages/catalog` | Do not break Vercel this week |
| Repo later | `apps/web` + `apps/api` + `packages/catalog` | Clean split after checkout works |
| API hostname | Local + tunnel until VPS; then `api.crosswithswag.co.za` | Do not put `/api` on the Vercel domain |
| Orchestration | Docker Compose for Postgres (and API if useful) | No Redis/Mongo |
| Workspaces | Folders + README; not Turbo/Nx | Java is Maven, not Turbo |

---

## 4. P0 before local pay-sandbox is useful

Do these in parallel with coding. None require the VPS.

### 4.1 Domain mail (GoDaddy → Gmail)

DNS on `crosswithswag.co.za` (already on GoDaddy). Do **not** move the site domain off Vercel.

Forward to `crosswithswag@gmail.com`:

- `orders@crosswithswag.co.za`
- `support@crosswithswag.co.za`
- `info@crosswithswag.co.za`
- `zuki@crosswithswag.co.za`
- `tashiv@crosswithswag.co.za`
- `marcus@crosswithswag.co.za`

Gmail filters on `To:` / `Delivered-To:` so the shared inbox is readable.

### 4.2 Transactional send (Spring)

1. Create Resend (default) or Postmark/SES.
2. Add SPF + DKIM (+ DMARC when ready) on GoDaddy for `crosswithswag.co.za`.
3. Spring sends as `orders@crosswithswag.co.za`.
4. Replies land in Gmail via the forward.

Do not send production order mail from `crosswithswag@gmail.com`.

### 4.3 PayFast merchant

No account yet. P0:

1. Sign up at PayFast (business / merchant).
2. Enable **sandbox**.
3. Note `merchant_id`, `merchant_key`, passphrase (ITN).
4. Enable **card + Instant EFT**.
5. Live keys stay unused until VPS + HTTPS + return URLs on production frontend.

Yoco and Apple Pay: listed as P2, same `PaymentProvider` interface.

### 4.4 Paxi fee

`shipping_cents` for `PAXI_COLLECT` is **config**, not code. Placeholder until Marcus (PAXI 5 kg bag is roughly R60 economy / R110 speed — charge a round number you choose). Private ship: `shipping_cents = 0` on PayFast.

---

## 5. Architecture

```
Browser (Vercel)                    Spring (local → later VPS)
  shop / cart / checkout              POST /v1/checkout
  PAXI iframe (point code)            create order CREATED
  redirect to PayFast            →    PayFast hosted (card | Instant EFT)
  /order/confirmed               ←    GET return_url
                                      POST ITN → PAID (verify signature)
                                      email buyer + email orders@ + CSV
```

Rules:

- Frontend never holds PayFast `merchant_key` or mail API keys.
- Frontend never sends `price_cents` as authority. It sends `sku` + `size` + `qty`. Spring loads the catalog and computes `subtotal_cents + shipping_cents`.
- PayFast amount must match the stored order. Mismatch → ignore ITN, do not mark PAID.
- ITN endpoint is unauthenticated HTTP; **signature + source confirmation** is the auth.
- CORS: `http://localhost:3000` and the Vercel / `crosswithswag.co.za` origins. Nothing else.

### 5.1 HTTP (v1)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/v1/catalog` | Optional; frontend may keep using the shared file at build time |
| `POST` | `/v1/checkout` | Guest + lines + `PAXI_COLLECT` \| `PRIVATE_SHIP` + Paxi point or address → PayFast redirect fields |
| `POST` | `/v1/payfast/itn` | Instant Transaction Notification |
| `GET` | `/v1/orders/{ref}` | Confirmation page poll (ref + email or signed token — do not make a public PII dump) |

No login. CSV is **outbound email**, not a download URL.

### 5.2 Order record (minimum)

- `id` (uuid), `ref` (`SWAG-XXXXXX`, keep the stub format)
- `status`
- `email`, `name`, `phone`
- `ship_method` (`PAXI_COLLECT` \| `PRIVATE_SHIP`)
- Paxi: `paxi_code`, `paxi_name`, `paxi_address` (required if Paxi)
- Private: `address_text` (required if private)
- `subtotal_cents`, `shipping_cents`, `total_cents`, `currency=ZAR`
- `payfast_payment_id` / ITN payload (audit)
- `customer_id` **nullable** (accounts later)
- lines: `sku`, `size`, `qty`, `unit_price_cents`, names for email/CSV
- timestamps

### 5.3 Status

`CREATED` → (ITN success) `PAID` → `IN_PRODUCTION` → `DISPATCHED`  
`CREATED` → (cancel / expire / fail) `CANCELLED`  
Later: `PAID` → `REFUNDED` (dashboard refund; optional ITN listener)

Without admin, `IN_PRODUCTION` / `DISPATCHED` can be a tiny authenticated script or SQL. Do not block v1 pay on that UI.

### 5.4 Payment provider interface

```text
PaymentProvider
  createCheckout(order) → redirectUrl + vendorFields
  verifyItn(request) → Paid | Ignored | Failed
```

v1: `PayfastPaymentProvider`. Later: `YocoPaymentProvider`, Apple Pay via a PSP (often still PayFast/Yoco, not a third parallel merchant unless required).

### 5.5 Spring internals

Java 21, Spring Boot 3.4.x, Maven, Flyway, Spring Data JPA, PostgreSQL, Bean Validation, tests.

Package: `za.co.crosswithswag.api`.

Layers: `web` → `application` → `domain` → `infrastructure` (PayFast, mail, JPA). Controllers do not talk to PayFast or the database directly.

Do **not** add Redis, Mongo, or Spring Security for the shop. A future admin is a separate concern.

---

## 6. Shared catalog

`packages/catalog/catalog.json` (name can be `.yaml`) is the merchandising bible.

- `sku` / `id` aligned with current `lib/v4/products.ts` (`express-dispatch-black`, …)
- `slug`, `family`, `shirtName`, `colourwayName`
- `price_cents` (Marcus confirms; not a constant in Java)
- `sizes[]` with `offered: true|false` (not a quantity)
- no `quantity_on_hand` in v1 (column may exist null for later)

Next: read at build or copy into `lib/v4/products.ts` via a small generate script so the gallery does not drift.  
Spring: load on boot (and/or seed a `product` table from the file). **Pay path always uses Spring’s copy.**

Images stay URLs under `/assets/v4/...` on the frontend origin.

---

## 7. PAXI

Official locator:

```html
<iframe
  width="100%"
  height="800"
  src="https://map.paxi.co.za?size=l,m,s&status=1,3,4&maxordervalue=1000&output=nc"
  frameBorder="0"
  allow="geolocation"
></iframe>
```

Checkout must not create a PayFast payment for `PAXI_COLLECT` without `paxi_code` (and name/address if the widget provides them). If `postMessage` from the iframe is undocumented or flaky, fallback: required store-code field + link to the map.

Spring does not register the parcel with PAXI. You drop the bag at PEP as today.

Private ship: existing address field; no fee on PayFast.

v1 geography: **South Africa only** (Paxi + Instant EFT).

---

## 8. Hosting timeline

| Phase | Frontend | API | DB | PayFast |
|---|---|---|---|---|
| Now | Vercel / `npm run dev` | `localhost:8080` | Docker Postgres | Off, or sandbox + tunnel for ITN |
| First live charge | Vercel prod | VPS + HTTPS `api.crosswithswag.co.za` | Postgres on VPS (or Docker there) | Live keys, ITN = `https://api.../v1/payfast/itn` |
| Later | Vercel `apps/web` root dir | same VPS | same | Onsite / Yoco / Apple Pay |

Tunnel (Cloudflare Tunnel or ngrok) is **only** for sandbox ITN to a laptop. Do not take live money on a tunnel.

VPS when purchased (not now): Caddy or nginx TLS, Docker Compose `api` + `postgres`, backups, firewall (22/80/443), secrets via env files not git. GoDaddy `A` record for `api` → VPS. Do not add this hostname to the Vercel project.

---

## 9. Proposed structure

### 9.1 Now (do this first)

```
crosswithswag/                       ← git root; Vercel still builds here
  app/                               ← Next App Router (unchanged)
  components/
  lib/                               ← gallery + v4 UI; products.ts generated or synced
  public/
  api/                               ← Spring Boot (Maven)
    src/main/java/za/co/crosswithswag/api/
      web/                           ← controllers, PayFast ITN
      application/                   ← checkout, order, mail use-cases
      domain/                        ← Order, Catalog, Money
      infrastructure/
        payfast/
        mail/
        persistence/
    src/main/resources/
      db/migration/                  ← Flyway
      application.yaml
    pom.xml
  packages/catalog/                  ← shared merchandising file
    catalog.json
    README.md
  docker-compose.yml                 ← Postgres 16
  cursor.md/backend-plan.md          ← this file
  AGENT_CONTEXT.md
```

### 9.2 Later (after checkout is real)

```
BEFORE                              AFTER
app/                                apps/web/app/          ← Next; Vercel root = apps/web
components/                         apps/web/components/
lib/                                apps/web/lib/
public/                             apps/web/public/
api/              ──────────────►   apps/api/              ← same Spring tree
packages/catalog/                   packages/catalog/
package.json                        package.json           ← name + optional workspaces
                                    apps/web/package.json
```

Apps do not import each other. Catalog is the only shared package. No Turbo unless JS workspaces become painful.

---

## 10. Frontend changes (Vercel) when API exists

- Checkout: ship method, Paxi iframe, hide address when Paxi.
- Pay button: `POST /v1/checkout` → redirect to PayFast (replace `createPaymentStub`).
- Confirmation: use `SWAG-` ref from query/`return_url`, not stub `sessionStorage` as source of truth (keep stub only behind a flag until API is up).
- `NEXT_PUBLIC_API_URL` for local vs prod.
- Do not proxy PayFast through Next `app/api`.

---

## 11. P1 / P2

**P1 (after first paid sandbox orders feel boring):**

- Script or tiny admin to set `IN_PRODUCTION` / `DISPATCHED` + second buyer email
- Expire stale `CREATED` orders
- Catalog generate script so `products.ts` cannot drift
- Move to `apps/web` + `apps/api`
- VPS + `api.crosswithswag.co.za` + live PayFast

**P2:**

- Customer accounts (`customer_id`)
- Staff admin
- Numeric stock (option 2/3)
- PAXI / courier booking APIs
- PayFast Onsite
- Yoco, Apple Pay
- Spring refund API
- Waitlist in Postgres (only if V4 product asks; not prod today)

---

## 12. Migration (when we implement — not run yet)

```bash
# 0. Preconditions: Java 21, Docker, Maven, Node (already)

# 1. Skeleton
mkdir -p api packages/catalog
# start.spring.io: web, validation, data-jpa, postgresql, flyway,
# lombok optional. NO redis, NO mongodb.
# javaVersion=21 bootVersion=3.4.x packaging=jar type=maven-project
# artifactId=api packageName=za.co.crosswithswag.api

# 2. Compose
# docker-compose.yml: postgres:16, POSTGRES_DB=swag, port 5432

# 3. Catalog
# Extract lib/v4/products.ts → packages/catalog/catalog.json

# 4. Verify
docker compose up -d
cd api && ./mvnw test && ./mvnw spring-boot:run
npm run lint && npm run test && npm run build
```

Vercel: no change until the later `apps/web` move (then set Root Directory).

---

## 13. Verification

Local, before VPS:

1. `docker compose up -d` — Postgres healthy.
2. `./mvnw test` — catalog pricing, ITN signature fixtures, status transitions.
3. Checkout against sandbox with tunnel — card and Instant EFT if sandbox allows.
4. ITN marks `PAID`; buyer mail + `orders@` CSV received in Gmail.
5. Paxi order rejected without a point code; private ship rejected without address.
6. Tampered `price_cents` from the browser does not change PayFast amount.
7. `npm run lint` / `npm run test` / `npm run build` still green; Vercel still deploys the gallery from repo root.

---

## 14. Open (do not block coding)

- Exact `price_cents` per SKU (Marcus)
- Exact Paxi `shipping_cents` and economy vs speed
- Resend vs Postmark vs SES (default **Resend**)
- PayFast merchant legal entity / bank account
- Whether `GET /v1/catalog` is used or Next only reads the JSON at build
- Confirmation email copy (keep it as quiet as the site)

---

## 15. Explicit non-goals for this cut

- Changing production DNS for the **website**
- Attaching a second domain to Vercel
- Analytics
- Replacing V3.3.3 waitlist on the freeze branch
- Manufacturing portal
- Turbo/Nx
- Hard-coding R350 in Spring
