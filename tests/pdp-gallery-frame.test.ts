import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  PDP_GALLERY_ASPECT_CSS,
  PDP_GALLERY_ASPECT_HEIGHT,
  PDP_GALLERY_ASPECT_WIDTH,
  PDP_GALLERY_MAT,
  PDP_PRINT_EDGES,
  PDP_PRINT_MAT,
  galleryViewFileSizes,
  sampleGalleryMatColour,
  samplePrintEdgeColours,
  samplePrintMatColour,
  tallestGalleryAspect,
} from "@/lib/v4/pdp-gallery-frame";

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
const page = readFileSync(
  join(process.cwd(), "app/(gallery)/current/page.tsx"),
  "utf8",
);
const reserve = readFileSync(
  join(process.cwd(), "components/v4/PdpGalleryReserve.tsx"),
  "utf8",
);

describe("PDP main gallery frame from actual files", () => {
  it("locks aspect-ratio to the tallest gallery file, 1600 × 2000", async () => {
    const tallest = await tallestGalleryAspect();
    const views = await galleryViewFileSizes();
    expect(tallest.width).toBe(PDP_GALLERY_ASPECT_WIDTH);
    expect(tallest.height).toBe(PDP_GALLERY_ASPECT_HEIGHT);
    expect(tallest.css).toBe(PDP_GALLERY_ASPECT_CSS);
    expect(PDP_GALLERY_ASPECT_CSS).toBe("1600 / 2000");
    for (const view of views) {
      expect(view.height / view.width).toBeLessThanOrEqual(
        tallest.height / tallest.width,
      );
    }
    const print = views.find((view) => view.label === "Print");
    expect(print).toBeTruthy();
    expect(print!.height / print!.width).toBeLessThan(
      tallest.height / tallest.width,
    );
  });

  it("samples the product-photo edge white, not cream", async () => {
    const sampled = await sampleGalleryMatColour();
    expect(sampled).toBe(PDP_GALLERY_MAT);
    expect(PDP_GALLERY_MAT).toBe("#ffffff");
    expect(PDP_GALLERY_MAT.toLowerCase()).not.toBe("#f5f3e7");
    expect(PDP_GALLERY_MAT.toLowerCase()).not.toBe("#d6d1c4");
  });

  it("samples each Print edge and uses the majority as the Print mat", async () => {
    const edges = await samplePrintEdgeColours();
    expect(edges).toEqual(PDP_PRINT_EDGES);
    expect(PDP_PRINT_EDGES).toEqual({
      top: "#0a0a0a",
      bottom: "#000000",
      left: "#000000",
      right: "#000000",
    });
    expect(await samplePrintMatColour()).toBe(PDP_PRINT_MAT);
    expect(PDP_PRINT_MAT).toBe("#000000");
    expect(PDP_PRINT_MAT.toLowerCase()).not.toBe("#141414");
  });

  it("reserves that ratio and mat on .pdp-gallery__main with contain, centred", () => {
    expect(css).toMatch(/--pdp-gallery-aspect:\s*1600\s*\/\s*2000/);
    expect(css).toMatch(/--pdp-gallery-mat:\s*#ffffff/i);
    expect(css).toMatch(/--pdp-gallery-print-mat:\s*#000000/i);
    const main = css.slice(css.indexOf(".pdp-gallery__main {"));
    const block = main.slice(0, main.indexOf(".pdp-gallery__thumbs"));
    expect(block).toMatch(/aspect-ratio:\s*var\(--pdp-gallery-aspect\)/);
    expect(block).toMatch(/background:\s*var\(--pdp-gallery-mat\)/);
    expect(block).toMatch(/object-fit:\s*contain\s*!important/);
    expect(block).toMatch(/object-position:\s*center\s*!important/);
    expect(block).toMatch(/\.pdp-gallery__main::after/);
    expect(block).toMatch(/content:\s*none/);
    expect(css).toMatch(
      /\.pdp-tile--print\s*\{[^}]*background:\s*var\(--pdp-gallery-print-mat\)/s,
    );
    expect(css).toMatch(
      /\.pdp-tile--print\s*\{[^}]*border-color:\s*var\(--pdp-gallery-print-mat\)/s,
    );
  });

  it("keeps a reserved gallery frame in the /current Suspense fallback", () => {
    expect(page).not.toMatch(/fallback=\{null\}/);
    expect(page).toMatch(/fallback=\{<PdpGalleryReserve \/>\}/);
    expect(reserve).toMatch(/pdp-gallery__main/);
  });
});
