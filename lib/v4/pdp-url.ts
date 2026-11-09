import type { ProductSize } from "@/lib/v4/products";

/** /current opens with no size picked; a size is only ever the shopper's own choice. */
export const INITIAL_SIZE: ProductSize | null = null;

/** Shared URLs carry the colourway only, never a size. */
export function pdpPath(pathname: string, slug: string, hash = ""): string {
  return `${pathname}?product=${encodeURIComponent(slug)}${hash}`;
}

/**
 * Returns the query string without any `size` param (with its leading "?", or "" when nothing is left),
 * or null when there was no size param to strip.
 */
export function stripSizeParam(search: string): string | null {
  const params = new URLSearchParams(search);
  if (!params.has("size")) return null;
  params.delete("size");
  const rest = params.toString();
  return rest ? `?${rest}` : "";
}
