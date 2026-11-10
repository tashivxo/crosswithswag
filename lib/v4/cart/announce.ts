import { cartCopy } from "@/lib/copy";
import type { CartLine } from "@/lib/v4/cart/cart-math";

export function removalMessage(line: CartLine, remaining: number): string {
  return cartCopy.a11y.removed(line.title, line.colourway, line.size, remaining);
}

export function quantityMessage(line: CartLine, quantity: number): string {
  return cartCopy.a11y.quantityChanged(line.title, line.size, quantity);
}

type Schedule = (run: () => void) => () => void;

/**
 * Writes messages to a polite live region. The region is emptied first and filled on the next
 * tick, so the same text announced twice in a row is still read out.
 */
export function createAnnouncer(
  setMessage: (text: string) => void,
  schedule: Schedule,
) {
  let cancelPending: (() => void) | null = null;

  function cancel() {
    cancelPending?.();
    cancelPending = null;
  }

  function announce(text: string) {
    cancel();
    setMessage("");
    cancelPending = schedule(() => {
      cancelPending = null;
      setMessage(text);
    });
  }

  return { announce, cancel };
}

export type RemovalFocusTarget =
  | { kind: "line"; lineId: string }
  | { kind: "empty" };

/** Where focus should land after a line is removed, so it is never dropped onto <body>. */
export function focusTargetAfterRemoval(
  lineIds: string[],
  removedId: string,
): RemovalFocusTarget | null {
  const index = lineIds.indexOf(removedId);
  if (index === -1) return null;
  const rest = lineIds.filter((id) => id !== removedId);
  if (rest.length === 0) return { kind: "empty" };
  return { kind: "line", lineId: rest[Math.min(index, rest.length - 1)] };
}
