"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  productCardImage,
  type ProductSize,
  type StandardProduct,
} from "@/lib/v4/products";

export type CartLine = {
  lineId: string;
  productId: string;
  slug: string;
  title: string;
  colourway: string;
  size: ProductSize;
  unitPriceCents: number;
  quantity: number;
  imageSrc: string;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addLine: (product: StandardProduct, size: ProductSize) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineId(productId: string, size: ProductSize) {
  return `${productId}:${size}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const addLine = useCallback((product: StandardProduct, size: ProductSize) => {
    const id = lineId(product.id, size);
    const imageSrc = productCardImage(product);
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
          imageSrc,
        },
      ];
    });
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.lineId !== id));
  }, []);

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeLine(id);
        return;
      }
      setLines((prev) =>
        prev.map((l) =>
          l.lineId === id ? { ...l, quantity: Math.max(1, quantity) } : l,
        ),
      );
    },
    [removeLine],
  );

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotalCents = lines.reduce(
      (n, l) => n + l.unitPriceCents * l.quantity,
      0,
    );
    return {
      lines,
      count,
      subtotalCents,
      drawerOpen,
      openDrawer,
      closeDrawer,
      addLine,
      removeLine,
      setQuantity,
      clear,
    };
  }, [
    lines,
    drawerOpen,
    openDrawer,
    closeDrawer,
    addLine,
    removeLine,
    setQuantity,
    clear,
  ]);

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
