"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { V4OutlineClayButton } from "@/components/v4/V4Shop";
import { useCart } from "@/lib/v4/cart/CartProvider";
import {
  STANDARD_EDITION_TOTAL,
  colourwaySiblings,
  formatPrice,
  gallerySlides,
  isSizeSoldOut,
  productBySlug,
  productMakeTable,
  productSpecRows,
  relatedProducts,
  type ProductSize,
  type StandardProduct,
} from "@/lib/v4/products";

const SIZES: ProductSize[] = ["S", "M", "L", "XL", "2XL", "3XL"];

const DEFAULT_SLUG = "product-express-dispatch-black";

function padShirtIndex(n: number): string {
  return String(n).padStart(2, "0");
}

function GalleryImage({
  src,
  alt,
  priority,
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
}) {
  if (!src) {
    return <div className="v4-product-gallery__placeholder" aria-hidden />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 899px) 100vw, 760px"
      className="v4-product-gallery__img"
      priority={priority}
    />
  );
}

function ProductGallery({
  product,
}: {
  product: StandardProduct;
}) {
  const slides = useMemo(() => gallerySlides(product), [product]);
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + slides.length) % slides.length);
    },
    [slides.length],
  );

  const mainSrc = slides[0];
  const thumbA = slides[1];
  const thumbB = slides[2];

  return (
    <div className="v4-product-gallery">
      <div className="v4-product-gallery__desktop">
        <div className="v4-product-gallery__main">
          <GalleryImage
            src={mainSrc}
            alt={`${product.colourwayName} — front`}
            priority
          />
        </div>
        <div className="v4-product-gallery__thumbs">
          <div className="v4-product-gallery__thumb">
            <GalleryImage src={thumbA} alt={`${product.colourwayName} — back`} />
          </div>
          <div className="v4-product-gallery__thumb">
            <GalleryImage src={thumbB} alt={`${product.colourwayName} — detail`} />
          </div>
        </div>
      </div>

      <div className="v4-product-gallery__mobile">
        <div className="v4-product-gallery__pager">
          <GalleryImage
            src={slides[index]}
            alt={`${product.colourwayName} — view ${index + 1}`}
            priority
          />
          <span className="v4-product-gallery__pager-label">
            {index + 1}/{slides.length}
          </span>
        </div>
        <div className="v4-product-gallery__pager-controls">
          <button type="button" onClick={() => go(-1)} aria-label="Previous image">
            ←
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next image">
            →
          </button>
        </div>
      </div>
    </div>
  );
}

