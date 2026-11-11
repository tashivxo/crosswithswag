import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isShortScreen } from "@/lib/short-screen";
import {
  SCROLL_TRIGGER_REFRESH_KEY,
  requestScrollSafeRefresh,
} from "@/lib/scroll-refresh-gate";

gsap.registerPlugin(ScrollTrigger);

/** Hidden probe on `html`; its offsetHeight tracks 100lvh for pin sizing. */
export const LANDING_LVH_PROBE_ATTR = "data-landing-lvh-probe";

export const LANDING_PIN_ID = "landing-hero-dock";

/**
 * Pin length as a share of 100lvh. V3.3.3 gallery intro was ~1.0 svh
 * (`#home-intro` bottom top). Coming-soon used 0.6 because the mark already
 * sat high and small on the poster. V4 flies the full centered hero, so 1.2
 * gives that longer trip enough scroll.
 */
export const LANDING_PIN_VH = 1.2;

export function landingPinScrollPx(lvhHeightPx: number): number {
  return Math.round(lvhHeightPx * LANDING_PIN_VH);
}

export type LandingDock = {
  timeline: gsap.core.Timeline;
  home: HTMLElement;
  onRefresh: (callback: () => void) => () => void;
  onProgress: (callback: (progress: number) => void) => () => void;
  release: () => void;
};

type Shared = {
  timeline: gsap.core.Timeline;
  home: HTMLElement;
  refs: number;
  observer: ResizeObserver | null;
  lvhObserver: ResizeObserver | null;
  lvhProbe: HTMLElement;
  refreshQueued: boolean;
  refreshListeners: Set<() => void>;
  progressListeners: Set<(progress: number) => void>;
  disableTouchPin: () => void;
};

let shared: Shared | null = null;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function dockScrub() {
  // 1:1 with scroll on every pointer. A numeric scrub interpolates on the
  // ticker, which iOS starves mid-gesture, so the mark stepped and trailed
  // the finger while the pinned landing stayed put. Same as V3.3.3.
  return true;
}

function enableTouchPin() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.ticker.lagSmoothing(0);
  return () => {};
}

function createLvhProbe(): HTMLElement {
  const probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.setAttribute(LANDING_LVH_PROBE_ATTR, "");
  Object.assign(probe.style, {
    position: "fixed",
    left: "0",
    top: "0",
    width: "0",
    height: "100lvh",
    visibility: "hidden",
    pointerEvents: "none",
    overflow: "hidden",
  });
  document.documentElement.appendChild(probe);
  return probe;
}

function observeLvhProbe(state: Shared) {
  if (typeof ResizeObserver === "undefined") return null;

  let height = -1;
  const observer = new ResizeObserver((entries) => {
    const box = entries[entries.length - 1]?.contentRect;
    if (!box) return;
    const changed = height >= 0 && box.height !== height;
    height = box.height;
    if (changed) queueRefresh(state);
  });
  observer.observe(state.lvhProbe);
  return observer;
}

function queueRefresh(state: Shared) {
  if (state.refreshQueued) return;
  state.refreshQueued = true;
  window.requestAnimationFrame(() => {
    state.refreshQueued = false;
    if (shared !== state) return;
    requestScrollSafeRefresh(SCROLL_TRIGGER_REFRESH_KEY, () => {
      if (shared) ScrollTrigger.refresh();
    });
  });
}

function observeResize(state: Shared) {
  const hero = state.home.querySelector(".landing-hero") ?? state.home;
  if (typeof ResizeObserver === "undefined") return null;

  let width = -1;
  let height = -1;
  const observer = new ResizeObserver((entries) => {
    const box = entries[entries.length - 1]?.contentRect;
    if (!box) return;
    const changed =
      width >= 0 && (box.width !== width || box.height !== height);
    width = box.width;
    height = box.height;
    if (changed) queueRefresh(state);
  });
  observer.observe(hero);
  return observer;
}

function teardown(state: Shared) {
  state.observer?.disconnect();
  state.lvhObserver?.disconnect();
  state.lvhProbe.remove();
  state.refreshListeners.clear();
  state.progressListeners.clear();
  state.timeline.scrollTrigger?.kill(true);
  state.timeline.kill();
  state.disableTouchPin();
  if (shared === state) shared = null;
}

/**
 * One pin for the V4 `/` landing. The mark flight and header chrome add
 * tweens to this timeline. Pin length is `LANDING_PIN_VH` (1.2 × lvh), not
 * the coming-soon 0.6 — V4 starts from viewport center at full hero size.
 * Does not mount the Jotform poster.
 */
export function acquireLandingDock(): LandingDock | null {
  if (prefersReducedMotion() || isShortScreen()) {
    return null;
  }

  if (!shared) {
    const home = document.getElementById("home");
    if (!home) return null;

    const lvhProbe = createLvhProbe();

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: LANDING_PIN_ID,
        trigger: home,
        start: "top top",
        end: () => `+=${landingPinScrollPx(lvhProbe.offsetHeight)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: dockScrub(),
        invalidateOnRefresh: true,
        onUpdate: (self: { progress: number }) => {
          shared?.progressListeners.forEach((listener) =>
            listener(self.progress),
          );
        },
        onRefresh: (self: { progress: number }) => {
          shared?.progressListeners.forEach((listener) =>
            listener(self.progress),
          );
          shared?.refreshListeners.forEach((listener) => listener());
        },
      },
    });
    timeline.to({}, { duration: 1 }, 0);

    const state: Shared = {
      timeline,
      home,
      refs: 0,
      observer: null,
      lvhObserver: null,
      lvhProbe,
      refreshQueued: false,
      refreshListeners: new Set(),
      progressListeners: new Set(),
      disableTouchPin: enableTouchPin(),
    };
    shared = state;
    state.observer = observeResize(state);
    state.lvhObserver = observeLvhProbe(state);
    queueRefresh(state);
  }

  const state = shared;
  state.refs += 1;
  let released = false;

  return {
    timeline: state.timeline,
    home: state.home,
    onRefresh: (callback) => {
      state.refreshListeners.add(callback);
      return () => state.refreshListeners.delete(callback);
    },
    onProgress: (callback) => {
      state.progressListeners.add(callback);
      return () => state.progressListeners.delete(callback);
    },
    release: () => {
      if (released) return;
      released = true;
      state.refs -= 1;
      if (state.refs <= 0) teardown(state);
    },
  };
}

