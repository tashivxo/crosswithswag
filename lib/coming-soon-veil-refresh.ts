import { gsap } from "gsap";
import { comingSoonEnabled } from "@/lib/coming-soon";

type ScrollTriggerLike = { refresh?: () => void };

// Reads the plugin from gsap's registry so this module never registers or
// imports ScrollTrigger itself; it is a no-op until something else has.
function registeredScrollTrigger(): ScrollTriggerLike | undefined {
  const core = gsap.core as unknown as {
    globals?: () => Record<string, unknown>;
  };
  return core.globals?.().ScrollTrigger as ScrollTriggerLike | undefined;
}

export function refreshScrollTrigger(
  getScrollTrigger: () => ScrollTriggerLike | undefined = registeredScrollTrigger,
): boolean {
  if (!comingSoonEnabled()) return false;
  const scrollTrigger = getScrollTrigger();
  if (typeof scrollTrigger?.refresh !== "function") return false;
  scrollTrigger.refresh();
  return true;
}

type WatchOptions = {
  refresh?: () => unknown;
  debounceMs?: number;
  raf?: (callback: () => void) => number;
  cancelRaf?: (id: number) => void;
  ResizeObserverImpl?: typeof ResizeObserver;
};

/**
 * Refreshes ScrollTrigger once after the veil first lays out, then again on a
 * debounced resize. Returns a cleanup that cancels pending work.
 */
export function watchVeilLayout(
  element: Element,
  {
    refresh = refreshScrollTrigger,
    debounceMs = 150,
    raf = (callback) => requestAnimationFrame(callback),
    cancelRaf = (id) => cancelAnimationFrame(id),
    ResizeObserverImpl = globalThis.ResizeObserver,
  }: WatchOptions = {},
): () => void {
  if (!ResizeObserverImpl) return () => {};

  let first = true;
  let rafId: number | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const observer = new ResizeObserverImpl(() => {
    if (first) {
      first = false;
      // Wait a frame so DarkVeil's own resize has sized the canvas.
      rafId = raf(() => {
        rafId = null;
        refresh();
      });
      return;
    }
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      refresh();
    }, debounceMs);
  });
  observer.observe(element);

  return () => {
    observer.disconnect();
    if (rafId !== null) cancelRaf(rafId);
    if (timer !== null) clearTimeout(timer);
    rafId = null;
    timer = null;
  };
}
