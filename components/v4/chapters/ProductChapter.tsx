"use client";

import { useSearchParams } from "next/navigation";
import { V4FilledButton } from "@/components/v4/V4Shop";
import { useCart } from "@/lib/v4/cart/CartProvider";
import {
  formatPrice,
  productBySlug,
  standardProducts,
  type ProductSize,
} from "@/lib/v4/products";

const SIZES: ProductSize[] = ["S", "M", "L", "XL", "2XL", "3XL"];

export function ProductChapter() {
  const params = useSearchParams();
  const slug = params.get("product") ?? standardProducts[0]?.slug;
  const product = slug ? productBySlug(slug) : standardProducts[0];
  const { addLine } = useCart();

  if (!product) {
    return (
      <section className="section-shell">
        <p>Product not found.</p>
      </section>
    );
  }

  return (
    <section className="section-shell v4-product">
      <p className="lbl">
        ← ALL SHIRTS / {product.shirtName} / {product.colourwayName.toUpperCase()}
      </p>
      <span className="v4-badge">OPEN YEAR ROUND</span>
      <div className="v4-product__layout">
        <div className="v4-product__gallery" aria-hidden />
        <div className="v4-product__panel">
          <p className="lbl">[ SHIRT ]</p>
          <h1>{product.shirtName}</h1>
          <p>{product.colourwayName}</p>
          <p className="v4-product__price">{formatPrice(product.priceCents)}</p>
          <p>ITEM PRICE — DELIVERY EXTRA</p>
          <p>
            a homage to streetwear and the y2k era. printed to order, packed by
            hand.
          </p>
          <p className="lbl">SIZE</p>
          <div className="v4-product-card__sizes">
            {SIZES.map((size) => (
              <button key={size} type="button" className="v4-size-btn">
                {size}
              </button>
            ))}
          </div>
          <V4FilledButton
            onClick={() => addLine(product, "M")}
          >
            ADD TO CART →
          </V4FilledButton>
          <p className="lbl">
            OPEN YEAR ROUND — DROPS FRIDAY 13 NOVEMBER · paxi from R60 at
            checkout
          </p>
        </div>
      </div>
    </section>
  );
}
