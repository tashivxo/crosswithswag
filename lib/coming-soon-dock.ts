import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { comingSoonEnabled } from "@/lib/coming-soon";

gsap.registerPlugin(ScrollTrigger);

export const COMING_SOON_DOCK_ATTR = "data-cs-dock";

/** Timeline position where the mark lands in the nav slot. The header fills solid only in the 5% after it. */
export const COMING_SOON_LANDING = 0.95;

/** The label starts fading at this share of the flight (0.8 * landing on the timeline). */
export const LABEL_FADE_START = 0.8;

/** Timeline length of the label fade. Ends well before the landing so label and mark never overlap. */
export const LABEL_FADE_SPAN = 0.1;

/** Upward drift of the label while it fades, in px. */
export const LABEL_DRIFT_PX = 5;

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

const FIT_TOLERANCE = 2;

type FlightState = "idle" | "flying";

export type ComingSoonDock = {
  timeline: gsap.core.Timeline;
  home: HTMLElement;
  release: () => void;
};

type Shared = {
  timeline: gsap.core.Timeline;
  home: HTMLElement;
  refs: number;
  observer: ResizeObserver | null;
  refreshQueued: boolean;
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

  if (!shared) {
    const home = document.getElementById("home");
    if (!home) return null;
    // Pinning a poster taller than the viewport would cut the form off for the
    // whole pin. Short screens get the static docked nav instead.
    if (home.offsetHeight > window.innerHeight + FIT_TOLERANCE) return null;

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
        onRefresh: (self: { progress: number }) =>
          setFlightState(flightStateFor(self.progress)),
      },
    });
    timeline.to({}, { duration: 1 }, 0);

    const state: Shared = {
      timeline,
      home,
      refs: 0,
      observer: null,
      refreshQueued: false,
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

  if (prefersReducedMotion()) {
    // The mark is docked from load, so the poster label would sit under it:
    // hide it from first paint (CSS does the same before scripts run).
    const label = document
      .getElementById("home")
      ?.querySelector<HTMLElement>(".cs-label--top");
    if (label) gsap.set(label, { opacity: 0 });
    const undock = showDocked();
    return () => {
      undock();
      if (label) gsap.set(label, { clearProps: "opacity" });
    };
  }

  const dock = acquireComingSoonDock();
  const poster = dock?.home.querySelector<HTMLElement>(".cs-wordmark") ?? null;
  if (!dock || !poster) {
    dock?.release();
    return showDocked();
  }

  const { home, timeline } = dock;
  const label = home.querySelector<HTMLElement>(".cs-label--top");
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
          ease: "none",
          duration: LABEL_FADE_SPAN,
        },
        LABEL_FADE_START * COMING_SOON_LANDING,
      );
    }
  }, layer);

  return once(() => {
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
