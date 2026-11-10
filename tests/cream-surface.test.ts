import { describe, expect, it } from "vitest";
import { isCreamSurface } from "@/lib/sections.config";

describe("isCreamSurface", () => {
  it("is on for the converted routes only (/, /current and the commerce routes)", () => {
    expect(isCreamSurface("/")).toBe(true);
    expect(isCreamSurface("/current")).toBe(true);
    expect(isCreamSurface("/current/")).toBe(true);
    expect(isCreamSurface("/cart")).toBe(true);
    expect(isCreamSurface("/checkout/")).toBe(true);
    expect(isCreamSurface("/order/confirmed")).toBe(true);
    expect(isCreamSurface("/order")).toBe(false);
    expect(isCreamSurface("/space")).toBe(false);
    expect(isCreamSurface("/archive/")).toBe(false);
  });
});
