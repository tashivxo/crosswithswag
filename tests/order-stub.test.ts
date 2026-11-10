import { describe, expect, it } from "vitest";
import {
  createStubOrder,
  parseStubOrder,
  serialiseStubOrder,
} from "@/lib/v4/order";

describe("stub order", () => {
  it("makes a SWAG- reference from the random source", () => {
    const order = createStubOrder({ itemCount: 2, totalCents: 76000 }, () => 0.5);
    expect(order.ref).toMatch(/^SWAG-[0-9A-Z]{6}$/);
    expect(order.itemCount).toBe(2);
    expect(order.totalCents).toBe(76000);
  });

  it("gives different references for different random draws", () => {
    const a = createStubOrder({ itemCount: 1, totalCents: 1 }, () => 0.1);
    const b = createStubOrder({ itemCount: 1, totalCents: 1 }, () => 0.9);
    expect(a.ref).not.toBe(b.ref);
  });

  it("round-trips through session storage text", () => {
    const order = createStubOrder({ itemCount: 3, totalCents: 111000 }, () => 0.25);
    expect(parseStubOrder(serialiseStubOrder(order))).toEqual(order);
  });

  it("rejects missing, malformed or tampered data", () => {
    expect(parseStubOrder(null)).toBeNull();
    expect(parseStubOrder("")).toBeNull();
    expect(parseStubOrder("{not json")).toBeNull();
    expect(parseStubOrder(JSON.stringify({ ref: "x" }))).toBeNull();
    expect(
      parseStubOrder(JSON.stringify({ ref: "<b>hi</b>", itemCount: 1, totalCents: 1 })),
    ).toBeNull();
  });
});
