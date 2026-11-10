import { describe, expect, it } from "vitest";
import {
  addToLines,
  cartCount,
  cartSubtotalCents,
  lineId,
  orderTotalCents,
  removeFromLines,
  setLineQuantity,
} from "@/lib/v4/cart/cart-math";
import { deliveryOptions, productBySlug } from "@/lib/v4/products";

const black = productBySlug("product-express-dispatch-black")!;
const white = productBySlug("product-express-dispatch-white")!;

describe("addToLines", () => {
  it("adds a line carrying colourway and the chosen size", () => {
    const lines = addToLines([], black, "M");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatchObject({
      lineId: lineId(black.id, "M"),
      productId: black.id,
      colourway: black.colourwayName,
      size: "M",
      quantity: 1,
      unitPriceCents: black.priceCents,
    });
  });

  it("merges the same colourway and size, but keeps another size or colourway apart", () => {
    let lines = addToLines([], black, "M");
    lines = addToLines(lines, black, "M");
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(2);
    lines = addToLines(lines, black, "L");
    lines = addToLines(lines, white, "M");
    expect(lines).toHaveLength(3);
  });

  it("does not mutate the previous lines", () => {
    const before = addToLines([], black, "S");
    const frozen = JSON.stringify(before);
    addToLines(before, black, "S");
    expect(JSON.stringify(before)).toBe(frozen);
  });
});

describe("setLineQuantity", () => {
  const start = addToLines(addToLines([], black, "M"), white, "L");

  it("sets a quantity on the matching line only", () => {
    const next = setLineQuantity(start, lineId(black.id, "M"), 3);
    expect(next[0].quantity).toBe(3);
    expect(next[1].quantity).toBe(1);
  });

  it("removes the line at zero or below", () => {
    expect(setLineQuantity(start, lineId(black.id, "M"), 0)).toHaveLength(1);
    expect(setLineQuantity(start, lineId(black.id, "M"), -2)).toHaveLength(1);
  });

  it("ignores an unknown line id", () => {
    expect(setLineQuantity(start, "nope", 4)).toEqual(start);
  });
});

describe("removeFromLines", () => {
  it("removes by id", () => {
    const lines = addToLines(addToLines([], black, "M"), white, "L");
    const next = removeFromLines(lines, lineId(white.id, "L"));
    expect(next.map((l) => l.lineId)).toEqual([lineId(black.id, "M")]);
  });
});

describe("totals (ZAR cents)", () => {
  it("counts shirts and sums unit price times quantity", () => {
    let lines = addToLines([], black, "M");
    lines = setLineQuantity(lines, lineId(black.id, "M"), 2);
    lines = addToLines(lines, white, "L");
    expect(cartCount(lines)).toBe(3);
    expect(cartSubtotalCents(lines)).toBe(black.priceCents * 2 + white.priceCents);
  });

  it("is zero for an empty cart", () => {
    expect(cartCount([])).toBe(0);
    expect(cartSubtotalCents([])).toBe(0);
  });

  it("adds the delivery option price to the subtotal", () => {
    const lines = addToLines([], black, "M");
    const subtotal = cartSubtotalCents(lines);
    for (const option of deliveryOptions) {
      expect(orderTotalCents(subtotal, option.priceCents)).toBe(
        subtotal + option.priceCents,
      );
    }
  });

  it("charges no delivery on an empty cart", () => {
    expect(orderTotalCents(0, deliveryOptions[0].priceCents)).toBe(0);
  });
});
