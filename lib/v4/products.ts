import { productPage } from "@/lib/copy";

export type ProductFamily = "express" | "halo" | "super" | "daily";

export type ProductSize = "S" | "M" | "L" | "XL" | "2XL" | "3XL";

const SHOP_ASSET = "/assets/v4/shop";

export type ProductHoverView = "front-detail" | "back";

export type ProductImages = {
  /** Empty string = no photo (placeholder block in UI). */
  main: string;
  thumbs: [string | null, string | null];
  mobileMain?: string;
  card: string;
  /** Shop card hover/focus image: front-detail by default, the back for SUPER tees whose print is on the back. */
  hover: string;
  /** "back" gets the turn reveal and the BACK PRINT label on the shop card; "front-detail" is the plain crossfade. */
  hoverView: ProductHoverView;
  /** Print close-up shown first on the PDP (Figma black tile). Only dispatch black has one. */
  printClose?: string;
};

export type StandardProduct = {
  id: string;
  slug: string;
  family: ProductFamily;
  shirtName: string;
  colourwayName: string;
  priceCents: number;
  shirtIndex: number;
  images: ProductImages;
  soldOutSizes?: ProductSize[];
};

/** Standard edition — R350 per status note until Marcus confirms range/3XL pricing. */
export const STANDARD_EDITION_PRICE_CENTS = 35_000;

export const STANDARD_EDITION_TOTAL = 9;

export const productFamilies: Record<
  ProductFamily,
  { title: string; copyLabel: string }
> = {
  express: { title: "PRODUCT EXPRESS", copyLabel: "swag express" },
  halo: { title: "PRODUCT HALO", copyLabel: "halo swag" },
  super: { title: "PRODUCT SUPER", copyLabel: "super swag" },
  daily: { title: "PRODUCT DAILY", copyLabel: "daily swag" },
};

function shopImages(
  key: string,
  opts: {
    thumbs?: [string | null, string | null];
    /** Explicit hover image. Omit for the front-detail crossfade. */
    hover?: { view: "back"; src: string };
  } = {},
): ProductImages {
  const base = `${SHOP_ASSET}/product-${key}`;
  const front = `${base}_front.jpg`;
  const detail = `${base}_front-detail.jpg`;
  return {
    main: front,
    thumbs: opts.thumbs ?? [detail, null],
    card: front,
    hover: opts.hover?.src ?? detail,
    hoverView: opts.hover?.view ?? "front-detail",
  };
}

/** SUPER tees carry their print on the back: hover/focus shows the back, and it is the 2nd PDP image. */
function backPrintImages(key: string): ProductImages {
  const base = `${SHOP_ASSET}/product-${key}`;
  const back = `${base}_back.jpg`;
  return shopImages(key, {
    thumbs: [back, `${base}_front-detail.jpg`],
    hover: { view: "back", src: back },
  });
}

/**
 * Catalog order and family grouping follow Figma landing frame 21:277.
 * Confirmed by Marcus (WhatsApp, 9 Nov 23:17 SAST): SUPER = Pulse (pink) + Rush (lime);
 * DAILY = Royal Department (blue) + Grey Department (black).
 * DRAFT: confirm with Marcus. Dispatch (EXPRESS) and Orbit (HALO) placement and colourways.
 */
