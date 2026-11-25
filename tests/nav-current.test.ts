import { describe, expect, it } from "vitest";
import {
  chapterByPath,
  getDesktopNavItems,
  isDesktopNavCurrent,
  navItems,
  normalizePath,
} from "@/lib/sections.config";

const cartItem = getDesktopNavItems("/").find((item) => item.action === "cart")!;

function currentIds(path: string): string[] {
  return getDesktopNavItems(path)
    .filter((item) => isDesktopNavCurrent(item, path))
    .map((item) => item.id);
}

describe("current nav item", () => {
  it("marks cart on /cart and /checkout", () => {
    expect(isDesktopNavCurrent(cartItem, "/cart")).toBe(true);
    expect(isDesktopNavCurrent(cartItem, "/cart/")).toBe(true);
    expect(isDesktopNavCurrent(cartItem, "/checkout")).toBe(true);
  });

  it("marks nothing on /order/confirmed", () => {
    expect(currentIds("/order/confirmed")).toEqual([]);
    expect(currentIds("/order/confirmed/")).toEqual([]);
  });

  it("marks nothing in the mobile MENU list on /order/confirmed", () => {
    const current = navItems.filter(
      (item) => !item.external && isDesktopNavCurrent(item, "/order/confirmed"),
    );
    expect(current).toEqual([]);
  });

  it("still marks shop on / and /current, and the chapter on its own route", () => {
    expect(currentIds("/")).toEqual(["home"]);
    expect(currentIds("/current")).toEqual(["home"]);
    expect(currentIds("/archive")).toEqual(["archive"]);
  });
});

describe("shop hash paths", () => {
  const shopNavItem = () =>
    getDesktopNavItems().find((item) => item.id === "home")!;

  it("normalizes /#shop to / for chapter lookup", () => {
    expect(normalizePath("/#shop")).toBe("/");
    expect(chapterByPath("/#shop")?.id).toBe("home");
  });

  it("marks shop current when the nav href is /#shop", () => {
    const item = { ...shopNavItem(), href: "/#shop" };
    expect(isDesktopNavCurrent(item, "/")).toBe(true);
    expect(isDesktopNavCurrent(item, "/current")).toBe(true);
  });

  it("uses /#shop for desktop and mobile shop links", () => {
    expect(shopNavItem().href).toBe("/#shop");
    expect(navItems.find((item) => item.id === "home")?.href).toBe("/#shop");
  });
});
