"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getLenis } from "@/lib/lenis";
import { useCart } from "@/lib/v4/cart/CartProvider";
import {
  CartEmptyState,
  CartLineList,
  CartLiveRegion,
  CartTotalsBlock,
} from "@/components/v4/cart/CartUi";
import { cartCopy } from "@/lib/copy";

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
    getLenis()?.stop();
    document.body.classList.add("locked");
    closeBtnRef.current?.focus();
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      getLenis()?.start();
      document.body.classList.remove("locked");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen, onKeyDown]);

  return (
    <div
      className="cart-drawer t-panel-slide"
      role="presentation"
      data-open={drawerOpen ? "true" : "false"}
      aria-hidden={!drawerOpen}
      inert={!drawerOpen}
      data-lenis-prevent
    >
      <button
        type="button"
        className="cart-drawer__scrim"
        aria-label={cartCopy.drawer.closeLabel}
        tabIndex={drawerOpen ? 0 : -1}
        onClick={closeDrawer}
      />
      <div
        ref={panelRef}
        className="cart-drawer__panel t-panel-slide"
        data-open={drawerOpen ? "true" : "false"}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="cart-drawer__head">
          <p id="cart-drawer-title" className="lbl lbl--sand">
            {cartCopy.drawer.title(count)}
          </p>
          <button
            ref={closeBtnRef}
            type="button"
            className="cart-drawer__close"
            onClick={closeDrawer}
          >
            <span className="nav-label">{cartCopy.drawer.close}</span>
          </button>
        </header>

        <CartLiveRegion scope="drawer" />

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
            <CartTotalsBlock
              subtotalCents={subtotalCents}
              onCheckoutNavigate={closeDrawer}
            />
            <button
              type="button"
              className="cart-link"
              onClick={closeDrawer}
            >
              {cartCopy.keepShopping}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
