---
name: swag.
description: Wearable Editions — a Void Black typographic poster gallery
colors:
  void: "#0A0A0A"
  stone: "#575D61"
  clay: "#8C5E4A"
  sand: "#D6D1C4"
  line: "rgba(214, 209, 196, 0.14)"
  line-strong: "rgba(214, 209, 196, 0.28)"
  raise: "rgba(214, 209, 196, 0.035)"
  body-muted: "rgba(214, 209, 196, 0.74)"
typography:
  display:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(44px, 11vw, 168px)"
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(30px, 5.6vw, 76px)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "clamp(15px, 1.45vw, 19px)"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0.006em"
  label:
    fontFamily: "Instrument Sans, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  none: "0px"
spacing:
  gut: "clamp(18px, 4vw, 56px)"
  pad: "clamp(64px, 9vw, 132px)"
  pad-sm: "clamp(44px, 6vw, 84px)"
components:
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.sand}"
    rounded: "{rounded.none}"
    padding: "13px 22px"
  button-outline-hover:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.void}"
    rounded: "{rounded.none}"
  button-clay:
    backgroundColor: "transparent"
    textColor: "{colors.sand}"
    rounded: "{rounded.none}"
    padding: "13px 22px"
  field-join:
    backgroundColor: "transparent"
    textColor: "{colors.clay}"
    rounded: "{rounded.none}"
---

# Design System: swag.

## Overview

**Creative North Star: "The Typographic Poster Wall"**

The site is a dark gallery of oversized type, not a layout of cards. Each fold is one poster: Void Black ground, Sand ink, Clay as the rare accent. Display type is allowed to bleed. The custom wordmark is the only non-typographic mark.

Density comes from scale contrast — 11px tracked labels against clamp display — never from chrome. Motion is scroll-linked (wordmark dock, Lenis) plus honest UI state (waitlist swap/shake, menu panel). Copy is not gated behind reveals.

**Key Characteristics:**
- Four named colours only
- One type family, three weights
- Square corners, hairline rules, no pills
- Text CTAs, not sales buttons
- Wordmark as SVG mask, never typed

## Colors

Four locked pigments. Roles do not drift.

### Primary
- **Void Black** (`{colors.void}`): the gallery wall. Default page ground.

### Secondary
- **Sand** (`{colors.sand}`): primary ink on Void. Wordmark fill on dark.

### Tertiary
- **Clay** (`{colors.clay}`): scarce accent — joins, live labels, hover on open archive names, error.

### Neutral
- **Stone Grey** (`{colors.stone}`): muted labels, closed-edition names, placeholder-adjacent muted copy.
- **Line** (`{colors.line}`): 1px rules and grid seams.
- **Raise** (`{colors.raise}`): hover wash on contact tiles only, never a card fill at rest.

**The Four-Pigment Rule.** No fifth colour, no gradient fills, no grey-on-colour that is not Stone or a Sand alpha.

## Typography

**Display Font:** Instrument Sans (sans-serif fallback)
**Body Font:** Instrument Sans
**Label/Mono Font:** same family

**Character:** A single grotesque used at extreme scale contrast. Caps for display and labels; sentence case for voice/body.

### Hierarchy
- **Display** (700, `clamp(44px, 11vw, 168px)`, ~0.86, tracking floor `-0.04em`): chapter titles, closers.
- **Headline** (700, `clamp(30px, 5.6vw, 76px)`): section anchors.
- **Body** (400, `clamp(15px, 1.45vw, 19px)`, max ~70ch): manifesto and edition copy.
- **Label** (600, 11px, `0.16em`, uppercase): `[ navigation ]`, edition chips, MENU.

**The Bleed Rule.** Display may exit the viewport. Sections `overflow: hidden`. Do not shrink type to “fit.”

**The Tracking Floor Rule.** Display tracking is not tighter than `-0.04em`.

## Layout

Fluid gutter `--gut` (`clamp(18px, 4vw, 56px)`). Chapters are `min-height: 100dvh` posters, not trapped `100vh` slides. Vertical rhythm: `--pad` / `--pad-sm`. Header is fixed: wordmark slot + MENU. Breakpoints in CSS: 1024 / 860 / 560.

## Elevation & Depth

Flat. Depth is scale, opacity, and 1px Sand-alpha rules — not shadow.

**The No-Shadow Rule.** No drop shadows. Hover is colour or a 3.5% Sand raise, never lift.

## Shapes

Square. Radius is `0`. Rules are 1px. Colourway chips are the exception (swatches). Inputs are an underline, not a box.

## Components

### Buttons
- **Shape:** square, 1px Sand-alpha (or Clay) stroke, `13px 22px`, 11px tracked uppercase.
- **Primary (clay outline):** Clay border at rest; Clay fill on hover, Sand type.
- **Secondary:** Sand-alpha border; invert to Sand fill / Void type on hover.
- **Press:** `scale(0.97)` at 160ms `--ease`.
- **Join:** text-only Clay label in the underline field, not a filled chip.

### Chips
- Edition state: 1px stroke, 10px tracked uppercase. Live = Sand, in-development = Clay, closed = Stone.

### Cards / Containers
- Avoid. Contact tiles and archive rows are full-bleed columns with 1px seams, not rounded cards. Closed archive rows sit at 0.52 opacity and are not links.

### Inputs / Fields
- Underline field (`border-bottom: 1px solid line-strong`). Sand value, muted placeholder.
- Focus: 1px Clay outline, 2px offset.
- Error: Clay underline + `enter a valid email.` + shake. Success: `join` → `received` text swap; field read-only.

### Navigation
- Fixed header: SVG wordmark (hero scale while centred, dock width once seated) + MENU.
- MENU stays visible while scrolling. Overlay is a full-viewport Void panel (`t-panel-slide`). Chapter labels grow from origin on hover (`t-avatar`).

### Wordmark
- Masked SVG, laid out at `--wordmark-hero-width` (largest size). Centres in the hero at scale 1. Docks by scaling down to `--wordmark-dock-width` (`clamp(88px, 11vw, 120px)`) over the first 260px of scroll — never scale the mask up. Header height follows the docked mark, not the hero mark.

## Do's and Don'ts

### Do:
- **Do** use only Void, Stone, Clay, Sand.
- **Do** let display type bleed.
- **Do** keep MENU findable.
- **Do** show copy without waiting for a reveal class.
- **Do** make closed editions look closed.

### Don't:
- **Don't** add button pills, cards, gradients, or a fifth colour.
- **Don't** hide hero copy until the wordmark docks.
- **Don't** report waitlist success for an empty or invalid address.
- **Don't** invent colourways, prices, or edition stories.
- **Don't** animate layout properties (padding/width) for hover chrome.
