import { describe, expect, it } from "vitest";
import {
  getDesktopNavItems,
  isDesktopNavCurrent,
  navItems,
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
