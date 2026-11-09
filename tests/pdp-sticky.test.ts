import { describe, expect, it } from "vitest";
import { isStickyBarHidden } from "@/lib/v4/pdp-sticky";

describe("isStickyBarHidden", () => {
  it("hides the sticky bar while the main ADD TO CART is in the viewport", () => {
    expect(isStickyBarHidden(true)).toBe(true);
  });

  it("shows the sticky bar once the main ADD TO CART has scrolled out", () => {
    expect(isStickyBarHidden(false)).toBe(false);
  });

  it("keeps the bar visible until the observer has reported", () => {
    expect(isStickyBarHidden(null)).toBe(false);
    expect(isStickyBarHidden(undefined)).toBe(false);
  });
});
