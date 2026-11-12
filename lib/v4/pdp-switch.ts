import { getLenis } from "@/lib/lenis";
import { meta } from "@/lib/copy";
import { INITIAL_SIZE, pdpPath } from "@/lib/v4/pdp-url";
import {
  productBySlug,
  sizeAfterColourwaySwitch,
  type GalleryView,
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

/** Keep Front on Front (not numeric index). Missing view → image 1 (index 0). */
export function galleryIndexForView(
  views: GalleryView[],
  label: string | undefined,
): number {
  if (!label || views.length === 0) return 0;
  const found = views.findIndex((view) => view.label === label);
  return found >= 0 ? found : 0;
}

/** `%s` in the root title template `SWAG — %s`. Names come from catalog data. */
export function pdpMetadataTitle(product: StandardProduct): string {
  return `${product.shirtName.toLowerCase()} — ${product.colourwayName}`;
}

export function pdpDocumentTitle(product: StandardProduct): string {
  const template = `${meta.title} — %s`;
  return template.replace("%s", pdpMetadataTitle(product));
}

export type PendingColourway = { from: string; to: string };

export type ColourwayClickPlan = {
  pending: PendingColourway;
  url: string;
  /** Paint `pending.to` urgently; let `router.replace` run inside startTransition. */
  routerSync: "transition";
};

/**
 * Colourway click: the visible product is `pending.to` in the same frame.
 * `router.replace` is a transition so a force-dynamic RSC does not block that paint.
 * The URL stays the source of truth for loads, back/forward, and Links once it catches up.
 */
export function colourwayClickPlan({
  currentSlug,
  nextSlug,
  pathname,
  hash,
}: {
  currentSlug: string;
  nextSlug: string;
  pathname: string;
  hash: string;
}): ColourwayClickPlan | null {
  if (!productBySlug(nextSlug) || nextSlug === currentSlug) return null;
  return {
    pending: { from: currentSlug, to: nextSlug },
    url: pdpPath(pathname, nextSlug, hash),
    routerSync: "transition",
  };
}

/**
 * Until useSearchParams catches up with a colourway click, keep the pending slug
 * so the UI still switches. A urlSlug that is neither from nor to (related card,
 * back/forward) wins.
 */
export function visiblePdpSlug({
  urlSlug,
  pending,
  fallback,
}: {
  urlSlug: string;
  pending: PendingColourway | null;
  fallback: string;
}): { slug: string; pending: PendingColourway | null } {
  const url = urlSlug || fallback;
  if (!pending) return { slug: url, pending: null };
  if (url === pending.to) return { slug: url, pending: null };
  if (url === pending.from) return { slug: pending.to, pending };
  return { slug: url, pending: null };
}
