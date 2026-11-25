import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/lenis", () => ({
  getLenis: () => null,
}));

import { restoreRouteScroll } from "@/lib/home-scroll";

const SHOP_Y = 2400;

function stubDom({ hash }: { hash: string }) {
  const shop = {
    scrollIntoView: vi.fn(),
    focus: vi.fn(),
    getBoundingClientRect: () => ({ top: SHOP_Y - 0, left: 0, width: 0, height: 0 }),
  };

  const scrollTo = vi.fn();

  vi.stubGlobal("document", {
    documentElement: { scrollTop: 0 },
    body: { scrollTop: 0 },
    getElementById: (id: string) => (id === "shop" ? shop : null),
  });

  vi.stubGlobal("window", {
    scrollY: 0,
    scrollTo,
    location: { hash },
    matchMedia: () => ({ matches: true }),
  });

  return { scrollTo, shop };
}

describe("restoreRouteScroll on home", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("scrolls to the shop section when the URL hash is #shop", () => {
    const { scrollTo } = stubDom({ hash: "#shop" });
    restoreRouteScroll("/");
    expect(scrollTo).toHaveBeenCalled();
    const y = scrollTo.mock.calls.find((call) => call[0] === 0)?.[1];
    expect(y).toBe(SHOP_Y);
  });

  it("scrolls to the top when there is no shop hash", () => {
    const { scrollTo } = stubDom({ hash: "" });
    restoreRouteScroll("/");
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });
});