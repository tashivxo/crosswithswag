import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";

type Call = { kind: "fromTo" | "to" | "set"; args: unknown[] };
type FakeTrigger = Record<string, unknown> & { kill: Mock };
type FakeTimeline = {
  vars: { scrollTrigger?: Record<string, unknown> } | undefined;
  calls: Call[];
  scrollTrigger?: FakeTrigger;
  fromTo: Mock;
  to: Mock;
  set: Mock;
  kill: Mock;
};

const h = vi.hoisted(() => {
  const state = {
    timelines: [] as FakeTimeline[],
    contexts: [] as { revert: Mock; kill: Mock }[],
    triggerCreates: [] as Record<string, unknown>[],
    tweenConfigs: [] as Record<string, unknown>[],
    sets: [] as unknown[][],
  };

  const timeline = vi.fn((vars?: FakeTimeline["vars"]) => {
    const tl = {
      vars,
      calls: [] as Call[],
    } as FakeTimeline;
    tl.scrollTrigger = vars?.scrollTrigger
      ? ({ ...vars.scrollTrigger, kill: vi.fn() } as FakeTrigger)
      : undefined;
    const record =
      (kind: Call["kind"]) =>
      (...args: unknown[]) => {
        tl.calls.push({ kind, args });
        return tl;
      };
    tl.fromTo = vi.fn(record("fromTo"));
    tl.to = vi.fn(record("to"));
    tl.set = vi.fn(record("set"));
    tl.kill = vi.fn();
    state.timelines.push(tl);
    return tl;
  });

  const context = vi.fn((fn: () => void) => {
    fn();
    const ctx = { revert: vi.fn(), kill: vi.fn() };
    state.contexts.push(ctx);
    return ctx;
  });

  const standalone = (vars: unknown) => {
    state.tweenConfigs.push(vars as Record<string, unknown>);
    return {};
  };

  const gsap = {
    registerPlugin: vi.fn(),
    timeline,
    context,
    set: vi.fn((...args: unknown[]) => {
      state.sets.push(args);
    }),
    to: vi.fn((_target: unknown, vars: unknown) => standalone(vars)),
    fromTo: vi.fn((_target: unknown, _from: unknown, to: unknown) =>
      standalone(to),
    ),
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
  };

  const ScrollTrigger = {
    create: vi.fn((vars: Record<string, unknown>) => {
      state.triggerCreates.push(vars);
      return { kill: vi.fn() };
    }),
    refresh: vi.fn(),
    update: vi.fn(),
    config: vi.fn(),
  };

  return { state, gsap, ScrollTrigger };
});

vi.mock("gsap", () => ({ gsap: h.gsap, default: h.gsap }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: h.ScrollTrigger }));

import {
  COMING_SOON_DOCK_ATTR,
  HEADER_GLYPH_FRACTION,
  LABEL_FADE_LENGTH,
  SHORT_SCREEN_MAX_HEIGHT,
  SHORT_SCREEN_ATTR,
  SHORT_SCREEN_QUERY,
  acquireComingSoonDock,
  getShortScreenSnapshot,
  subscribeShortScreen,
  mountComingSoonChrome,
  mountComingSoonFlight,
} from "@/lib/coming-soon-dock";

const globalsCss = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

/** CSS the docked state applies for reduced motion (a media query, live). */
function reducedMotionDockedCss() {
  const start = globalsCss.indexOf("@media (prefers-reduced-motion: reduce) {\n  .cs {\n    --cs-fit: 0;");
  expect(start, "reduced-motion docked block missing").toBeGreaterThan(0);
  return globalsCss.slice(start, globalsCss.indexOf("\n}\n", start));
}

/** CSS the docked state applies for a short screen: keyed off the attribute, not a media query. */
function shortScreenDockedCss() {
  const start = globalsCss.indexOf("/* docked: short screen */");
  const end = globalsCss.indexOf("/* end docked: short screen */");
  expect(start, "short-screen docked block missing").toBeGreaterThan(0);
  expect(end).toBeGreaterThan(start);
  return globalsCss.slice(start, end);
}

function rect(left: number, top: number, width: number, height: number) {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
  };
}

function fakeElement(initial: ReturnType<typeof rect>, extra = {}) {
  const el = {
    style: {} as Record<string, string>,
    box: initial,
    offsetWidth: initial.width,
    offsetHeight: initial.height,
    getBoundingClientRect: () => el.box,
    querySelector: vi.fn(() => null),
    ...extra,
  };
  return el;
}

const posterBox = rect(56, 128, 652, 240);
const slotBox = rect(56, 4, 120, 84);

type Geometry = {
  viewport: { width: number; height: number };
  poster: ReturnType<typeof rect>;
  slot: ReturnType<typeof rect>;
  label: ReturnType<typeof rect>;
  layerWidth: number;
};

const desktop: Geometry = {
  viewport: { width: 1440, height: 1000 },
  poster: posterBox,
  slot: slotBox,
  label: rect(56, 56, 1328, 13),
  layerWidth: 652,
};

const mobile: Geometry = {
  viewport: { width: 390, height: 900 },
  poster: rect(24, 97, 342, 126),
  slot: rect(18, 4, 88, 62),
  label: rect(24, 28, 342, 13),
  layerWidth: 240,
};

