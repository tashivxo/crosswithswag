import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("gsap", () => {
  const gsap = { registerPlugin: vi.fn() };
  return { gsap, default: gsap };
});
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));

import {
  COMING_SOON_DOCK_ATTR,
  getShortScreenSnapshot,
  isShortScreen,
  SHORT_SCREEN_ATTR,
  SHORT_SCREEN_MAX_HEIGHT,
  SHORT_SCREEN_QUERY,
  SHORT_SCREEN_REEVALUATE_PX,
  shortScreenInitScript,
  subscribeShortScreen,
} from "@/lib/coming-soon-dock";

/**
 * The short-screen decision is made once, before first paint, by an inline
 * script in the document head. It lives in an attribute on <html>; CSS keys off
 * that attribute and the dock reads and updates it. A raw max-height media query
 * would follow the mobile URL bar immediately, so CSS must never use one.
 */

type Viewport = {
  win: {
    location: { pathname: string };
    innerWidth: number;
    innerHeight: number;
    __csShortEval?: { width: number; height: number };
    matchMedia: (query: string) => { matches: boolean };
    addEventListener: (type: string, cb: () => void) => void;
    removeEventListener: (type: string, cb: () => void) => void;
  };
  attrs: Map<string, string>;
  resize: (width: number, height: number) => void;
};

function stubViewport(
  width: number,
  height: number,
  options: { reduced?: boolean; path?: string } = {},
): Viewport {
  const attrs = new Map<string, string>();
  const listeners = new Map<string, Array<() => void>>();
  const win = {
    innerWidth: width,
    innerHeight: height,
    location: { pathname: options.path ?? "/" },
    matchMedia: (query: string) => {
      if (query.includes("prefers-reduced-motion")) {
        return { matches: Boolean(options.reduced) };
      }
      const max = /\(max-height:\s*(\d+)px\)/.exec(query);
      return { matches: max ? win.innerHeight <= Number(max[1]) : false };
    },
    addEventListener: (type: string, cb: () => void) => {
      listeners.set(type, [...(listeners.get(type) ?? []), cb]);
    },
    removeEventListener: (type: string, cb: () => void) => {
      listeners.set(
        type,
        (listeners.get(type) ?? []).filter((x) => x !== cb),
      );
    },
  } as Viewport["win"];
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", {
    documentElement: {
      setAttribute: (k: string, v: string) => attrs.set(k, v),
      getAttribute: (k: string) => attrs.get(k) ?? null,
      removeAttribute: (k: string) => attrs.delete(k),
    },
  });
  return {
    win,
    attrs,
    resize(w, h) {
      win.innerWidth = w;
      win.innerHeight = h;
      for (const cb of listeners.get("resize") ?? []) cb();
    },
  };
}

