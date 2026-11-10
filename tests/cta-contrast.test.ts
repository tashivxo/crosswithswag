import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

type Rgb = [number, number, number];

function token(name: string): string {
  const match = css.match(new RegExp(`${name}:\\s*([^;]+);`));
  expect(match, `missing token ${name}`).not.toBeNull();
  return match![1].trim();
}

function resolve(value: string): string {
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  return ref ? resolve(token(ref[1])) : value;
}

function hex(value: string): Rgb {
  const h = resolve(value).replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
}

function luminance([r, g, b]: Rgb): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("shared outline CTA (.tlink, .btn)", () => {
  const fill = hex(token("--cta-fill"));
  const onFill = hex(token("--cta-on-fill"));
  const page = hex(token("--surface-page"));
  const ink = hex(token("--ink"));

  it("label on the hover fill passes AA for small text (4.5:1)", () => {
    expect(contrast(onFill, fill)).toBeGreaterThanOrEqual(4.5);
  });

  it("ink label at rest passes AA on the cream page", () => {
    expect(contrast(ink, page)).toBeGreaterThanOrEqual(4.5);
  });

  it("outline and focus ring pass 3:1 against the cream page (WCAG 1.4.11)", () => {
    expect(contrast(fill, page)).toBeGreaterThanOrEqual(3);
  });

  it("wipes via a pseudo-element and reduces to an instant change under reduced motion", () => {
    expect(css).toMatch(/\.tlink::before,\s*\.btn::before/);
    const idx = css.lastIndexOf("/* ===== Shared outline CTA");
    expect(idx).toBeGreaterThan(-1);
    const block = css.slice(idx);
    expect(block).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(block).toMatch(/:focus-visible/);
    expect(block).toMatch(/min-height:\s*44px/);
  });
});
