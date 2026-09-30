# swag. — V4 Spec

**Status:** Draft for Marcus review. Not production.
**Author:** Tashiv notes, 30 Sep 2026.
**Production today:** V3.1 gallery on `main`. Orders still go through Jotform. Do not ship cart, checkout, or payment keys from this spec until the Marcus gates below are signed.

V4 is the first version where the site takes the order. The site stays a type-led gallery. Commerce is added as edition logic, not as a generic store.

---

## 1. Why V4 exists

V3.1 is a digital gallery. kloofstreetnights is live on `/current`. `order` opens Jotform. Copy still says there is no store.

That model cannot carry the next edition. V4 has to answer:

1. How a visitor browses garments, adds them to a cart, and pays.
2. What happens to a closed edition after it leaves `/current`.
3. How every future edition is structured so the site does not invent a new layout per drop.
4. How campaign shoot photography lives on the site, not only winter-drop artboards.

---

## 2. Locked from Tashiv (engineering may plan against these)

| Decision | V4 stance |
|---|---|
| Site type | Gallery with on-site commerce. Jotform goes away. |
| kloofstreetnights | Closed. It is no longer the current edition. It becomes an archive record. |
| Standard edition | From V4, every open edition uses one shared edition template. |
| Shop behaviour | Browse items → add to cart → order → pay on-site. |
| Payments | Provision **Yoco** and **PayFast**. Keys live in Vercel env, never in the repo. |
| Photography | Shoot pictures are required media, not decoration. |

Design rules from V3 still apply: four brand colours, Instrument Sans, text links only, no pills, cards, rounded shop chrome, gradients, or stock ecommerce patterns. The cart must still feel like the gallery.

---

## 3. Blocked on Marcus

These cannot be built as production IA until Marcus researches and signs them.

| Question | Why it blocks V4 |
|---|---|
| How previous drops exist | Archive is currently a list. V4 needs a real record per closed edition: story, shoot, garments, closed state. |
| Previous-drop menu | Tashiv wants visitors to be able to enter past drops. Marcus decides whether that is the archive index, MENU entries, or both. |
| Next edition structure | What replaces kloofstreetnights on `/current`: name, objects, colourways, garments, sizes, price, close rule. |
| Closed-edition commerce | View-only record, leftover stock, or never for sale again. Brand rule today is no reissue. |
| Canonical shoot frames | Which images are campaign, which are garment objects, which are archive. |
| Shipping and fulfilment | Current copy says Paxi. Confirm SA-only, methods, and who packs. |

Until those are signed, `/current` stays a single open edition, `/archive` stays an index, and no per-drop archive routes ship.

---

## 4. What V3.1 actually is today

Use this as the from-state. Do not assume a shop already exists.

| Surface | Today |
|---|---|
| Routes | `/` `/current` `/archive` `/manifesto` `/playlists` `/contact` |
| Current edition | kloofstreetnights (`001`), state `live` |
| Order | MENU `order` and Current CTA → Jotform `order-kloofstreetnights` |
| Archive | Six named editions. Only `001` links through (to `/current`). `002–006` are unreleased |
| Photography | `public/assets/winter-drop/` artboards on Current clothes grid |
| Copy | “no store. orders go through the form.” / “living archive, not a storefront.” |

Edition names already in `lib/editions.ts`: kloofstreetnights, crosswithswag — first edition, atm, octane, mountain eater red, courtside club culture. Names for `002–006` are locked in copy; dates and structures are not.

---

## 5. Information architecture (proposed)

Production routes stay. Commerce hangs off the open edition. Closed editions leave `/current`.

| Route | V4 job |
|---|---|
| `/` | Gallery home. Current edition + archive CTAs. No product grid as the first read. |
| `/current` | The **open** edition only. Standard edition template. This is where browse and add-to-cart live. |
| `/archive` | Index of closed editions. This is the previous-drop menu unless Marcus puts drops in MENU. |
| `/archive/[slug]` | Permanent record of one closed edition. Same template as `/current`, commerce off. **Do not build until Marcus signs archive IA.** |
| `/cart` | Quiet list of selected objects. Text actions only. |
| `/checkout` | Details, fulfilment, pay with Yoco or PayFast. |
| `/order/confirmed` | Receipt. No account required for V4. |
| `/manifesto` `/playlists` `/contact` | Unchanged job. Waitlist stays first-access, not a shop substitute. |

MENU in V4:

- Keep chapter list: home, current, archive, manifesto, playlists, contact.
- Replace external `order` with `cart` (or hide `order` once cart exists).
- Do **not** list every past drop in MENU unless Marcus asks. Archive is the index.

kloofstreetnights move:

- State becomes `closed`.
- Archive row links to `/archive/kloofstreetnights` (after Marcus signs), not `/current`.
- `/current` is reserved for the next open edition. If no next edition is ready, `/current` is an empty-open state (“no edition is open”) rather than a closed drop pretending to be current.

---

## 6. Standard edition template (from V4)

Every open edition, and later every archive record, uses the same chapter. kloofstreetnights was a one-off campaign layout. V4 stops that.

Required blocks, in order:

