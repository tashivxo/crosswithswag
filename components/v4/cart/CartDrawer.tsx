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
    "v4-cart-drawer__panel",
    reducedMotion ? "v4-cart-drawer__panel--instant" : "",
    "is-open",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="v4-cart-drawer is-open" role="presentation">
      <button
        type="button"
        className="v4-cart-drawer__scrim"
        aria-label="Close cart"
        onClick={closeDrawer}
      />
      <div
        ref={panelRef}
        className={panelClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby="v4-cart-drawer-title"
      >
        <header className="v4-cart-drawer__head">
          <p id="v4-cart-drawer-title" className="lbl">
            [ CART — {count} ]
          </p>
          <button
            ref={closeBtnRef}
            type="button"
            className="v4-cart-drawer__close"
            onClick={closeDrawer}
          >
            CLOSE ✕
          </button>
        </header>

        {lines.length === 0 ? (
          <CartEmptyState variant="drawer" onShop={closeDrawer} />
        ) : (
          <>
            <CartLineList
              lines={lines}
              variant="drawer"
              onRemove={removeLine}
              onSetQuantity={setQuantity}
            />
            <hr className="v4-cart-rule" />
            <CartTotalsBlock
              subtotalCents={subtotalCents}
              variant="drawer"
              onCheckoutNavigate={closeDrawer}
            />
            <button
              type="button"
              className="v4-cart-text-link v4-cart-keep-shopping"
              onClick={closeDrawer}
            >
              KEEP SHOPPING
            </button>
          </>
        )}
      </div>
    </div>
  );
}
