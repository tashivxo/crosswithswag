import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/*
 * Mobile scroll on the coming-soon home (flag on). Two measured causes of
 * jank on phones are covered here:
 *
 * 1. ScrollTrigger.refresh() mid-gesture. The URL bar collapsing resizes the
 *    100dvh poster and the veil; the dock's and the veil's ResizeObservers then
 *    re-measured the pin during the touch scroll (bypassing ignoreMobileResize).
 *    On touch devices that refresh now waits until the scroll has settled, and
 *    the dock and veil requests collapse into one.
 * 2. The WebGL veil's per-frame cost. On touch it renders at DPR 1 instead of
 *    min(devicePixelRatio, 2), and the field texture is re-created on resize
 *    (texStorage2D on an immutable texture is INVALID_OPERATION).
 */

const h = vi.hoisted(() => {
  const refresh = vi.fn();
  const ScrollTrigger = {
    refresh,
    update: vi.fn(),
    config: vi.fn(),
    create: vi.fn(() => ({ kill: vi.fn() })),
  };
  const timeline = vi.fn((vars?: { scrollTrigger?: Record<string, unknown> }) => {
    const tl: Record<string, unknown> = {
      vars,
      scrollTrigger: vars?.scrollTrigger
        ? { ...vars.scrollTrigger, kill: vi.fn() }
        : undefined,
      kill: vi.fn(),
    };
    tl.to = vi.fn(() => tl);
    tl.fromTo = vi.fn(() => tl);
    tl.set = vi.fn(() => tl);
    return tl;
  });
  const gsap = {
    registerPlugin: vi.fn(),
    timeline,
    context: vi.fn((fn: () => void) => {
      fn();
      return { revert: vi.fn(), kill: vi.fn() };
    }),
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
    core: { globals: () => ({ ScrollTrigger }) },
  };
  return { gsap, ScrollTrigger, refresh };
});

vi.mock("gsap", () => ({ gsap: h.gsap, default: h.gsap }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: h.ScrollTrigger }));

const veilProps: Record<string, unknown>[] = [];
vi.mock("@/components/v3/DarkVeil", () => {
  const DarkVeil = (props: Record<string, unknown>) => {
    veilProps.push(props);
    return null;
  };
  return { default: DarkVeil, DarkVeil };
});

type Listener = () => void;

/** A window stand-in that records listeners so tests can dispatch touch and scroll. */
function fakeWindow({ coarse }: { coarse: boolean }) {
  const listeners = new Map<string, Set<Listener>>();
  const options = new Map<string, AddEventListenerOptions | boolean | undefined>();
  const win = {
    innerWidth: 390,
    innerHeight: 844,
    devicePixelRatio: 3,
    location: { pathname: "/" },
    matchMedia: (query: string) => ({
      matches: query.includes("pointer: coarse") ? coarse : false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
    requestAnimationFrame: (cb: (t: number) => void) => {
      cb(0);
      return 1;
    },
    cancelAnimationFrame: vi.fn(),
    addEventListener: (
      type: string,
      fn: Listener,
      opts?: AddEventListenerOptions | boolean,
    ) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(fn);
      options.set(type, opts);
    },
    removeEventListener: (type: string, fn: Listener) => {
      listeners.get(type)?.delete(fn);
    },
  };
  const dispatch = (type: string) =>
    [...(listeners.get(type) ?? [])].forEach((fn) => fn());
  const count = (type: string) => listeners.get(type)?.size ?? 0;
  return { win, dispatch, count, options };
}

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  observed: unknown[] = [];
  constructor(private callback: (entries: unknown[]) => void) {
    FakeResizeObserver.instances.push(this);
  }
  observe(target: unknown) {
    this.observed.push(target);
  }
  unobserve() {}
  disconnect() {}
  fire(width: number, height: number) {
    this.callback([{ contentRect: { width, height } }]);
  }
}

