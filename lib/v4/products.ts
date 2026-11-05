export type ProductFamily = "express" | "halo" | "super" | "daily";

export type ProductSize = "S" | "M" | "L" | "XL" | "2XL" | "3XL";

export type StandardProduct = {
  id: string;
  slug: string;
  family: ProductFamily;
  shirtName: string;
  colourwayName: string;
  priceCents: number;
  imageSlot?: string;
};

/** Standard edition — R350 per status note until Marcus confirms range/3XL pricing. */
export const STANDARD_EDITION_PRICE_CENTS = 35_000;

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
  },
  {
    id: "express-dispatch-white",
    slug: "product-express-dispatch-white",
    family: "express",
    shirtName: "PRODUCT EXPRESS",
    colourwayName: "dispatch white",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
  },
  {
    id: "halo-orbit-pink",
    slug: "product-halo-orbit-pink",
    family: "halo",
    shirtName: "PRODUCT HALO",
    colourwayName: "orbit pink",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
  },
  {
    id: "super-rush",
    slug: "product-super-rush",
    family: "super",
    shirtName: "PRODUCT SUPER",
    colourwayName: "rush",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
  },
  {
    id: "daily-grey-department",
    slug: "product-daily-grey-department",
    family: "daily",
    shirtName: "PRODUCT DAILY",
    colourwayName: "grey department",
    priceCents: STANDARD_EDITION_PRICE_CENTS,
  },
];

export function productBySlug(slug: string): StandardProduct | undefined {
  return standardProducts.find((p) => p.slug === slug);
}

export function formatPrice(cents: number): string {
  return `R${Math.round(cents / 100)}`;
}

export const deliveryOptions = [
  { id: "paxi-economy", label: "economy — 7 to 9 business days", priceCents: 6000 },
  { id: "paxi-speed", label: "speed — 3 to 5 business days", priceCents: 11000 },
  { id: "paxi-door", label: "door-to-door — on request", priceCents: 12000 },
] as const;
