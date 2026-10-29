import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { comingSoonEnabled } from "@/lib/coming-soon";
import { isShortScreen } from "@/lib/short-screen";

gsap.registerPlugin(ScrollTrigger);

export const COMING_SOON_DOCK_ATTR = "data-cs-dock";

/** Timeline position where the mark lands in the nav slot. The header fills solid only in the 5% after it. */
export const COMING_SOON_LANDING = 0.95;

/**
 * Latest share of the flight by which the label must be gone. The fade ends
 * earlier when the mark's box would reach the label sooner (see labelFadeEnd).
 */
export const LABEL_FADE_END = 0.7;

/** The label fade always lasts this share of the flight (start = end minus this, never below 0). */
export const LABEL_FADE_LENGTH = 0.15;

/** Share of the flight kept clear between "gone" and the mark's box reaching the label. */
export const LABEL_CLEAR_MARGIN = 0.02;

/** Upward drift of the label while it fades, in px. */
export const LABEL_DRIFT_PX = 5;

export {
  SHORT_SCREEN_ATTR,
  SHORT_SCREEN_MAX_HEIGHT,
  SHORT_SCREEN_QUERY,
  SHORT_SCREEN_REEVALUATE_PX,
  getShortScreenSnapshot,
  isShortScreen,
  shortScreenInitScript,
  subscribeShortScreen,
} from "@/lib/short-screen";

/** Pin length as a share of the viewport height. */
export const COMING_SOON_PIN_VH = 0.6;

/**
 * Visible glyph width as a share of the header `.wordmark` box. The header mask
 * is `contain` inside a 1.4267 box, the SVG is 9088x6968 and the glyph spans
 * 76.1% of the SVG width: 0.761 * (9088 / 6968) / 1.426685.
 */
export const HEADER_GLYPH_FRACTION = 0.6957;

/**
 * ScrollTrigger can report a float-sized progress at scroll 0 (the measured
 * start is not always an exact integer), so treat that as "not started".
 */
export const FLIGHT_EPSILON = 0.001;

function flightStateFor(progress: number): FlightState {
  return progress > FLIGHT_EPSILON ? "flying" : "idle";
}

type FlightState = "idle" | "flying";

export type ComingSoonDock = {
  timeline: gsap.core.Timeline;
  home: HTMLElement;
  /** Runs after every ScrollTrigger refresh. Returns an unsubscribe. */
  onRefresh: (callback: () => void) => () => void;
  release: () => void;
};

type Shared = {
  timeline: gsap.core.Timeline;
  home: HTMLElement;
  refs: number;
  observer: ResizeObserver | null;
  refreshQueued: boolean;
  refreshListeners: Set<() => void>;
};

let shared: Shared | null = null;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function dockScrub() {
  return window.matchMedia("(pointer: coarse)").matches ? 0.25 : true;
}

function setFlightState(state: FlightState | null) {
  const root = document.documentElement;
  if (state === null) {
    root.removeAttribute(COMING_SOON_DOCK_ATTR);
    return;
  }
  if (root.getAttribute(COMING_SOON_DOCK_ATTR) !== state) {
    root.setAttribute(COMING_SOON_DOCK_ATTR, state);
  }
}

function dockScale(slot: HTMLElement, layer: HTMLElement) {
  const hero = layer.offsetWidth;
  return hero > 0 ? slot.offsetWidth / hero : 1;
}

function queueRefresh(state: Shared) {
  if (state.refreshQueued) return;
  state.refreshQueued = true;
  window.requestAnimationFrame(() => {
    state.refreshQueued = false;
    if (shared === state) ScrollTrigger.refresh();
  });
}

function observeResize(state: Shared) {
  const poster = state.home.querySelector(".cs");
  if (!poster || typeof ResizeObserver === "undefined") return null;

  let width = -1;
  let height = -1;
  const observer = new ResizeObserver((entries) => {
    const box = entries[entries.length - 1]?.contentRect;
    if (!box) return;
    const changed = width >= 0 && (box.width !== width || box.height !== height);
    width = box.width;
    height = box.height;
    if (changed) queueRefresh(state);
  });
  observer.observe(poster);
  return observer;
}

