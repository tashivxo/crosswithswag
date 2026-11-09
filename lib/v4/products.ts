export type ProductFamily = "express" | "halo" | "super" | "daily";

export type ProductSize = "S" | "M" | "L" | "XL" | "2XL" | "3XL";

const SHOP_ASSET = "/assets/v4/shop";

export type ProductImages = {
  /** Empty string = no photo (placeholder block in UI). */
  main: string;
  thumbs: [string | null, string | null];
  mobileMain?: string;
  card: string;
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
    card?: "composite" | "front";
    thumbs?: [string | null, string | null];
  } = {},
): ProductImages {
  const base = `${SHOP_ASSET}/product-${key}`;
  const front = `${base}_front.jpg`;
  return {
    main: front,
    thumbs: opts.thumbs ?? [`${base}_front-detail.jpg`, null],
    card: opts.card === "front" ? front : `${base}.jpg`,
  };
}

/**
 * Catalog order and family grouping follow Figma landing frame 21:277.
 * DRAFT: confirm with Marcus. The products zip names Dispatch, Orbit, Rush, Pulse,
 * Grey Department and Royal Department only. SUPER and DAILY family labels are
 * inferred from Figma, not from the zip.
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
    images: shopImages("express_dispatch-black", {
      thumbs: [
        `${SHOP_ASSET}/product-express_dispatch-black_front-detail.jpg`,
        `${SHOP_ASSET}/dispatch-black-cross-print.png`,
      ],
    }),
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
    // DRAFT: zip folder is "White tee - Black print"; the Figma card is a front + back composite we do not have.
    images: shopImages("halo_orbit-white", { card: "front" }),
  },
  {
    id: "super-rush",
    slug: "product-super-rush",
    // DRAFT: confirm with Marcus. Zip folder is "Rush"; SUPER family inferred from Figma.
    family: "super",
    shirtName: "PRODUCT SUPER",
    colourwayName: "rush",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 6,
    images: shopImages("super_rush", {
      thumbs: [
        `${SHOP_ASSET}/product-super_rush_front-detail.jpg`,
        `${SHOP_ASSET}/product-super_rush_back.jpg`,
      ],
    }),
  },
  {
    id: "super-pulse",
    slug: "product-super-pulse",
    // DRAFT: confirm with Marcus. Zip folder is "Pulse" (replaces the old placeholder "speed");
    // SUPER family inferred from Figma.
    family: "super",
    shirtName: "PRODUCT SUPER",
    colourwayName: "pulse",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 7,
    images: shopImages("super_pulse", {
      thumbs: [
        `${SHOP_ASSET}/product-super_pulse_front-detail.jpg`,
        `${SHOP_ASSET}/product-super_pulse_back.jpg`,
      ],
    }),
  },
  {
    id: "daily-grey-department",
    slug: "product-daily-grey-department",
    // DRAFT: confirm with Marcus. Zip folder is "Grey Department"; DAILY family inferred from Figma.
    family: "daily",
    shirtName: "PRODUCT DAILY",
    colourwayName: "grey department",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 8,
    images: shopImages("daily_grey-department", { card: "front" }),
  },
  {
    id: "daily-royal-department",
    slug: "product-daily-royal-department",
    // DRAFT: confirm with Marcus. Zip folder is "Royal Department"; DAILY family inferred from Figma.
    family: "daily",
    shirtName: "PRODUCT DAILY",
    colourwayName: "royal department",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 9,
    images: shopImages("daily_royal-department", { card: "front" }),
  },
];

export function productBySlug(slug: string): StandardProduct | undefined {
  return standardProducts.find((p) => p.slug === slug);
}

export function productById(id: string): StandardProduct | undefined {
  return standardProducts.find((p) => p.id === id);
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
