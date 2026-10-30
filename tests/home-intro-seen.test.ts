import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isHomeIntroSeen } from "@/lib/home-scroll";

function stubSessionStorage(value: string | null) {
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: { getItem: () => value, setItem: () => {} },
  });
}

describe("isHomeIntroSeen", () => {
  const original = process.env.NEXT_PUBLIC_COMING_SOON;

  beforeEach(() => stubSessionStorage("1"));
  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_COMING_SOON;
    else process.env.NEXT_PUBLIC_COMING_SOON = original;
  });

  it("honours the session flag in the normal gallery", () => {
    delete process.env.NEXT_PUBLIC_COMING_SOON;
    expect(isHomeIntroSeen()).toBe(true);
  });

  it("never skips the coming-soon poster, even when the session flag is set", () => {
    process.env.NEXT_PUBLIC_COMING_SOON = "1";
    expect(isHomeIntroSeen()).toBe(false);
  });
});
