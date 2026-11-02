/**
 * Holds ScrollTrigger refreshes while a touch scroll is in progress.
 *
 * On phones the URL bar collapsing or expanding resizes anything sized in
 * dvh (the coming-soon poster and its veil). Their ResizeObservers then asked
 * ScrollTrigger to refresh mid-gesture, which unpins, re-measures and re-pins
 * #home under the finger or during native momentum: a visible jump. ScrollTrigger's
 * own ignoreMobileResize does not cover these manual refreshes.
 *
 * On touch devices a refresh requested while a finger is down, or while scroll
 * events are still arriving, now runs once the scroll has settled. Requests
 * share a key, so the dock and the veil cost one refresh. Fine pointers
 * (desktop) refresh immediately, exactly as before.
 *
 * This gate is for ScrollTrigger.refresh only. Veil redraws use
 * scheduleVeilRedraw and must never wait for the settle timer.
 */

export { scheduleVeilRedraw } from "@/lib/veil-canvas-size";

/** Quiet time after the last touch or scroll event before held refreshes run. */
export const SCROLL_SETTLE_MS = 160;

/** Key shared by every ScrollTrigger.refresh request on the coming-soon home. */
export const SCROLL_TRIGGER_REFRESH_KEY = "scroll-trigger";

type GateTarget = {
  addEventListener: (
    type: string,
    listener: () => void,
    options?: AddEventListenerOptions,
  ) => void;
  removeEventListener: (type: string, listener: () => void) => void;
};

export type ScrollRefreshGate = {
  /** Runs `refresh` now (returns true) or holds it until the scroll settles (false). */
  request: (key: string, refresh: () => void) => boolean;
  isBusy: () => boolean;
  dispose: () => void;
};

const EVENTS = ["touchstart", "touchend", "touchcancel", "scroll"] as const;

export function createScrollRefreshGate({
  target,
  settleMs = SCROLL_SETTLE_MS,
  setTimer = (callback, ms) => setTimeout(callback, ms),
  clearTimer = (id) => clearTimeout(id as ReturnType<typeof setTimeout>),
}: {
  target: GateTarget;
  settleMs?: number;
  setTimer?: (callback: () => void, ms: number) => unknown;
  clearTimer?: (id: unknown) => void;
}): ScrollRefreshGate {
  let touching = false;
  let settling = false;
  let timer: unknown = null;
  const pending = new Map<string, () => void>();

  const flush = () => {
    if (touching || settling || pending.size === 0) return;
    const queued = [...pending.values()];
    pending.clear();
    queued.forEach((refresh) => refresh());
  };

  const settleLater = () => {
    settling = true;
    if (timer !== null) clearTimer(timer);
    timer = setTimer(() => {
      timer = null;
      settling = false;
      flush();
    }, settleMs);
  };

  const handlers: Record<(typeof EVENTS)[number], () => void> = {
    touchstart: () => {
      touching = true;
    },
    touchend: () => {
      touching = false;
      settleLater();
    },
    touchcancel: () => {
      touching = false;
      settleLater();
    },
    scroll: settleLater,
  };

  for (const type of EVENTS) {
    target.addEventListener(type, handlers[type], { passive: true });
  }

  return {
    request: (key, refresh) => {
      if (!touching && !settling) {
        refresh();
        return true;
      }
      pending.delete(key);
      pending.set(key, refresh);
      return false;
    },
    isBusy: () => touching || settling,
    dispose: () => {
      for (const type of EVENTS) target.removeEventListener(type, handlers[type]);
      if (timer !== null) clearTimer(timer);
      timer = null;
      pending.clear();
    },
  };
}

let shared: ScrollRefreshGate | null = null;

function coarsePointer(win: Window) {
  return typeof win.matchMedia === "function" && win.matchMedia("(pointer: coarse)").matches;
}

/**
 * The page-wide gate. Fine pointers, the server and any window without event
 * listeners run the refresh immediately.
 */
export function requestScrollSafeRefresh(key: string, refresh: () => void): boolean {
  const win = typeof window === "undefined" ? undefined : window;
  if (!win || typeof win.addEventListener !== "function" || !coarsePointer(win)) {
    refresh();
    return true;
  }
  shared ??= createScrollRefreshGate({ target: win });
  return shared.request(key, refresh);
}
