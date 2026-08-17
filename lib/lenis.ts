import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export function setLenis(lenis: Lenis | null) {
  lenisInstance = lenis;
}
