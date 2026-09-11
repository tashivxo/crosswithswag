import { getLenis } from "@/lib/lenis";
import { chapterByPath } from "@/lib/sections.config";

export const HOME_INTRO_SEEN_KEY = "swag:home-intro-seen";

const RESTORE_DELAYS_MS = [0, 50, 220, 360];

let restoreTimers: number[] = [];
let restoreFrame = 0;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isHomeIntroSeen(): boolean {
  try {
    return sessionStorage.getItem(HOME_INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markHomeIntroSeen(): void {
  try {
    sessionStorage.setItem(HOME_INTRO_SEEN_KEY, "1");
  } catch {
    // sessionStorage unavailable
  }
}

function elementDocumentY(element: HTMLElement): number {
  return element.getBoundingClientRect().top + window.scrollY;
}

function hardScrollTo(y: number): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(y, { immediate: true });
  }

  const html = document.documentElement;
  const body = document.body;
  html.scrollTop = y;
  body.scrollTop = y;
  window.scrollTo(0, y);
  window.scrollTo({ top: y, left: 0, behavior: "auto" });
}

export function scrollPageTo(
  target: number | HTMLElement,
  options?: { immediate?: boolean },
): void {
  const immediate = options?.immediate ?? prefersReducedMotion();
  const y = typeof target === "number" ? target : elementDocumentY(target);

  if (immediate) {
    hardScrollTo(y);
    return;
  }

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(y, { immediate: false });
    return;
  }

  if (typeof target !== "number") {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  window.scrollTo({ top: y, behavior: "smooth" });
}

export function scrollToHomeLanding(options?: { immediate?: boolean }): void {
  markHomeIntroSeen();
  const hero = document.getElementById("home-hero");
  if (!hero) {
    scrollPageTo(0, options);
    return;
  }
  scrollPageTo(hero, options);
}

function chapterHeadElement(path: string): HTMLElement | null {
  const chapter = chapterByPath(path);
  if (chapter) {
    const named = document.getElementById(chapter.headId);
    if (named) return named;
  }

  const fallback = path === "/" ? "home" : path.replace(/^\//, "");
  return document.getElementById(fallback);
}

export function restoreRouteScroll(path: string): void {
  const chapter = chapterByPath(path);
  const reduceMotion = prefersReducedMotion();

  if (chapter?.id === "home") {
    if (isHomeIntroSeen() || reduceMotion) {
      scrollToHomeLanding({ immediate: true });
    } else {
      scrollPageTo(0, { immediate: true });
    }
    return;
  }

  scrollPageTo(0, { immediate: true });
  const head = chapterHeadElement(path);
  if (head) {
    head.scrollIntoView({ block: "start", behavior: "auto" });
    hardScrollTo(Math.max(0, elementDocumentY(head)));
    try {
      head.focus({ preventScroll: true });
    } catch {
      head.focus();
    }
  }
}

export function cancelRouteScroll(): void {
  restoreTimers.forEach((timer) => window.clearTimeout(timer));
  restoreTimers = [];
  if (restoreFrame) {
    window.cancelAnimationFrame(restoreFrame);
    restoreFrame = 0;
  }
}

export function queueRouteScroll(path: string): () => void {
  cancelRouteScroll();
  restoreRouteScroll(path);

  restoreFrame = window.requestAnimationFrame(() => {
    restoreRouteScroll(path);
    restoreFrame = 0;
  });

  restoreTimers = RESTORE_DELAYS_MS.map((delay) =>
    window.setTimeout(() => restoreRouteScroll(path), delay),
  );

  return cancelRouteScroll;
}
