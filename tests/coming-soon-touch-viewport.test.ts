import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

/** Slice from the coming-soon poster block through the short-screen dock rules. */
function comingSoonCss() {
  const start = css.indexOf("Coming soon poster");
  expect(start).toBeGreaterThan(0);
  const end = css.indexOf("/* end docked: short screen */");
  expect(end).toBeGreaterThan(start);
  return css.slice(start, end + "/* end docked: short screen */".length);
}

function coarsePointerBlocks(source: string) {
  const blocks: string[] = [];
  const re = /@media\s*\(\s*pointer:\s*coarse\s*\)\s*\{/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    let depth = 1;
    let i = match.index + match[0].length;
    const start = i;
    while (i < source.length && depth > 0) {
      if (source[i] === "{") depth += 1;
      else if (source[i] === "}") depth -= 1;
      i += 1;
    }
    blocks.push(source.slice(start, i - 1));
  }
  return blocks;
}

function coarseComingSoonRules() {
  return coarsePointerBlocks(comingSoonCss()).join("\n");
}

function stripVeilRules(block: string) {
  return block.replace(/\.cs-veil[\s\S]*?\}/g, "");
}

describe("coming-soon touch viewport (coarse pointer)", () => {
  it("sizes .cs with min-height 100svh, not dvh or vh", () => {
    const coarse = coarseComingSoonRules();
    expect(coarse).toMatch(/\.cs\s*\{[^}]*min-height:\s*100svh\s*;/);
    expect(coarse).not.toMatch(/\.cs\s*\{[^}]*min-height:\s*100dvh/);
    expect(coarse).not.toMatch(/\.cs\s*\{[^}]*min-height:\s*100vh\s*;/);
  });

  it("uses svh for other coming-soon layout heights on touch, not dvh or vh", () => {
    const coarse = stripVeilRules(coarseComingSoonRules());
    expect(coarse).toMatch(/--cs-vh:\s*100svh\s*;/);
    expect(coarse).not.toMatch(/\dvh/);
    expect(coarse).not.toMatch(/--cs-vh:\s*100vh\s*;/);
    expect(coarse).not.toMatch(/min-height:\s*100vh\s*;/);
  });

  it("leaves .cs-veil lvh/vh sizing untouched on touch", () => {
    const coarse = coarseComingSoonRules();
    expect(coarse).toMatch(/\.cs-veil\s*\{[^}]*min-height:\s*max\(\s*100%\s*,\s*100vh\s*\)/);
    expect(coarse).toMatch(/min-height:\s*max\(\s*100%\s*,\s*100lvh\s*\)/);
  });

  it("keeps desktop .cs on dvh until the coarse override", () => {
    const section = comingSoonCss();
    expect(section).toMatch(/\.cs\s*\{[\s\S]*min-height:\s*100dvh\s*;/);
  });
});