export const standardProducts: StandardProduct[] = [
  {
    id: "express-dispatch-black",
    slug: "product-express-dispatch-black",
    family: "express",
    shirtName: "PRODUCT EXPRESS",
    colourwayName: "dispatch black",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 1,
    soldOutSizes: ["3XL"],
    images: {
      ...shopImages("express_dispatch-black"),
      printClose: `${SHOP_ASSET}/dispatch-black-cross-print.png`,
    },
  },
  {
    id: "express-dispatch-white",
    slug: "product-express-dispatch-white",
    family: "express",
    shirtName: "PRODUCT EXPRESS",
    colourwayName: "dispatch white",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 2,
    images: shopImages("express_dispatch-white"),
  },
  {
    id: "halo-orbit-pink",
    slug: "product-halo-orbit-pink",
    family: "halo",
    shirtName: "PRODUCT HALO",
    colourwayName: "orbit pink",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 3,
    images: shopImages("halo_orbit-pink"),
  },
  {
    id: "halo-orbit-black",
    slug: "product-halo-orbit-black",
    family: "halo",
    shirtName: "PRODUCT HALO",
    colourwayName: "orbit black",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 4,
    images: shopImages("halo_orbit-black"),
  },
  {
    id: "halo-orbit-white",
    slug: "product-halo-orbit-white",
    family: "halo",
    shirtName: "PRODUCT HALO",
    colourwayName: "orbit white",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 5,
    // DRAFT: zip folder is "White tee - Black print"; card uses front-full until a composite exists.
    images: shopImages("halo_orbit-white"),
  },
  {
    id: "super-rush",
    slug: "product-super-rush",
    // Confirmed: SUPER, Rush (lime).
    family: "super",
    shirtName: "PRODUCT SUPER",
    colourwayName: "rush",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 6,
    images: backPrintImages("super_rush"),
  },
  {
    id: "super-pulse",
    slug: "product-super-pulse",
    // Confirmed: SUPER, Pulse (pink). Replaces the old placeholder "speed".
    family: "super",
    shirtName: "PRODUCT SUPER",
    colourwayName: "pulse",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 7,
    images: backPrintImages("super_pulse"),
  },
  {
    id: "daily-grey-department",
    slug: "product-daily-grey-department",
    // Confirmed: DAILY, Grey Department (black).
    family: "daily",
    shirtName: "PRODUCT DAILY",
    colourwayName: "grey department",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 8,
    images: shopImages("daily_grey-department"),
  },
  {
    id: "daily-royal-department",
    slug: "product-daily-royal-department",
    // Confirmed: DAILY, Royal Department (blue).
    family: "daily",
    shirtName: "PRODUCT DAILY",
    colourwayName: "royal department",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 9,
    images: shopImages("daily_royal-department"),
  },
];

export function productBySlug(slug: string): StandardProduct | undefined {
  return standardProducts.find((p) => p.slug === slug);
}

export function productById(id: string): StandardProduct | undefined {
  return standardProducts.find((p) => p.id === id);
}

/** Link name for the shop card image: the product, plus the back print where the hover shows one. */
export function productCardLinkName(product: StandardProduct): string {
  const name = `${product.shirtName.toLowerCase()} — ${product.colourwayName}`;
  return productHasBackPrint(product) ? `${name}, back print` : name;
}

export function productHasBackPrint(product: StandardProduct): boolean {
  return product.images.hoverView === "back";
}

/** Every distinct PDP gallery image in display order: print close-up (if any), front, then the thumbs. */
export function productGalleryImages(product: StandardProduct): string[] {
  const main = galleryDesktopMain(product);
  const all = [
    ...(product.images.printClose ? [product.images.printClose] : []),
    ...(main ? [main] : []),
    ...galleryDesktopThumbs(product),
    ...galleryMobileSlides(product),
  ];
  return Array.from(new Set(all));
}

export type GalleryView = {
  src: string;
  /** Accessible and visible-name for the thumbnail, e.g. "Front", "Back print", "Front detail". */
  label: string;
};

function galleryViewLabel(src: string, index: number): string {
  const file = src.split("/").pop() ?? "";
  if (file.includes("print")) return "Print";
  if (file.endsWith("_front-detail.jpg")) return "Front detail";
  if (file.endsWith("_back-detail.jpg")) return "Back detail";
  if (file.endsWith("_back.jpg")) return "Back print";
  if (file.endsWith("_front.jpg")) return "Front";
  return `View ${index + 1}`;
}

export function productGalleryViews(product: StandardProduct): GalleryView[] {
  return productGalleryImages(product).map((src, i) => ({
    src,
    label: galleryViewLabel(src, i),
  }));
}

