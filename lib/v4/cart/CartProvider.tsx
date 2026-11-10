"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createAnnouncer,
  quantityMessage,
  removalMessage,
} from "@/lib/v4/cart/announce";
import {
  addToLines,
  cartCount,
  cartSubtotalCents,
  removeFromLines,
  setLineQuantity,
  type CartLine,
} from "@/lib/v4/cart/cart-math";
import type { ProductSize, StandardProduct } from "@/lib/v4/products";

export type { CartLine };

const ANNOUNCE_DELAY_MS = 60;

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  drawerOpen: boolean;
  /** Latest polite live-region message (removals and quantity changes). */
  announcement: string;
  openDrawer: () => void;
  closeDrawer: () => void;
  addLine: (product: StandardProduct, size: ProductSize) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLinesState] = useState<CartLine[]>([]);
  const linesRef = useRef<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const announcer = useMemo(
    () =>
      createAnnouncer(setAnnouncement, (run) => {
        const timer = window.setTimeout(run, ANNOUNCE_DELAY_MS);
        return () => window.clearTimeout(timer);
      }),
    [],
  );
  useEffect(() => () => announcer.cancel(), [announcer]);

  const commit = useCallback((next: CartLine[]) => {
    linesRef.current = next;
    setLinesState(next);
  }, []);

  // The region that carries the message changes with the drawer, so drop any old text first;
  // otherwise a stale message would be read out when the other region takes over.
  const openDrawer = useCallback(() => {
    announcer.cancel();
    setAnnouncement("");
    setDrawerOpen(true);
  }, [announcer]);
  const closeDrawer = useCallback(() => {
    announcer.cancel();
    setAnnouncement("");
    setDrawerOpen(false);
  }, [announcer]);

  const addLine = useCallback(
    (product: StandardProduct, size: ProductSize) => {
      commit(addToLines(linesRef.current, product, size));
    },
    [commit],
  );

  const removeLine = useCallback(
    (id: string) => {
      const line = linesRef.current.find((l) => l.lineId === id);
      if (!line) return;
      const next = removeFromLines(linesRef.current, id);
      commit(next);
      announcer.announce(removalMessage(line, cartCount(next)));
    },
    [announcer, commit],
  );

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      const line = linesRef.current.find((l) => l.lineId === id);
      if (!line) return;
      if (quantity <= 0) {
        removeLine(id);
        return;
      }
      commit(setLineQuantity(linesRef.current, id, quantity));
      announcer.announce(quantityMessage(line, quantity));
    },
    [announcer, commit, removeLine],
  );

  const clear = useCallback(() => commit([]), [commit]);

  const value = useMemo(
    () => ({
      lines,
      count: cartCount(lines),
      subtotalCents: cartSubtotalCents(lines),
      drawerOpen,
      announcement,
      openDrawer,
      closeDrawer,
      addLine,
      removeLine,
      setQuantity,
      clear,
    }),
    [
      lines,
      drawerOpen,
      announcement,
      openDrawer,
      closeDrawer,
      addLine,
      removeLine,
      setQuantity,
      clear,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
