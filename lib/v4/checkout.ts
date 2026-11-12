import { checkoutCopy } from "@/lib/copy";
import type { ShopShipMethod } from "@/lib/v4/shipping";

export type CheckoutField = "name" | "email" | "phone" | "paxiCode" | "address";

export type CheckoutValues = Record<CheckoutField, string>;

export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

/** Visual order of the form; the first invalid field in this order takes focus on submit. */
export const CHECKOUT_FIELD_ORDER: readonly CheckoutField[] = [
  "name",
  "email",
  "phone",
  "paxiCode",
  "address",
];

export const EMPTY_CHECKOUT_VALUES: CheckoutValues = {
  name: "",
  email: "",
  phone: "",
  paxiCode: "",
  address: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS = /^\+?[\d\s\-()]+$/;
const MIN_PHONE_DIGITS = 10;

export function validateCheckout(
  values: CheckoutValues,
  shipMethod: ShopShipMethod = "PRIVATE_SHIP",
): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (values.name.trim().length < 2) errors.name = checkoutCopy.errors.name;
  if (!EMAIL.test(values.email.trim())) errors.email = checkoutCopy.errors.email;
  const phone = values.phone.trim();
  const digits = phone.replace(/\D/g, "");
  if (!PHONE_CHARS.test(phone) || digits.length < MIN_PHONE_DIGITS) {
    errors.phone = checkoutCopy.errors.phone;
  }
  if (shipMethod === "PAXI_COLLECT") {
    if (values.paxiCode.trim().length < 3) errors.paxiCode = checkoutCopy.errors.paxiCode;
  } else if (values.address.trim().length < 5) {
    errors.address = checkoutCopy.errors.address;
  }
  return errors;
}

export function firstInvalidField(errors: CheckoutErrors): CheckoutField | null {
  return CHECKOUT_FIELD_ORDER.find((field) => errors[field]) ?? null;
}

export function fieldId(field: CheckoutField): string {
  return `checkout-${field}`;
}

export function errorId(field: CheckoutField): string {
  return `checkout-${field}-error`;
}

/** Space-separated aria-describedby: an optional hint first, then the error while one is showing. */
export function describedByIds(
  field: CheckoutField,
  errors: CheckoutErrors,
  hintId?: string,
): string | undefined {
  const ids = [hintId, errors[field] ? errorId(field) : undefined].filter(
    (id): id is string => Boolean(id),
  );
  return ids.length ? ids.join(" ") : undefined;
}

/** Focuses the first invalid field and returns it, or null when the form is valid. */
export function focusFirstInvalid(
  errors: CheckoutErrors,
  getElement: (id: string) => { focus: () => void } | null,
): CheckoutField | null {
  const field = firstInvalidField(errors);
  if (!field) return null;
  getElement(fieldId(field))?.focus();
  return field;
}
