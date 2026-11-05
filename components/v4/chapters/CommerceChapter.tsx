"use client";

import { useRouter } from "next/navigation";
import { V4FilledButton } from "@/components/v4/V4Shop";
import { useCart } from "@/lib/v4/cart/CartProvider";
import {
  CartEmptyState,
  CartLineList,
  CartPageLabelRow,
  CartTotalsBlock,
} from "@/components/v4/cart/CartUi";
import { deliveryOptions, formatPrice } from "@/lib/v4/products";

export function CartChapter() {
  const router = useRouter();
  const { lines, count, subtotalCents, removeLine, setQuantity } = useCart();

  return (
    <section className="v4-cart-page section-shell">
      <div className="v4-cart-page__inner wrap">
        <div className="v4-cart-head--desktop">
          <CartPageLabelRow count={count} />
        </div>

        <header className="v4-cart-sheet__head v4-cart-head--mobile">
          <p className="lbl">[ CART — {count} ]</p>
          <button
            type="button"
            className="v4-cart-drawer__close"
            onClick={() => router.back()}
          >
            CLOSE ✕
          </button>
        </header>

        <h1 className="v4-cart-page__title">SELECTED OBJECTS.</h1>

        {lines.length === 0 ? (
          <CartEmptyState variant="page" />
        ) : (
          <div className="v4-cart-page__layout">
            <div className="v4-cart-page__lines">
              <CartLineList
                lines={lines}
                variant="route"
                onRemove={removeLine}
                onSetQuantity={setQuantity}
              />
            </div>

            <div className="v4-cart-totals--desktop">
              <CartTotalsBlock subtotalCents={subtotalCents} variant="page" />
            </div>

            <div className="v4-cart-totals--mobile">
              <hr className="v4-cart-rule" />
              <CartTotalsBlock subtotalCents={subtotalCents} variant="drawer" />
              <button
                type="button"
                className="v4-cart-text-link v4-cart-keep-shopping"
                onClick={() => router.back()}
              >
                KEEP SHOPPING
              </button>
            </div>
          </div>
        )}
      </div>
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
