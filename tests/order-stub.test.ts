import { describe, expect, it } from "vitest";
import {
  STUB_PROCESSING_MS,
  createPaymentStub,
  createStubOrder,
  parseStubOrder,
  serialiseStubOrder,
  type StubOrder,
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

describe("createPaymentStub", () => {
  const summary = { itemCount: 2, totalCents: 76000 };

  function harness() {
    const scheduled: Array<{ run: () => void; ms: number; cancelled: boolean }> = [];
    const saved: StubOrder[] = [];
    const confirmed: StubOrder[] = [];
    const stub = createPaymentStub({
      schedule: (run, ms) => {
        const entry = { run, ms, cancelled: false };
        scheduled.push(entry);
        return () => {
          entry.cancelled = true;
        };
      },
      save: (order) => saved.push(order),
      onConfirmed: (order) => confirmed.push(order),
      random: () => 0.42,
    });
    const flush = () =>
      scheduled.forEach((entry) => {
        if (!entry.cancelled) entry.run();
      });
    return { stub, scheduled, saved, confirmed, flush };
  }

  it("creates one order for two rapid submits", () => {
    const { stub, scheduled, saved, confirmed, flush } = harness();
    expect(stub.submit(summary)).toBe(true);
    expect(stub.submit(summary)).toBe(false);
    expect(stub.submit(summary)).toBe(false);
    expect(scheduled).toHaveLength(1);
    flush();
    expect(saved).toHaveLength(1);
    expect(confirmed).toHaveLength(1);
    expect(confirmed[0].itemCount).toBe(2);
  });

  it("stays locked after confirming, so a late submit cannot create a second order", () => {
    const { stub, saved, flush } = harness();
    stub.submit(summary);
    flush();
    expect(stub.submit(summary)).toBe(false);
    expect(saved).toHaveLength(1);
  });

  it("reports in-flight while a payment is pending", () => {
    const { stub } = harness();
    expect(stub.isInFlight()).toBe(false);
    stub.submit(summary);
    expect(stub.isInFlight()).toBe(true);
  });

  it("waits the processing time before confirming", () => {
    const { stub, scheduled, confirmed } = harness();
    stub.submit(summary);
    expect(scheduled[0].ms).toBe(STUB_PROCESSING_MS);
    expect(confirmed).toHaveLength(0);
  });

  it("cancel drops the pending order and unlocks", () => {
    const { stub, saved, flush } = harness();
    stub.submit(summary);
    stub.cancel();
    flush();
    expect(saved).toHaveLength(0);
    expect(stub.isInFlight()).toBe(false);
  });
});
