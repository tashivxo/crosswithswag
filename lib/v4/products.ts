export type ProductFamily = "express" | "halo" | "super" | "daily";

export type ProductSize = "S" | "M" | "L" | "XL" | "2XL" | "3XL";

const SHOP_ASSET = "/assets/v4/shop";

export type ProductImages = {
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
      main: `${SHOP_ASSET}/dispatch-black-cross-print.png`,
      thumbs: [`${SHOP_ASSET}/dispatch-black-shirt.png`, null],
      mobileMain: `${SHOP_ASSET}/dispatch-black-shirt.png`,
      card: `${SHOP_ASSET}/dispatch-black-shirt.png`,
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
    images: {
      main: `${SHOP_ASSET}/dispatch-white-shirt.png`,
      thumbs: [null, null],
      mobileMain: `${SHOP_ASSET}/dispatch-white-shirt-mobile.png`,
      card: `${SHOP_ASSET}/dispatch-white-shirt.png`,
    },
  },
  {
    id: "halo-orbit-pink",
    slug: "product-halo-orbit-pink",
    family: "halo",
    shirtName: "PRODUCT HALO",
    colourwayName: "orbit pink",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 3,
    images: {
      main: `${SHOP_ASSET}/orbit-pink-shirt.png`,
      thumbs: [null, null],
      mobileMain: `${SHOP_ASSET}/orbit-pink-shirt-mobile.png`,
      card: `${SHOP_ASSET}/orbit-pink-shirt.png`,
    },
  },
  {
    id: "halo-orbit-black",
    slug: "product-halo-orbit-black",
    family: "halo",
    shirtName: "PRODUCT HALO",
    colourwayName: "orbit black",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 4,
    images: {
      main: `${SHOP_ASSET}/orbit-black-shirt.png`,
      thumbs: [null, null],
      mobileMain: `${SHOP_ASSET}/orbit-black-shirt-mobile.png`,
      card: `${SHOP_ASSET}/orbit-black-shirt.png`,
    },
  },
  {
    id: "super-rush",
    slug: "product-super-rush",
    family: "super",
    shirtName: "PRODUCT SUPER",
    colourwayName: "rush",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 5,
    images: {
      main: `${SHOP_ASSET}/orbit-pink-shirt.png`,
      thumbs: [null, null],
      card: `${SHOP_ASSET}/orbit-pink-shirt.png`,
    },
  },
  {
    id: "daily-grey-department",
    slug: "product-daily-grey-department",
    family: "daily",
    shirtName: "PRODUCT DAILY",
    colourwayName: "grey department",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
    shirtIndex: 6,
    images: {
      main: `${SHOP_ASSET}/dispatch-white-shirt.png`,
      thumbs: [null, null],
      card: `${SHOP_ASSET}/dispatch-white-shirt.png`,
    },
  },
];

export function productBySlug(slug: string): StandardProduct | undefined {
  return standardProducts.find((p) => p.slug === slug);
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

export function relatedProducts(currentSlug: string): StandardProduct[] {
  return RELATED_SLUGS.filter((slug) => slug !== currentSlug)
    .map((slug) => productBySlug(slug))
    .filter((p): p is StandardProduct => Boolean(p));
}

export function isSizeSoldOut(
  product: StandardProduct,
  size: ProductSize,
): boolean {
  return product.soldOutSizes?.includes(size) ?? false;
}

export function gallerySlides(product: StandardProduct): (string | null)[] {
  return [product.images.main, ...product.images.thumbs];
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
