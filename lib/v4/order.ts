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