// Laptop and phone sizes with the poster scaled to the viewport height
// (see tests/coming-soon-fit.test.ts for the layout model they come from).
const laptop: Geometry = {
  viewport: { width: 1366, height: 657 },
  poster: rect(56, 82, 572, 210),
  slot: slotBox,
  label: rect(56, 35, 1254, 13),
  layerWidth: 619,
};

const laptop720: Geometry = {
  viewport: { width: 1280, height: 720 },
  poster: rect(56, 94, 592, 218),
  slot: slotBox,
  label: rect(56, 41, 1168, 13),
  layerWidth: 580,
};

const phone: Geometry = {
  viewport: { width: 390, height: 664 },
  poster: rect(24, 59, 224, 82),
  slot: rect(18, 4, 88, 62),
  label: rect(24, 20, 342, 13),
  layerWidth: 240,
};

type Env = {
  home: ReturnType<typeof fakeElement>;
  poster: ReturnType<typeof fakeElement>;
  label: ReturnType<typeof fakeElement>;
  layer: ReturnType<typeof fakeElement>;
  slot: ReturnType<typeof fakeElement>;
  chrome: ReturnType<typeof fakeElement>;
  header: ReturnType<typeof fakeElement>;
  rootAttrs: Map<string, string>;
};

function installDom(
  reduceMotion: boolean,
  coarse = false,
  geo: Geometry = desktop,
): Env {
  const poster = fakeElement(geo.poster);
  const label = fakeElement(geo.label);
  const cs = fakeElement(rect(0, 0, geo.viewport.width, geo.viewport.height));
  const home = fakeElement(rect(0, 0, geo.viewport.width, geo.viewport.height), {
    querySelector: vi.fn((selector: string) => {
      if (selector === ".cs-wordmark") return poster;
      if (selector === ".cs-label--top") return label;
      if (selector === ".cs") return cs;
      return null;
    }),
  });
  const rootAttrs = new Map<string, string>();

  vi.stubGlobal("document", {
    documentElement: {
      setAttribute: (k: string, v: string) => rootAttrs.set(k, v),
      removeAttribute: (k: string) => rootAttrs.delete(k),
      getAttribute: (k: string) => rootAttrs.get(k) ?? null,
    },
    getElementById: (id: string) => (id === "home" ? home : null),
  });

  vi.stubGlobal("window", {
    innerWidth: geo.viewport.width,
    innerHeight: geo.viewport.height,
    visualViewport: undefined,
    matchMedia: (query: string) => {
      const maxHeight = /\(max-height:\s*(\d+)px\)/.exec(query);
      return {
        matches: query.includes("prefers-reduced-motion")
          ? reduceMotion
          : query.includes("pointer: coarse")
            ? coarse
            : maxHeight
              ? geo.viewport.height <= Number(maxHeight[1])
              : false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
    },
    requestAnimationFrame: (cb: (t: number) => void) => {
      cb(0);
      return 1;
    },
    cancelAnimationFrame: vi.fn(),
  });

  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );

  return {
    home,
    poster,
    label,
    layer: fakeElement(rect(0, 0, geo.layerWidth, geo.layerWidth / 1.426685)),
    slot: fakeElement(geo.slot),
    chrome: fakeElement(rect(1300, 20, 60, 44)),
    header: fakeElement(rect(0, 0, 1440, 92)),
    rootAttrs,
  };
}

function pinConfigs() {
  const fromTimelines = h.state.timelines
    .map((tl) => tl.vars?.scrollTrigger)
    .filter(Boolean) as Record<string, unknown>[];
  const fromTweens = h.state.tweenConfigs
    .map((vars) => vars.scrollTrigger)
    .filter(Boolean) as Record<string, unknown>[];
  return [...fromTimelines, ...fromTweens, ...h.state.triggerCreates].filter(
    (config) => Boolean(config.pin),
  );
}

const pendingCleanups: (() => void)[] = [];

function acquire() {
  const dock = acquireComingSoonDock();
  if (dock) pendingCleanups.push(dock.release);
  return dock;
}

function mountBoth(env: Env) {
  const flight = mountComingSoonFlight({
    layer: env.layer as never,
    slot: env.slot as never,
  });
  const chrome = mountComingSoonChrome({
    chrome: env.chrome as never,
    header: env.header as never,
  });
  for (const cleanup of [flight, chrome]) if (cleanup) pendingCleanups.push(cleanup);
  return { flight, chrome };
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "1");
  h.state.timelines.length = 0;
  h.state.contexts.length = 0;
  h.state.triggerCreates.length = 0;
  h.state.tweenConfigs.length = 0;
  h.state.sets.length = 0;
  vi.clearAllMocks();
});

afterEach(() => {
  // A failing assertion must not leak a live pin into the next test.
  while (pendingCleanups.length) pendingCleanups.pop()?.();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("flag off", () => {
  it("creates no pin, no timeline and no flight, and defers to the legacy dock", () => {
    vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "");
    const env = installDom(false);

    expect(acquire()).toBeNull();
    expect(mountBoth(env)).toEqual({ flight: null, chrome: null });

    expect(h.gsap.timeline).not.toHaveBeenCalled();
    expect(h.gsap.context).not.toHaveBeenCalled();
    expect(h.gsap.set).not.toHaveBeenCalled();
    expect(h.ScrollTrigger.create).not.toHaveBeenCalled();
    expect(pinConfigs()).toHaveLength(0);
    expect(env.rootAttrs.size).toBe(0);
  });

  it("treats any value other than 1 as off", () => {
    vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "true");
    installDom(false);
    expect(acquire()).toBeNull();
    expect(h.gsap.timeline).not.toHaveBeenCalled();
  });
});