export function productCardImage(product: StandardProduct): string {
  return product.images.card || product.images.main;
}

export function formatPrice(cents: number): string {
  return `R${Math.round(cents / 100)}`;
}

export function colourwaySiblings(
  product: StandardProduct,
): StandardProduct[] {
  return standardProducts.filter(
    (p) =>
      p.family === product.family &&
      p.shirtName === product.shirtName &&
      p.slug !== product.slug,
  );
}

const RELATED_SLUGS = [
  "product-express-dispatch-white",
  "product-halo-orbit-pink",
  "product-halo-orbit-black",
] as const;

export function relatedProducts(): StandardProduct[] {
  return RELATED_SLUGS.map((slug) => productBySlug(slug)).filter(
    (p): p is StandardProduct => Boolean(p),
  );
}

function resolveThumbSrc(
  _product: StandardProduct,
  thumb: string | null,
): string | null {
  return thumb || null;
}

export function galleryDesktopMain(product: StandardProduct): string | null {
  return product.images.main || null;
}

export function galleryDesktopThumbs(product: StandardProduct): string[] {
  return product.images.thumbs
    .map((thumb) => resolveThumbSrc(product, thumb))
    .filter((src): src is string => Boolean(src));
}

export function galleryMobileSlides(product: StandardProduct): string[] {
  const slides: string[] = [];
  const first = product.images.mobileMain || product.images.main;
  if (first) slides.push(first);

  for (const raw of product.images.thumbs) {
    const resolved = resolveThumbSrc(product, raw);
    if (resolved && !slides.includes(resolved)) {
      slides.push(resolved);
    }
  }

  if (
    product.images.main &&
    product.images.main !== first &&
    !slides.includes(product.images.main)
  ) {
    slides.push(product.images.main);
  }

  return slides;
}

export function isSizeSoldOut(
  product: StandardProduct,
  size: ProductSize,
): boolean {
  return product.soldOutSizes?.includes(size) ?? false;
}

export type SizeButtonState = {
  soldOut: boolean;
  selectable: boolean;
  /** Accessible name: the size, plus the sold-out suffix from lib/copy.ts when unavailable. */
  label: string;
};

export function sizeButtonState(
  product: StandardProduct,
  size: ProductSize,
): SizeButtonState {
  const soldOut = isSizeSoldOut(product, size);
  return {
    soldOut,
    selectable: !soldOut,
    label: soldOut ? `${size} ${productPage.soldOutSuffix}` : size,
  };
}

/** Size to keep when switching colourway: the same size if it is on sale in the new one, otherwise none. */
export function sizeAfterColourwaySwitch(
  next: StandardProduct,
  size: ProductSize | null,
): ProductSize | null {
  return size && !isSizeSoldOut(next, size) ? size : null;
}

export const deliveryOptions = [
  { id: "paxi-economy", label: "economy — 7 to 9 business days", priceCents: 6000 },
  { id: "paxi-speed", label: "speed — 3 to 5 business days", priceCents: 11000 },
  { id: "paxi-door", label: "door-to-door — on request", priceCents: 12000 },
] as const;

export const productSpecRows = [
  { label: "WEIGHT", value: "220gsm" },
  { label: "FABRIC", value: "100% cotton" },
  { label: "FIT", value: "adult unisex" },
  { label: "NECK", value: "crew neck" },
  { label: "SLEEVE", value: "short sleeve" },
] as const;

export const productMakeTable = [
  { label: "WEIGHT", value: "220gsm" },
  { label: "FABRIC", value: "100% cotton" },
  { label: "GARMENTS", value: "t-shirt — nine designs" },
  { label: "FIT", value: "adult unisex — crew neck, short sleeve" },
  { label: "DESPATCH", value: "paxi — delivery extra (R60 / R110)" },
  { label: "EDITION STATUS", value: "always available — never closes" },
  { label: "MADE", value: "printed to order — packed by hand" },
] as const;
