import {
  productCardImage,
  type ProductSize,
  type StandardProduct,
} from "@/lib/v4/products";

export type CartLine = {
  lineId: string;
  productId: string;
  slug: string;
  title: string;
  colourway: string;
  size: ProductSize;
  unitPriceCents: number;
  quantity: number;
  imageSrc: string;
};

export function lineId(productId: string, size: ProductSize): string {
  return `${productId}:${size}`;
}

export function addToLines(
  lines: CartLine[],
  product: StandardProduct,
  size: ProductSize,
): CartLine[] {
  const id = lineId(product.id, size);
  if (lines.some((l) => l.lineId === id)) {
    return lines.map((l) =>
      l.lineId === id ? { ...l, quantity: l.quantity + 1 } : l,
    );
  }
  return [
    ...lines,
    {
      lineId: id,
      productId: product.id,
      slug: product.slug,
      title: product.shirtName,
      colourway: product.colourwayName,
      size,
      unitPriceCents: product.priceCents,
      quantity: 1,
      imageSrc: productCardImage(product),
    },
  ];
}

export function removeFromLines(lines: CartLine[], id: string): CartLine[] {
  return lines.filter((l) => l.lineId !== id);
}

/** A quantity of zero or below removes the line. */
export function setLineQuantity(
  lines: CartLine[],
  id: string,
  quantity: number,
): CartLine[] {
  if (quantity <= 0) return removeFromLines(lines, id);
  return lines.map((l) => (l.lineId === id ? { ...l, quantity } : l));
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.quantity, 0);
}

export function cartSubtotalCents(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.unitPriceCents * l.quantity, 0);
}

export function orderTotalCents(
  subtotalCents: number,
  deliveryCents: number,
): number {
  return subtotalCents === 0 ? 0 : subtotalCents + deliveryCents;
}
