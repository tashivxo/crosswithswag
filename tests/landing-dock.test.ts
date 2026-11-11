import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const h = vi.hoisted(() => {
  const timelines: Array<{
    vars?: { scrollTrigger?: Record<string, unknown> };
    fromTo: ReturnType<typeof vi.fn>;
    to: ReturnType<typeof vi.fn>;
    kill: ReturnType<typeof vi.fn>;
    scrollTrigger?: { kill: ReturnType<typeof vi.fn> };
  }> = [];

  const timeline = vi.fn((vars?: { scrollTrigger?: Record<string, unknown> }) => {
    const tl = {
      vars,
      fromTo: vi.fn(function (this: unknown) {
        return this;
      }),
      to: vi.fn(function (this: unknown) {
        return this;
      }),
      kill: vi.fn(),
      scrollTrigger: vars?.scrollTrigger
        ? { kill: vi.fn(), ...vars.scrollTrigger }
        : undefined,
    };
    timelines.push(tl);
    return tl;
  });

  const ScrollTrigger = {
    refresh: vi.fn(),
    update: vi.fn(),
    config: vi.fn(),
    normalizeScroll: vi.fn(),
    create: vi.fn(),
  };

  const gsap = {
    registerPlugin: vi.fn(),
    timeline,
    context: vi.fn((fn: () => void) => {
      fn();
      return { revert: vi.fn(), kill: vi.fn() };
    }),
    set: vi.fn(),
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
  };

  return { timelines, gsap, ScrollTrigger };
});

vi.mock("gsap", () => ({ gsap: h.gsap, default: h.gsap }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: h.ScrollTrigger }));

import { acquireLandingDock, LANDING_PIN_ID } from "@/lib/landing-dock";
import { SHORT_SCREEN_ATTR } from "@/lib/short-screen";

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

const pending: Array<() => void> = [];

function acquire() {
  const dock = acquireLandingDock();
  if (dock) pending.push(dock.release);
  return dock;
}

function installDom({ coarse = false, short = false } = {}) {
  const rootAttrs = new Map<string, string>();
  rootAttrs.set(SHORT_SCREEN_ATTR, short ? "1" : "0");
  const home = {
    querySelector: (selector: string) =>
      selector === ".landing-hero" ? { offsetWidth: 390, offsetHeight: 844 } : null,
  };

  vi.stubGlobal("document", {
    createElement: () => ({
      setAttribute: vi.fn(),
      style: {},
      offsetHeight: 844,
      remove: vi.fn(),
    }),
    documentElement: {
      setAttribute: (k: string, v: string) => rootAttrs.set(k, v),
      removeAttribute: (k: string) => rootAttrs.delete(k),
      getAttribute: (k: string) => rootAttrs.get(k) ?? null,
      appendChild: (node: unknown) => node,
    },
    getElementById: (id: string) => (id === "home" ? home : null),
  });

  vi.stubGlobal("window", {
    innerWidth: 390,
    innerHeight: 844,
    matchMedia: (query: string) => ({
      matches: query.includes("pointer: coarse") ? coarse : false,
      media: query,
      addEventListener() {},
      removeEventListener() {},
    }),
    requestAnimationFrame: (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    },
    addEventListener() {},
    removeEventListener() {},
  });

  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );

  return home;
}

beforeEach(() => {
  h.timelines.length = 0;
  vi.clearAllMocks();
});

afterEach(() => {
  while (pending.length) pending.pop()?.();
  vi.unstubAllGlobals();
});

describe("V4 landing pin (mobile / fast scroll)", () => {
  it("creates one pin on #home with V3.3.3 pin flags", () => {
    const home = installDom();
    const a = acquire();
    const b = acquire();
    expect(a?.timeline).toBe(b?.timeline);
    expect(h.gsap.timeline).toHaveBeenCalledTimes(1);
    expect(h.ScrollTrigger.create).not.toHaveBeenCalled();
    expect(h.ScrollTrigger.normalizeScroll).not.toHaveBeenCalled();

    const pin = h.timelines[0].vars?.scrollTrigger;
    expect(pin).toMatchObject({
      id: LANDING_PIN_ID,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      start: "top top",
      scrub: true,
      invalidateOnRefresh: true,
    });
    expect(pin?.trigger).toBe(home);
  });

  it("touch: scrubs 1:1 so the mark cannot trail the finger in 0.25s chunks", () => {
    installDom({ coarse: true });
    acquire();
    expect(h.timelines[0].vars?.scrollTrigger?.scrub).toBe(true);
    expect(h.ScrollTrigger.config).toHaveBeenCalledWith({
      ignoreMobileResize: true,
    });
    expect(h.gsap.ticker.lagSmoothing).toHaveBeenCalledWith(0);
    expect(h.ScrollTrigger.normalizeScroll).not.toHaveBeenCalled();
  });

  it("sizes the pin end from the 100lvh probe, not window.innerHeight", () => {
    installDom();
    acquire();
    const end = h.timelines[0].vars?.scrollTrigger?.end as
      | (() => string)
      | undefined;
    expect(typeof end).toBe("function");
    expect(end?.()).toBe("+=1013");
  });

  it("does not pin on a short screen", () => {
    installDom({ short: true });
    expect(acquire()).toBeNull();
    expect(h.gsap.timeline).not.toHaveBeenCalled();
  });
});

describe("touch landing height", () => {
  it("uses svh on coarse pointers so the URL bar cannot reflow the pin", () => {
    expect(css).toMatch(
      /@media \(pointer: coarse\) \{[\s\S]*?#home\.hero-section[\s\S]*?min-height:\s*100svh/,
    );
  });
});
