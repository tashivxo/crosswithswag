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

function hex(value: string): Rgb {
  const h = value.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
}

function rgba(value: string): { rgb: Rgb; alpha: number } {
  const m = value.match(/rgba\(\s*(\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\s*\)/);
  expect(m, `not an rgba() value: ${value}`).not.toBeNull();
  return { rgb: [Number(m![1]), Number(m![2]), Number(m![3])], alpha: Number(m![4]) };
}

function over(top: { rgb: Rgb; alpha: number }, bottom: Rgb): Rgb {
  return top.rgb.map((c, i) => c * top.alpha + bottom[i] * (1 - top.alpha)) as Rgb;
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

function rule(selector: string): string {
  const start = css.indexOf(`\n${selector} {`);
  expect(start, `missing rule ${selector}`).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf("}", start));
}

describe("form field border (WCAG 1.4.11, 3:1 non-text contrast)", () => {
  const white = hex(token("--surface-tile"));
  const cream = hex(token("--studio-white"));
  const border = over(rgba(token("--ink-line-field")), white);

  it("passes 3:1 against the white field and the cream page behind it", () => {
    expect(contrast(border, white)).toBeGreaterThanOrEqual(3);
    expect(contrast(border, cream)).toBeGreaterThanOrEqual(3);
  });

  it("is used by the text inputs and the radio rows", () => {
    expect(rule(".cm-input")).toContain("1px solid var(--ink-line-field)");
    expect(rule(".cm-option")).toContain("1px solid var(--ink-line-field)");
  });

  it("leaves --ink-line-strong for its other uses", () => {
    expect(token("--ink-line-strong")).toBe("rgba(45, 45, 45, 0.28)");
    expect(rule(".cart-qty__btn")).toContain("var(--ink-line-strong)");
  });
});