function teardown(state: Shared) {
  state.observer?.disconnect();
  state.refreshListeners.clear();
  state.timeline.scrollTrigger?.kill(true);
  state.timeline.kill();
  setFlightState(null);
  if (shared === state) shared = null;
}

/**
 * The one pin for the coming-soon home. The poster flight and the header chrome
 * both add their tweens to the returned timeline; nobody else may pin.
 */
export function acquireComingSoonDock(): ComingSoonDock | null {
  if (!comingSoonEnabled()) return null;
  if (prefersReducedMotion()) return null;
  if (isShortScreen()) return null;

  if (!shared) {
    const home = document.getElementById("home");
    if (!home) return null;

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        id: "coming-soon-dock",
        trigger: home,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * COMING_SOON_PIN_VH)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: dockScrub(),
        invalidateOnRefresh: true,
        onUpdate: (self: { progress: number }) =>
          setFlightState(flightStateFor(self.progress)),
        onRefresh: (self: { progress: number }) => {
          setFlightState(flightStateFor(self.progress));
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
      refreshQueued: false,
      refreshListeners: new Set(),
    };
    shared = state;
    setFlightState("idle");
    state.observer = observeResize(state);
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
    release: () => {
      if (released) return;
      released = true;
      state.refs -= 1;
      if (state.refs <= 0) teardown(state);
    },
  };
}

function measureFlight(
  home: HTMLElement,
  poster: HTMLElement,
  slot: HTMLElement,
  layer: HTMLElement,
) {
  const homeBox = home.getBoundingClientRect();
  const posterBox = poster.getBoundingClientRect();
  const slotBox = slot.getBoundingClientRect();
  const hero = layer.offsetWidth;

  return {
    x: posterBox.left + posterBox.width / 2 - (slotBox.left + slotBox.width / 2),
    // The pin holds #home at the top of the viewport for the whole flight, so
    // measure the poster mark relative to #home to stay correct at any scroll.
    y:
      posterBox.top -
      homeBox.top +
      posterBox.height / 2 -
      (slotBox.top + slotBox.height / 2),
    scale: hero > 0 ? posterBox.width / (hero * HEADER_GLYPH_FRACTION) : 1,
  };
}

/**
 * Share of the flight by which the label must be fully gone: the designer's
 * outer bound, pulled earlier when the mark's glyph box would reach the label's
 * box sooner (the mark is much wider than the label on desktop). The glyph box
 * is modelled as a straight interpolation from the poster mark to the docked
 * glyph, with the poster's aspect ratio.
 */
function labelFadeEnd(
  home: HTMLElement,
  poster: HTMLElement,
  slot: HTMLElement,
  label: HTMLElement,
) {
  const homeTop = home.getBoundingClientRect().top;
  const p = poster.getBoundingClientRect();
  const s = slot.getBoundingClientRect();
  const l = label.getBoundingClientRect();
  if (p.width <= 0) return LABEL_FADE_END;

  const aspect = p.height / p.width;
  const pcx = p.left + p.width / 2;
  const pcy = p.top - homeTop + p.height / 2;
  const scx = s.left + s.width / 2;
  const scy = s.top + s.height / 2;
  const labelTop = l.top - homeTop;
  const labelBottom = l.bottom - homeTop;

  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const width = p.width + (s.width * HEADER_GLYPH_FRACTION - p.width) * f;
    const height = width * aspect;
    const cx = pcx + (scx - pcx) * f;
    const cy = pcy + (scy - pcy) * f;
    const reaches =
      cx - width / 2 < l.right &&
      cx + width / 2 > l.left &&
      cy - height / 2 < labelBottom &&
      cy + height / 2 > labelTop;
    if (reaches) {
      return Math.max(0.05, Math.min(LABEL_FADE_END, f - LABEL_CLEAR_MARGIN));
    }
  }
  return LABEL_FADE_END;
}

function once(fn: () => void) {
  let done = false;
  return () => {
    if (done) return;
    done = true;
    fn();
  };
}

/**
 * Coming-soon flight of the poster mark into the header slot. Returns null when
 * the flag is off so the caller keeps the legacy dock untouched.
 */
