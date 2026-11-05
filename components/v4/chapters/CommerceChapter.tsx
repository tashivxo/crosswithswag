"use client";

import { V4FilledButton } from "@/components/v4/V4Shop";
import { useCart } from "@/lib/v4/cart/CartProvider";
import { deliveryOptions, formatPrice } from "@/lib/v4/products";

export function CartChapter() {
  const { lines, subtotalCents, removeLine } = useCart();

  if (lines.length === 0) {
    return (
      <section className="section-shell v4-cart">
        <h1>CART</h1>
        <p>Your cart is empty.</p>
        <V4FilledButton href="/">SHOP THE STANDARD EDITION →</V4FilledButton>
      </section>
    );
  }

  return (
    <section className="section-shell v4-cart">
      <h1>CART</h1>
      <ul className="v4-cart__lines">
        {lines.map((line) => (
          <li key={line.lineId} className="v4-cart__line">
            <div>
              <p className="lbl">{line.title}</p>
              <p>
                {line.colourway} · size {line.size}
              </p>
            </div>
            <p>{formatPrice(line.unitPriceCents * line.quantity)}</p>
            <button
              type="button"
              className="text-link"
              onClick={() => removeLine(line.lineId)}
            >
              remove
            </button>
          </li>
        ))}
      </ul>
      <p className="v4-cart__total">Subtotal {formatPrice(subtotalCents)}</p>
      <V4FilledButton href="/checkout">CHECKOUT →</V4FilledButton>
    </section>
  );
}

export function CheckoutChapter() {
  const { lines, subtotalCents } = useCart();
  const delivery = deliveryOptions[0].priceCents;
  const total = subtotalCents + delivery;

  return (
    <section className="section-shell v4-checkout">
      <h1>CHECKOUT</h1>
      <p className="lbl">[ 01 — CONTACT ]</p>
      <p>Email and phone fields — UI only until Marcus signs checkout copy.</p>
      <p className="lbl">[ 02 — DELIVERY — PAXI ]</p>
      <ul>
        {deliveryOptions.map((opt) => (
          <li key={opt.id}>
            {opt.label} · {formatPrice(opt.priceCents)}
          </li>
        ))}
      </ul>
      <p className="lbl">[ 03 — PAYMENT ]</p>
      <p>● card — yoco (hosted checkout)</p>
      <p>○ instant eft — payfast</p>
      <p className="v4-checkout__note">
        card details never touch this site. an order is marked paid by the
        processor, not by the redirect.
      </p>
      <p className="v4-cart__total">
        Pay {formatPrice(total)} → (not wired)
      </p>
      <p className="lbl">{lines.length} items · delivery extra</p>
    </section>
  );
}

export function OrderConfirmedChapter() {
  return (
    <section className="section-shell v4-order-confirmed">
      <h1>ORDER RECEIVED</h1>
      <p>Thank you. This is a static confirmation screen on V4_branch.</p>
      <V4FilledButton href="/">BACK TO THE SHOP →</V4FilledButton>
    </section>
  );
}
