import { getLenis } from "@/lib/lenis";

export const HOME_INTRO_SEEN_KEY = "swag:home-intro-seen";

const CHAPTER_HEAD_IDS: Record<string, string> = {
  "/": "home-hero",
  "/current": "current",
  "/archive": "archive",
  "/manifesto": "manifesto",
  "/contact": "contact",
};

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

export function homeLandingY(): number {
  const hero = document.getElementById("home-hero");
  if (!hero) return 0;
  return elementDocumentY(hero);
}

export function scrollPageTo(
  target: number | HTMLElement,
  options?: { immediate?: boolean },
): void {
  const immediate = options?.immediate ?? prefersReducedMotion();
  const lenis = getLenis();

  if (typeof target === "number") {
    if (lenis) {
      lenis.scrollTo(target, { immediate });
    } else {
      window.scrollTo({
        top: target,
        behavior: immediate ? "auto" : "smooth",
      });
    }
    return;
  }

  const y = elementDocumentY(target);
  if (lenis) {
    lenis.scrollTo(y, { immediate });
  } else if (immediate) {
    window.scrollTo(0, y);
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
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

export function scrollToChapterHead(path: string): void {
  const normalized = path === "/" ? "/" : path.replace(/\/$/, "");

  if (normalized === "/") {
    scrollToHomeLanding();
    return;
  }

  const id = CHAPTER_HEAD_IDS[normalized];
  if (!id) {
    scrollPageTo(0, { immediate: true });
    return;
  }

  const element = document.getElementById(id);
  if (element) {
    scrollPageTo(element);
  } else {
    scrollPageTo(0, { immediate: true });
  }
}