/** What the inline head script does, run against the stubbed window and document. */
function runInitScript() {
  const run = new Function("window", "document", shortScreenInitScript());
  run(globalThis.window, globalThis.document);
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "1");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("first paint, before any hydration", () => {
  it.each([
    [619, "1"],
    [620, "1"],
    [621, "0"],
  ])("the head script sets the attribute for a %spx tall screen: %s", (height, value) => {
    const vp = stubViewport(390, height);
    runInitScript();
    expect(vp.attrs.get(SHORT_SCREEN_ATTR)).toBe(value);
  });

  it("evaluates the shared query, not a copy of it", () => {
    const script = shortScreenInitScript();
    expect(script).toContain(SHORT_SCREEN_QUERY);
    expect(script).toContain(SHORT_SCREEN_ATTR);
    expect(SHORT_SCREEN_QUERY).toBe(`(max-height: ${SHORT_SCREEN_MAX_HEIGHT}px)`);
  });

  it("is self-contained (no imports, no references to module scope) and never throws", () => {
    stubViewport(390, 600);
    const bare = new Function("window", "document", shortScreenInitScript());
    expect(() => bare({}, { documentElement: { setAttribute() {} } })).not.toThrow();
    expect(() => bare(undefined, undefined)).not.toThrow();
  });

  it("records the size it evaluated at, so the dock can tell a URL bar nudge from a real resize", () => {
    const vp = stubViewport(390, 664);
    runInitScript();
    expect(vp.win.__csShortEval).toEqual({ width: 390, height: 664 });
  });

  it.each([619, 620, 621])(
    "the dock reads the same state the script set at %spx, before it runs anything",
    (height) => {
      stubViewport(390, height);
      runInitScript();
      const expected = height <= SHORT_SCREEN_MAX_HEIGHT;
      expect(isShortScreen()).toBe(expected);
      expect(getShortScreenSnapshot()).toBe(expected);
    },
  );

  it("is keyed off an attribute in the CSS, with no raw max-height media query", () => {
    const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
    expect(css).not.toMatch(/@media[^{]*max-height/);
    expect(css).toContain(`html[${SHORT_SCREEN_ATTR}="1"] .cs-wordmark`);
    expect(css).toContain(`html[${SHORT_SCREEN_ATTR}="1"] .cs-label--top`);
  });
});

describe("the URL bar must not flip the docked fallback", () => {
  function subscribed(width: number, height: number) {
    const vp = stubViewport(width, height);
    runInitScript();
    const callback = vi.fn();
    const unsubscribe = subscribeShortScreen(callback);
    return { vp, callback, unsubscribe };
  }

  it("a 60px height change across 620 at the same width does not flip the state or notify", () => {
    const { vp, callback, unsubscribe } = subscribed(390, 664);
    expect(getShortScreenSnapshot()).toBe(false);

    vp.resize(390, 604);
    // The media query itself would now say short; the decision must not follow it.
    expect(vp.win.matchMedia(SHORT_SCREEN_QUERY)).toMatchObject({ matches: true });
    expect(getShortScreenSnapshot()).toBe(false);
    expect(vp.attrs.get(SHORT_SCREEN_ATTR)).toBe("0");
    expect(callback).not.toHaveBeenCalled();

    vp.resize(390, 664);
    expect(getShortScreenSnapshot()).toBe(false);
    expect(callback).not.toHaveBeenCalled();
    unsubscribe();
  });

  it("the same nudge the other way (short, bar hides, taller) does not flip either", () => {
    const { vp, callback, unsubscribe } = subscribed(390, 600);
    expect(getShortScreenSnapshot()).toBe(true);
    vp.resize(390, 660);
    expect(getShortScreenSnapshot()).toBe(true);
    expect(vp.attrs.get(SHORT_SCREEN_ATTR)).toBe("1");
    expect(callback).not.toHaveBeenCalled();
    unsubscribe();
  });

  it("exactly 100px is still a nudge; more than 100px re-evaluates", () => {
    expect(SHORT_SCREEN_REEVALUATE_PX).toBe(100);
    const a = subscribed(390, 700);
    a.vp.resize(390, 600);
    expect(getShortScreenSnapshot()).toBe(false);
    expect(a.callback).not.toHaveBeenCalled();
    a.vp.resize(390, 599);
    expect(getShortScreenSnapshot()).toBe(true);
    expect(a.callback).toHaveBeenCalledTimes(1);
    a.unsubscribe();
  });

  it("a height change of more than 100px flips the state, the attribute and notifies once", () => {
    const { vp, callback, unsubscribe } = subscribed(390, 664);
    vp.resize(390, 540);
    expect(getShortScreenSnapshot()).toBe(true);
    expect(vp.attrs.get(SHORT_SCREEN_ATTR)).toBe("1");
    expect(callback).toHaveBeenCalledTimes(1);

    vp.resize(390, 700);
    expect(getShortScreenSnapshot()).toBe(false);
    expect(vp.attrs.get(SHORT_SCREEN_ATTR)).toBe("0");
    expect(callback).toHaveBeenCalledTimes(2);
    unsubscribe();
  });

  it("measures the 100px from the last evaluated height, so small steps cannot drift past it", () => {
    const { vp, callback, unsubscribe } = subscribed(390, 664);
    vp.resize(390, 620);
    vp.resize(390, 580);
    vp.resize(390, 565);
    expect(getShortScreenSnapshot()).toBe(false);
    expect(callback).not.toHaveBeenCalled();
    vp.resize(390, 560);
    expect(getShortScreenSnapshot()).toBe(true);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(vp.win.__csShortEval).toEqual({ width: 390, height: 560 });
    unsubscribe();
  });

  it("any width change re-evaluates, however small the height change", () => {
    const { vp, callback, unsubscribe } = subscribed(390, 621);
    vp.resize(391, 619);
    expect(getShortScreenSnapshot()).toBe(true);
    expect(vp.attrs.get(SHORT_SCREEN_ATTR)).toBe("1");
    expect(callback).toHaveBeenCalledTimes(1);
    expect(vp.win.__csShortEval).toEqual({ width: 391, height: 619 });

    vp.resize(390, 619);
    expect(getShortScreenSnapshot()).toBe(true);
    vp.resize(1024, 621);
    expect(getShortScreenSnapshot()).toBe(false);
    unsubscribe();
  });

  it("a rotation (width and height swap) re-evaluates", () => {
    const { vp, callback, unsubscribe } = subscribed(390, 844);
    vp.resize(844, 390);
    expect(getShortScreenSnapshot()).toBe(true);
    expect(callback).toHaveBeenCalledTimes(1);
    vp.resize(390, 844);
    expect(getShortScreenSnapshot()).toBe(false);
    expect(callback).toHaveBeenCalledTimes(2);
    unsubscribe();
  });

  it("does not notify when a re-evaluation lands on the same state", () => {
    const { vp, callback, unsubscribe } = subscribed(390, 900);
    vp.resize(390, 700);
    expect(getShortScreenSnapshot()).toBe(false);
    expect(callback).not.toHaveBeenCalled();
    unsubscribe();
  });

  it("stops listening when unsubscribed", () => {
    const { vp, callback, unsubscribe } = subscribed(390, 664);
    unsubscribe();
    vp.resize(390, 300);
    expect(callback).not.toHaveBeenCalled();
  });

  it("CSS and JS state always match: the attribute is the state, whatever the viewport does", () => {
    const { vp, unsubscribe } = subscribed(390, 664);
    const sizes: Array<[number, number]> = [
      [390, 600],
      [390, 640],
      [390, 500],
      [390, 560],
      [400, 619],
      [400, 700],
      [800, 400],
      [800, 620],
      [800, 621],
      [390, 664],
    ];
    for (const [w, h] of sizes) {
      vp.resize(w, h);
      const attr = vp.attrs.get(SHORT_SCREEN_ATTR);
      expect(attr === "1").toBe(getShortScreenSnapshot());
      expect(attr === "1").toBe(isShortScreen());
    }
    unsubscribe();
  });
});

describe("flag off", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "");
  });

  it("never sets the attribute, never listens and never reports a short screen", () => {
    const vp = stubViewport(390, 400);
    const callback = vi.fn();
    const addSpy = vi.spyOn(vp.win, "addEventListener");
    const unsubscribe = subscribeShortScreen(callback);
    vp.resize(390, 100);
    expect(getShortScreenSnapshot()).toBe(false);
    expect(addSpy).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(vp.attrs.has(SHORT_SCREEN_ATTR)).toBe(false);
    unsubscribe();
  });

  it("renders no head script", async () => {
    const { ShortScreenScript } = await import("@/components/ShortScreenScript");
    expect(ShortScreenScript()).toBeNull();
  });
});

