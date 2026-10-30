---
name: Pin waitlist dock
overview: Pin the coming-soon waitlist while scroll docks MENU + the poster swag. mark, and lay Marcus's React Bits DarkVeil behind that poster as a full-viewport WebGL background.
todos:
  - id: install-dark-veil
    content: "Install @react-bits/DarkVeil-JS-CSS via shadcn CLI; wrap with Marcus's exact props and mobile quality 0.4"
    status: pending
  - id: layer-veil
    content: Place DarkVeil as an absolute inset-0 layer behind ComingSoonChapter content (z-index 0 / content z-index 1)
    status: pending
  - id: pin-home
    content: "Pin #home in coming-soon WordmarkDriftDock; share trigger with SiteHeader chrome; do not double-pin"
    status: pending
  - id: fly-wordmark
    content: Replace coming-soon opacity fade with flight from .cs-wordmark rect; hide poster mark as layout placeholder
    status: pending
  - id: docs-verify
    content: Update AGENT_CONTEXT.md; lint/test/build; browser-check pin, veil, reverse, reduced motion, flag-off
    status: pending
---

# Pin waitlist until nav dock completes

## Target choreography

Coming-soon only (`NEXT_PUBLIC_COMING_SOON=1`). Flag off is unchanged.

- First paint: DarkVeil runs behind the waitlist form, with no MENU.
- Initial scroll pins the poster/form while MENU fades in and the poster `swag.` mark flies into the top-left nav slot.
- Once the dock is complete, the pin releases and the ticker/rest of home scroll normally.
- Reverse scroll undoes the dock.
- Reduced motion shows the docked nav immediately without pin or flight.

## Marcus DarkVeil handoff

Source: Marcus's October 28, 2026 email, “DarkVeil background for the Coming Soon site,” and attachment `DarkVeil_Handoff_for_Tash.md`.

- Component: React Bits **DarkVeil**, JS-CSS variant, no extra npm dependencies.
- Preview: https://reactbits.dev/backgrounds/dark-veil
- Install: `npx shadcn@latest add @react-bits/DarkVeil-JS-CSS`
- Manual source: https://reactbits.dev/r/DarkVeil-JS-CSS.json
- `@react-bits` is already configured in `components.json`.
- Full-page use: parent `position: relative` with a set height; veil layer `position: absolute; inset: 0`; content `z-index: 1`.
- Keep the project Void background (`#0A0A0A`); Marcus's `#393943` is a page-specific effect override.
- Use `quality={0.55}` on desktop and `quality={0.4}` on coarse-pointer devices.
- The component is WebGL2-only, pauses off-screen/tab-hidden, and respects reduced motion. Unsupported browsers fall back to the Void background.

Lock these props:

```jsx
<DarkVeil
  color="#393943"
  speed={0.65}
  scale={1.05}
  rotation={354}
  flow={0.35}
  warp={0.4}
  variation={4}
  sheen={0.35}
  glow={0.2}
  brightness={1.2}
  grain={0.07}
  quality={0.55}
  opacity={0.7}
  mouseStrength={1.3}
/>
```

## Implementation

### DarkVeil layer

Install the registry component from the repository root. Keep generated files under `components/v3/` or convert them to TSX if needed for linting.

Add a thin client wrapper such as `components/v3/ComingSoonVeil.tsx`:

- Render DarkVeil with the locked props.
- Select quality `0.4` for coarse pointers and `0.55` otherwise.
- Mark it `aria-hidden`.
- Set `pointer-events: none` so the form remains fully usable.

Render the veil as the first child of `ComingSoonChapter`. Keep it outside the CSS grid:

```css
.cs-veil { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.cs > *:not(.cs-veil) { position: relative; z-index: 1; }
```

Do not put the veil on the ticker or later home sections.

### Pin and dock

Update `components/v3/WordmarkDriftDock.tsx`:

- In coming-soon mode, use `#home` as the trigger so the header chrome and wordmark share the same sequence.
- Pin `#home` with `pin: true`, `pinSpacing: true`, and `anticipatePin: 1`.
- Do not add a second pin to the MENU/header-line ScrollTrigger in `components/v3/SiteHeader.tsx`.
- Replace the current coming-soon opacity fade with a scrubbed flight.
- Measure the starting transform from `.cs-wordmark` to the header mark slot.
- End at the existing dock scale and position.
- Hide the poster mark visually while preserving its layout box, so only one mark is visible.
- Keep the form clickable throughout the pin.

Watch the interaction between GSAP pinning, the `.section-shell`/`.cs` `overflow: hidden`, Lenis, and DarkVeil's ResizeObserver. Refresh ScrollTrigger after canvas/layout initialization if necessary.

The fixed header (`z-index: 120`) must remain above the veil and form. If its Void background obscures the intended first-paint full-bleed veil, make only the coming-soon header transparent until the dock completes; do not change inner-route headers.

### Documentation

Update the coming-soon section in `AGENT_CONTEXT.md` to describe the pinned form, wordmark flight, DarkVeil background, `#393943` override, and mobile quality `0.4`.

## Verification

Run:

```text
npm test
npm run lint
npm run build
```

Browser-check desktop and mobile with the flag on:

- First paint has DarkVeil behind the form, one large `swag.` mark, and no MENU.
- Cursor interaction affects the veil without blocking email, checkbox, or submit.
- During initial scroll the form and veil remain stationary while MENU fades and the mark flies top-left.
- After dock completion, further scroll moves the poster and reveals the ticker.
- Reverse scroll undoes the dock.
- DarkVeil pauses off-screen.
- Reduced motion is static, immediately docked, and has no pin/flight.
- Coarse pointer uses quality `0.4`.
- Flag off keeps the original home intro unchanged and renders no DarkVeil.
