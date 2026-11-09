import { describe, expect, it } from "vitest";
import { INITIAL_SIZE, pdpPath, stripSizeParam } from "@/lib/v4/pdp-url";
import { sizeAfterColourwaySwitch, productBySlug } from "@/lib/v4/products";

describe("PDP initial size", () => {
  it("opens with no size selected", () => {
    expect(INITIAL_SIZE).toBeNull();
  });

  it("switching colourway from the initial state still has no size", () => {
    const white = productBySlug("product-express-dispatch-white")!;
    expect(sizeAfterColourwaySwitch(white, INITIAL_SIZE)).toBeNull();
  });
});

describe("PDP URL", () => {
  it("carries only the colourway", () => {
    const url = pdpPath("/current", "product-express-dispatch-black", "#size-guide");
    expect(url).toBe("/current?product=product-express-dispatch-black#size-guide");
    expect(url).not.toMatch(/size=/);
  });

  it("strips a size param and keeps the rest", () => {
    expect(stripSizeParam("?product=x&size=M")).toBe("?product=x");
    expect(stripSizeParam("?size=3XL&product=x")).toBe("?product=x");
    expect(stripSizeParam("?size=M")).toBe("");
  });

  it("leaves a URL with no size alone", () => {
    expect(stripSizeParam("?product=x")).toBeNull();
    expect(stripSizeParam("")).toBeNull();
  });
});
