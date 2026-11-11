import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getDesktopNavItems } from "@/lib/sections.config";

const read = (rel: string) => readFileSync(join(process.cwd(), rel), "utf8");

describe("V4 / hero scroll dock", () => {
  it("sets hero mode only on /", () => {
    const chrome = read("components/v3/SiteChrome.tsx");
    expect(chrome).toMatch(
      /normalizePath\(pathname\) === "\/" \? "hero" : "docked"/,
    );
    expect(chrome).not.toMatch(/mode = "docked" as const/);
  });

  it("pins #home for the flight and never mounts the Jotform pin", () => {
    const dock = read("lib/landing-dock.ts");
    const wordmark = read("components/v3/WordmarkDriftDock.tsx");
    const header = read("components/v3/SiteHeader.tsx");
    expect(dock).toMatch(/pin:\s*true/);
    expect(dock).toMatch(/pinSpacing:\s*true/);
    expect(dock).toMatch(/anticipatePin:\s*1/);
    expect(dock).toMatch(/getElementById\("home"\)/);
    expect(wordmark).toMatch(/acquireLandingDock/);
    expect(header).toMatch(/acquireLandingDock/);
    expect(wordmark).not.toMatch(/mountComingSoonFlight/);
    expect(header).not.toMatch(/mountComingSoonChrome/);
    expect(dock).not.toMatch(/comingSoonEnabled/);
  });

  it("does not skip `/` via the home-intro session flag", () => {
    const homeScroll = read("lib/home-scroll.ts");
    const restore = homeScroll.slice(
      homeScroll.indexOf("export function restoreRouteScroll"),
      homeScroll.indexOf("export function cancelRouteScroll"),
    );
    const homeStart = restore.indexOf('if (chapter?.id === "home")');
    const homeEnd = restore.indexOf("return;", homeStart);
    const homeBranch = restore.slice(homeStart, homeEnd);
    expect(homeBranch).toContain("scrollPageTo(0");
    expect(homeBranch).not.toMatch(/isHomeIntroSeen/);
    expect(homeBranch).not.toMatch(/scrollToHomeLanding/);
  });

  it("hides the duplicate in-page mark while the header mark flies", () => {
    const css = read("app/globals.css");
    expect(css).toMatch(/\[data-route="hero"\] ~ #content \.landing-mark/);
  });

  it("shows the bar when reduced motion docks the mark", () => {
    const css = read("app/globals.css");
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.site-header__chrome \{[\s\S]*?opacity:\s*1/,
    );
  });

  it("keeps PLAYLISTS in the bar that fades in", () => {
    expect(getDesktopNavItems().map((item) => item.navLabel)).toContain(
      "playlists",
    );
  });

  it("docks at the token width with a glyph crop, not the 72px Figma crop", () => {
    const css = read("app/globals.css");
    const dock = read("lib/landing-dock.ts");
    const wordmark = read("components/v3/WordmarkDriftDock.tsx");
    expect(css).toMatch(/--wordmark-dock-width:\s*clamp\(88px,\s*11vw,\s*120px\)/);
    expect(css).toMatch(/--wordmark-glyph-ratio:/);
    expect(css).toMatch(
      /\.wordmark-drift-layer \.wordmark \{[\s\S]*?width:\s*131\.35%/,
    );
    expect(css).not.toMatch(
      /@media \(min-width: 900px\) \{[\s\S]*?--wordmark-dock-width:\s*72px/,
    );
    expect(css).not.toMatch(/--header-height:\s*78\.485px/);
    expect(dock).toMatch(/LANDING_PIN_VH = 1\.2/);
    expect(wordmark).toMatch(/ResizeObserver/);
  });

  it("slows the clay wipe on every .tlink and .btn to 0.7s ease-out", () => {
    const css = read("app/globals.css");
    expect(css).toMatch(/--cta-wipe-dur:\s*0\.7s/);
    expect(css).toMatch(
      /\.tlink::before,\s*\.btn::before \{[\s\S]*?transition: transform var\(--cta-wipe-dur\) var\(--ease\)/,
    );
    expect(css).not.toMatch(/\.tlink:hover \{[\s\S]{0,80}scale\(1\.04\)/);
    expect(css).not.toMatch(/\.btn:hover \{\s*background: var\(--sand\)/);
  });
});
