import {
  validateWaitlist,
  type WaitlistErrors,
  type WaitlistValue,
} from "@/lib/waitlist";
import type { SendWaitlistResult } from "@/lib/waitlist-client";

export type FormPhase = "idle" | "submitting" | "success" | "failure";

export type FormState = { phase: FormPhase; errors: WaitlistErrors };

export const initialFormState: FormState = { phase: "idle", errors: {} };

export function beginSubmit(
  state: FormState,
  input: { email: string; consent: boolean },
): { state: FormState; value: WaitlistValue | null } {
  if (state.phase === "submitting" || state.phase === "success") {
    return { state, value: null };
  }

  const result = validateWaitlist(input);
  if (!result.ok) {
    return { state: { phase: "idle", errors: result.errors }, value: null };
  }
  return { state: { phase: "submitting", errors: {} }, value: result.value };
}

export function applyResult(
  _state: FormState,
  result: SendWaitlistResult,
): FormState {
  if (result.status === "success") return { phase: "success", errors: {} };
  if (result.status === "invalid") {
    return { phase: "idle", errors: result.errors };
  }
  return { phase: "failure", errors: {} };
}

export function clearFieldError(
  state: FormState,
  field: keyof WaitlistErrors,
): FormState {
  if (!state.errors[field]) return state;
  const errors = { ...state.errors };
  delete errors[field];
  return { ...state, errors };
}