function installDock({ coarse }: { coarse: boolean }) {
  const fw = fakeWindow({ coarse });
  vi.stubGlobal("window", fw.win);
  vi.stubGlobal("requestAnimationFrame", fw.win.requestAnimationFrame);
  vi.stubGlobal("cancelAnimationFrame", fw.win.cancelAnimationFrame);
  const cs = { id: "cs" };
  const home = {
    getBoundingClientRect: () => ({ top: 0, left: 0, width: 390, height: 844 }),
    querySelector: (selector: string) => (selector === ".cs" ? cs : null),
  };
  const attrs = new Map<string, string>([["data-cs-short", "0"]]);
  vi.stubGlobal("document", {
    documentElement: {
      setAttribute: (k: string, v: string) => attrs.set(k, v),
      removeAttribute: (k: string) => attrs.delete(k),
      getAttribute: (k: string) => attrs.get(k) ?? null,
    },
    getElementById: (id: string) => (id === "home" ? home : null),
  });
  vi.stubGlobal("ResizeObserver", FakeResizeObserver);
  const posterObserver = () =>
    FakeResizeObserver.instances.find((o) => o.observed.includes(cs));
  return { ...fw, cs, posterObserver };
}

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "1");
  FakeResizeObserver.instances = [];
  h.refresh.mockClear();
  veilProps.length = 0;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("scroll refresh gate", () => {
  async function gate(settleMs = 160) {
    const { createScrollRefreshGate, SCROLL_SETTLE_MS } = await import(
      "@/lib/scroll-refresh-gate"
    );
    const fw = fakeWindow({ coarse: true });
    const g = createScrollRefreshGate({ target: fw.win, settleMs });
    return { g, ...fw, SCROLL_SETTLE_MS };
  }

  it("settles 160ms after the last touch or scroll event", async () => {
    const { SCROLL_SETTLE_MS } = await gate();
    expect(SCROLL_SETTLE_MS).toBe(160);
  });

  it("runs a refresh straight away when nothing is scrolling", async () => {
    const { g } = await gate();
    const refresh = vi.fn();
    expect(g.request("st", refresh)).toBe(true);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(g.isBusy()).toBe(false);
  });

  it("holds a refresh while a finger is down and runs it once the scroll settles", async () => {
    const { g, dispatch } = await gate();
    const refresh = vi.fn();
    dispatch("touchstart");
    expect(g.isBusy()).toBe(true);
    expect(g.request("st", refresh)).toBe(false);
    vi.advanceTimersByTime(1000);
    expect(refresh).not.toHaveBeenCalled();
    dispatch("touchend");
    vi.advanceTimersByTime(159);
    expect(refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(g.isBusy()).toBe(false);
  });

  it("waits out native momentum: scroll events after the finger lifts extend the hold", async () => {
    const { g, dispatch } = await gate();
    const refresh = vi.fn();
    dispatch("touchstart");
    g.request("st", refresh);
    dispatch("touchend");
    for (let i = 0; i < 10; i++) {
      vi.advanceTimersByTime(100);
      dispatch("scroll");
    }
    expect(refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(160);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("holds during a scroll with no finger down (momentum alone)", async () => {
    const { g, dispatch } = await gate();
    const refresh = vi.fn();
    dispatch("scroll");
    expect(g.request("st", refresh)).toBe(false);
    vi.advanceTimersByTime(160);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("collapses repeated requests for one key into a single refresh, the latest one", async () => {
    const { g, dispatch } = await gate();
    const first = vi.fn();
    const latest = vi.fn();
    const other = vi.fn();
    dispatch("touchstart");
    g.request("st", first);
    g.request("st", latest);
    g.request("other", other);
    dispatch("touchend");
    vi.advanceTimersByTime(160);
    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledTimes(1);
    expect(other).toHaveBeenCalledTimes(1);
  });

  it("treats touchcancel like touchend", async () => {
    const { g, dispatch } = await gate();
    const refresh = vi.fn();
    dispatch("touchstart");
    g.request("st", refresh);
    dispatch("touchcancel");
    vi.advanceTimersByTime(160);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it("listens passively, so it can never block native scrolling", async () => {
    const { options } = await gate();
    for (const type of ["touchstart", "touchend", "touchcancel", "scroll"]) {
      expect(options.get(type)).toMatchObject({ passive: true });
    }
  });

  it("dispose removes its listeners and drops anything pending", async () => {
    const { g, dispatch, count } = await gate();
    const refresh = vi.fn();
    dispatch("touchstart");
    g.request("st", refresh);
    g.dispose();
    for (const type of ["touchstart", "touchend", "touchcancel", "scroll"]) {
      expect(count(type)).toBe(0);
    }
    vi.advanceTimersByTime(1000);
    expect(refresh).not.toHaveBeenCalled();
  });
});

describe("requestScrollSafeRefresh (shared gate)", () => {
  it("desktop (fine pointer): refreshes immediately even mid-scroll, exactly as before", async () => {
    const fw = fakeWindow({ coarse: false });
    vi.stubGlobal("window", fw.win);
    const { requestScrollSafeRefresh } = await import("@/lib/scroll-refresh-gate");
    const refresh = vi.fn();
    fw.dispatch("touchstart");
    fw.dispatch("scroll");
    expect(requestScrollSafeRefresh("st", refresh)).toBe(true);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(fw.count("scroll")).toBe(0);
  });

  it("touch (coarse pointer): defers a refresh requested during a touch scroll", async () => {
    const fw = fakeWindow({ coarse: true });
    vi.stubGlobal("window", fw.win);
    const { requestScrollSafeRefresh } = await import("@/lib/scroll-refresh-gate");
    const refresh = vi.fn();
    // The first request installs the shared listeners and runs (page load, idle).
    expect(requestScrollSafeRefresh("st", refresh)).toBe(true);
    fw.dispatch("touchstart");
    expect(requestScrollSafeRefresh("st", refresh)).toBe(false);
    expect(refresh).toHaveBeenCalledTimes(1);
    fw.dispatch("touchend");
    vi.advanceTimersByTime(160);
    expect(refresh).toHaveBeenCalledTimes(2);
  });

  it("runs immediately where there is no window (server, tests)", async () => {
    vi.stubGlobal("window", undefined);
    const { requestScrollSafeRefresh } = await import("@/lib/scroll-refresh-gate");
    const refresh = vi.fn();
    expect(requestScrollSafeRefresh("st", refresh)).toBe(true);
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});

describe("dock and veil refreshes on a phone (URL bar resize mid-scroll)", () => {
  it("touch: a poster resize during a touch scroll waits for the scroll to settle", async () => {
    const env = installDock({ coarse: true });
    const { acquireComingSoonDock } = await import("@/lib/coming-soon-dock");
    const dock = acquireComingSoonDock();
    expect(dock).not.toBeNull();
    // Initial refresh after the pin is built (idle, at load).
    expect(h.refresh).toHaveBeenCalledTimes(1);

    const observer = env.posterObserver();
    expect(observer).toBeDefined();
    observer!.fire(390, 844);
    env.dispatch("touchstart");
    observer!.fire(390, 904); // URL bar collapses: 100dvh grows by 60px
    expect(h.refresh).toHaveBeenCalledTimes(1);
    env.dispatch("touchend");
    env.dispatch("scroll");
    vi.advanceTimersByTime(100);
    env.dispatch("scroll");
    expect(h.refresh).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(160);
    expect(h.refresh).toHaveBeenCalledTimes(2);
    dock!.release();
  });

  it("touch: the dock and the veil resize together cost one refresh, after the scroll", async () => {
    const env = installDock({ coarse: true });
    const { acquireComingSoonDock } = await import("@/lib/coming-soon-dock");
    const { watchVeilLayout } = await import("@/lib/coming-soon-veil-refresh");
    const dock = acquireComingSoonDock();
    const veilEl = { id: "veil" } as unknown as Element;
    const stop = watchVeilLayout(veilEl, {
      raf: (cb) => setTimeout(cb, 16) as unknown as number,
      cancelRaf: (id) => clearTimeout(id),
      ResizeObserverImpl: FakeResizeObserver as unknown as typeof ResizeObserver,
    });
    const veilObserver = FakeResizeObserver.instances.find((o) =>
      o.observed.includes(veilEl),
    )!;
    veilObserver.fire(390, 844);
    vi.advanceTimersByTime(16); // first layout refresh (idle)
    h.refresh.mockClear();

    env.posterObserver()!.fire(390, 844);
    env.dispatch("touchstart");
    env.posterObserver()!.fire(390, 904);
    veilObserver.fire(390, 904);
    vi.advanceTimersByTime(150); // veil debounce elapses while the finger is down
    expect(h.refresh).not.toHaveBeenCalled();
    env.dispatch("touchend");
    vi.advanceTimersByTime(160);
    expect(h.refresh).toHaveBeenCalledTimes(1);
    stop();
    dock!.release();
  });

  it("desktop: a poster resize still refreshes on the next frame", async () => {
    const env = installDock({ coarse: false });
    const { acquireComingSoonDock } = await import("@/lib/coming-soon-dock");
    const dock = acquireComingSoonDock();
    h.refresh.mockClear();
    env.posterObserver()!.fire(1440, 900);
    env.dispatch("scroll");
    env.posterObserver()!.fire(1440, 960);
    expect(h.refresh).toHaveBeenCalledTimes(1);
    dock!.release();
  });
});

describe("veil resolution on touch", () => {
  it("caps the veil at DPR 1 on coarse pointers and keeps the default on desktop", async () => {
    const { resolveVeilDpr, VEIL_DPR_TOUCH } = await import("@/lib/coming-soon-veil");
    expect(VEIL_DPR_TOUCH).toBe(1);
    expect(resolveVeilDpr({ coarsePointer: true })).toBe(1);
    expect(resolveVeilDpr({ coarsePointer: false })).toBeUndefined();
  });

  it("forwards the dpr to DarkVeil", async () => {
    const { ComingSoonVeilLayer } = await import("@/components/v3/ComingSoonVeil");
    renderToStaticMarkup(createElement(ComingSoonVeilLayer, { quality: 0.4, dpr: 1 }));
    expect(veilProps[0]).toMatchObject({ quality: 0.4, dpr: 1 });
  });

  it("desktop props are unchanged: no dpr key at all", async () => {
    const { ComingSoonVeilLayer } = await import("@/components/v3/ComingSoonVeil");
    renderToStaticMarkup(createElement(ComingSoonVeilLayer, { quality: 0.55 }));
    expect(Object.keys(veilProps[0])).not.toContain("dpr");
  });
});

/** WebGL2 stand-in that enforces immutable texture storage like a real context. */
function fakeGl() {
  let nextId = 1;
  const immutable = new Set<number>();
  const alive = new Set<number>();
  let bound: number | null = null;
  const errors: string[] = [];
  const gl = {
    TEXTURE_2D: 0x0de1,
    FRAMEBUFFER: 0x8d40,
    COLOR_ATTACHMENT0: 0x8ce0,
    RGBA16F: 0x881a,
    RGBA8: 0x8058,
    TEXTURE_MIN_FILTER: 1,
    TEXTURE_MAG_FILTER: 2,
    TEXTURE_WRAP_S: 3,
    TEXTURE_WRAP_T: 4,
    LINEAR_MIPMAP_LINEAR: 5,
    LINEAR: 6,
    CLAMP_TO_EDGE: 7,
    createTexture: vi.fn(() => {
      const id = nextId++;
      alive.add(id);
      return { id };
    }),
    deleteTexture: vi.fn((t: { id: number } | null) => {
      if (t) alive.delete(t.id);
    }),
    bindTexture: vi.fn((_target: number, t: { id: number } | null) => {
      bound = t ? t.id : null;
    }),
    texStorage2D: vi.fn(
      (_t: number, levels: number, _fmt: number, w: number, h: number) => {
        if (bound === null || !alive.has(bound)) errors.push("no texture");
        else if (immutable.has(bound)) errors.push("INVALID_OPERATION");
        else immutable.add(bound);
        return { levels, w, h };
      },
    ),
    texParameteri: vi.fn(),
    createFramebuffer: vi.fn(() => ({ fb: true })),
    deleteFramebuffer: vi.fn(),
    bindFramebuffer: vi.fn(),
    framebufferTexture2D: vi.fn(),
  };
  return { gl, errors, alive };
}

describe("veil field target", () => {
  it("re-creates the texture on resize instead of re-specifying immutable storage", async () => {
    const { createFieldTarget } = await import("@/lib/veil-field-target");
    const { gl, errors, alive } = fakeGl();
    const target = createFieldTarget(gl as unknown as WebGL2RenderingContext, {
      floatTargets: true,
    });
    target.resize(156, 338);
    target.resize(156, 338); // same size: no work
    expect(gl.texStorage2D).toHaveBeenCalledTimes(1);
    expect(gl.texStorage2D).toHaveBeenLastCalledWith(gl.TEXTURE_2D, 9, gl.RGBA16F, 156, 338);
    const first = target.texture;

    target.resize(156, 362); // URL bar collapsed
    expect(errors).toEqual([]);
    expect(target.texture).not.toBe(first);
    expect(gl.deleteTexture).toHaveBeenCalledWith(first);
    expect(alive.size).toBe(1);
    expect(target.width).toBe(156);
    expect(target.height).toBe(362);
    expect(gl.framebufferTexture2D).toHaveBeenLastCalledWith(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      target.texture,
      0,
    );

    target.dispose();
    expect(alive.size).toBe(0);
    expect(gl.deleteFramebuffer).toHaveBeenCalledTimes(1);
  });

  it("uses RGBA8 without float render targets", async () => {
    const { createFieldTarget } = await import("@/lib/veil-field-target");
    const { gl } = fakeGl();
    const target = createFieldTarget(gl as unknown as WebGL2RenderingContext, {
      floatTargets: false,
    });
    target.resize(64, 32);
    expect(gl.texStorage2D).toHaveBeenLastCalledWith(gl.TEXTURE_2D, 7, gl.RGBA8, 64, 32);
  });

  it("DarkVeil uses the field target rather than re-specifying storage inline", () => {
    const source = readFileSync(
      new URL("../components/v3/DarkVeil.jsx", import.meta.url),
      "utf8",
    );
    expect(source).toContain("createFieldTarget");
    expect(source).not.toContain("texStorage2D");
  });
});

