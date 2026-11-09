import { describe, expect, it } from "vitest";
import { isCreamSurface } from "@/lib/sections.config";

describe("isCreamSurface", () => {
  it("is on for the converted landing route only", () => {
    expect(isCreamSurface("/")).toBe(true);
    expect(isCreamSurface("/space")).toBe(false);
    expect(isCreamSurface("/current")).toBe(false);
    expect(isCreamSurface("/archive/")).toBe(false);
  });
});
