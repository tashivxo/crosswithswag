import { describe, expect, it } from "vitest";
import { JotformError, type JotformConfig } from "@/lib/jotform";
import { handleWaitlist } from "@/lib/waitlist-handler";
import type { WaitlistValue } from "@/lib/waitlist";

const config: JotformConfig = {
  apiKey: "secret-key",
  formId: "999",
  emailQid: "3",
  consentQid: "5",
  consentValue: "Yes",
  apiBase: "https://api.jotform.com",
};

function post(body: unknown, raw = false) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? String(body) : JSON.stringify(body),
  });
}

function deps(overrides: {
  config?: JotformConfig | null;
  submit?: (value: WaitlistValue) => Promise<void>;
}) {
  const submitted: WaitlistValue[] = [];
  return {
    submitted,
    deps: {
      config: overrides.config === undefined ? config : overrides.config,
      submit:
        overrides.submit ??
        (async (value: WaitlistValue) => {
          submitted.push(value);
        }),
    },
  };
}

describe("handleWaitlist", () => {
  it("returns 200 and submits the normalised value on success", async () => {
    const { deps: d, submitted } = deps({});
    const res = await handleWaitlist(
      post({ email: " Marcus@Example.com ", consent: true }),
      d,
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(submitted).toEqual([{ email: "marcus@example.com", consent: true }]);
  });

  it("returns 400 for a body that is not JSON", async () => {
    const { deps: d, submitted } = deps({});
    const res = await handleWaitlist(post("not json", true), d);
    expect(res.status).toBe(400);
    expect(submitted).toHaveLength(0);
  });

  it("returns 422 with field errors and never calls Jotform when invalid", async () => {
    const { deps: d, submitted } = deps({});
    const res = await handleWaitlist(post({ email: "nope", consent: false }), d);
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({
      ok: false,
      errors: { email: "invalid", consent: "required" },
    });
    expect(submitted).toHaveLength(0);
  });

  it("returns 503 when Jotform is not configured", async () => {
    const { deps: d } = deps({ config: null });
    const res = await handleWaitlist(
      post({ email: "a@b.co", consent: true }),
      d,
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, error: "unavailable" });
  });

  it("returns 502 with a generic body when Jotform fails, without leaking details", async () => {
    const { deps: d } = deps({
      submit: async () => {
        throw new JotformError("jotform responded 401 key secret-key");
      },
    });
    const res = await handleWaitlist(
      post({ email: "a@b.co", consent: true }),
      d,
    );
    expect(res.status).toBe(502);
    const text = await res.text();
    expect(JSON.parse(text)).toEqual({ ok: false, error: "unavailable" });
    expect(text).not.toContain("secret-key");
    expect(text).not.toContain("401");
  });

  it("returns 502 for unexpected errors too", async () => {
    const { deps: d } = deps({
      submit: async () => {
        throw new Error("boom");
      },
    });
    const res = await handleWaitlist(
      post({ email: "a@b.co", consent: true }),
      d,
    );
    expect(res.status).toBe(502);
  });

  it("marks every response uncacheable", async () => {
    const { deps: d } = deps({});
    const res = await handleWaitlist(
      post({ email: "a@b.co", consent: true }),
      d,
    );
    expect(res.headers.get("Cache-Control")).toBe("no-store");
  });
});
