"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ProductSize, StandardProduct } from "@/lib/v4/products";

export type CartLine = {
  lineId: string;
  productId: string;
  slug: string;
  title: string;
  colourway: string;
  size: ProductSize;
  unitPriceCents: number;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  addLine: (product: StandardProduct, size: ProductSize) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineId(productId: string, size: ProductSize) {
  return `${productId}:${size}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addLine = useCallback((product: StandardProduct, size: ProductSize) => {
    const id = lineId(product.id, size);
    setLines((prev) => {
      const existing = prev.find((l) => l.lineId === id);
      if (existing) {
        return prev.map((l) =>
          l.lineId === id ? { ...l, quantity: l.quantity + 1 } : l,
        );
      }
      return [
        ...prev,
        {
          lineId: id,
          productId: product.id,
          slug: product.slug,
          title: product.shirtName,
          colourway: product.colourwayName,
          size,
          unitPriceCents: product.priceCents,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotalCents = lines.reduce(
      (n, l) => n + l.unitPriceCents * l.quantity,
      0,
    );
    return { lines, count, subtotalCents, addLine, removeLine, clear };
  }, [lines, addLine, removeLine, clear]);

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
