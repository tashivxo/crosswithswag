"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { cartCopy } from "@/lib/copy";
import { focusTargetAfterRemoval } from "@/lib/v4/cart/announce";
import { useCart, type CartLine } from "@/lib/v4/cart/CartProvider";
import { formatPrice, isSizeSoldOut, productById } from "@/lib/v4/products";

type Variant = "page" | "drawer";

const emptyLeadId = (variant: Variant) => `cart-${variant}-empty`;

/**
 * Polite live region for removals and quantity changes. One lives in the page and one inside the
 * drawer dialog (a modal dialog hides everything outside it from assistive tech); only the one
 * for the surface that is showing carries the message.
 */
export function CartLiveRegion({ scope }: { scope: Variant }) {
  const { announcement, drawerOpen } = useCart();
  const active = (scope === "drawer") === drawerOpen;
  return (
    <div
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-cart-live={scope}
    >
      {active ? announcement : ""}
    </div>
  );
}

type CartLineListProps = {
  lines: CartLine[];
  variant: Variant;
  onRemove: (lineId: string) => void;
  onSetQuantity: (lineId: string, quantity: number) => void;
};

export function CartLineList({
  lines,
  variant,
  onRemove,
  onSetQuantity,
}: CartLineListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  // Remove/minus-at-one delete the focused control, so hand focus to the neighbour
  // (or the empty state) instead of dropping it onto <body>.
  const moveFocusAfterRemoval = (id: string) => {
    const target = focusTargetAfterRemoval(
      lines.map((l) => l.lineId),
      id,
    );
    if (!target) return;
    requestAnimationFrame(() => {
      if (target.kind === "empty") {
        document.getElementById(emptyLeadId(variant))?.focus();
        return;
      }
      listRef.current
        ?.querySelector<HTMLElement>(`[data-remove="${CSS.escape(target.lineId)}"]`)
        ?.focus();
    });
  };

  const remove = (id: string) => {
    moveFocusAfterRemoval(id);
    onRemove(id);
  };

  const setQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) moveFocusAfterRemoval(id);
    onSetQuantity(id, quantity);
  };

  return (
    <ul ref={listRef} className={`cart-lines cart-lines--${variant}`}>
      {lines.map((line) => {
        const product = productById(line.productId);
        const soldOut = product != null && isSizeSoldOut(product, line.size);
        const who = [line.title, line.colourway, line.size] as const;

        return (
          <li key={line.lineId} className="cart-line">
            <div className="frame cart-line__thumb">
              {line.imageSrc ? (
                <Image src={line.imageSrc} alt="" fill sizes="120px" />
              ) : null}
            </div>
            <div className="cart-line__meta">
              <p className="lbl lbl--sand">{line.title.toLowerCase()}</p>
              <p className="cart-line__detail voice">
                {cartCopy.lineDetail(line.colourway, line.size)}
              </p>
              {soldOut ? (
                <p className="lbl lbl--clay">{cartCopy.soldOutLine(line.size)}</p>
              ) : null}
              <div className="cart-qty" role="group" aria-label={cartCopy.a11y.quantity(line.quantity)}>
                <button
                  type="button"
                  className="cart-qty__btn"
                  aria-label={cartCopy.a11y.decrease(...who)}
                  onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                >
                  −
                </button>
                <span className="cart-qty__value" aria-hidden="true">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  className="cart-qty__btn"
                  aria-label={cartCopy.a11y.increase(...who)}
                  onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="cart-line__aside">
              <p className="cart-line__price">
                {formatPrice(line.unitPriceCents * line.quantity)}
              </p>
              <button
                type="button"
                className="cart-link cart-link--remove"
                data-remove={line.lineId}
                aria-label={cartCopy.a11y.removeLabel(...who)}
                onClick={() => remove(line.lineId)}
              >
                {cartCopy.remove}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CartEmptyState({
  variant = "page",
  onShop,
}: {
  variant?: Variant;
  onShop?: () => void;
}) {
  return (
    <div className="cart-empty">
      <p id={emptyLeadId(variant)} tabIndex={-1} className="cart-empty__lead voice">
        {cartCopy.empty.lead}
      </p>
      <p className="body-copy voice">{cartCopy.empty.body}</p>
      <div className="cta-row">
        <Link className="btn btn--clay cm-cta cm-cta--auto" href="/#shop" onClick={onShop}>
          {cartCopy.empty.cta}
        </Link>
      </div>
    </div>
  );
}

export function CartTotalsBlock({
  subtotalCents,
  onCheckoutNavigate,
}: {
  subtotalCents: number;
  onCheckoutNavigate?: () => void;
}) {
  return (
    <div className="cart-totals">
      <div className="cart-totals__row">
        <span className="lbl lbl--sand">{cartCopy.subtotal}</span>
        <span className="cart-totals__value">{formatPrice(subtotalCents)}</span>
      </div>
      <div className="cart-totals__row">
        <span className="lbl">{cartCopy.delivery}</span>
        <span className="lbl">{cartCopy.deliveryNote}</span>
      </div>
      <p className="lbl cart-totals__note">{cartCopy.note}</p>
      <Link
        className="btn btn--clay cm-cta"
        href="/checkout"
        onClick={onCheckoutNavigate}
      >
        {cartCopy.checkout}
      </Link>
    </div>
  );
}
