import { describe, expect, it } from "vitest";
import { productPage } from "@/lib/copy";
import { productBySlug, sizeButtonState } from "@/lib/v4/products";

describe("sizeButtonState", () => {
  const black = productBySlug("product-express-dispatch-black")!;
  const white = productBySlug("product-express-dispatch-white")!;

  it("marks a sold-out size unselectable and appends the sold-out suffix", () => {
    expect(black.soldOutSizes).toContain("3XL");
    const state = sizeButtonState(black, "3XL");
    expect(state.soldOut).toBe(true);
    expect(state.selectable).toBe(false);
    expect(state.label).toBe(`3XL ${productPage.soldOutSuffix}`);
    expect(productPage.soldOutSuffix).toBe("sold out");
  });

  it("leaves an available size selectable with a plain name", () => {
    const state = sizeButtonState(black, "M");
    expect(state).toEqual({ soldOut: false, selectable: true, label: "M" });
  });

  it("is per product: the same size can be on sale in another colourway", () => {
    expect(sizeButtonState(white, "3XL").selectable).toBe(true);
  });
});
