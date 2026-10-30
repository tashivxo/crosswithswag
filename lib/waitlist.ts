const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistErrors = {
  email?: "invalid";
  consent?: "required";
};

export type WaitlistValue = { email: string; consent: true };

export type WaitlistValidation =
  | { ok: true; value: WaitlistValue }
  | { ok: false; errors: WaitlistErrors };

export function validateWaitlist(input: {
  email: unknown;
  consent: unknown;
}): WaitlistValidation {
  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const errors: WaitlistErrors = {};

  if (!EMAIL.test(email)) errors.email = "invalid";
  if (input.consent !== true) errors.consent = "required";

  if (errors.email || errors.consent) return { ok: false, errors };
  return { ok: true, value: { email, consent: true } };
}