function SizeLinks({
  product,
  selected,
  onSelect,
  className,
}: {
  product: StandardProduct;
  selected: ProductSize;
  onSelect: (size: ProductSize) => void;
  className?: string;
}) {
  return (
    <div className={["v4-product-sizes", className].filter(Boolean).join(" ")}>
      {SIZES.map((size) => {
        const soldOut = isSizeSoldOut(product, size);
        const isSelected = selected === size;
        return (
          <button
            key={size}
            type="button"
            className={[
              "v4-product-size-link",
              isSelected ? "is-selected" : "",
              soldOut ? "is-sold-out" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onSelect(size)}
            aria-pressed={isSelected}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

function SoldOutNotify({
  size,
  onNotify,
}: {
  size: ProductSize;
  onNotify: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  return (
    <div className="v4-product-soldout">
      <p className="v4-product-soldout__help">
        {size} is sold out. leave your email and we will tell you when it is
        back.
      </p>
      <form
        className="v4-product-soldout__form"
        onSubmit={(e) => {
          e.preventDefault();
          const trimmed = email.trim();
          if (!trimmed.includes("@")) {
            setStatus("error");
            return;
          }
          onNotify(trimmed);
          setStatus("sent");
        }}
      >
        <label className="sr-only" htmlFor="v4-notify-email">
          Email for restock notification
        </label>
        <input
          id="v4-notify-email"
          type="email"
          autoComplete="email"
          placeholder="email@address.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          className="v4-product-soldout__input"
        />
        <V4OutlineClayButton type="submit">NOTIFY ME →</V4OutlineClayButton>
      </form>
      {status === "sent" ? (
        <p className="v4-product-soldout__thanks">received — we will be in touch.</p>
      ) : null}
      {status === "error" ? (
        <p className="v4-product-soldout__thanks">enter a valid email.</p>
      ) : null}
    </div>
  );
}

function RelatedCard({ product }: { product: StandardProduct }) {
  const { addLine } = useCart();
  const [size, setSize] = useState<ProductSize>("M");

  return (
    <article className="v4-product-related-card">
      <Link
        href={`/current?product=${product.slug}`}
        className="v4-product-related-card__link"
      >
        <div className="v4-product-related-card__media">
          <Image
            src={product.images.card}
            alt={product.colourwayName}
            fill
            sizes="280px"
            className="v4-product-gallery__img"
          />
        </div>
        <p className="lbl v4-product-related-card__name">{product.shirtName}</p>
        <p className="v4-product-related-card__price">
          {formatPrice(product.priceCents)}
        </p>
        <p className="v4-product-related-card__colourway">
          {product.colourwayName}
        </p>
      </Link>
      <SizeLinks
        product={product}
        selected={size}
        onSelect={setSize}
        className="v4-product-related-card__sizes"
      />
      <V4OutlineClayButton
        className="v4-product-related-card__atc"
        disabled={isSizeSoldOut(product, size)}
        onClick={() => addLine(product, size)}
      >
        ADD TO CART →
      </V4OutlineClayButton>
    </article>
  );
}

function ProductPurchasePanel({
  product,
}: {
  product: StandardProduct;
}) {
  const router = useRouter();
  const { addLine } = useCart();
  const [selectedSize, setSelectedSize] = useState<ProductSize>("M");

  const siblings = colourwaySiblings(product);
  const allColourways = [product, ...siblings].sort((a, b) =>
    a.colourwayName.localeCompare(b.colourwayName),
  );
  const soldOut = isSizeSoldOut(product, selectedSize);

  const handleNotify = useCallback(async (email: string) => {
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
    } catch {
      /* client-only fallback — no API required */
    }
  }, []);

  return (
    <div className="v4-product__aside">
      <div className="v4-product__panel">
        <p className="lbl v4-product__index">
          [ SHIRT {padShirtIndex(product.shirtIndex)} OF{" "}
          {padShirtIndex(STANDARD_EDITION_TOTAL)} ]
        </p>
        <h1 className="v4-product__title">
          {product.shirtName.toLowerCase()}
        </h1>
        <p className="v4-product__colourway text-clay">
          {product.colourwayName}
        </p>
        <p className="v4-product__price-row">
          <span className="v4-product__price">
            {formatPrice(product.priceCents)}
          </span>
          <span className="lbl">+ ITEM PRICE — DELIVERY EXTRA</span>
        </p>
        <p className="v4-product__lede">
          a homage to streetwear and the y2k era. printed to order, packed by
          hand.
        </p>

        <dl className="v4-product-spec-inline">
          {productSpecRows.map((row) => (
            <div key={row.label} className="v4-product-spec-inline__row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>

        {allColourways.length > 1 ? (
          <div className="v4-product-colourways">
            <span className="lbl">COLOURWAY:</span>
            <div className="v4-product-colourways__links">
              {allColourways.map((cw) => {
                const isCurrent = cw.slug === product.slug;
                return (
                  <button
                    key={cw.slug}
                    type="button"
                    className={
                      isCurrent
                        ? "v4-product-colourway-link is-selected"
                        : "v4-product-colourway-link"
                    }
                    onClick={() =>
                      router.push(`/current?product=${cw.slug}`, {
                        scroll: false,
                      })
                    }
                  >
                    {cw.colourwayName}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="v4-product-size-block" id="size-guide">
          <div className="v4-product-size-block__head">
            <span className="lbl">SIZE</span>
            <Link href="/current#size-guide" className="v4-product-size-guide">
              + SIZE GUIDE →
            </Link>
          </div>
          <SizeLinks
            product={product}
            selected={selectedSize}
            onSelect={setSelectedSize}
          />
        </div>

        {soldOut ? (
          <SoldOutNotify size={selectedSize} onNotify={handleNotify} />
        ) : null}

        <V4OutlineClayButton
          className="v4-product__atc"
          disabled={soldOut}
          onClick={() => addLine(product, selectedSize)}
        >
          {soldOut ? `SOLD OUT IN ${selectedSize}` : "ADD TO CART →"}
        </V4OutlineClayButton>

        <div className="v4-product-notes text-clay">
          <p>OPEN YEAR ROUND — DROPS FRIDAY 13 NOVEMBER</p>
          <p>
            item price excludes delivery. paxi economy R60 · speed R110 ·
            door-to-door R120, chosen at checkout.
          </p>
          <p>GUEST CHECKOUT — NO ACCOUNT NEEDED</p>
        </div>
      </div>

      <div className="v4-product-sticky" aria-hidden={false}>
        <div className="v4-product-sticky__meta">
          <span>{formatPrice(product.priceCents)}</span>
          <span>
            {product.colourwayName} · {selectedSize}
          </span>
        </div>
        <V4OutlineClayButton
          className="v4-product-sticky__btn"
          disabled={soldOut}
          onClick={() => addLine(product, selectedSize)}
        >
          {soldOut ? `SOLD OUT IN ${selectedSize}` : "ADD TO CART →"}
        </V4OutlineClayButton>
      </div>
    </div>
  );
}

export function ProductChapter() {
  const params = useSearchParams();
  const slug = params.get("product") ?? DEFAULT_SLUG;
  const product = slug ? productBySlug(slug) : productBySlug(DEFAULT_SLUG);

  if (!product) {
    return (
      <section className="v4-product-page section-shell">
        <p>Product not found.</p>
      </section>
    );
  }

  const related = relatedProducts(product.slug);

  return (
    <div className="v4-product-page">
      <section className="v4-product-main wrap">
        <div className="v4-product-main__crumb">
          <Link href="/#shop">← ALL SHIRTS</Link>
          <span aria-hidden> / </span>
          <span>{product.shirtName}</span>
          <span aria-hidden> / </span>
          <span>{product.colourwayName.toUpperCase()}</span>
        </div>
        <span className="v4-badge v4-badge--studio">OPEN YEAR ROUND</span>

        <div className="v4-product__layout">
          <ProductGallery key={product.slug} product={product} />
          <ProductPurchasePanel key={product.slug} product={product} />
        </div>
      </section>

      <section className="v4-product-more wrap">
        <div className="v4-product-more__head">
          <p className="lbl">[ 02 — MORE FROM THE STANDARD EDITION ]</p>
          <div className="v4-product-more__links">
            <span>ALL NINE</span>
            <Link href="/">→ SHOP →</Link>
          </div>
        </div>
        <div className="v4-product-related-grid">
          {related.map((item) => (
            <RelatedCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section className="v4-product-spec wrap">
        <p className="lbl">[ 03 — SPECIFICATION ]</p>
        <h2 className="v4-product-make">THE MAKE.</h2>
        <dl className="v4-product-make-table">
          {productMakeTable.map((row) => (
            <div key={row.label} className="v4-product-make-table__row">
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="v4-product-director wrap">
        <blockquote className="v4-product-director__note">
          <p className="lbl">[ A MESSAGE FROM THE DIRECTOR ]</p>
          <p>
            [ director note — written per edition, signed. frozen on the archive
            record once the edition closes. ]
          </p>
          <footer>— the.director / standard edition</footer>
        </blockquote>
      </section>
    </div>
  );
}
