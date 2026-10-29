import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const veilProps: Record<string, unknown>[] = [];

vi.mock("@/components/v3/DarkVeil", () => {
  const DarkVeil = (props: Record<string, unknown>) => {
    veilProps.push(props);
    return null;
  };
  return { default: DarkVeil, DarkVeil };
});

import { ComingSoonChapter } from "@/components/v3/chapters/ComingSoonChapter";
import {
  ComingSoonVeil,
  ComingSoonVeilLayer,
} from "@/components/v3/ComingSoonVeil";
import {
  COMING_SOON_VEIL_PROPS,
  VEIL_QUALITY_DESKTOP,
  VEIL_QUALITY_TOUCH,
  resolveVeilQuality,
} from "@/lib/coming-soon-veil";

const css = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

beforeEach(() => {
  veilProps.length = 0;
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("flag gating", () => {
  it("renders the veil only when NEXT_PUBLIC_COMING_SOON is 1", () => {
    vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "1");
    const on = renderToStaticMarkup(createElement(ComingSoonVeil));
    expect(on).toContain("cs-veil");
  });

  it("renders nothing with the flag off", () => {
    for (const value of ["0", "true", ""]) {
      vi.stubEnv("NEXT_PUBLIC_COMING_SOON", value);
      expect(renderToStaticMarkup(createElement(ComingSoonVeil))).toBe("");
    }
    vi.unstubAllEnvs();
    vi.stubEnv("NEXT_PUBLIC_COMING_SOON", undefined);
    expect(renderToStaticMarkup(createElement(ComingSoonVeil))).toBe("");
  });

  it("adds nothing to the chapter markup with the flag off", () => {
    vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "0");
    const markup = renderToStaticMarkup(
      createElement(ComingSoonChapter, { id: "home-intro" }),
    );
    expect(markup).not.toContain("cs-veil");
    expect(markup).not.toContain("dark-veil");
    expect(markup).toMatch(/^<section[^>]*><p class="cs-label cs-label--top"/);
  });
});

describe("veil layer", () => {
  it("is aria-hidden and ignores pointer events", () => {
    const markup = renderToStaticMarkup(
      createElement(ComingSoonVeilLayer, { quality: 0.55 }),
    );
    expect(markup).toMatch(/^<div[^>]*class="cs-veil"/);
    expect(markup).toContain('aria-hidden="true"');
    expect(css).toMatch(/\.cs-veil\s*\{[^}]*pointer-events:\s*none/);
  });

  it("is the first child of ComingSoonChapter", () => {
    vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "1");
    const markup = renderToStaticMarkup(
      createElement(ComingSoonChapter, { id: "home-intro" }),
    );
    expect(markup).toMatch(
      /^<section[^>]*class="cs"[^>]*><div[^>]*class="cs-veil"/,
    );
    expect(markup.indexOf("cs-veil")).toBeLessThan(
      markup.indexOf("cs-label"),
    );
  });

  it("sits behind the content and stays inside the chapter", () => {
    expect(css).toMatch(
      /\.cs-veil\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0[^}]*z-index:\s*0/,
    );
    expect(css).toMatch(
      /\.cs\s*>\s*\*:not\(\.cs-veil\)\s*\{[^}]*position:\s*relative[^}]*z-index:\s*1/,
    );
  });

  it("only makes the coming-soon header transparent", () => {
    expect(css).toMatch(
      /:has\(\.cs-veil\)[^{]*\.site-header[^{]*\{[^}]*background/,
    );
  });
});

describe("DarkVeil props", () => {
  it("passes Marcus's locked props", () => {
    renderToStaticMarkup(
      createElement(ComingSoonVeilLayer, { quality: 0.55 }),
    );
    expect(veilProps).toHaveLength(1);
    expect(veilProps[0]).toMatchObject({
      color: "#393943",
      speed: 0.65,
      scale: 1.05,
      rotation: 354,
      flow: 0.35,
      warp: 0.4,
      variation: 4,
      sheen: 0.35,
      glow: 0.2,
      brightness: 1.2,
      grain: 0.07,
      quality: 0.55,
      opacity: 0.7,
      mouseStrength: 1.3,
    });
    expect(COMING_SOON_VEIL_PROPS).toMatchObject({
      color: "#393943",
      opacity: 0.7,
    });
  });

  it("forwards the resolved quality", () => {
    renderToStaticMarkup(
      createElement(ComingSoonVeilLayer, { quality: VEIL_QUALITY_TOUCH }),
    );
    expect(veilProps[0].quality).toBe(0.4);
  });

  it("pauses the animation under reduced motion", () => {
    renderToStaticMarkup(
      createElement(ComingSoonVeilLayer, {
        quality: 0.55,
        reducedMotion: true,
      }),
    );
    expect(veilProps[0]).toMatchObject({ paused: true, intro: false });
  });

  it("keeps animating when motion is allowed", () => {
    renderToStaticMarkup(
      createElement(ComingSoonVeilLayer, { quality: 0.55 }),
    );
    expect(veilProps[0].paused).toBeFalsy();
  });
});

describe("resolveVeilQuality", () => {
  it("uses 0.55 on desktop", () => {
    expect(VEIL_QUALITY_DESKTOP).toBe(0.55);
    expect(resolveVeilQuality({ coarsePointer: false, maxTouchPoints: 0 })).toBe(
      0.55,
    );
  });

  it("uses 0.4 for coarse pointers", () => {
    expect(resolveVeilQuality({ coarsePointer: true, maxTouchPoints: 0 })).toBe(
      0.4,
    );
  });

  it("uses 0.4 for touch devices", () => {
    expect(resolveVeilQuality({ coarsePointer: false, maxTouchPoints: 5 })).toBe(
      0.4,
    );
  });
});
