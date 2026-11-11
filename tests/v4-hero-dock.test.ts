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

  it("scrubs the header mark against #home and never mounts the Jotform pin", () => {
    const dock = read("components/v3/WordmarkDriftDock.tsx");
    const header = read("components/v3/SiteHeader.tsx");
    expect(dock).toMatch(/getElementById\("home"\)/);
    expect(dock).not.toMatch(/mountComingSoonFlight/);
    expect(header).not.toMatch(/mountComingSoonChrome/);
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
    expect(css).toMatch(
      /\[data-route="hero"\] ~ #content \.landing-mark/,
    );
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
});