describe("flag on, server rendering", () => {
  it("renders one inline script carrying the shared query, with nothing to hydrate", async () => {
    const { ShortScreenScript } = await import("@/components/ShortScreenScript");
    const element = ShortScreenScript() as {
      type: string;
      props: { dangerouslySetInnerHTML?: { __html: string }; children?: unknown };
    } | null;
    expect(element).not.toBeNull();
    expect(element?.type).toBe("script");
    expect(element?.props.children).toBeUndefined();
    expect(element?.props.dangerouslySetInnerHTML?.__html).toBe(shortScreenInitScript());
  });

  it("the layout wires it in the head, and marks <html> so the script's attribute is not a hydration mismatch", () => {
    const layout = readFileSync(join(process.cwd(), "app/layout.tsx"), "utf8");
    expect(layout).toContain("ShortScreenScript");
    expect(layout).toMatch(/<head>[\s\S]*<ShortScreenScript\s*\/>[\s\S]*<\/head>/);
    expect(layout).toContain("suppressHydrationWarning");
    expect(layout).toMatch(/comingSoonEnabled\(\)/);
  });
});

describe("the header mark is hidden by the head script too, so only the poster mark shows before the app runs", () => {
  const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

  it.each([
    ["1440x621", 1440, 621],
    ["1440x900", 1440, 900],
    ["1440x1080", 1440, 1080],
    ["390x664", 390, 664],
    ["1366x657", 1366, 657],
  ])("%s on the home route: the same script sets the dock attribute to idle", (_name, width, height) => {
    const vp = stubViewport(width, height);
    runInitScript();
    expect(vp.attrs.get(SHORT_SCREEN_ATTR)).toBe("0");
    expect(vp.attrs.get(COMING_SOON_DOCK_ATTR)).toBe("idle");
  });

  it.each([619, 620])("a %spx tall screen is docked: no idle attribute, only the header mark", (height) => {
    const vp = stubViewport(1440, height);
    runInitScript();
    expect(vp.attrs.get(SHORT_SCREEN_ATTR)).toBe("1");
    expect(vp.attrs.has(COMING_SOON_DOCK_ATTR)).toBe(false);
  });

  it("reduced motion is docked: no idle attribute, only the header mark", () => {
    const vp = stubViewport(1440, 900, { reduced: true });
    runInitScript();
    expect(vp.attrs.has(COMING_SOON_DOCK_ATTR)).toBe(false);
  });

  it.each(["/editions", "/playlists", "/about"])("%s is not the home route: no idle attribute", (path) => {
    const vp = stubViewport(1440, 900, { path });
    runInitScript();
    expect(vp.attrs.get(SHORT_SCREEN_ATTR)).toBe("0");
    expect(vp.attrs.has(COMING_SOON_DOCK_ATTR)).toBe(false);
  });

  it("uses the dock's own attribute and value, not a second one", () => {
    const script = shortScreenInitScript();
    expect(script).toContain(COMING_SOON_DOCK_ATTR);
    expect(COMING_SOON_DOCK_ATTR).toBe("data-cs-dock");
    const vp = stubViewport(1440, 900);
    runInitScript();
    expect([...vp.attrs.keys()].sort()).toEqual([COMING_SOON_DOCK_ATTR, SHORT_SCREEN_ATTR].sort());
  });

  it("still never throws when the window is incomplete", () => {
    const bare = new Function("window", "document", shortScreenInitScript());
    expect(() => bare({ matchMedia: () => ({ matches: false }) }, { documentElement: { setAttribute() {} } })).not.toThrow();
    expect(() => bare({ matchMedia: () => ({ matches: false }), location: undefined }, { documentElement: { setAttribute() {} } })).not.toThrow();
  });

  it("CSS hides the header mark while idle, and the docked states always win over a stale idle", () => {
    expect(css).toMatch(/html\[data-cs-dock="idle"\] \.wordmark-drift-layer\s*\{[^}]*visibility:\s*hidden/);
    const reduced = css.slice(
      css.indexOf("@media (prefers-reduced-motion: reduce) {\n  .cs {\n    --cs-fit: 0;"),
    );
    expect(reduced).toMatch(
      /html:has\(\.cs\) \.wordmark-drift-layer\s*\{[^}]*visibility:\s*visible/,
    );
    const short = css.slice(css.indexOf("/* docked: short screen */"));
    expect(short).toMatch(
      /html\[data-cs-short="1"\]:has\(\.cs\) \.wordmark-drift-layer\s*\{[^}]*visibility:\s*visible/,
    );
    // The docked rules are later in the file and at least as specific as the idle rule.
    expect(css.indexOf('html[data-cs-dock="idle"] .wordmark-drift-layer')).toBeLessThan(
      css.indexOf("/* docked: short screen */"),
    );
  });

  it("the flag-off page gets no attribute from the script component", async () => {
    vi.stubEnv("NEXT_PUBLIC_COMING_SOON", "");
    const { ShortScreenScript } = await import("@/components/ShortScreenScript");
    expect(ShortScreenScript()).toBeNull();
  });
});
