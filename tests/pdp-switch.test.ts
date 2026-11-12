import { describe, expect, it } from "vitest";
import { addToLines } from "@/lib/v4/cart/cart-math";
import { applyPdpProductChange, isSameShirt, pdpScrollToTopOptions, shirtKey } from "@/lib/v4/pdp-switch";
import { INITIAL_SIZE } from "@/lib/v4/pdp-url";
import { formatPrice, productBySlug, productGalleryViews } from "@/lib/v4/products";

const black = productBySlug("product-express-dispatch-black")!;
const white = productBySlug("product-express-dispatch-white")!;
const haloPink = productBySlug("product-halo-orbit-pink")!;
const haloBlack = productBySlug("product-halo-orbit-black")!;

describe("isSameShirt (family + model, not slug)", () => {
  it("treats colourways of one shirt as the same product", () => {
    expect(isSameShirt(black, white)).toBe(true);
    expect(isSameShirt(haloPink, haloBlack)).toBe(true);
    expect(shirtKey(black)).toBe(shirtKey(white));
    expect(shirtKey(black)).not.toBe(black.slug);
  });

  it("treats a related shirt as a different product even in another family", () => {
    expect(isSameShirt(black, haloPink)).toBe(false);
    expect(shirtKey(black)).not.toBe(shirtKey(haloPink));
  });
});

describe("colourway click on the same shirt", () => {
  it("changes the shown colourway, gallery images, title and price identity without a fresh PDP", () => {
    const change = applyPdpProductChange(black, white, "M");
    expect(white.colourwayName).not.toBe(black.colourwayName);
    expect(productGalleryViews(white)[0].src).not.toBe(productGalleryViews(black)[0].src);
    expect(white.shirtName).toBe(black.shirtName);
    expect(formatPrice(white.priceCents)).toBe(formatPrice(black.priceCents));
    expect(change.resetGallery).toBe(false);
    expect(change.announceShirt).toBe(false);
    expect(change.size).toBe("M");
  });

  it("keeps the size when it is in stock, and clears it when sold out (sizeAfterColourwaySwitch)", () => {
    expect(applyPdpProductChange(white, black, "M").size).toBe("M");
    expect(black.soldOutSizes).toContain("3XL");
    expect(applyPdpProductChange(white, black, "3XL").size).toBeNull();
    expect(applyPdpProductChange(black, white, INITIAL_SIZE).size).toBeNull();
  });

  it("does not scroll, move focus, or reset the gallery", () => {
    const change = applyPdpProductChange(black, white, "L");
    expect(change.resetGallery).toBe(false);
    expect(change.announceShirt).toBe(false);
  });
});

describe("navigating to a different product (related ShopCard / ?product=)", () => {
  it("behaves like opening a fresh PDP: no preselected size, gallery back to the first image, announce the shirt", () => {
    const change = applyPdpProductChange(black, haloPink, "M");
    expect(change.size).toBeNull();
    expect(change.resetGallery).toBe(true);
    expect(change.announceShirt).toBe(true);
    expect(haloPink.shirtName).not.toBe(black.shirtName);
    expect(haloPink.colourwayName).not.toBe(black.colourwayName);
  });

  it("still announces when the URL is the only input (same helper as the Link)", () => {
    expect(applyPdpProductChange(white, haloBlack, "L")).toMatchObject({
      size: null,
      resetGallery: true,
      announceShirt: true,
    });
  });
});

describe("back/forward follows the URL through the same helper", () => {
  it("replays colourway vs shirt rules along a history stack", () => {
    const start = applyPdpProductChange(null, black, INITIAL_SIZE);
    expect(start).toMatchObject({ size: null, resetGallery: false, announceShirt: false });

    const toWhite = applyPdpProductChange(black, white, "M");
    expect(toWhite.size).toBe("M");
    expect(toWhite.announceShirt).toBe(false);

    const toHalo = applyPdpProductChange(white, haloPink, toWhite.size);
    expect(toHalo.size).toBeNull();
    expect(toHalo.announceShirt).toBe(true);

    const backToWhite = applyPdpProductChange(haloPink, white, toHalo.size);
    expect(backToWhite.size).toBeNull();
    expect(backToWhite.announceShirt).toBe(true);
    expect(backToWhite.resetGallery).toBe(true);

    const backToBlack = applyPdpProductChange(white, black, "S");
    expect(backToBlack.size).toBe("S");
    expect(backToBlack.announceShirt).toBe(false);
    expect(backToBlack.resetGallery).toBe(false);
  });
});

describe("scroll on a shirt change", () => {
  it("never uses smooth scrolling, including when reduced motion is on", () => {
    expect(pdpScrollToTopOptions(false).behavior).toBe("auto");
    expect(pdpScrollToTopOptions(true).behavior).toBe("auto");
    expect(pdpScrollToTopOptions(true).immediate).toBe(true);
    expect(pdpScrollToTopOptions(false).immediate).toBe(true);
  });
});

describe("cart lines from two colourways", () => {
  it("adding two different colourways yields two lines", () => {
    const lines = addToLines(addToLines([], black, "M"), white, "M");
    expect(lines).toHaveLength(2);
    expect(lines.map((l) => l.colourway).sort()).toEqual(
      [black.colourwayName, white.colourwayName].sort(),
    );
  });
});
