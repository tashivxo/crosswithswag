import { describe, expect, it, vi } from "vitest";
import {
  apiBaseUrl,
  CheckoutApiError,
  fetchOrderConfirmation,
  postCheckout,
} from "@/lib/v4/checkout-api";
import { isPayfastProcessUrl } from "@/lib/v4/payfast";
import { isPaxiOrigin, paxiPointFromMessage } from "@/lib/v4/paxi";
import { parseCheckoutSession, serialiseCheckoutSession } from "@/lib/v4/order";
import { paxiShippingCents, shippingCents } from "@/lib/v4/shipping";

describe("apiBaseUrl", () => {
  it("trims trailing slashes", () => {
    expect(apiBaseUrl("http://localhost:8080/")).toBe("http://localhost:8080");
  });

  it("is null when unset", () => {
    expect(apiBaseUrl("")).toBeNull();
    expect(apiBaseUrl(undefined)).toBeNull();
  });
});

describe("postCheckout", () => {
  it("posts sku/size/qty only", async () => {
    const fetchFn = vi.fn(async () =>
      new Response(
        JSON.stringify({
          ref: "SWAG-ABC123",
          redirectUrl: "https://sandbox.payfast.co.za/eng/process",
          vendorFields: { amount: "410.00" },
        }),
        { status: 200 },
      ),
    );
    const result = await postCheckout(
      {
        name: "Ayanda",
        email: "a@b.co",
        phone: "0821234567",
        shipMethod: "PAXI_COLLECT",
        paxiCode: "PEP1",
        lines: [{ sku: "express-dispatch-black", size: "M", qty: 1 }],
      },
      fetchFn as unknown as typeof fetch,
      "http://localhost:8080",
    );
    expect(result.ref).toBe("SWAG-ABC123");
    expect(fetchFn).toHaveBeenCalledOnce();
    const init = fetchFn.mock.calls[0]?.[1] as RequestInit;
    expect(JSON.parse(String(init.body)).lines[0]).toEqual({
      sku: "express-dispatch-black",
      size: "M",
      qty: 1,
    });
  });

  it("surfaces api messages", async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response(JSON.stringify({ message: "paxi_code is required" }), {
          status: 400,
        }),
    ) as unknown as typeof fetch;
    await expect(
      postCheckout(
        {
          name: "Ayanda",
          email: "a@b.co",
          phone: "0821234567",
          shipMethod: "PAXI_COLLECT",
          lines: [{ sku: "express-dispatch-black", size: "M", qty: 1 }],
        },
        fetchFn,
        "http://localhost:8080",
      ),
    ).rejects.toBeInstanceOf(CheckoutApiError);
  });
});

describe("fetchOrderConfirmation", () => {
  it("returns null on 404", async () => {
    const fetchFn = vi.fn(async () => new Response("", { status: 404 })) as unknown as typeof fetch;
    await expect(
      fetchOrderConfirmation("SWAG-ABC123", "a@b.co", fetchFn, "http://localhost:8080"),
    ).resolves.toBeNull();
  });
});

describe("payfast url allow-list", () => {
  it("accepts sandbox and live process urls only", () => {
    expect(isPayfastProcessUrl("https://sandbox.payfast.co.za/eng/process")).toBe(true);
    expect(isPayfastProcessUrl("https://evil.example/eng/process")).toBe(false);
  });
});

describe("paxi messages", () => {
  it("reads nested point payloads from paxi origins", () => {
    expect(isPaxiOrigin("https://map.paxi.co.za")).toBe(true);
    expect(isPaxiOrigin("https://example.com")).toBe(false);
    expect(paxiPointFromMessage({ point: { code: "PEP1", name: "Sea Point" } })).toEqual({
      code: "PEP1",
      name: "Sea Point",
      address: "",
    });
  });
});

describe("checkout session", () => {
  it("round-trips a SWAG ref and email", () => {
    const session = { ref: "SWAG-ABC123", email: "a@b.co" };
    expect(parseCheckoutSession(serialiseCheckoutSession(session))).toEqual(session);
  });
});

describe("shipping", () => {
  it("charges the configured paxi fee and nothing for private ship", () => {
    expect(paxiShippingCents("6000")).toBe(6000);
    expect(shippingCents("PRIVATE_SHIP")).toBe(0);
  });
});
