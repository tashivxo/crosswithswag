import { describe, expect, it } from "vitest";
import {
  applyResult,
  beginSubmit,
  clearFieldError,
  initialFormState,
} from "@/lib/waitlist-form-state";

const valid = { email: "a@b.co", consent: true };

describe("beginSubmit", () => {
  it("moves a valid form to submitting and returns the normalised value", () => {
    const { state, value } = beginSubmit(initialFormState, {
      email: " A@B.co ",
      consent: true,
    });
    expect(state).toEqual({ phase: "submitting", errors: {} });
    expect(value).toEqual({ email: "a@b.co", consent: true });
  });

  it("stays idle with field errors for an invalid form and sends nothing", () => {
    const { state, value } = beginSubmit(initialFormState, {
      email: "nope",
      consent: false,
    });
    expect(state).toEqual({
      phase: "idle",
      errors: { email: "invalid", consent: "required" },
    });
    expect(value).toBeNull();
  });

  it("ignores a submit while already submitting", () => {
    const submitting = { phase: "submitting", errors: {} } as const;
    const { state, value } = beginSubmit(submitting, valid);
    expect(state).toBe(submitting);
    expect(value).toBeNull();
  });

  it("ignores a submit after success", () => {
    const done = { phase: "success", errors: {} } as const;
    const { state, value } = beginSubmit(done, valid);
    expect(state).toBe(done);
    expect(value).toBeNull();
  });

  it("allows retry from failure", () => {
    const failed = { phase: "failure", errors: {} } as const;
    const { state, value } = beginSubmit(failed, valid);
    expect(state.phase).toBe("submitting");
    expect(value).toEqual(valid);
  });
});

describe("applyResult", () => {
  const submitting = { phase: "submitting", errors: {} } as const;

  it("maps success", () => {
    expect(applyResult(submitting, { status: "success" })).toEqual({
      phase: "success",
      errors: {},
    });
  });

  it("maps server-side invalid back to idle with errors", () => {
    expect(
      applyResult(submitting, { status: "invalid", errors: { email: "invalid" } }),
    ).toEqual({ phase: "idle", errors: { email: "invalid" } });
  });

  it("maps failure", () => {
    expect(applyResult(submitting, { status: "failure" })).toEqual({
      phase: "failure",
      errors: {},
    });
  });
});

describe("clearFieldError", () => {
  it("removes only the named field error", () => {
    const state = {
      phase: "idle",
      errors: { email: "invalid", consent: "required" },
    } as const;
    expect(clearFieldError(state, "email")).toEqual({
      phase: "idle",
      errors: { consent: "required" },
    });
  });

  it("returns the same state when there is nothing to clear", () => {
    expect(clearFieldError(initialFormState, "email")).toBe(initialFormState);
  });
});
