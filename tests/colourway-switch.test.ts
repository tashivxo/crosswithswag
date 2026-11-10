import { describe, expect, it } from "vitest";
import {
  colourwaySiblings,
  productBySlug,
  sizeAfterColourwaySwitch,
  standardProducts,
} from "@/lib/v4/products";

describe("colourway switching", () => {
  it("keeps the chosen size when the new colourway has it on sale", () => {
    const white = productBySlug("product-express-dispatch-white")!;
    expect(sizeAfterColourwaySwitch(white, "M")).toBe("M");
  });

  it("clears the size when the new colourway is sold out in it", () => {
    const black = productBySlug("product-express-dispatch-black")!;
    expect(black.soldOutSizes).toContain("3XL");
    expect(sizeAfterColourwaySwitch(black, "3XL")).toBeNull();
  });

  it("keeps no size when none was chosen", () => {
    const white = productBySlug("product-express-dispatch-white")!;
    expect(sizeAfterColourwaySwitch(white, null)).toBeNull();
  });

  it("offers the confirmed SUPER and DAILY colourways as siblings", () => {
    const pulse = productBySlug("product-super-pulse")!;
    expect(colourwaySiblings(pulse).map((p) => p.slug)).toEqual([
      "product-super-rush",
    ]);
    const royal = productBySlug("product-daily-royal-department")!;
    expect(colourwaySiblings(royal).map((p) => p.slug)).toEqual([
      "product-daily-grey-department",
    ]);
  });

  it("gives every product a slug that productBySlug resolves", () => {
    for (const product of standardProducts) {
      expect(productBySlug(product.slug)).toBe(product);
    }
  });
});
