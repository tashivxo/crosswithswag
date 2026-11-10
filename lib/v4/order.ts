/**
 * Payment stub. No processor is wired: the pay button validates the guest form, waits briefly,
 * and hands a placeholder reference to /order/confirmed through sessionStorage. Replace this
 * module (and the stub note in lib/copy.ts) when Yoco / PayFast are signed.
 */
export const STUB_ORDER_STORAGE_KEY = "swag:stub-order";

/** How long the pay button shows "processing…" before the stub confirms. */
export const STUB_PROCESSING_MS = 900;

export type StubOrder = {
  ref: string;
  itemCount: number;
  totalCents: number;
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
