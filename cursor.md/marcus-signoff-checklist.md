# Marcus Sign-Off Checklist — Filled
## swag. V1 pre-build decisions

Everything below is answered except Section 5 (kloofstreetnights), which is left as a guideline for Marcus to answer directly — it's creative content, not a system decision.

---

## 1. Manifesto and Tagline

**Current direction:** Wearable Editions, Draft 1.

- [x] Lock "Wearable Editions" as the hero tagline.
- [x] Lock the Draft 1 manifesto text as final.
- [ ] Revise manifesto before Stitch/code work continues.

**Core idea confirmed:** singular wearable edition objects, not products, merch, collections, or traditional drops. "Wearable Editions" has been the settled descriptor for a while — no reason to reopen it now.

---

## 2. Typeface

**Current direction:** Instrument Sans via Google Fonts.

- [x] Lock Instrument Sans.
- [ ] Replace with another typeface.
- [ ] Keep Instrument Sans for prototype only, decide final later.

**Weight mapping in current docs:**

| Identity weight | Web weight | Tailwind |
|---|---|---|
| 55 Roman | 400 | `font-normal` |
| 65 Medium | 500 | `font-medium` |
| 75 Bold | 700 | `font-bold` |

Mapping is clean — Instrument Sans carries all three weights natively. This closes the earlier concern about the identity deck's weight spec not matching.

---

## 3. SWAG Statement Distribution

- [x] Approve provisional split.
- [ ] Reassign statements.

| Section | Provisional focus | Statements |
|---|---|---|
| 3 | Authentic Expression | A home for individuals / Does not seek permission to exist / Speaks to be true, not approved / Says come as you are |
| 4 | Internal Authority | Represents your internal authority / Upholds truth without hesitation / Refuses to negotiate what is essential to you |
| 5 | Presence | Emanates presence / Does not beg to be understood / Commands respect without raising a voice |
| 7 | Density / Weight | Is daily practice. Is consistency. / Has density. Does not fragment. / Alchemises pain. Uses ruptures to reconstruct. / Has weight. Embodies a new internal movement. |

The thematic arc (Expression → Authority → Presence → Density/Weight) tracks the scroll colour sequence (Black → Sand → Stone → Clay). No reason to break that alignment.

---

## 4. Bleed Display Words

- [x] Approve provisional words.
- [ ] Replace with deck-specific words.

| Section | Bleed word |
|---|---|
| 3 | EXPRESSION |
| 4 | AUTHORITY |
| 5 | PRESENCE |
| 7 | WEIGHT |

Single-word set is the right call for bleed treatment — matches each section's focus from #3 directly, and stays legible at scale where the deck's fuller phrases (e.g. "AUTHENTIC EXPRESSION," "EMANATES PRESENCE") would get crowded.

---

## 5. Section 6: kloofstreetnights - Wearable Edition

**Locked positioning:** release showcase reframed as wearable edition.

- [x] One-line supporting copy. — Confirmed, with closing line added to resolve the structure flag:
  > "kloof street nights started with a dinner. a first date night with **** — good food, good wine, better company. that's it. that's the whole story. this account, these designs — they exist for me and my people. no greater explanation is owed beyond that."
  >
  > **-the.director**
  >
  > **kloofstreetnights.**

  *Resolved:* added the edition name as a closing statement after the sign-off, matching the established signature structure (narrative body → `-the.director` → edition name as a statement). Quote and sign-off left untouched.

- [x] Imagery direction. — Confirmed: **campaign photography, void black colourway.** Finished product shots exist (hoodie, crewneck, tee — front and back) on white background with wordmark. This is real photography, not placeholder — resolves the earlier open question outright.

- [x] CTA wording to Instagram. — Confirmed: **"this lives at @crosswithswag."** Echoes the quote's own language ("this account, these designs — they exist for me and my people") rather than standing apart from it as a separate marketing line.

---

## 6. Motion Direction

- [ ] Smooth crossfade between backgrounds.
- [ ] Push / gallery-wall transition between sections.
- [x] Continuous scroll-linked interpolation.

- [ ] Static background layer.
- [x] Slow parallax layer.
- [ ] More kinetic scroll-linked motion.

Scroll-linked interpolation matches the "living archive" framing and continuous-scroll feel already built into the site structure — a crossfade or push would introduce discrete section boundaries that work against that. Slow parallax on the ghost watermark applies the same restraint-as-strategy principle used elsewhere in the brand (no hype, no over-animation) — kinetic motion would compete with the garment/copy for attention; fully static would waste the depth the watermark is meant to create.

---

## 7. Technical / Launch Decisions

- [ ] Analytics provider: Vercel Analytics, Plausible, GA4, or other.
- [ ] Domain name and DNS access.
- [ ] Public launch date.

Left open — genuinely Marcus's call, not something to recommend a default on.

---

## Approval Gate

- [x] Manifesto + tagline.
- [x] Typeface direction.
- [ ] Stitch screen compositions. *(pending visual review, not a checklist answer)*
- [x] SWAG copy distribution and bleed words.
- [x] Section 6 copy and imagery direction. *(fully resolved — copy, imagery, and CTA all confirmed)*
- [x] Motion pacing direction.
