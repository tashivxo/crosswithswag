import { describe, expect, it } from "vitest";
import { isCreamSurface } from "@/lib/sections.config";

describe("isCreamSurface", () => {
  it("is on for the converted routes only (/ and /current)", () => {
    expect(isCreamSurface("/")).toBe(true);
    expect(isCreamSurface("/current")).toBe(true);
    expect(isCreamSurface("/current/")).toBe(true);
    expect(isCreamSurface("/cart")).toBe(false);
    expect(isCreamSurface("/space")).toBe(false);
    expect(isCreamSurface("/archive/")).toBe(false);
  });
});
