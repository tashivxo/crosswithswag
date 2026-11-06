"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/v4/cart/CartProvider";
import {
  CartEmptyState,
  CartLineList,
  CartTotalsBlock,
} from "@/components/v4/cart/CartUi";

export function CartDrawer() {
  const {
    lines,
    count,
    subtotalCents,
    drawerOpen,
    closeDrawer,
    removeLine,
    setQuantity,
  } = useCart();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [closeDrawer],
  );

  useEffect(() => {
    if (!drawerOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen, onKeyDown]);

  if (!drawerOpen) return null;

  const panelClass = [
    "cart-drawer__panel",
    reducedMotion ? "cart-drawer__panel--instant" : "",
    "is-open",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="cart-drawer is-open" role="presentation">
      <button
        type="button"
        className="cart-drawer__scrim"
        aria-label="Close cart"
        onClick={closeDrawer}
      />
      <div
        ref={panelRef}
        className={panelClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="cart-drawer__head">
          <p id="cart-drawer-title" className="lbl lbl--sand">
            [ cart — {count} ]
          </p>
          <button
            ref={closeBtnRef}
            type="button"
            className="cart-drawer__close"
            onClick={closeDrawer}
          >
            close
          </button>
        </header>

        {lines.length === 0 ? (
          <CartEmptyState onShop={closeDrawer} />
        ) : (
          <>
            <CartLineList
              lines={lines}
              variant="drawer"
              onRemove={removeLine}
              onSetQuantity={setQuantity}
            />
            <CartTotalsBlock
              subtotalCents={subtotalCents}
              onCheckoutNavigate={closeDrawer}
            />
            <button
              type="button"
              className="lbl cart-link"
              onClick={closeDrawer}
            >
              keep shopping
            </button>
          </>
        )}
      </div>
    </div>
  );
}
