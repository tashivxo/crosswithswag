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
  acquireComingSoonDock,
  mountComingSoonChrome,
  mountComingSoonFlight,
} from "@/lib/coming-soon-dock";

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

function fakeElement(box: ReturnType<typeof rect>, extra = {}) {
  return {
    style: {} as Record<string, string>,
    offsetWidth: box.width,
    offsetHeight: box.height,
    getBoundingClientRect: () => box,
    querySelector: vi.fn(() => null),
    ...extra,
  };
}

const posterBox = rect(56, 115, 652, 240);
const slotBox = rect(56, 4, 120, 84);

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

function installDom(reduceMotion: boolean, coarse = false): Env {
  const poster = fakeElement(posterBox);
  const label = fakeElement(rect(56, 56, 90, 13));
  const cs = fakeElement(rect(0, 0, 1440, 800));
  const home = fakeElement(rect(0, 0, 1440, 800), {
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
    innerWidth: 1440,
    innerHeight: 800,
    visualViewport: undefined,
    matchMedia: (query: string) => ({
      matches: query.includes("prefers-reduced-motion")
        ? reduceMotion
        : query.includes("pointer: coarse")
          ? coarse
          : false,
    }),
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
    layer: fakeElement(rect(0, 0, 652, 457)),
    slot: fakeElement(slotBox),
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

    flight?.();
    chrome?.();
  });
});

describe("poster taller than the viewport", () => {
  it("does not pin, so the form is never cut off, and docks the nav statically", () => {
    const env = installDom(false);
    env.home.offsetHeight = 1000;
    const { flight, chrome } = mountBoth(env);

    expect(acquire()).toBeNull();
    expect(h.gsap.timeline).not.toHaveBeenCalled();
    expect(pinConfigs()).toHaveLength(0);
    expect(env.rootAttrs.has(COMING_SOON_DOCK_ATTR)).toBe(false);
    expect(flight).toBeTypeOf("function");
    expect(chrome).toBeTypeOf("function");
    expect(h.state.sets.find(([t]) => t === env.chrome)?.[1]).toMatchObject({
      autoAlpha: 1,
    });

    flight?.();
    chrome?.();
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
    expect((config.end as () => string)()).toBe("+=480");
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
    const call = tl.calls.find((c) => c.args[0] === env.label);
    expect(call, "label tween missing").toBeDefined();
    const from = call?.args[1] as Record<string, number>;
    const to = call?.args[2] as Record<string, number | string>;
    const start = num(call?.args[3], 0);
    const end = start + num(to.duration, 0.5);
    return { call, from, to, start, end };
  }

  it("starts fading at about 80% of the flight", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    const { start } = labelCall(env);
    const ratio = start / flightLanding(env);
    expect(ratio).toBeGreaterThanOrEqual(0.75);
    expect(ratio).toBeLessThanOrEqual(0.85);
    flight?.();
    chrome?.();
  });

  it("is fully transparent before the mark lands, so they never overlap", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    const { from, to, end } = labelCall(env);
    expect(from.opacity).toBe(1);
    expect(to.opacity).toBe(0);
    expect(end).toBeLessThan(flightLanding(env));
    flight?.();
    chrome?.();
  });

  it("drifts upward by 4 to 6px as it fades", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    const { from, to } = labelCall(env);
    expect(from.y).toBe(0);
    expect(Number(to.y)).toBeLessThanOrEqual(-4);
    expect(Number(to.y)).toBeGreaterThanOrEqual(-6);
    flight?.();
    chrome?.();
  });

  it("is a scrubbed tween on the one shared timeline, so scroll back reverses it, with no new trigger or pin", () => {
    const env = installDom(false);
    const { flight, chrome } = mountBoth(env);
    const { call, to } = labelCall(env);
    expect(call?.kind).toBe("fromTo");
    expect(h.state.timelines[0].calls).toContain(call);
    expect(to.ease).toBe("none");
    expect("scrollTrigger" in to).toBe(false);
    expect(h.state.timelines).toHaveLength(1);
    expect(h.ScrollTrigger.create).not.toHaveBeenCalled();
    expect(h.gsap.to).not.toHaveBeenCalled();
    expect(h.gsap.fromTo).not.toHaveBeenCalled();
    expect(pinConfigs()).toHaveLength(1);
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

  it("is hidden from first paint with reduced motion, as a plain opacity switch with no drift, and never scrolls back in", () => {
    const env = installDom(true);
    const { flight, chrome } = mountBoth(env);

    const set = h.state.sets.find(([t]) => t === env.label)?.[1] as
      | Record<string, unknown>
      | undefined;
    expect(set).toMatchObject({ opacity: 0 });
    expect(set).not.toHaveProperty("y");
    expect(set).not.toHaveProperty("x");

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

  it("hides the label in CSS before any script runs when motion is reduced, with no transition", () => {
    const start = css.lastIndexOf("@media (prefers-reduced-motion: reduce)");
    const blocks = [...css.matchAll(/@media \(prefers-reduced-motion: reduce\) \{/g)];
    const hits = blocks
      .map((m) => css.slice(m.index, css.indexOf("\n}\n", m.index)))
      .filter((block) => block.includes(".cs-label--top"));
    expect(start).toBeGreaterThan(0);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(/\.cs-label--top\s*\{[^}]*opacity:\s*0/);
    expect(hits[0]).toMatch(/\.cs-label--top\s*\{[^}]*transition:\s*none/);
    expect(hits[0]).not.toMatch(/transform|translate/);
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
