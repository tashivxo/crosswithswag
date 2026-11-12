"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/v4/cart/CartProvider";
import {
  formatPrice,
  productCardImage,
  productCardLinkName,
  productHasBackPrint,
  sizeButtonState,
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

  const frontSrc = productCardImage(product);
  const hoverSrc = product.images.hover;
  const backPrint = productHasBackPrint(product);
  const imageSizes = "(max-width: 599px) 100vw, (max-width: 899px) 50vw, 33vw";
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
        data-hover={product.images.hoverView}
        aria-label={productCardLinkName(product)}
      >
        {frontSrc && backPrint && hoverSrc ? (
          <span className="land-card__flip">
            <Image
              className="land-card__media-img land-card__media-img--front"
              src={frontSrc}
              alt=""
              aria-hidden
              fill
              sizes={imageSizes}
            />
            <Image
              className="land-card__media-img land-card__media-img--back"
              src={hoverSrc}
              alt=""
              aria-hidden
              fill
              sizes={imageSizes}
              loading="eager"
              fetchPriority="low"
            />
          </span>
        ) : frontSrc ? (
          <>
            <Image
              className="land-card__media-img land-card__media-img--front"
              src={frontSrc}
              alt={`${product.shirtName.toLowerCase()} in ${product.colourwayName}`}
              fill
              sizes={imageSizes}
            />
            {hoverSrc ? (
              <Image
                className="land-card__media-img land-card__media-img--detail"
                src={hoverSrc}
                alt=""
                fill
                sizes={imageSizes}
                aria-hidden
              />
            ) : null}
          </>
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
      <span className="land-card__cw">
        <span>{product.colourwayName}</span>
        {backPrint ? <span className="land-card__back">back print</span> : null}
      </span>
      <div
        className="land-sizes"
        role="group"
        aria-label={`size for ${product.colourwayName}`}
        data-need={state === "need-size" ? "true" : undefined}
      >
        {SIZES.map((s) => {
          const { soldOut, selectable, label } = sizeButtonState(product, s);
          return (
            <button
              key={s}
              type="button"
              className="land-size"
              aria-pressed={size === s}
              aria-disabled={soldOut || undefined}
              aria-label={soldOut ? label : undefined}
              onClick={() => {
                if (selectable) setSize(s);
              }}
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
