import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  productCardImage,
  productCardLinkName,
  productGalleryImages,
  productGalleryViews,
  productHasBackPrint,
  standardProducts,
} from "@/lib/v4/products";

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
const card = readFileSync(join(process.cwd(), "components/v4/shop/ShopCard.tsx"), "utf8");
const pdp = readFileSync(join(process.cwd(), "components/v4/chapters/ProductChapter.tsx"), "utf8");

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

  it("flags only pulse and rush as back-print and keeps every card image on the front", () => {
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

describe("PDP gallery", () => {
  it("puts the front first and the back second for back-print tees", () => {
    for (const slug of BACK_PRINT_SLUGS) {
      const images = productGalleryImages(bySlug(slug));
      expect(images[0], slug).toMatch(/_front\.jpg$/);
      expect(images[1], slug).toMatch(/_back\.jpg$/);
      expect(new Set(images).size, slug).toBe(images.length);
    }
  });

  it("names Pulse and Rush thumbnails Front, Back print, Front detail", () => {
    for (const slug of BACK_PRINT_SLUGS) {
      expect(productGalleryViews(bySlug(slug)).map((v) => v.label), slug).toEqual([
        "Front",
        "Back print",
        "Front detail",
      ]);
    }
  });

  it("gives every other tee sensible view names (Print for the print close-up), never 'image N of M'", () => {
    expect(productGalleryViews(bySlug("product-express-dispatch-black")).map((v) => v.label)).toEqual([
      "Print",
      "Front",
      "Front detail",
    ]);
    for (const p of standardProducts) {
      const labels = productGalleryViews(p).map((v) => v.label);
      expect(new Set(labels).size, p.slug).toBe(labels.length);
      for (const label of labels) expect(label, p.slug).toMatch(/^(Print|Front|Front detail|Back print|Back detail)$/);
    }
  });

  it("uses the view name as the thumbnail's accessible name", () => {
    expect(pdp).toContain("aria-label={label}");
    expect(pdp).not.toMatch(/Show image/);
  });
});

describe("shop card markup", () => {
  it("appends 'back print' to the link name for pulse and rush only, leaving product copy as is", () => {
    expect(productCardLinkName(bySlug("product-super-pulse"))).toBe("product super — pulse, back print");
    expect(productCardLinkName(bySlug("product-super-rush"))).toBe("product super — rush, back print");
    for (const p of standardProducts.filter((x) => !BACK_PRINT_SLUGS.includes(x.slug))) {
      expect(productCardLinkName(p), p.slug).toBe(`${p.shirtName.toLowerCase()} — ${p.colourwayName}`);
    }
    expect(card).toContain("aria-label={productCardLinkName(product)}");
  });

  it("renders both flip faces decorative (alt empty, aria-hidden) so the link is not double-announced", () => {
    const flip = card.slice(card.indexOf('<span className="land-card__flip">'), card.indexOf("</span>", card.indexOf('<span className="land-card__flip">')));
    expect(flip.match(/alt=""/g)).toHaveLength(2);
    expect(flip.match(/aria-hidden/g)).toHaveLength(2);
    expect(flip).toContain("land-card__media-img--front");
    expect(flip).toContain("land-card__media-img--back");
  });

  it("loads the back face eagerly (low priority) so the first hover never shows a blank frame", () => {
    expect(card).toContain('loading="eager"');
    expect(card).toContain('fetchPriority="low"');
  });

  it("leaves the front-detail tees' markup as it was (front alt kept, decorative hover layer)", () => {
    expect(card).toContain("alt={`${product.shirtName.toLowerCase()} in ${product.colourwayName}`}");
    expect(card).toMatch(/land-card__media-img--detail"[\s\S]{0,120}alt=""[\s\S]{0,160}aria-hidden/);
  });

  it("labels only back-print cards and sets data-hover", () => {
    expect(card).toContain("data-hover={product.images.hoverView}");
    expect(card).toContain("{backPrint ? <span");
    expect(card).toContain("back print");
  });
});

function block(selector: string): string {
  const start = css.indexOf(selector);
  expect(start, selector).toBeGreaterThan(-1);
  return css.slice(start, css.indexOf("}", start) + 1);
}

const flipSection = css.slice(
  css.indexOf('.land-card__media[data-hover="back"] {'),
  css.indexOf(".land-card__back {"),
);

describe("shop card flip CSS", () => {
  it("is a single preserve-3d flip under a perspective parent", () => {
    expect(block('.land-card__media[data-hover="back"] {')).toMatch(/perspective:\s*1[12]\d\dpx;/);
    const flip = block(".land-card__flip {");
    expect(flip).toContain("transform-style: preserve-3d;");
    expect(flip).toContain("position: absolute;");
    expect(flip).toContain("inset: 0;");
  });

  it("hides both faces' backs (incl. -webkit-) and pre-rotates the back 180deg", () => {
    const faces = block(".land-card__flip .land-card__media-img {");
    expect(faces).toContain("-webkit-backface-visibility: hidden;");
    expect(faces).toContain("backface-visibility: hidden;");
    expect(block(".land-card__flip .land-card__media-img--back {")).toContain("transform: rotateY(180deg);");
  });

  it("rotates the wrapper 0 -> 180deg over 300ms ease-out, on hover (fine pointers) and focus-visible", () => {
    const flip = block(".land-card__flip {");
    expect(flip).toContain("transform: rotateY(0deg);");
    expect(flip).toContain("transition: transform 300ms ease-out;");
    expect(block('.land-card__media[data-hover="back"]:focus-visible .land-card__flip {')).toContain(
      "transform: rotateY(180deg);",
    );
    expect(
      css,
    ).toMatch(
      /@media \(hover: hover\) and \(pointer: fine\) \{\s*\.land-card__media\[data-hover="back"\]:hover \.land-card__flip \{\s*transform: rotateY\(180deg\);/,
    );
  });

  it("never fades the flip layers: no opacity or layout property is set or transitioned on them", () => {
    const rules = flipSection.slice(0, flipSection.indexOf("/* Label sits"));
    const body = rules.replace(/\/\*[\s\S]*?\*\//g, "");
    const flipBlocks = body.split("}").filter((b) => /land-card__flip|data-hover="back"/.test(b));
    expect(flipBlocks.length).toBeGreaterThan(4);
    for (const b of flipBlocks) {
      expect(b, b).not.toMatch(/opacity/);
      expect(b, b).not.toMatch(/\b(width|height|top|left|margin|padding)\s*:/);
    }
    expect(block(".land-card__flip {")).not.toMatch(/transition:[^;]*opacity/);
  });

  it("scopes the opacity crossfade to the front-detail tees only", () => {
    expect(css).toContain('.land-card__media[data-hover="front-detail"] .land-card__media-img {\n  transition: opacity 180ms ease;');
    expect(css).not.toMatch(/data-hover="back"[^{}]*\{[^}]*opacity/);
  });

  it("limits pointer hover to fine, hover-capable pointers", () => {
    const section = css.slice(
      css.indexOf('.land-card__media[data-hover="front-detail"] .land-card__media-img {'),
      css.indexOf("@media (prefers-reduced-motion: reduce) {", css.indexOf(".land-card__back {")),
    );
    expect((section.match(/:hover/g) ?? []).length).toBeGreaterThan(0);
    const outside = section
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/@media \(hover: hover\) and \(pointer: fine\) \{[\s\S]*?\n\}\n/g, "");
    expect(outside).not.toMatch(/:hover/);
  });

  it("shows the label always on coarse pointers and hides it until hover/focus on fine ones", () => {
    const label = block(".land-card__back {");
    expect(label).toContain("font-size: 11px;");
    expect(label).toContain("text-transform: uppercase;");
    expect(label).toContain("color: var(--clay);");
    expect(label).not.toContain("opacity");
    expect(css).toMatch(/@media \(hover: hover\) and \(pointer: fine\) \{\s*\.land-card__back \{\s*opacity: 0;/);
    expect(css).toContain(".land-card__media:focus-visible ~ .land-card__cw .land-card__back");
  });

  it("under reduced motion drops the flip transition (instant swap) and keeps the swap rules", () => {
    const start = css.indexOf("@media (prefers-reduced-motion: reduce) {", css.indexOf(".land-card__back {"));
    const reduced = css.slice(start, css.indexOf("\n}\n", start));
    expect(reduced).toMatch(/\.land-card__flip,[\s\S]*?transition: none;/);
    expect(reduced).not.toMatch(/\.land-card__flip[^{}]*\{[^}]*transform:\s*none/);
    expect(reduced).not.toMatch(/data-hover="back"[^{}]*\{[^}]*display:\s*none/);
    expect(reduced).toContain('[data-hover="front-detail"] .land-card__media-img--detail');
  });
});
