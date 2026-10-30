import { describe, expect, it } from "vitest";
import { validateWaitlist } from "@/lib/waitlist";

describe("validateWaitlist", () => {
  it("accepts a valid email with consent and normalises the email", () => {
    const result = validateWaitlist({ email: "  Marcus@Example.COM ", consent: true });
    expect(result).toEqual({
      ok: true,
      value: { email: "marcus@example.com", consent: true },
    });
  });

  it("rejects an empty email", () => {
    const result = validateWaitlist({ email: "", consent: true });
    expect(result).toEqual({ ok: false, errors: { email: "invalid" } });
  });

  it("rejects an email without @", () => {
    const result = validateWaitlist({ email: "marcus.example.com", consent: true });
    expect(result).toEqual({ ok: false, errors: { email: "invalid" } });
  });

  it("rejects missing consent", () => {
    const result = validateWaitlist({ email: "marcus@example.com", consent: false });
    expect(result).toEqual({ ok: false, errors: { consent: "required" } });
  });

  it("reports both errors together", () => {
    const result = validateWaitlist({ email: "nope", consent: false });
    expect(result).toEqual({
      ok: false,
      errors: { email: "invalid", consent: "required" },
    });
  });

  it("rejects non-boolean consent values", () => {
    const result = validateWaitlist({ email: "marcus@example.com", consent: "true" });
    expect(result).toEqual({ ok: false, errors: { consent: "required" } });
  });

  it("rejects non-string emails", () => {
    const result = validateWaitlist({ email: 42, consent: true });
    expect(result).toEqual({ ok: false, errors: { email: "invalid" } });
  });
});
