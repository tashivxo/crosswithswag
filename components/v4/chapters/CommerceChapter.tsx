"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/v4/cart/CartProvider";
import {
  CartEmptyState,
  CartLineList,
  CartTotalsBlock,
} from "@/components/v4/cart/CartUi";
import { deliveryOptions, formatPrice } from "@/lib/v4/products";

export function CartChapter() {
  const router = useRouter();
  const { lines, count, subtotalCents, removeLine, setQuantity } = useCart();

  return (
    <section id="cart" className="chapter">
      <div className="wrap page-head cart-head" tabIndex={-1}>
        <div className="hero-top">
          <span className="lbl lbl--sand">[ cart ]</span>
          <span className="lbl">
            standard edition — {count} shirt{count === 1 ? "" : "s"}
          </span>
        </div>
        <h1 className="display voice cart-title">selected objects.</h1>
      </div>

      <div className="wrap pad-sm">
        {lines.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className="cart-page">
            <CartLineList
              lines={lines}
              variant="page"
              onRemove={removeLine}
              onSetQuantity={setQuantity}
            />
            <aside className="cart-page__totals">
              <CartTotalsBlock subtotalCents={subtotalCents} />
              <button
                type="button"
                className="lbl cart-link"
                onClick={() => router.back()}
              >
                keep shopping
              </button>
            </aside>
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
    <section id="checkout" className="chapter">
      <div className="wrap page-head cart-head" tabIndex={-1}>
        <div className="hero-top">
          <span className="lbl lbl--sand">[ checkout ]</span>
          <span className="lbl">guest checkout — no account needed</span>
        </div>
        <h1 className="display voice cart-title">checkout.</h1>
      </div>

      <div className="wrap pad-sm checkout">
        <div className="checkout__block">
          <span className="lbl">[ 01 — contact ]</span>
          <p className="body-copy voice">
            email and phone fields — ui only until marcus signs checkout copy.
          </p>
        </div>
        <div className="checkout__block">
          <span className="lbl">[ 02 — delivery — paxi ]</span>
          <ul className="dense">
            {deliveryOptions.map((opt, index) => (
              <li key={opt.id} data-n={String(index + 1).padStart(2, "0")}>
                {opt.label} · {formatPrice(opt.priceCents)}
              </li>
            ))}
          </ul>
        </div>
        <div className="checkout__block">
          <span className="lbl">[ 03 — payment ]</span>
          <p className="body-copy voice">● card — yoco (hosted checkout)</p>
          <p className="body-copy voice">○ instant eft — payfast</p>
          <p className="lbl checkout__note">
            card details never touch this site. an order is marked paid by the
            processor, not by the redirect.
          </p>
        </div>
        <div className="checkout__block">
          <span className="lbl">
            {lines.length} item{lines.length === 1 ? "" : "s"} · delivery extra
          </span>
          <p className="cart-totals__value">{formatPrice(total)}</p>
          <p className="lbl">pay → (not wired)</p>
        </div>
      </div>
    </section>
  );
}

export function OrderConfirmedChapter() {
  return (
    <section id="order-confirmed" className="chapter">
      <div className="wrap page-head cart-head" tabIndex={-1}>
        <div className="hero-top">
          <span className="lbl lbl--sand">[ order ]</span>
          <span className="state state--live">received</span>
        </div>
        <h1 className="display voice cart-title">order received.</h1>
        <div className="hero-bottom">
          <p className="body-copy voice">
            thank you. this is a static confirmation screen on v4_branch.
          </p>
          <div className="cta-row">
            <Link className="btn btn--clay" href="/#shop">
              back to the shop →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
