import { getLenis } from "@/lib/lenis";
import { INITIAL_SIZE } from "@/lib/v4/pdp-url";
import {
  sizeAfterColourwaySwitch,
  type ProductSize,
  type StandardProduct,
} from "@/lib/v4/products";

/** One wearable: family + shirt name. Colourways of that shirt share this key; slugs do not. */
export function shirtKey(product: StandardProduct): string {
  return `${product.family}:${product.shirtName}`;
}

export function isSameShirt(a: StandardProduct, b: StandardProduct): boolean {
  return shirtKey(a) === shirtKey(b);
}

export type PdpProductChange = {
  size: ProductSize | null;
  resetGallery: boolean;
  /** Scroll to top and move focus to the product heading. */
  announceShirt: boolean;
};

/**
 * How the PDP should react when the visible product changes.
 * Colourway of the same shirt keeps size (if in stock), gallery index, scroll and focus.
 * A different shirt is a fresh PDP. First paint (`from` null) does not announce.
 */
export function applyPdpProductChange(
  from: StandardProduct | null,
  to: StandardProduct,
  selectedSize: ProductSize | null,
): PdpProductChange {
  if (!from || from.slug === to.slug) {
    return { size: selectedSize, resetGallery: false, announceShirt: false };
  }
  if (isSameShirt(from, to)) {
    return {
      size: sizeAfterColourwaySwitch(to, selectedSize),
      resetGallery: false,
      announceShirt: false,
    };
  }
  return { size: INITIAL_SIZE, resetGallery: true, announceShirt: true };
}

/** Never smooth: Lenis and window both jump. Reduced motion is the same jump. */
export function pdpScrollToTopOptions(reducedMotion: boolean): {
  behavior: "auto";
  immediate: true;
} {
  if (reducedMotion) {
    return { behavior: "auto", immediate: true };
  }
  return { behavior: "auto", immediate: true };
}

export function scrollPdpToTop(reducedMotion = false): void {
  const { immediate, behavior } = pdpScrollToTopOptions(reducedMotion);
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { immediate });
  }
  window.scrollTo({ top: 0, left: 0, behavior });
}
