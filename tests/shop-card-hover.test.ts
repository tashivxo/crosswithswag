import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  productCardImage,
  productGalleryImages,
  productHasBackPrint,
  productHoverAlt,
  standardProducts,
} from "@/lib/v4/products";

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
const card = readFileSync(join(process.cwd(), "components/v4/shop/ShopCard.tsx"), "utf8");

const BACK_PRINT_SLUGS = ["product-super-pulse", "product-super-rush"];

function bySlug(slug: string) {
  const product = standardProducts.find((p) => p.slug === slug);
  expect(product, slug).toBeDefined();
  return product!;
}

describe("shop card hover image", () => {
  it("resolves SUPER pulse and rush to their back image", () => {
    expect(bySlug("product-super-pulse").images.hover).toBe(
      "/assets/v4/shop/product-super_pulse_back.jpg",
    );
    expect(bySlug("product-super-rush").images.hover).toBe(
      "/assets/v4/shop/product-super_rush_back.jpg",
    );
  });

  it("keeps the other seven tees on front-detail", () => {
    const others = standardProducts.filter((p) => !BACK_PRINT_SLUGS.includes(p.slug));
    expect(others).toHaveLength(7);
    for (const p of others) {
      expect(p.images.hover, p.slug).toMatch(/_front-detail\.jpg$/);
      expect(p.images.hoverView, p.slug).toBe("front-detail");
      expect(productHasBackPrint(p), p.slug).toBe(false);
    }
  });

  it("flags only pulse and rush as back-print and keeps their card image on the front", () => {
    for (const p of standardProducts) {
      expect(productHasBackPrint(p), p.slug).toBe(BACK_PRINT_SLUGS.includes(p.slug));
      expect(productCardImage(p), p.slug).toMatch(/_front\.jpg$/);
    }
  });

  it("points every hover image at a served file", () => {
    for (const p of standardProducts) {
      expect(existsSync(join(process.cwd(), "public", p.images.hover)), p.images.hover).toBe(true);
    }
  });
});

describe("PDP gallery for back-print tees", () => {
  it("puts the front first and the back second", () => {
    for (const slug of BACK_PRINT_SLUGS) {
      const images = productGalleryImages(bySlug(slug));
      expect(images[0], slug).toMatch(/_front\.jpg$/);
      expect(images[1], slug).toMatch(/_back\.jpg$/);
      expect(new Set(images).size, slug).toBe(images.length);
    }
  });
});

describe("shop card markup", () => {
  it("names the back image as the back print; the seven front-detail tees stay decorative", () => {
    expect(productHoverAlt(bySlug("product-super-pulse"))).toBe("product super in pulse, back print");
    expect(productHoverAlt(bySlug("product-super-rush"))).toBe("product super in rush, back print");
    for (const p of standardProducts.filter((x) => !BACK_PRINT_SLUGS.includes(x.slug))) {
      expect(productHoverAlt(p), p.slug).toBe("");
    }
    expect(card).toContain("alt={productHoverAlt(product)}");
    expect(card).toContain("aria-hidden={backPrint ? undefined : true}");
  });

  it("keeps the link's accessible name as the product, not the images", () => {
    expect(card).toContain("aria-label={`${product.shirtName.toLowerCase()} — ${product.colourwayName}`}");
  });

  it("loads the back layer eagerly (low priority) so the first hover never shows a blank frame", () => {
    expect(card).toContain('loading: "eager"');
    expect(card).toContain('fetchPriority: "low"');
    expect(card).toContain("backPrint ? {");
  });

  it("labels only back-print cards and sets data-hover", () => {
    expect(card).toContain("data-hover={product.images.hoverView}");
    expect(card).toContain("{backPrint ? <span");
    expect(card).toContain("back print");
  });

  it("never hides the hover layer with display or visibility for back-print tees (it must stay painted)", () => {
    expect(css).not.toMatch(/data-hover="back"[^{}]*\{[^}]*(display:\s*none|(?<!backface-)visibility:\s*hidden)/);
  });
});

function block(selector: string, from = 0): string {
  const start = css.indexOf(selector, from);
  expect(start, selector).toBeGreaterThan(-1);
  return css.slice(start, css.indexOf("}", start) + 1);
}

describe("shop card hover CSS", () => {
  const reduced = css.slice(
    css.indexOf("@media (prefers-reduced-motion: reduce) {", css.indexOf(".land-card__back")),
  );
  const reducedBlock = reduced.slice(0, reduced.indexOf("\n}\n"));

  it("turns on Y over 150ms + 150ms ease-out, with transform and opacity only", () => {
    const base = block('.land-card__media[data-hover="back"] .land-card__media-img {');
    expect(base).toContain("transition-property: transform, opacity;");
    expect(base).toContain("transition-duration: 150ms;");
    expect(base).toContain("transition-timing-function: ease-out;");
    expect(base).toContain("backface-visibility: hidden;");
    expect(block('.land-card__media[data-hover="back"]:focus-visible .land-card__media-img--detail')).toContain(
      "transition-delay: 150ms;",
    );
    const turn = css.slice(
      css.indexOf('.land-card__media[data-hover="back"] .land-card__media-img {'),
      css.indexOf(".land-card__back {"),
    );
    expect(turn).toMatch(/rotateY/);
    for (const layout of ["width:", "height:", "top:", "left:", "margin", "padding", "inset"]) {
      expect(turn, layout).not.toContain(layout);
    }
  });

  it("reveals the back on keyboard focus-visible, not only on hover", () => {
    expect(css).toContain(".land-card__media:focus-visible .land-card__media-img--detail");
    expect(css).toContain('.land-card__media[data-hover="back"]:focus-visible .land-card__media-img--front');
    expect(css).toContain(".land-card__media:focus-visible ~ .land-card__cw .land-card__back");
  });

  it("limits pointer hover to fine, hover-capable pointers", () => {
    const hoverRules = css.slice(
      css.indexOf(".land-card__media-img--detail {\n  opacity: 0;"),
      css.indexOf("@media (prefers-reduced-motion: reduce) {", css.indexOf(".land-card__back {")),
    );
    const hoverSelectors = hoverRules.match(/[^{}]*:hover[^{}]*\{/g) ?? [];
    expect(hoverSelectors.length).toBeGreaterThan(0);
    const outside = hoverRules.replace(
      /@media \(hover: hover\) and \(pointer: fine\) \{[\s\S]*?\n\}\n/g,
      "",
    );
    expect(outside.replace(/\/\*[\s\S]*?\*\//g, "")).not.toMatch(/:hover/);
  });

  it("shows the label always on coarse pointers and hides it until hover/focus on fine ones", () => {
    const label = block(".land-card__back {");
    expect(label).toContain("font-size: 11px;");
    expect(label).toContain("text-transform: uppercase;");
    expect(label).toContain("color: var(--clay);");
    expect(label).not.toContain("opacity");
    expect(css).toMatch(
      /@media \(hover: hover\) and \(pointer: fine\) \{\s*\.land-card__back \{\s*opacity: 0;/,
    );
  });

  it("under reduced motion drops every transition and transform but still swaps back-print tees", () => {
    expect(reducedBlock).toContain("transition: none !important;");
    expect(reducedBlock).toContain("transform: none !important;");
    expect(reducedBlock).toContain('[data-hover="front-detail"] .land-card__media-img--detail');
    expect(reducedBlock).not.toContain('[data-hover="back"] .land-card__media-img--detail {\n    display');
    expect(reducedBlock).not.toMatch(/data-hover="back"[^{}]*\{[^}]*display:\s*none/);
  });
});