describe("reduced motion", () => {
  it("shows the nav in place with no pin, no flight and no ScrollTrigger", () => {
    const env = installDom(true);
    const { flight, chrome } = mountBoth(env);

    expect(flight).toBeTypeOf("function");
    expect(chrome).toBeTypeOf("function");
    expect(acquire()).toBeNull();

    expect(h.gsap.timeline).not.toHaveBeenCalled();
    expect(h.ScrollTrigger.create).not.toHaveBeenCalled();
    expect(pinConfigs()).toHaveLength(0);
    expect(env.rootAttrs.has(COMING_SOON_DOCK_ATTR)).toBe(false);

    const setFor = (target: unknown) =>
      h.state.sets.find(([t]) => t === target)?.[1] as
        | Record<string, unknown>
        | undefined;

    expect(setFor(env.layer)).toMatchObject({
      x: 0,
      y: 0,
      scale: slotBox.width / env.layer.offsetWidth,
      opacity: 1,
    });
    expect(setFor(env.chrome)).toMatchObject({ autoAlpha: 1, y: 0 });
    expect(setFor(env.label)).toBeUndefined();
    expect(setFor(env.poster)).toBeUndefined();

    flight?.();
    chrome?.();
  });
});

describe("nav starts docked on short screens", () => {
  const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  const withHeight = (height: number): Geometry => ({
    ...desktop,
    viewport: { ...desktop.viewport, height },
  });

  it("the breakpoint is 620px: only truly short screens get the docked fallback", () => {
    expect(SHORT_SCREEN_MAX_HEIGHT).toBe(620);
    expect(SHORT_SCREEN_QUERY).toBe("(max-height: 620px)");
    expect(css).not.toMatch(/max-height:\s*860px/);
  });

  it.each([
    ["619px", 619, true],
    ["620px", 620, true],
    ["621px", 621, false],
  ])("a %s tall screen is short: %s", (_label, height, short) => {
    const env = installDom(false, false, withHeight(height));
    expect(getShortScreenSnapshot()).toBe(short);
    const { flight, chrome } = mountBoth(env);
    expect(acquire() === null).toBe(short);
    flight?.();
    chrome?.();
  });

  it("one decision drives both: the query is evaluated in JS and CSS keys off the attribute it sets, never a live max-height media query", () => {
    expect(SHORT_SCREEN_QUERY).toBe(`(max-height: ${SHORT_SCREEN_MAX_HEIGHT}px)`);
    expect(SHORT_SCREEN_ATTR).toBe("data-cs-short");
    expect(css).not.toMatch(/@media[^{]*max-height/);
    expect(css).toContain(`html[${SHORT_SCREEN_ATTR}="1"]`);
  });

  it.each([
    ["1px below", SHORT_SCREEN_MAX_HEIGHT - 1],
    ["exactly at", SHORT_SCREEN_MAX_HEIGHT],
  ])("%s the breakpoint: no pin, no flight, nav docked, no flight state", (_label, height) => {
    const env = installDom(false, false, withHeight(height));
    const { flight, chrome } = mountBoth(env);

    expect(acquire()).toBeNull();
    expect(h.gsap.timeline).not.toHaveBeenCalled();
    expect(h.ScrollTrigger.create).not.toHaveBeenCalled();
    expect(pinConfigs()).toHaveLength(0);
    expect(env.rootAttrs.has(COMING_SOON_DOCK_ATTR)).toBe(false);

    expect(h.state.sets.find(([t]) => t === env.layer)?.[1]).toMatchObject({
      x: 0,
      y: 0,
      scale: slotBox.width / env.layer.offsetWidth,
      opacity: 1,
    });
    expect(h.state.sets.find(([t]) => t === env.chrome)?.[1]).toMatchObject({
      autoAlpha: 1,
    });
    // The poster and label are collapsed by CSS, never tweened by JS.
    expect(h.state.sets.some(([t]) => t === env.label || t === env.poster)).toBe(false);

    flight?.();
    chrome?.();
  });

  it("1px above the breakpoint: one pin, a flight, and one mark at a time", () => {
    const env = installDom(false, false, withHeight(SHORT_SCREEN_MAX_HEIGHT + 1));
    const { flight, chrome } = mountBoth(env);

    expect(h.gsap.timeline).toHaveBeenCalledTimes(1);
    expect(pinConfigs()).toHaveLength(1);
    expect(env.rootAttrs.get(COMING_SOON_DOCK_ATTR)).toBe("idle");
    const [tl] = h.state.timelines;
    expect(tl.calls.some((c) => c.args[0] === env.layer)).toBe(true);
    expect(tl.calls.some((c) => c.args[0] === env.label)).toBe(true);

    const onUpdate = tl.scrollTrigger?.onUpdate as (self: { progress: number }) => void;
    onUpdate({ progress: 0.5 });
    expect(env.rootAttrs.get(COMING_SOON_DOCK_ATTR)).toBe("flying");
    onUpdate({ progress: 0 });
    expect(env.rootAttrs.get(COMING_SOON_DOCK_ATTR)).toBe("idle");

    flight?.();
    chrome?.();
  });

  it("decides from the media query alone, not from measuring #home", () => {
    const tall = installDom(false, false, withHeight(SHORT_SCREEN_MAX_HEIGHT + 1));
    tall.home.offsetHeight = 5000;
    const a = mountBoth(tall);
    expect(pinConfigs()).toHaveLength(1);
    a.flight?.();
    a.chrome?.();

    h.state.timelines.length = 0;
    const short = installDom(false, false, withHeight(SHORT_SCREEN_MAX_HEIGHT));
    short.home.offsetHeight = 10;
    const b = mountBoth(short);
    expect(h.state.timelines).toHaveLength(0);
    b.flight?.();
    b.chrome?.();
  });

  it("collapses the poster mark and the COMING SOON label in CSS, with no JS", () => {
    const short = `html[${SHORT_SCREEN_ATTR}="1"]`;
    const reduced = reducedMotionDockedCss();
    const attr = shortScreenDockedCss();
    for (const block of [reduced, attr]) {
      expect(block).toMatch(/\.cs-wordmark,[^{]*\.cs-label--top\s*\{[^}]*display:\s*none/);
      expect(block).not.toMatch(/visibility:\s*hidden/);
      // The header mark is docked and MENU is visible before any script runs.
      expect(block).toMatch(/\.wordmark-drift-layer\s*\{[^}]*transform:\s*scale/);
      expect(block).toMatch(/\.site-header__chrome\s*\{[^}]*opacity:\s*1/);
    }
    expect(attr).toContain(`${short} .cs-wordmark`);
    expect(attr).toMatch(new RegExp(`${short.replace(/[[\]"]/g, "\\$&")} \\.cs \\{[^}]*--cs-fit:\\s*0`));
  });

  it("does not collapse the poster outside those queries", () => {
    const base = css.slice(css.indexOf(".cs-wordmark {"), css.indexOf(".cs-identifier {"));
    expect(base).not.toMatch(/display:\s*none/);
    const label = css.slice(css.indexOf(".cs-label {"), css.indexOf(".cs-label--field"));
    expect(label).not.toMatch(/display:\s*none/);
  });

  it("is flag-scoped: the header rules only match when the coming-soon poster is on the page", () => {
    const reduced = (reducedMotionDockedCss().match(/^\s*[^{}\n@]+\{/gm) ?? []);
    expect(reduced.length).toBeGreaterThan(0);
    for (const selector of reduced) {
      expect(selector.trim()).toMatch(/^(html:has\(\.cs\)|\.cs)/);
    }
    const short = (shortScreenDockedCss().match(/^\s*[^{}\n@/*]+\{/gm) ?? []);
    expect(short.length).toBeGreaterThan(0);
    for (const selector of short) {
      expect(selector.trim()).toMatch(
        new RegExp(`^html\\[${SHORT_SCREEN_ATTR}="1"\\](:has\\(\\.cs\\))? (\\.cs|\\.site-header|\\.wordmark-drift-layer)`),
      );
    }
  });

  it("gives the form the room once the poster mark and label are gone", () => {
    expect(css).toMatch(
      /@media \(min-width: 1100px\) and \(prefers-reduced-motion: reduce\) \{[^}]*\.cs-right\s*\{[^}]*margin-top/,
    );
    expect(shortScreenDockedCss()).toMatch(
      /@media \(min-width: 1100px\) \{\s*html\[data-cs-short="1"\] \.cs-right\s*\{[^}]*margin-top/,
    );
  });

  it("exposes the same decision to React, and is false whenever the flag is off", () => {
    installDom(false, false, withHeight(SHORT_SCREEN_MAX_HEIGHT));
    expect(getShortScreenSnapshot()).toBe(true);
    installDom(false, false, withHeight(SHORT_SCREEN_MAX_HEIGHT + 1));
    expect(getShortScreenSnapshot()).toBe(false);
    vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "");
    installDom(false, false, withHeight(SHORT_SCREEN_MAX_HEIGHT));
    expect(getShortScreenSnapshot()).toBe(false);
  });

  it("subscribes to resize, not to the live media query, so the URL bar cannot flip the dock", () => {
    installDom(false);
    const add = vi.fn();
    const remove = vi.fn();
    const matchMedia = vi.fn();
    vi.stubGlobal("window", {
      innerWidth: 390,
      innerHeight: 664,
      matchMedia,
      addEventListener: add,
      removeEventListener: remove,
    });
    const callback = vi.fn();
    const unsubscribe = subscribeShortScreen(callback);
    expect(add.mock.calls.map(([type]) => type)).toContain("resize");
    expect(matchMedia).not.toHaveBeenCalled();
    unsubscribe();
    expect(remove.mock.calls.map(([type]) => type)).toContain("resize");
  });
});

describe("pin shared between the poster mark and the header", () => {
  it("creates exactly one pin on #home, however many consumers mount", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);

    expect(h.gsap.timeline).toHaveBeenCalledTimes(1);
    expect(h.ScrollTrigger.create).not.toHaveBeenCalled();

    const pins = pinConfigs();
    expect(pins).toHaveLength(1);
    expect(pins[0]).toMatchObject({
      trigger: env.home,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      start: "top top",
      invalidateOnRefresh: true,
    });

    flight?.();
    chrome?.();
  });

  it("hands the same timeline to every acquirer", () => {
    installDom(false);
    const a = acquire();
    const b = acquire();
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(a?.timeline).toBe(b?.timeline);
    expect(h.gsap.timeline).toHaveBeenCalledTimes(1);
    a?.release();
    b?.release();
  });

  it("puts the flight and the header chrome on that one timeline, never on their own trigger", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    const [tl] = h.state.timelines;

    const targets = tl.calls.map((call) => call.args[0]);
    expect(targets).toContain(env.layer);
    expect(targets).toContain(env.chrome);
    expect(targets).toContain(env.header);

    expect(h.gsap.to).not.toHaveBeenCalled();
    expect(h.gsap.fromTo).not.toHaveBeenCalled();

    flight?.();
    chrome?.();
  });

  it("scales the pin length with the viewport and re-reads it on refresh", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    const config = pinConfigs()[0];
    expect(typeof config.end).toBe("function");
    expect((config.end as () => string)()).toBe("+=600");
    flight?.();
    chrome?.();
  });
});

describe("flight", () => {
  it("starts on the poster mark centre and ends at the existing dock scale and slot", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    const [tl] = h.state.timelines;

    const call = tl.calls.find(
      (c) => c.kind === "fromTo" && c.args[0] === env.layer,
    );
    expect(call).toBeDefined();
    const from = call?.args[1] as Record<string, () => number>;
    const to = call?.args[2] as Record<string, unknown> & {
      scale: () => number;
    };

    const posterCx = posterBox.left + posterBox.width / 2;
    const posterCy = posterBox.top + posterBox.height / 2;
    const slotCx = slotBox.left + slotBox.width / 2;
    const slotCy = slotBox.top + slotBox.height / 2;

    expect(from.x()).toBeCloseTo(posterCx - slotCx);
    expect(from.y()).toBeCloseTo(posterCy - slotCy);
    expect(from.scale()).toBeCloseTo(
      posterBox.width / (env.layer.offsetWidth * HEADER_GLYPH_FRACTION),
    );
    expect(to.x).toBe(0);
    expect(to.y).toBe(0);
    expect(to.scale()).toBeCloseTo(slotBox.width / env.layer.offsetWidth);
    expect(to.ease).toBe("none");

    flight?.();
    chrome?.();
  });

  it("fades MENU in and brings the coming-soon header from transparent to solid", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    const [tl] = h.state.timelines;

    const chromeCall = tl.calls.find((c) => c.args[0] === env.chrome);
    expect(chromeCall?.args[1]).toMatchObject({ autoAlpha: 0 });
    expect(chromeCall?.args[2]).toMatchObject({ autoAlpha: 1 });

    const headerCalls = tl.calls.filter((c) => c.args[0] === env.header);
    const solid = headerCalls.find((c) => "--header-solid" in (c.args[1] as object));
    expect(solid?.args[1]).toMatchObject({ "--header-solid": 0 });
    expect(solid?.args[2]).toMatchObject({ "--header-solid": 1 });

    flight?.();
    chrome?.();
  });
});

describe("header background timing", () => {
  const num = (value: unknown, fallback: number) =>
    typeof value === "number" ? value : fallback;

  it("stays transparent until the mark lands, then fills over only the last 5% of the timeline", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    const [tl] = h.state.timelines;

    const flightCall = tl.calls.find(
      (c) => c.kind === "fromTo" && c.args[0] === env.layer,
    );
    const landing =
      num(flightCall?.args[3], 0) +
      num((flightCall?.args[2] as { duration?: number }).duration, 0.5);

    const fill = tl.calls.find(
      (c) =>
        c.args[0] === env.header && "--header-solid" in (c.args[1] as object),
    );
    const fillStart = num(fill?.args[3], 0);
    const fillEnd =
      fillStart + num((fill?.args[2] as { duration?: number }).duration, 0.5);

    expect(landing).toBeLessThanOrEqual(0.95 + 1e-9);
    expect(fillStart).toBeGreaterThanOrEqual(landing - 1e-9);
    expect(fillEnd).toBeCloseTo(1);
    expect(fillEnd - fillStart).toBeLessThanOrEqual(0.05 + 1e-9);

    flight?.();
    chrome?.();
  });

  it("finishes the MENU fade and header line no later than the landing", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    const [tl] = h.state.timelines;
    const flightCall = tl.calls.find(
      (c) => c.kind === "fromTo" && c.args[0] === env.layer,
    );
    const landing =
      num(flightCall?.args[3], 0) +
      num((flightCall?.args[2] as { duration?: number }).duration, 0.5);

    const menu = tl.calls.find((c) => c.args[0] === env.chrome);
    const menuEnd =
      num(menu?.args[3], 0) +
      num((menu?.args[2] as { duration?: number }).duration, 0.5);
    expect(menuEnd).toBeLessThanOrEqual(landing + 1e-9);

    flight?.();
    chrome?.();
  });
});

describe("COMING SOON label", () => {
  const num = (value: unknown, fallback: number) =>
    typeof value === "number" ? value : fallback;

  type LabelTo = {
    opacity: number;
    y: number;
    duration: number;
    ease: ((t: number) => number) | string;
  };

  function flightLanding(env: Env) {
    const [tl] = h.state.timelines;
    const call = tl.calls.find(
      (c) => c.kind === "fromTo" && c.args[0] === env.layer,
    );
    return (
      num(call?.args[3], 0) +
      num((call?.args[2] as { duration?: number }).duration, 0.5)
    );
  }

  function labelCall(env: Env) {
    const [tl] = h.state.timelines;
    const calls = tl.calls.filter((c) => c.args[0] === env.label);
    expect(calls.length, "label tween missing").toBeGreaterThan(0);
    const call = calls[calls.length - 1];
    const from = call.args[1] as Record<string, number>;
    const to = call.args[2] as unknown as LabelTo;
    const start = num(call.args[3], 0);
    return { call, from, to, start };
  }

  /** Label opacity and drift at a share (0 to 1) of the flight. */
  function labelAt(env: Env, flightShare: number) {
    const { from, to, start } = labelCall(env);
    const position = flightShare * flightLanding(env);
    const raw = Math.min(1, Math.max(0, (position - start) / to.duration));
    const eased = typeof to.ease === "function" ? to.ease(raw) : raw;
    return {
      opacity: from.opacity + (to.opacity - from.opacity) * eased,
      y: from.y + (to.y - from.y) * eased,
    };
  }

  /** Independent model of the mark's glyph box during the flight. */
  function markBox(geo: Geometry, f: number) {
    const aspect = geo.poster.height / geo.poster.width;
    const width =
      geo.poster.width +
      (geo.slot.width * HEADER_GLYPH_FRACTION - geo.poster.width) * f;
    const pcx = geo.poster.left + geo.poster.width / 2;
    const pcy = geo.poster.top + geo.poster.height / 2;
    const scx = geo.slot.left + geo.slot.width / 2;
    const scy = geo.slot.top + geo.slot.height / 2;
    const cx = pcx + (scx - pcx) * f;
    const cy = pcy + (scy - pcy) * f;
    const height = width * aspect;
    return {
      left: cx - width / 2,
      right: cx + width / 2,
      top: cy - height / 2,
      bottom: cy + height / 2,
    };
  }

  const overlaps = (
    a: { left: number; right: number; top: number; bottom: number },
    b: { left: number; right: number; top: number; bottom: number },
  ) =>
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

  function mount(geo: Geometry) {
    const env = installDom(false, false, geo);
    const { flight, chrome } = mountBoth(env);
    return { env, flight, chrome };
  }

  /** Where the label starts to fade and where it reaches 0, as shares of the flight. */
  function fadeWindow(env: Env) {
    let start = 0;
    let end = 1;
    for (let i = 0; i <= 2000; i++) {
      const f = i / 2000;
      if (labelAt(env, f).opacity >= 1 - 1e-9) start = f;
    }
    for (let i = 2000; i >= 0; i--) {
      const f = i / 2000;
      if (labelAt(env, f).opacity <= 1e-9) end = f;
    }
    return { start, end };
  }

  it("fades over about 15% of the flight: the start is the end minus 15%", () => {
    expect(LABEL_FADE_LENGTH).toBe(0.15);
    for (const geo of [desktop, mobile, laptop, laptop720, phone]) {
      const { env, flight, chrome } = mount(geo);
      const { start, end } = fadeWindow(env);
      expect(end - start).toBeGreaterThanOrEqual(0.14);
      expect(end - start).toBeLessThanOrEqual(0.16);
      flight?.();
      chrome?.();
      h.state.timelines.length = 0;
    }
  });

  it("desktop window: roughly 44% to 59% of the flight", () => {
    const { env, flight, chrome } = mount(desktop);
    const { start, end } = fadeWindow(env);
    expect(start).toBeGreaterThanOrEqual(0.43);
    expect(start).toBeLessThanOrEqual(0.46);
    expect(end).toBeGreaterThanOrEqual(0.58);
    expect(end).toBeLessThanOrEqual(0.61);
    flight?.();
    chrome?.();
  });

  it("mobile and tablet window: 55% to 70% of the flight", () => {
    const { env, flight, chrome } = mount(mobile);
    const { start, end } = fadeWindow(env);
    expect(start).toBeGreaterThanOrEqual(0.54);
    expect(start).toBeLessThanOrEqual(0.56);
    expect(end).toBeGreaterThanOrEqual(0.69);
    expect(end).toBeLessThanOrEqual(0.71);
    flight?.();
    chrome?.();
  });

  it.each([
    ["laptop 1366x657", laptop],
    ["laptop 1280x720", laptop720],
    ["phone 390x664", phone],
  ])(
    "scaled poster on %s: window is 15% long, ends by 70% and 2% before contact",
    (_name, geo) => {
      const { env, flight, chrome } = mount(geo);
      const { start, end } = fadeWindow(env);
      let contact = 1;
      for (let i = 0; i <= 2000; i++) {
        const f = i / 2000;
        if (overlaps(markBox(geo, f), geo.label)) {
          contact = f;
          break;
        }
      }
      expect(end - start).toBeGreaterThanOrEqual(0.14);
      expect(end - start).toBeLessThanOrEqual(0.16);
      expect(end).toBeLessThanOrEqual(0.7 + 0.005);
      expect(end).toBeLessThanOrEqual(contact - 0.015);
      expect(start).toBeGreaterThanOrEqual(0);
      flight?.();
      chrome?.();
    },
  );

  it("never starts before 0 when the mark's box reaches the label almost at once", () => {
    const early: Geometry = {
      ...desktop,
      label: rect(56, 128, 1328, 13),
    };
    const { env, flight, chrome } = mount(early);
    const { start, end } = fadeWindow(env);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeLessThan(0.15);
    expect(labelAt(env, 0).opacity).toBe(1);
    expect(Number.isFinite(labelAt(env, 0.05).opacity)).toBe(true);
    expect(labelAt(env, 1).opacity).toBe(0);
    flight?.();
    chrome?.();
  });

  it.each([
    ["desktop", desktop],
    ["mobile", mobile],
    ["laptop 1366x657", laptop],
    ["laptop 1280x720", laptop720],
    ["phone 390x664", phone],
  ])("is at opacity 0 by 70% of the flight on %s", (_name, geo) => {
    const { env, flight, chrome } = mount(geo);
    expect(labelAt(env, 0.7).opacity).toBe(0);
    expect(labelAt(env, 0.85).opacity).toBe(0);
    expect(labelAt(env, 1).opacity).toBe(0);
    flight?.();
    chrome?.();
  });

  it.each([
    ["desktop", desktop],
    ["mobile", mobile],
    ["laptop 1366x657", laptop],
    ["laptop 1280x720", laptop720],
    ["phone 390x664", phone],
  ])(
    "is never visible while the mark's box overlaps the label's box on %s",
    (_name, geo) => {
      const { env, flight, chrome } = mount(geo);
      let overlapSamples = 0;
      for (let i = 0; i <= 400; i++) {
        const f = i / 400;
        if (overlaps(markBox(geo, f), geo.label)) {
          overlapSamples += 1;
          expect(
            labelAt(env, f).opacity,
            `label visible while overlapped at ${(f * 100).toFixed(1)}% of the flight`,
          ).toBeLessThanOrEqual(1e-6);
        }
      }
      expect(overlapSamples).toBeGreaterThan(0);
      flight?.();
      chrome?.();
    },
  );

  it("keeps the label fully visible until its fade starts", () => {
    const first = mount(desktop);
    expect(labelAt(first.env, 0).opacity).toBe(1);
    expect(labelAt(first.env, 0.4).opacity).toBe(1);
    first.flight?.();
    first.chrome?.();
    h.state.timelines.length = 0;

    const second = mount(mobile);
    expect(labelAt(second.env, 0).opacity).toBe(1);
    expect(labelAt(second.env, 0.5).opacity).toBe(1);
    second.flight?.();
    second.chrome?.();
  });

  it("drifts upward by 4 to 6px as it fades, landing on that drift", () => {
    const { env, flight, chrome } = mount(desktop);
    const { from } = labelCall(env);
    expect(from.y).toBe(0);
    const end = labelAt(env, 0.7).y;
    expect(end).toBeLessThanOrEqual(-4);
    expect(end).toBeGreaterThanOrEqual(-6);
    expect(labelAt(env, 1).y).toBe(end);
    flight?.();
    chrome?.();
  });

  it("re-measures on refresh, so a resize between layouts keeps the label clear of the mark", () => {
    const { env, flight, chrome } = mount(mobile);
    expect(labelAt(env, 0.65).opacity).toBeGreaterThan(0);

    env.poster.box = desktop.poster;
    env.slot.box = desktop.slot;
    env.label.box = desktop.label;
    env.layer.offsetWidth = desktop.layerWidth;
    const trigger = h.state.timelines[0].scrollTrigger as unknown as {
      onRefresh: (self: { progress: number }) => void;
    };
    trigger.onRefresh({ progress: 0 });

    expect(labelAt(env, 0.65).opacity).toBe(0);
    flight?.();
    chrome?.();
  });

  it("is a scrubbed tween on the one shared timeline, so scroll back reverses it, with no new trigger or pin", () => {
    const { env, flight, chrome } = mount(desktop);
    const { call, to, from } = labelCall(env);
    expect(call.kind).toBe("fromTo");
    expect(h.state.timelines[0].calls).toContain(call);
    expect(from.opacity).toBe(1);
    expect(from.y).toBe(0);
    expect("scrollTrigger" in to).toBe(false);
    expect(h.state.timelines).toHaveLength(1);
    expect(h.ScrollTrigger.create).not.toHaveBeenCalled();
    expect(h.gsap.to).not.toHaveBeenCalled();
    expect(h.gsap.fromTo).not.toHaveBeenCalled();
    expect(pinConfigs()).toHaveLength(1);
    // Same value at the same scroll point going down and coming back up.
    expect(labelAt(env, 0.6)).toEqual(labelAt(env, 0.6));
    flight?.();
    chrome?.();
  });

  it("is restored when the flight unmounts", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    flight?.();
    expect(h.state.contexts[0].revert).toHaveBeenCalledTimes(1);
    chrome?.();
  });

  it("is collapsed by CSS with reduced motion, so JS creates no tween, no timeline and no pin for it", () => {
    const env = installDom(true);
    const { flight, chrome } = mountBoth(env);

    expect(h.state.sets.some(([t]) => t === env.label || t === env.poster)).toBe(false);
    expect(h.gsap.timeline).not.toHaveBeenCalled();
    expect(h.gsap.to).not.toHaveBeenCalled();
    expect(h.gsap.fromTo).not.toHaveBeenCalled();
    expect(h.ScrollTrigger.create).not.toHaveBeenCalled();
    expect(pinConfigs()).toHaveLength(0);

    flight?.();
    chrome?.();
  });

  it("leaves the label alone when the flag is off", () => {
    vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "");
    const env = installDom(true);
    mountBoth(env);
    expect(h.state.sets.some(([t]) => t === env.label)).toBe(false);
  });

  const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

  it("collapses the poster mark and label in CSS before any script runs when motion is reduced", () => {
    expect(reducedMotionDockedCss()).toMatch(
      /\.cs-wordmark,\s*\.cs-label--top\s*\{[^}]*display:\s*none/,
    );
  });

  it("does not hide the label outside reduced motion", () => {
    const base = css.slice(css.indexOf(".cs-label {"), css.indexOf(".cs-label--field"));
    expect(base).not.toMatch(/opacity:\s*0/);
  });
});

describe("one visible mark", () => {
  const root = (env: Env) => env.rootAttrs.get(COMING_SOON_DOCK_ATTR);
  const progress = (value: number) =>
    (h.state.timelines[0].scrollTrigger?.onUpdate as (self: {
      progress: number;
    }) => void)({ progress: value });

  it("shows only the poster mark until the flight starts, then only the flying mark, including after release, and reverses on scroll back", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);

    expect(root(env)).toBe("idle");
    progress(0);
    expect(root(env)).toBe("idle");
    progress(0.0000018);
    expect(root(env)).toBe("idle");
    progress(0.4);
    expect(root(env)).toBe("flying");
    progress(1);
    expect(root(env)).toBe("flying");
    progress(0.2);
    expect(root(env)).toBe("flying");
    progress(0);
    expect(root(env)).toBe("idle");

    flight?.();
    chrome?.();
  });

  const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
  const rule = (selector: string) => {
    const start = css.indexOf(`${selector} {`);
    expect(start, `missing rule ${selector}`).toBeGreaterThanOrEqual(0);
    return css.slice(start, css.indexOf("}", start));
  };

  it("hides the poster mark with visibility so it keeps its layout box", () => {
    const flying = rule(`[${COMING_SOON_DOCK_ATTR}="flying"] .cs-wordmark`);
    expect(flying).toContain("visibility: hidden");
    expect(flying).not.toMatch(/display:\s*none/);
  });

  it("keeps the header mark hidden until the flight takes over, then shows it", () => {
    const idle = rule(`[${COMING_SOON_DOCK_ATTR}="idle"] .wordmark-drift-layer`);
    expect(idle).toContain("visibility: hidden");
    const flying = rule(`[${COMING_SOON_DOCK_ATTR}="flying"] .wordmark-drift-layer`);
    expect(flying).toContain("visibility: visible");
  });

  it("makes only the coming-soon header transparent, leaving the normal header solid", () => {
    expect(rule(".site-header")).toContain("background: var(--void)");
    const scoped = rule(`[${COMING_SOON_DOCK_ATTR}] .site-header`);
    expect(scoped).toContain("--header-solid");
    expect(scoped).toContain("background: rgba(10, 10, 10");
  });

  it("keeps the header above the veil and content layers", () => {
    expect(rule(".site-header")).toContain("z-index: 120");
  });
});

describe("cleanup on unmount", () => {
  it("reverts each consumer's tweens and keeps the pin until the last consumer leaves", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    const [tl] = h.state.timelines;
    expect(h.state.contexts).toHaveLength(2);

    flight?.();
    expect(h.state.contexts[0].revert).toHaveBeenCalledTimes(1);
    expect(tl.scrollTrigger?.kill).not.toHaveBeenCalled();
    expect(tl.kill).not.toHaveBeenCalled();
    expect(env.rootAttrs.has(COMING_SOON_DOCK_ATTR)).toBe(true);

    chrome?.();
    expect(h.state.contexts[1].revert).toHaveBeenCalledTimes(1);
    expect(tl.scrollTrigger?.kill).toHaveBeenCalledWith(true);
    expect(tl.kill).toHaveBeenCalledTimes(1);
    expect(env.rootAttrs.has(COMING_SOON_DOCK_ATTR)).toBe(false);
  });

  it("is idempotent, and a remount builds one fresh pin rather than stacking a second", () => {
    const env = installDom(false);
    const first = mountBoth(env);
    first.flight?.();
    first.flight?.();
    first.chrome?.();
    first.chrome?.();
    expect(h.state.timelines[0].kill).toHaveBeenCalledTimes(1);

    const second = mountBoth(env);
    expect(h.state.timelines).toHaveLength(2);
    expect(pinConfigs()).toHaveLength(2);
    second.flight?.();
    second.chrome?.();
    expect(h.state.timelines[1].kill).toHaveBeenCalledTimes(1);
  });

  it("disconnects its resize observer on release", () => {
    const disconnect = vi.fn();
    const env = installDom(false);
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect = disconnect;
      },
    );
    const { flight, chrome } = mountBoth(env);
    flight?.();
    chrome?.();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
