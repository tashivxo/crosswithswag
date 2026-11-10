import { describe, expect, it } from "vitest";
import {
  getDesktopNavItems,
  isCreamSurface,
  surfaceTone,
} from "@/lib/sections.config";

describe("isCreamSurface", () => {
  it("is on for the converted cream routes", () => {
    for (const path of [
      "/",
      "/current",
      "/current/",
      "/cart",
      "/checkout/",
      "/order/confirmed",
      "/playlists",
      "/archive/",
      "/space",
      "/contact",
    ]) {
      expect(isCreamSurface(path), path).toBe(true);
    }
    expect(isCreamSurface("/order")).toBe(false);
  });

  it("keeps the Figma photo (manifesto) and clay (404) frames off the cream list", () => {
    expect(isCreamSurface("/manifesto")).toBe(false);
    expect(isCreamSurface("/anything-else")).toBe(false);
  });
});

describe("surfaceTone", () => {
  it("maps each route to the surface its Figma frame uses", () => {
    expect(surfaceTone("/contact")).toBe("cream");
    expect(surfaceTone("/playlists/")).toBe("cream");
    expect(surfaceTone("/manifesto")).toBe("photo");
    expect(surfaceTone("/manifesto/")).toBe("photo");
  });

  it("falls back to clay for unknown paths (the 404 frame)", () => {
    expect(surfaceTone("/not-a-page")).toBe("clay");
    expect(surfaceTone("/cart/oops")).toBe("clay");
  });
});

describe("getDesktopNavItems", () => {
  it("includes playlists on every route", () => {
    const labels = getDesktopNavItems().map((item) => item.navLabel);
    expect(labels).toEqual([
      "shop",
      "space",
      "playlists",
      "archive",
      "manifesto",
      "contact",
      "cart",
    ]);
  });
});
