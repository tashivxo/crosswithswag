"use client";

import { V4FilledButton } from "@/components/v4/V4Shop";
import { useCart } from "@/lib/v4/cart/CartProvider";
import {
  formatPrice,
  productFamilies,
  standardProducts,
  type ProductFamily,
  type ProductSize,
} from "@/lib/v4/products";

const FAMILIES: ProductFamily[] = ["express", "halo", "super", "daily"];
const SIZES: ProductSize[] = ["S", "M", "L", "XL", "2XL", "3XL"];

export function LandingShopChapter() {
  const { addLine, count, subtotalCents } = useCart();

  return (
    <div className="v4-landing">
      <section className="v4-landing-hero section-shell">
        <p className="lbl v4-landing-hero__eyebrow">
          [ STANDARD EDITION — DROPS 13.11 ]
        </p>
        <div className="v4-landing-hero__mark" aria-hidden />
        <div className="v4-landing-hero__cta-row">
          <V4FilledButton href="#shop">SHOP THE STANDARD EDITION ↓</V4FilledButton>
          <V4FilledButton href="/space">ENTER THE SITE →</V4FilledButton>
        </div>
        <div className="v4-landing-hero__meta">
          <span>CAPE TOWN — EST. 2026</span>
          <span>WEARABLE EDITIONS + A SPACE</span>
        </div>
      </section>

      <section id="shop" className="v4-shop section-shell">
        <div className="v4-shop__head">
          <p className="lbl">[ 01 — SHOP ]</p>
          <p className="lbl">STANDARD EDITION — 9 SHIRTS — DROPS 13.11</p>
        </div>
        <h1 className="v4-shop__title">standard edition</h1>
        <p className="v4-shop__thesis">
          a homage to streetwear and the y2k era. always open. drops 13.11.
        </p>
        <div className="v4-shop__spec">
          <p className="lbl">[ THE SHIRT ]</p>
          <p>
            adult unisex. crew neck. short sleeve.
            <br />
            sizes S to 3XL.
          </p>
        </div>
        {FAMILIES.map((family) => {
          const items = standardProducts.filter((p) => p.family === family);
          return (
            <section key={family} className="v4-shop-row">
              <h3 className="v4-shop-row__title">
                {productFamilies[family].title}
              </h3>
              <div className="v4-shop-row__grid">
                {items.map((product) => (
                  <article key={product.id} className="v4-product-card">
                    <div className="v4-product-card__media" aria-hidden />
                    <p className="lbl">{product.shirtName}</p>
                    <p className="v4-product-card__colourway">
                      {product.colourwayName}
                    </p>
                    <p className="v4-product-card__price">
                      {formatPrice(product.priceCents)}
                    </p>
                    <div className="v4-product-card__sizes">
                      {SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          className="v4-size-btn"
                          onClick={() => addLine(product, size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
        <div className="v4-shop__sticky-bar">
          <span>
            {count} item{count === 1 ? "" : "s"} · {formatPrice(subtotalCents)}
          </span>
          <V4FilledButton href="/cart">GO TO CART ({count}) →</V4FilledButton>
        </div>
      </section>
    </div>
  );
}