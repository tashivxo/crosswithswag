/**
 * Guest checkout helpers. When NEXT_PUBLIC_API_URL is unset, pay still uses the in-browser stub.
 * With the API, Spring creates the order and PayFast hosted checkout takes the money.
 */
export const STUB_ORDER_STORAGE_KEY = "swag:stub-order";
export const CHECKOUT_SESSION_KEY = "swag:checkout-session";

/** How long the pay button shows "processing…" before the stub confirms. */
export const STUB_PROCESSING_MS = 900;

export type StubOrder = {
  ref: string;
  itemCount: number;
  totalCents: number;
};

export type CheckoutSession = {
  ref: string;
  email: string;
};

const REF_PATTERN = /^SWAG-[0-9A-Z]{6}$/;

export function createStubOrder(
  summary: { itemCount: number; totalCents: number },
  random: () => number = Math.random,
): StubOrder {
  const code = Math.floor(random() * 36 ** 6)
    .toString(36)
    .toUpperCase()
    .padStart(6, "0")
    .slice(-6);
  return { ref: `SWAG-${code}`, ...summary };
}

export function serialiseStubOrder(order: StubOrder): string {
  return JSON.stringify(order);
}

export function parseStubOrder(text: string | null): StubOrder | null {
  if (!text) return null;
  try {
    const data: unknown = JSON.parse(text);
    if (typeof data !== "object" || data === null) return null;
    const { ref, itemCount, totalCents } = data as Record<string, unknown>;
    if (typeof ref !== "string" || !REF_PATTERN.test(ref)) return null;
    if (typeof itemCount !== "number" || typeof totalCents !== "number") return null;
    return { ref, itemCount, totalCents };
  } catch {
    return null;
  }
}

export function serialiseCheckoutSession(session: CheckoutSession): string {
  return JSON.stringify(session);
}

export function parseCheckoutSession(text: string | null): CheckoutSession | null {
  if (!text) return null;
  try {
    const data: unknown = JSON.parse(text);
    if (typeof data !== "object" || data === null) return null;
    const { ref, email } = data as Record<string, unknown>;
    if (typeof ref !== "string" || !REF_PATTERN.test(ref)) return null;
    if (typeof email !== "string" || !email.includes("@")) return null;
    return { ref, email };
  } catch {
    return null;
  }
}

type PaymentStubDeps = {
  schedule: (run: () => void, ms: number) => () => void;
  save: (order: StubOrder) => void;
  onConfirmed: (order: StubOrder) => void;
  random?: () => number;
};

/**
 * The stub's single-flight guard. Lives outside React state, so two submits in the same tick
 * (double click, Enter plus click) cannot both pass before a re-render. Once a payment is in
 * flight it stays locked, including after it confirms, until `cancel()` is called on unmount.
 */
export function createPaymentStub({
  schedule,
  save,
  onConfirmed,
  random,
}: PaymentStubDeps) {
  let inFlight = false;
  let cancelPending: (() => void) | null = null;

  return {
    isInFlight: () => inFlight,
    /** Returns false (and does nothing) when a payment is already in flight. */
    submit(summary: { itemCount: number; totalCents: number }): boolean {
      if (inFlight) return false;
      inFlight = true;
      cancelPending = schedule(() => {
        const order = createStubOrder(summary, random);
        save(order);
        onConfirmed(order);
      }, STUB_PROCESSING_MS);
      return true;
    },
    cancel() {
      cancelPending?.();
      cancelPending = null;
      inFlight = false;
    },
  };
}
