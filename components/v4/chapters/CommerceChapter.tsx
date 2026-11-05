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

type CartChapterProps = {
  /** Mobile /cart route: full-viewport sheet without site chrome. */
  sheet?: boolean;
};

export function CartChapter({ sheet = false }: CartChapterProps) {
  const router = useRouter();
  const { lines, count, subtotalCents, removeLine, setQuantity } = useCart();

  const rootClass = sheet ? "v4-cart-sheet" : "v4-cart-page section-shell";

  const inner = (
    <>
      {sheet ? (
        <header className="v4-cart-sheet__head">
          <p className="lbl">[ CART — {count} ]</p>
          <button
            type="button"
            className="v4-cart-drawer__close"
            onClick={() => router.back()}
          >
            CLOSE ✕
          </button>
        </header>
      ) : (
        <CartPageLabelRow count={count} />
      )}

      {!sheet && lines.length > 0 ? (
        <h1 className="v4-cart-page__title">SELECTED OBJECTS.</h1>
      ) : null}

      {lines.length === 0 ? (
        <>
          {!sheet ? (
            <h1 className="v4-cart-page__title">SELECTED OBJECTS.</h1>
          ) : null}
          <CartEmptyState variant={sheet ? "sheet" : "page"} />
        </>
      ) : (
        <>
          <div
            className={
              sheet ? "v4-cart-sheet__body" : "v4-cart-page__layout"
            }
          >
            <div className={sheet ? undefined : "v4-cart-page__lines"}>
              <CartLineList
                lines={lines}
                variant={sheet ? "drawer" : "page"}
                onRemove={removeLine}
                onSetQuantity={setQuantity}
              />
            </div>
            {sheet ? (
              <>
                <hr className="v4-cart-rule" />
                <CartTotalsBlock
                  subtotalCents={subtotalCents}
                  variant="drawer"
                />
                <button
                  type="button"
                  className="v4-cart-text-link v4-cart-keep-shopping"
                  onClick={() => router.back()}
                >
                  KEEP SHOPPING
                </button>
              </>
            ) : (
              <CartTotalsBlock
                subtotalCents={subtotalCents}
                variant="page"
              />
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <section className={rootClass}>
      <div className={sheet ? "v4-cart-sheet__inner" : "v4-cart-page__inner wrap"}>
        {inner}
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
