"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/v4/cart/CartProvider";
import {
  formatPrice,
  isSizeSoldOut,
  productCardImage,
  type ProductSize,
  type StandardProduct,
} from "@/lib/v4/products";

// DRAFT: size range S to 3XL stays draft until Marcus signs off 3XL.
const SIZES: ProductSize[] = ["S", "M", "L", "XL", "2XL", "3XL"];

type AtcState = "idle" | "need-size" | "added";

export function ShopCard({ product }: { product: StandardProduct }) {
  const { addLine } = useCart();
  const [size, setSize] = useState<ProductSize | null>(null);
  const [state, setState] = useState<AtcState>("idle");
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const flash = (next: AtcState) => {
    setState(next);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1800);
  };

  const onAdd = () => {
    if (!size) {
      flash("need-size");
      return;
    }
    addLine(product, size);
    flash("added");
  };

  const src = productCardImage(product);
  const href = `/current?product=${product.slug}`;
  const label =
    state === "added"
      ? "added ✓"
      : state === "need-size"
        ? "pick a size ↑"
        : "add to cart →";

  return (
    <article className="land-card">
      <Link
        href={href}
        className="land-card__media"
        aria-label={`${product.shirtName.toLowerCase()} — ${product.colourwayName}`}
      >
        {src ? (
          <Image
            src={src}
            alt={`${product.shirtName.toLowerCase()} in ${product.colourwayName}`}
            fill
            sizes="(max-width: 599px) 100vw, (max-width: 899px) 50vw, 33vw"
          />
        ) : (
          <span className="land-card__missing lbl">
            draft — image missing
            <br />
            {product.slug}
          </span>
        )}
      </Link>
      <div className="land-card__meta">
        <span className="land-card__name">{product.shirtName}</span>
        <span className="land-card__price">{formatPrice(product.priceCents)}</span>
      </div>
      <span className="land-card__cw">{product.colourwayName}</span>
      <div
        className="land-sizes"
        role="group"
        aria-label={`size for ${product.colourwayName}`}
        data-need={state === "need-size" ? "true" : undefined}
      >
        {SIZES.map((s) => {
          const out = isSizeSoldOut(product, s);
          return (
            <button
              key={s}
              type="button"
              className="land-size"
              aria-pressed={size === s}
              disabled={out}
              title={out ? "sold out" : undefined}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="land-atc"
        data-state={state}
        onClick={onAdd}
        aria-live="polite"
      >
        <span className="land-atc__label">{label}</span>
      </button>
    </article>
  );
}
