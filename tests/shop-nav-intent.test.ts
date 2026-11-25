import { describe, expect, it } from "vitest";
import { shopNavIntent } from "@/lib/home-scroll";

describe("shopNavIntent", () => {
  it("scrolls in place when already on home", () => {
    expect(shopNavIntent("/")).toBe("scroll-shop");
  });

  it("navigates when on another chapter", () => {
    expect(shopNavIntent("/space")).toBe("push-shop");
    expect(shopNavIntent("/archive")).toBe("push-shop");
  });
});