export function mountComingSoonFlight({
  layer,
  slot,
}: {
  layer: HTMLElement;
  slot: HTMLElement;
}): (() => void) | null {
  if (!comingSoonEnabled()) return null;

  const showDocked = () => {
    gsap.set(layer, {
      x: 0,
      y: 0,
      scale: dockScale(slot, layer),
      opacity: 1,
    });
    return () => {
      gsap.set(layer, { clearProps: "transform" });
    };
  };

  // Reduced motion and short screens: the nav is docked from load and CSS has
  // already collapsed the poster mark and label, so there is nothing to animate.
  if (prefersReducedMotion() || isShortScreen()) return showDocked();

  const dock = acquireComingSoonDock();
  const poster = dock?.home.querySelector<HTMLElement>(".cs-wordmark") ?? null;
  if (!dock || !poster) {
    dock?.release();
    return showDocked();
  }

  const { home, timeline } = dock;
  const label = home.querySelector<HTMLElement>(".cs-label--top");
  // The tween spans 0 to LABEL_FADE_END of the flight; the ease maps that onto
  // the measured fade window (end minus 15%, end pulled earlier where the
  // mark's box reaches the label sooner) and is re-measured on refresh.
  let fadeStart = LABEL_FADE_END - LABEL_FADE_LENGTH;
  let fadeEnd = LABEL_FADE_END;
  const measureFade = () => {
    if (!label) return;
    fadeEnd = labelFadeEnd(home, poster, slot, label);
    fadeStart = Math.max(0, fadeEnd - LABEL_FADE_LENGTH);
  };
  measureFade();
  const stopListening = label ? dock.onRefresh(measureFade) : () => {};
  const ctx = gsap.context(() => {
    timeline.fromTo(
      layer,
      {
        x: () => measureFlight(home, poster, slot, layer).x,
        y: () => measureFlight(home, poster, slot, layer).y,
        scale: () => measureFlight(home, poster, slot, layer).scale,
        opacity: 1,
        force3D: true,
      },
      {
        x: 0,
        y: 0,
        scale: () => dockScale(slot, layer),
        opacity: 1,
        force3D: true,
        ease: "none",
        duration: COMING_SOON_LANDING,
      },
      0,
    );

    if (label) {
      timeline.fromTo(
        label,
        { opacity: 1, y: 0 },
        {
          opacity: 0,
          y: -LABEL_DRIFT_PX,
          ease: (t: number) => {
            const share = t * LABEL_FADE_END;
            const length = Math.max(fadeEnd - fadeStart, 0.01);
            return Math.min(1, Math.max(0, (share - fadeStart) / length));
          },
          duration: LABEL_FADE_END * COMING_SOON_LANDING,
        },
        0,
      );
    }
  }, layer);

  return once(() => {
    stopListening();
    ctx.revert();
    dock.release();
  });
}

/**
 * Coming-soon header chrome on the shared pin: MENU fades in, the header line
 * draws and the header stays transparent until the mark lands, then fills solid. Returns null when the
 * flag is off so the caller keeps the legacy header untouched.
 */
export function mountComingSoonChrome({
  chrome,
  header,
}: {
  chrome: HTMLElement;
  header: HTMLElement | null;
}): (() => void) | null {
  if (!comingSoonEnabled()) return null;

  const showChrome = () => {
    gsap.set(chrome, { autoAlpha: 1, y: 0, pointerEvents: "auto" });
    if (header) gsap.set(header, { "--header-line": 1 });
    return () => {};
  };

  const dock = acquireComingSoonDock();
  if (!dock) return showChrome();

  const { timeline } = dock;
  const ctx = gsap.context(() => {
    timeline.fromTo(
      chrome,
      { autoAlpha: 0, y: -8, pointerEvents: "none" },
      {
        autoAlpha: 1,
        y: 0,
        pointerEvents: "auto",
        ease: "none",
        duration: COMING_SOON_LANDING,
      },
      0,
    );

    if (header) {
      timeline.fromTo(
        header,
        { "--header-line": 0 },
        { "--header-line": 1, ease: "none", duration: 1 },
        0,
      );
      timeline.fromTo(
        header,
        { "--header-solid": 0 },
        { "--header-solid": 1, ease: "none", duration: 1 - COMING_SOON_LANDING },
        COMING_SOON_LANDING,
      );
    }
  }, chrome);

  return once(() => {
    ctx.revert();
    dock.release();
  });
}
