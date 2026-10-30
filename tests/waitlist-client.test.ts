import { describe, expect, it } from "vitest";
import { sendWaitlist } from "@/lib/waitlist-client";

function fetchReturning(body: unknown, status: number) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    return new Response(JSON.stringify(body), { status });
  }) as typeof fetch;
  return { calls, fetchImpl };
}

describe("sendWaitlist", () => {
  it("posts JSON to /api/waitlist and reports success", async () => {
    const { calls, fetchImpl } = fetchReturning({ ok: true }, 200);
    const result = await sendWaitlist({ email: "a@b.co", consent: true }, fetchImpl);
    expect(result).toEqual({ status: "success" });
    expect(calls[0].url).toBe("/api/waitlist");
    expect(calls[0].init.method).toBe("POST");
    expect(JSON.parse(String(calls[0].init.body))).toEqual({
      email: "a@b.co",
      consent: true,
    });
  });

  it("maps a 422 to invalid with field errors", async () => {
    const { fetchImpl } = fetchReturning(
      { ok: false, errors: { email: "invalid" } },
      422,
    );
    const result = await sendWaitlist({ email: "x", consent: true }, fetchImpl);
    expect(result).toEqual({ status: "invalid", errors: { email: "invalid" } });
  });

  it("maps 5xx responses to failure", async () => {
    const { fetchImpl } = fetchReturning({ ok: false, error: "unavailable" }, 502);
    const result = await sendWaitlist({ email: "a@b.co", consent: true }, fetchImpl);
    expect(result).toEqual({ status: "failure" });
  });

  it("maps a network error to failure", async () => {
    const fetchImpl = (async () => {
      throw new TypeError("Failed to fetch");
    }) as typeof fetch;
    const result = await sendWaitlist({ email: "a@b.co", consent: true }, fetchImpl);
    expect(result).toEqual({ status: "failure" });
  });

  it("maps an unreadable success body to failure", async () => {
    const fetchImpl = (async () =>
      new Response("<html>", { status: 200 })) as typeof fetch;
    const result = await sendWaitlist({ email: "a@b.co", consent: true }, fetchImpl);
    expect(result).toEqual({ status: "failure" });
  });
});
