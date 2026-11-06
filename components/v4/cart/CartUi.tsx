"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartLine } from "@/lib/v4/cart/CartProvider";
import { formatPrice, isSizeSoldOut, productById } from "@/lib/v4/products";

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
  return (
    <ul className={`cart-lines cart-lines--${variant}`}>
      {lines.map((line) => {
        const product = productById(line.productId);
        const soldOut = product != null && isSizeSoldOut(product, line.size);

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
                standard edition · {line.colourway} · size {line.size}
              </p>
              {soldOut ? (
                <p className="lbl lbl--clay">
                  sold out in {line.size} — still in your cart
                </p>
              ) : null}
              <div className="cart-qty">
                <button
                  type="button"
                  className="cart-qty__btn"
                  aria-label={`Decrease quantity for ${line.title}`}
                  onClick={() => onSetQuantity(line.lineId, line.quantity - 1)}
                >
                  −
                </button>
                <span className="cart-qty__value">{line.quantity}</span>
                <button
                  type="button"
                  className="cart-qty__btn"
                  aria-label={`Increase quantity for ${line.title}`}
                  onClick={() => onSetQuantity(line.lineId, line.quantity + 1)}
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
                className="lbl cart-link"
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

export function CartEmptyState({ onShop }: { onShop?: () => void }) {
  return (
    <div className="cart-empty">
      <p className="cart-empty__lead voice">nothing in here yet.</p>
      <p className="body-copy voice">the standard edition is always open.</p>
      <div className="cta-row">
        <Link className="btn btn--clay" href="/#shop" onClick={onShop}>
          shop the standard edition →
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
        <span className="lbl lbl--sand">subtotal</span>
        <span className="cart-totals__value">{formatPrice(subtotalCents)}</span>
      </div>
      <div className="cart-totals__row">
        <span className="lbl">delivery</span>
        <span className="lbl">chosen at checkout — paxi</span>
      </div>
      <p className="lbl cart-totals__note">
        item prices exclude delivery. paxi economy R60 · speed R110 ·
        door-to-door R120.
      </p>
      <div className="cta-row">
        <Link
          className="btn btn--clay"
          href="/checkout"
          onClick={onCheckoutNavigate}
        >
          continue to checkout →
        </Link>
      </div>
    </div>
  );
}
