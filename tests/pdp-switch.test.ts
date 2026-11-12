import { describe, expect, it } from "vitest";
import { addToLines } from "@/lib/v4/cart/cart-math";
import {
  applyPdpProductChange,
  colourwayClickPlan,
  galleryIndexForView,
  isSameShirt,
  pdpDocumentTitle,
  pdpMetadataTitle,
  pdpScrollToTopOptions,
  shirtKey,
  visiblePdpSlug,
} from "@/lib/v4/pdp-switch";
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

describe("gallery keeps the named view across colourways", () => {
  it("keeps Front (not numeric index) when switching dispatch black → white", () => {
    const blackViews = productGalleryViews(black);
    const whiteViews = productGalleryViews(white);
    expect(blackViews.map((v) => v.label)).toEqual(["Print", "Front", "Front detail"]);
    expect(whiteViews.map((v) => v.label)).toEqual(["Front", "Front detail"]);
    const frontOnBlack = blackViews.findIndex((v) => v.label === "Front");
    expect(frontOnBlack).toBe(1);
    expect(galleryIndexForView(whiteViews, blackViews[frontOnBlack].label)).toBe(0);
    expect(whiteViews[0].label).toBe("Front");
  });

  it("falls back to the first image when the new colourway lacks that view", () => {
    const blackViews = productGalleryViews(black);
    const whiteViews = productGalleryViews(white);
    expect(blackViews[0].label).toBe("Print");
    expect(whiteViews.some((v) => v.label === "Print")).toBe(false);
    expect(galleryIndexForView(whiteViews, "Print")).toBe(0);
  });
});

describe("document title per product", () => {
  it("uses the site template plus the shirt and colourway names already in data", () => {
    expect(pdpMetadataTitle(black)).toBe("product express — dispatch black");
    expect(pdpDocumentTitle(black)).toBe("SWAG — product express — dispatch black");
    expect(pdpDocumentTitle(white)).toBe("SWAG — product express — dispatch white");
  });
});

describe("visible slug while Next.js searchParams lag", () => {
  it("keeps a colourway click when the URL hook is still on the previous slug", () => {
    expect(
      visiblePdpSlug({
        urlSlug: black.slug,
        pending: { from: black.slug, to: white.slug },
        fallback: black.slug,
      }),
    ).toEqual({ slug: white.slug, pending: { from: black.slug, to: white.slug } });
  });

  it("follows the URL once Next.js catches up, and yields to a Link/back", () => {
    expect(
      visiblePdpSlug({
        urlSlug: white.slug,
        pending: { from: black.slug, to: white.slug },
        fallback: black.slug,
      }),
    ).toEqual({ slug: white.slug, pending: null });
    expect(
      visiblePdpSlug({
        urlSlug: haloPink.slug,
        pending: { from: black.slug, to: white.slug },
        fallback: black.slug,
      }),
    ).toEqual({ slug: haloPink.slug, pending: null });
  });
});

describe("colourway click plan (paint first, router catches up)", () => {
  it("returns the next slug as an urgent pending update and defers router sync", () => {
    const plan = colourwayClickPlan({
      currentSlug: black.slug,
      nextSlug: white.slug,
      pathname: "/current",
      hash: "",
    });
    expect(plan).toEqual({
      pending: { from: black.slug, to: white.slug },
      url: "/current?product=product-express-dispatch-white",
      routerSync: "transition",
    });
    expect(
      visiblePdpSlug({
        urlSlug: black.slug,
        pending: plan!.pending,
        fallback: black.slug,
      }).slug,
    ).toBe(white.slug);
  });

  it("ignores a click on the visible colourway or an unknown slug", () => {
    expect(
      colourwayClickPlan({
        currentSlug: black.slug,
        nextSlug: black.slug,
        pathname: "/current",
        hash: "",
      }),
    ).toBeNull();
    expect(
      colourwayClickPlan({
        currentSlug: black.slug,
        nextSlug: "not-a-product",
        pathname: "/current",
        hash: "",
      }),
    ).toBeNull();
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
