"use client";

import Image from "next/image";
import Link from "next/link";
import { V4FilledButton } from "@/components/v4/V4Shop";
import type { CartLine } from "@/lib/v4/cart/CartProvider";
import {
  formatPrice,
  isSizeSoldOut,
  productById,
} from "@/lib/v4/products";

type CartLineListProps = {
  lines: CartLine[];
  variant: "page" | "drawer";
  onRemove: (lineId: string) => void;
  onSetQuantity: (lineId: string, quantity: number) => void;
};

export function CartLineList({
  lines,
  variant,
  onRemove,
  onSetQuantity,
}: CartLineListProps) {
  const thumbClass =
    variant === "page"
      ? "v4-cart-line__thumb v4-cart-line__thumb--page"
      : "v4-cart-line__thumb v4-cart-line__thumb--drawer";

  return (
    <ul className="v4-cart-line-list">
      {lines.map((line) => {
        const product = productById(line.productId);
        const soldOut =
          product != null && isSizeSoldOut(product, line.size);
        const lineTotal = line.unitPriceCents * line.quantity;

        return (
          <li key={line.lineId} className="v4-cart-line">
            <div className={thumbClass}>
              {line.imageSrc ? (
                <Image
                  src={line.imageSrc}
                  alt=""
                  width={variant === "page" ? 120 : 84}
                  height={variant === "page" ? 150 : 105}
                  className="v4-cart-line__img"
                />
              ) : null}
            </div>
            <div className="v4-cart-line__meta">
              <p className="v4-cart-line__name">
                {variant === "page"
                  ? `T-SHIRT - ${line.title}`
                  : line.title}
              </p>
              <p className="v4-cart-line__detail">
                standard edition · {line.colourway} · size {line.size}
              </p>
              {soldOut ? (
                <p className="v4-cart-line__sold-out">
                  sold out in {line.size} — still in your cart
                </p>
              ) : null}
              <div className="v4-cart-line__qty">
                <button
                  type="button"
                  className="v4-cart-qty-btn"
                  aria-label={`Decrease quantity for ${line.title}`}
                  onClick={() => onSetQuantity(line.lineId, line.quantity - 1)}
                >
                  −
                </button>
                <span className="v4-cart-qty-btn__value">{line.quantity}</span>
                <button
                  type="button"
                  className="v4-cart-qty-btn"
                  aria-label={`Increase quantity for ${line.title}`}
                  onClick={() => onSetQuantity(line.lineId, line.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="v4-cart-line__aside">
              <p className="v4-cart-line__price">{formatPrice(lineTotal)}</p>
              <button
                type="button"
                className="v4-cart-text-link"
                onClick={() => onRemove(line.lineId)}
              >
                remove
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

type CartEmptyProps = {
  variant: "page" | "drawer" | "sheet";
  onShop?: () => void;
};

export function CartEmptyState({ variant, onShop }: CartEmptyProps) {
  const shopHref = "/#shop";
  const shopButton =
    variant === "drawer" ? (
      <V4FilledButton
        href={shopHref}
        className="v4-btn--studio"
        onClick={onShop}
      >
        SHOP THE STANDARD EDITION →
      </V4FilledButton>
    ) : (
      <V4FilledButton href={shopHref} className="v4-btn--studio" onClick={onShop}>
        SHOP THE STANDARD EDITION →
      </V4FilledButton>
    );

  return (
    <div className="v4-cart-empty">
      <p className="v4-cart-empty__lead">nothing in here yet.</p>
      <p className="v4-cart-empty__note">the standard edition is always open.</p>
      {shopButton}
    </div>
  );
}

type CartTotalsProps = {
  subtotalCents: number;
  variant: "page" | "drawer";
  onCheckoutNavigate?: () => void;
};

export function CartTotalsBlock({
  subtotalCents,
  variant,
  onCheckoutNavigate,
}: CartTotalsProps) {
  if (variant === "page") {
    return (
      <aside className="v4-cart-totals v4-cart-totals--page">
        <div className="v4-cart-totals__rows">
          <div className="v4-cart-totals__row">
            <span>subtotal</span>
            <span>{formatPrice(subtotalCents)}</span>
          </div>
          <div className="v4-cart-totals__row v4-cart-totals__row--muted">
            <span>delivery</span>
            <span>chosen at checkout — paxi</span>
          </div>
        </div>
        <hr className="v4-cart-rule" />
        <Link href="/checkout" className="v4-cart-text-link v4-cart-text-link--cta">
          continue to checkout →
        </Link>
        <p className="v4-cart-totals__footnote">
          the standard edition is always open. a closed edition cannot be added.
        </p>
      </aside>
    );
  }

  return (
    <div className="v4-cart-totals v4-cart-totals--drawer">
      <div className="v4-cart-totals__rows">
        <div className="v4-cart-totals__row">
          <span>subtotal</span>
          <span>{formatPrice(subtotalCents)}</span>
        </div>
        <div className="v4-cart-totals__row v4-cart-totals__row--muted">
          <span>delivery</span>
          <span>chosen at checkout — paxi</span>
        </div>
      </div>
      <p className="v4-cart-totals__delivery-note">
        item prices exclude delivery. paxi economy R60 · speed R110 ·
        door-to-door R120.
      </p>
      <V4FilledButton
        href="/checkout"
        className="v4-btn--studio v4-cart-totals__checkout-btn"
        onClick={onCheckoutNavigate}
      >
        CONTINUE TO CHECKOUT →
      </V4FilledButton>
    </div>
  );
}

export function CartPageLabelRow({ count }: { count: number }) {
  return (
    <div className="v4-cart-page__label-row">
      <p className="lbl">[ CART ]</p>
      <p className="lbl">
        STANDARD EDITION — {count} SHIRT{count === 1 ? "" : "S"}
      </p>
    </div>
  );
}
