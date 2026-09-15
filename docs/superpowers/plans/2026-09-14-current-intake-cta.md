# Current Intake CTA (Scoped Poster) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the `/current` intake “order this edition” control the obvious Jotform path by scaling only that CTA and clarifying helper + new-tab cue, without changing Home buttons or MENU order.

**Architecture:** Copy lives in `lib/copy.ts`. Markup stays in `CurrentChapter` intake block. Size is CSS-scoped under `#current .current-intake` so global `.btn` / `.btn--clay` (Home) are untouched. Footer version bump to `V3.3.1` and a short `AGENT_CONTEXT.md` note mark the cut.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind + `app/globals.css` brand CSS, Instrument Sans, four locked colours.

**Spec:** `docs/superpowers/specs/2026-09-14-current-intake-cta-design.md`  
**Branch:** `version_3.3.1`

**Note on tests:** This repo has no unit/e2e runner. Verification is `npm run lint`, `npm run build`, grep/regression checks, and visual check of `/current` + `/`.

---

## File map

| File | Responsibility |
| --- | --- |
| `lib/copy.ts` | `current.intake`, new `current.orderCue`, footer meta `V3.3.1` |
| `components/v3/chapters/CurrentChapter.tsx` | Render cue under the Clay order link |
| `app/globals.css` | Intake-only button scale + cue spacing |
| `AGENT_CONTEXT.md` | Footer version + V3.3.1 phase note |

Do **not** edit: `lib/sections.config.ts` (MENU order), `components/v3/chapters/HomeChapter.tsx`, Jotform URL, global `.btn` base rules.

---

### Task 1: Copy — intake, orderCue, footer version

**Files:**
- Modify: `lib/copy.ts` (`current` object ~lines 101–110; `footer.meta` ~line 285)

- [ ] **Step 1: Update `current` copy**

In `lib/copy.ts`, change the `current` object so it includes the shortened intake and new cue:

```ts
export const current = {
  editionLabel: "[ edition 001 ]",
  title: "kloofstreetnights",
  lines: [
    "worn after the lights go down and before anyone's watching.",
    "heavy fabric. long shadows. the hours between leaving and arriving.",
  ],
  intake: "no store. orders go through the form.",
  orderCue: "opens in a new tab",
  orderUrl: "https://form.jotform.com/crosswithswag/order-kloofstreetnights",
  orderSubject: "kloofstreetnights",
  // ...leave clothesRightLabel, colourwayNote, spec, etc. unchanged
```

Do not rename or change `orderUrl`. Do not add “jotform” to any string.

- [ ] **Step 2: Bump footer version**

In the same file, in `footer.meta`, change the version string:

```ts
  meta: [
    "WEARABLE EDITIONS — CAPE TOWN",
    "GRISEUS REGIUS (PTY) LTD 2026",
    "V3.3.1",
  ],
```

- [ ] **Step 3: Verify strings in source**

Run (PowerShell):

```powershell
Select-String -Path lib/copy.ts -Pattern 'no store\. orders go through the form\.|orderCue|opens in a new tab|V3\.3\.1'
```

Expected: matches for shortened intake, `orderCue`, cue text, and `V3.3.1`. No match for `no store front at the moment` or footer `V3.3.0`.

- [ ] **Step 4: Commit**

```powershell
git add lib/copy.ts
git commit -m "Clarify current intake copy and bump footer to V3.3.1."
```

---

### Task 2: Markup — render orderCue under the CTA

**Files:**
- Modify: `components/v3/chapters/CurrentChapter.tsx` (intake block ~lines 31–44)

- [ ] **Step 1: Add the cue element**

Replace the intake block so the cue sits **after** `.cta-row`, as a `<p>` with `.lbl` + `.current-intake__cue` (not inside the `<a>`):

```tsx
          <div className="current-intake">
            <span className="lbl">[ intake ]</span>
            <p className="body-copy voice current-intake__copy">{current.intake}</p>
            <div className="cta-row">
              <a
                className="btn btn--clay"
                href={current.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                order this edition
              </a>
            </div>
            <p className="lbl current-intake__cue">{current.orderCue}</p>
          </div>
```

Keep `target="_blank"` and `rel="noopener noreferrer"`. Do not wrap the cue in a link. Do not change CTA label text.

- [ ] **Step 2: Confirm TypeScript sees `orderCue`**

Run:

```powershell
npx tsc --noEmit
```

Expected: exit 0 (or no errors related to `current.orderCue`). If `tsc` is not configured standalone, proceed to Task 4’s `npm run build` as the typecheck.

- [ ] **Step 3: Commit**

```powershell
git add components/v3/chapters/CurrentChapter.tsx
git commit -m "Show new-tab cue under the current intake order CTA."
```

---

### Task 3: CSS — scale only the intake Clay button

**Files:**
- Modify: `app/globals.css` (near existing `#current .current-intake` rules ~lines 1396–1410)

