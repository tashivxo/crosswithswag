# Current intake CTA — scoped poster

Date: 2026-09-14  
Branch: `version_3.3.1`  
Surface: `/current` intake block (`#current .current-intake`)  
Mode: Experience (gallery), with one Operate moment (order)

## Problem

The kloofstreetnights order control is brand-correct and easy to miss. It uses the shared `.btn.btn--clay` recipe (`11px` tracked type, `13px 22px` padding). Next to the chapter display title and body copy it reads as a caption, not the path to order. The helper (`no store front at the moment. orders go through the form.`) is long, and the new-tab Jotform hop is not announced.

Users should see they can order without turning the fold into a store.

## Heuristic read (this control only)

Current: **6/10**. Target after this change: **9/10**.

| Issue | Heuristic | Severity | Fix |
| --- | --- | --- | --- |
| Outline control is smaller than surrounding body type | Don't make me think; one primary action | 3 | Scale this instance only |
| Touch area likely under 44px | Error prevention / a11y | 3 | Min-height 44px, more padding |
| "the form" with no destination cue | Match the real world; system status | 2 | Cue: `opens in a new tab` |
| "at the moment" is fluff | Get rid of half the words | 1 | Shorten helper |
| Naming Jotform or adding a filled sales chip | Aesthetic and minimalist; brand | — | Do not |

Do not change Home `.btn`s or MENU `order`. Those are separate scan contexts.

## Approach

**Scoped poster CTA.** Keep the Clay square outline. Make this one instance larger. Clarify two lines of copy. No pills, fills at rest, extra colour, or full-width checkout bar.

## Visual

- Location unchanged: right column of `#current-head` `.current-intro`, after `[ intake ]` and the helper.
- Control: existing `<a class="btn btn--clay">`. Same hover (Clay fill, Sand type) and press (`scale(0.97)` at 160ms).
- This instance only (`#current .current-intake .btn`):
  - font-size `14px`
  - letter-spacing `0.14em`
  - padding `18px 32px`
  - min-height `44px`
- Cue under the control: existing `.lbl` (muted Sand `--lbl`, `11px` / `0.16em` uppercase). Same voice as `[ intake ]`. Not inside the button. Spacing: `margin-top: 12px` on `.current-intake__cue`.
- Global `.btn` / `.btn--clay` stay as they are so Home CTAs do not change.

Reduced motion: no new motion. Existing press/hover colour change remains.

## Copy

Source: `lib/copy.ts` `current`.

| Key | Before | After |
| --- | --- | --- |
| `intake` | `no store front at the moment. orders go through the form.` | `no store. orders go through the form.` |
| CTA label | `order this edition` | `order this edition` |
| `orderCue` (new) | — | `opens in a new tab` |

Do not name Jotform. Do not add "click here", please, or store language. `orderUrl` stays `https://form.jotform.com/crosswithswag/order-kloofstreetnights`.

## Behaviour

- Same `href`, `target="_blank"`, `rel="noopener noreferrer"`.
- Cue is visible text, not hover-only.
- Cue is not a second link.

## Files

| File | Change |
| --- | --- |
| `lib/copy.ts` | `intake`; add `orderCue`; footer meta `V3.3.0` → `V3.3.1` |
| `components/v3/chapters/CurrentChapter.tsx` | Render `orderCue` under the Clay link |
| `app/globals.css` | Intake-scoped size + cue spacing |
| `AGENT_CONTEXT.md` | Note V3.3.1 intake CTA; footer version |

Markup sketch (class names already in the system):

```tsx
<div className="current-intake">
  <span className="lbl">[ intake ]</span>
  <p className="body-copy voice current-intake__copy">{current.intake}</p>
  <div className="cta-row">
    <a className="btn btn--clay" href={current.orderUrl} target="_blank" rel="noopener noreferrer">
      order this edition
    </a>
  </div>
  <p className="lbl current-intake__cue">{current.orderCue}</p>
</div>
```

## Out of scope

- Home chapter CTAs
- MENU `order` item (`lib/sections.config.ts`)
- Jotform fields, styling, or embed
- New routes, analytics, waitlist backend
- Redesign of `#current-head` layout, campaign grid, or colourways

## Success

- On desktop and mobile `/current`, the order control is the obvious action in the intake block.
- Tap target is at least 44px tall.
- Helper and cue scan in one pass: no store → form → new tab.
- Home `/` Clay buttons look unchanged.
- `npm run lint` and `npm run build` pass.

## Non-goals

This is not an ecommerce checkout. The rest of Current stays a typographic poster. The button gets louder; the page does not.