1. **Edition head** — number, name, one-line thesis, open/closed state.
2. **Shoot** — campaign photography from the shoot, full-bleed, not a product grid.
3. **Objects** — garment / print / framed object. Browseable. Colourway and size live here.
4. **Spec** — print, cloth, silhouette, despatch. Same quiet definition list as Current today.
5. **Director note** — signed. Optional on archive if Marcus wants it frozen.
6. **Commerce** — on open editions only: add to cart. On closed editions: no cart, no restock language.

Rules that stay brand-true:

- An edition still closes. No reissue language in the shop.
- Three objects remain the edition contract unless Marcus revises rule ii: garment, campaign image, framed print.
- One open edition at a time on `/current`.

Marcus still has to define the **next** edition’s objects. The template is the shell, not the collection.

---

## 7. Commerce logic

### 7.1 Visitor flow

1. Enter the open edition on `/current`.
2. Read the shoot, then browse objects.
3. Choose colourway and size.
4. Add to cart.
5. Open `/cart`. Change quantity or remove.
6. Checkout: name, email, phone, delivery details.
7. Pay with Yoco or PayFast.
8. Land on `/order/confirmed`. Order email is required.

No customer accounts in V4. Guest checkout only.

### 7.2 What a cart line is

A line is one object, not “the edition”:

- edition slug
- object (e.g. hoodie / sweater / t-shirt / print)
- colourway
- size (garments only)
- quantity
- unit price

Cart cannot mix a closed edition with an open one. If kloofstreetnights is closed and leftover stock is not approved, it is not addable.

### 7.3 What V4 does not include

- Saved carts across devices
- Discount codes, sales, free-shipping bars
- Subscriptions
- Restock notifications for closed editions
- International shipping unless Marcus expands beyond Paxi
- Admin UI (first V4 can be a simple order log + payment webhooks)

### 7.4 Copy that must change

V3 lines that cannot survive a working cart:

- “no store. orders go through the form.”
- “the site is a living archive, not a storefront.”
- MENU label `order` as a Jotform action

Replacement tone stays non-commercial. Prefer “add this object” / “take this edition” over “shop now” / “add to bag”. Exact lines need Marcus.

---

## 8. Payments

Tashiv recommendation: **use both Yoco and PayFast**.

| Provider | Why it is in V4 | Gate |
|---|---|---|
| Yoco | SA card checkout that fits a small brand. Hosted checkout preferred so card data never touches this app. | Merchant account + API keys + webhook secret |
| PayFast | Instant EFT and extra local methods Yoco may not cover. | Merchant account + passphrase + webhook |

Decide at key provisioning, not in UI chrome:

1. Create test merchants on both.
2. Put keys in Vercel (production + preview). Never commit them.
3. Pick a **primary** processor for the checkout default. Keep the other as fallback or as the EFT path.
4. Webhooks mark orders paid. Do not despatch on redirect alone.
5. Confirm with Marcus before live keys: who owns the merchant accounts, payout bank, and refunds.

Until keys exist, checkout can be built against sandbox only. No live charge on `main`.

---

## 9. Photography

V4 implements shoot pictures as the edition’s primary image, on both the open edition and (once signed) archive records.

| Layer | Job |
|---|---|
| Shoot / campaign frames | First read of the edition. Atmosphere, not SKU. |
| Object frames | One clear still per garment / colourway used in browse. |
| Archive frames | The same shoot, frozen. Do not swap in lifestyle filler later. |

Today the site serves winter-drop artboards on Current. That is not the V4 shoot contract. Marcus delivers or selects the canonical set. Engineering does not invent crops or placeholder fashion images.

Do not ship browse with empty image slots. If a garment has no shoot frame, it is not sellable yet.

---

## 10. Data that must exist before build

Minimum records, whether they live in `lib/` or a later store:

**Edition:** number, slug, name, thesis, state (`open` / `closed` / `unreleased`), open/close dates if known, shoot gallery, spec, director note.

**Object:** edition slug, name, kind (garment / print / frame), colourways, sizes, price, image, stock, sellable flag.

**Order:** id, email, phone, address, lines, fulfilment method, payment provider, payment id, status (`started` / `paid` / `failed` / `despatched`).

Unreleased editions `002–006` stay named in the archive index. They are not routes and not sellable until Marcus structures them.

---

## 11. Build sequence (after Marcus signs)

1. Close kloofstreetnights in data and copy. Clear Jotform from MENU and Current.
2. Lock the standard edition template on `/current` against the next edition (or an empty-open state).
3. Place shoot photography.
4. Browse + cart against sandbox stock.
5. Checkout + Yoco/PayFast sandbox + webhooks + order email.
6. Archive index as previous-drop menu. Per-drop archive routes only after Marcus signs IA.
7. Live keys, then first paid order as a closed rehearsal before public open.

---

## 12. Out of scope for V4

- Analytics (provider still unchosen)
- Community as a seventh chapter
- Cloudflare move
- Second custom domain
- Promoting frozen V2
- Reissue of kloofstreetnights

---

## 13. Sign-off

| Owner | Signs |
|---|---|
| Marcus | Archive existence, previous-drop menu, next edition structure, closed-edition leftover stock, canonical shoot set, prices, sizes, fulfilment, checkout copy |
| Tashiv | Yoco + PayFast as processors, on-site cart, standard edition template, kloofstreetnights closed |
| Engineering | No production commerce until the Marcus column is signed; keys only in Vercel |

Related production context: `AGENT_CONTEXT.md`. This spec does not override V3.1 until a V4 branch is opened on purpose.
