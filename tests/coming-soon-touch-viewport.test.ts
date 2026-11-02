import { describe, expect, it } from "vitest";
import {
  coarseComingSoonRules,
  comingSoonCss,
  globalsCss,
  touchComingSoonHomeUsesSvh,
} from "./coming-soon-touch-css";

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

  it("sizes pinned #home in coming-soon mode with min-height 100svh, not dvh or vh", () => {
    const coarse = coarseComingSoonRules();
    expect(coarse).toMatch(
      /html:has\(\.cs\)\s*#home\s*\{[^}]*min-height:\s*100svh\s*;/,
    );
    expect(coarse).not.toMatch(
      /html:has\(\.cs\)\s*#home\s*\{[^}]*min-height:\s*100dvh/,
    );
    expect(coarse).not.toMatch(
      /html:has\(\.cs\)\s*#home\s*\{[^}]*min-height:\s*100vh\s*;/,
    );
  });

  it("matches #home and .cs min-height on touch (both 100svh)", () => {
    const coarse = coarseComingSoonRules();
    const cs = coarse.match(/\.cs\s*\{[^}]*min-height:\s*(100svh)\s*;/);
    const home = coarse.match(
      /html:has\(\.cs\)\s*#home\s*\{[^}]*min-height:\s*(100svh)\s*;/,
    );
    expect(cs?.[1]).toBe("100svh");
    expect(home?.[1]).toBe(cs?.[1]);
  });

  it("leaves the global .section-shell rule on 100dvh for other gallery sections", () => {
    expect(globalsCss).toMatch(/\.section-shell\s*\{[^}]*min-height:\s*100dvh\s*;/);
    expect(globalsCss).not.toMatch(
      /\.section-shell\s*\{[^}]*min-height:\s*100svh\s*;/,
    );
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
