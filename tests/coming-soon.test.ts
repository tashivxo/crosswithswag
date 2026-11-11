import { describe, expect, it } from "vitest";
import { comingSoonEnabled } from "@/lib/coming-soon";

describe("comingSoonEnabled", () => {
  it("is on only when NEXT_PUBLIC_COMING_SOON is 1", () => {
    expect(comingSoonEnabled({ NEXT_PUBLIC_COMING_SOON: "1" })).toBe(true);
    expect(comingSoonEnabled({ NEXT_PUBLIC_COMING_SOON: "0" })).toBe(false);
    expect(comingSoonEnabled({ NEXT_PUBLIC_COMING_SOON: "true" })).toBe(false);
    expect(comingSoonEnabled({})).toBe(false);
  });

  it("stays off at Next runtime even if the env is 1", () => {
    const original = process.env.VITEST;
    process.env.VITEST = "false";
    expect(comingSoonEnabled({ NEXT_PUBLIC_COMING_SOON: "1" })).toBe(false);
    if (original === undefined) delete process.env.VITEST;
    else process.env.VITEST = original;
  });
});