- [ ] **Step 1: Add intake-scoped button + cue rules**

Immediately after the existing block:

```css
#current .current-intake .cta-row {
  margin-top: 32px;
}
```

add:

```css
#current .current-intake .btn {
  font-size: 14px;
  letter-spacing: 0.14em;
  padding: 18px 32px;
  min-height: 44px;
}

#current .current-intake__cue {
  margin-top: 12px;
}
```

Do **not** edit the global `.btn` or `.btn--clay` rules at ~1100–1128. Do not change Home `.cta-row` rules.

- [ ] **Step 2: Confirm selectors are scoped**

Run:

```powershell
Select-String -Path app/globals.css -Pattern '#current \.current-intake \.btn|#current \.current-intake__cue'
```

Expected: both selectors present. Then confirm global `.btn` padding is still `13px 22px`:

```powershell
Select-String -Path app/globals.css -Pattern '^\.btn \{' -Context 0,12
```

Expected: `padding: 13px 22px;` and `font-size: 11px;` still on the global rule.

- [ ] **Step 3: Commit**

```powershell
git add app/globals.css
git commit -m "Scale the current intake order CTA without changing global buttons."
```

---

### Task 4: AGENT_CONTEXT + lint/build verification

**Files:**
- Modify: `AGENT_CONTEXT.md` (footer version mention ~line 90; phase table ~line 244)

- [ ] **Step 1: Update footer version mention**

Find:

```markdown
- Shared Figma footer on every route (filled wordmark mask + `CROSS WITH SWAG` tagline). Meta bar includes `V3.3.0`.
```

Replace with:

```markdown
- Shared Figma footer on every route (filled wordmark mask + `CROSS WITH SWAG` tagline). Meta bar includes `V3.3.1`.
```

- [ ] **Step 2: Add V3.3.1 phase row**

In the Phase Status table, after the V3.3.0 row, add:

```markdown
| **V3.3.1** | 🛠 THIS BRANCH | Current intake scoped poster CTA: larger Clay order control, shortened helper, new-tab cue. Home `.btn`s and MENU `order` unchanged. Footer `V3.3.1`. |
```

Update the V3.3.0 row status from `🛠 THIS BRANCH` to `✅ SHIPPED` (or `✅ PRODUCTION` if that matches neighbouring rows) so only V3.3.1 is marked as the active branch cut.

- [ ] **Step 3: Lint**

```powershell
npm run lint
```

Expected: exit 0, no new errors in the files touched above.

- [ ] **Step 4: Build**

```powershell
npm run build
```

Expected: successful Next.js production build.

- [ ] **Step 5: Visual regression checklist (manual)**

With `npm run dev`, check:

1. `/current` — intake helper reads `no store. orders go through the form.`
2. `/current` — Clay outline CTA is visibly larger than before; tap height ≥ 44px
3. `/current` — cue `OPENS IN A NEW TAB` (via `.lbl` uppercase) sits under the button, muted Sand
4. `/current` — CTA still opens Jotform in a new tab
5. `/` — Home Clay buttons still look like the small global `.btn` (unchanged)
6. Any route footer meta shows `V3.3.1`

- [ ] **Step 6: Commit context**

```powershell
git add AGENT_CONTEXT.md
git commit -m "Document V3.3.1 intake CTA cut in agent context."
```

---

### Task 5: Final branch check

- [ ] **Step 1: Confirm out-of-scope files are clean**

```powershell
git diff main...HEAD --stat
```

Expected changed paths only among:

- `lib/copy.ts`
- `components/v3/chapters/CurrentChapter.tsx`
- `app/globals.css`
- `AGENT_CONTEXT.md`
- `docs/superpowers/specs/2026-09-14-current-intake-cta-design.md` (already committed)
- `docs/superpowers/plans/2026-09-14-current-intake-cta.md` (this plan)

Must **not** include: `HomeChapter.tsx`, `lib/sections.config.ts`.

- [ ] **Step 2: Confirm no Jotform branding in UI copy**

```powershell
Select-String -Path lib/copy.ts,components/v3/chapters/CurrentChapter.tsx -Pattern 'jotform' -CaseSensitive:$false
```

Expected: only `orderUrl` host string in `lib/copy.ts`, not in visible CTA/helper/cue labels.

---

## Spec coverage (self-review)

| Spec requirement | Task |
| --- | --- |
| Shorten `intake` | Task 1 |
| Add `orderCue` | Task 1 + 2 |
| Keep CTA label + URL + new tab | Task 2 |
| Scoped font/padding/min-height | Task 3 |
| Cue `.lbl` + `margin-top: 12px` | Task 2 + 3 |
| Global `.btn` unchanged | Task 3 Step 2 + Task 5 |
| Footer `V3.3.1` | Task 1 |
| `AGENT_CONTEXT.md` | Task 4 |
| Lint + build | Task 4 |
| Out of scope: Home, MENU | Task 5 |
