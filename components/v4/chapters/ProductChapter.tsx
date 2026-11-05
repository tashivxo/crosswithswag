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
  galleryDesktopMain,
  galleryDesktopThumbs,
  galleryMobileSlides,
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
  src: string;
  alt: string;
  priority?: boolean;
}) {
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

function GalleryPlaceholder() {
  return <div className="v4-product-gallery__placeholder" aria-hidden />;
}

function ProductGallery({ product }: { product: StandardProduct }) {
  const mainSrc = galleryDesktopMain(product);
  const thumbs = useMemo(
    () => galleryDesktopThumbs(product),
    [product],
  );
  const mobileSlides = useMemo(
    () => galleryMobileSlides(product),
    [product],
  );
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (delta: number) => {
      if (mobileSlides.length <= 1) return;
      setIndex((i) => (i + delta + mobileSlides.length) % mobileSlides.length);
    },
    [mobileSlides.length],
  );

  const mobileSrc = mobileSlides[index] ?? mobileSlides[0];

  return (
    <div className="v4-product-gallery">
      <div className="v4-product-gallery__desktop">
        <div className="v4-product-gallery__main">
          {mainSrc ? (
            <GalleryImage
              src={mainSrc}
              alt={`${product.colourwayName} — front`}
              priority
            />
          ) : (
            <GalleryPlaceholder />
          )}
        </div>
        {thumbs.length > 0 ? (
          <div
            className={[
              "v4-product-gallery__thumbs",
              thumbs.length === 1 ? "v4-product-gallery__thumbs--one" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {thumbs.map((src, thumbIndex) => (
              <div key={src + thumbIndex} className="v4-product-gallery__thumb">
                <GalleryImage
                  src={src}
                  alt={`${product.colourwayName} — view ${thumbIndex + 2}`}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="v4-product-gallery__mobile">
        {mobileSrc ? (
          <button
            type="button"
            className="v4-product-gallery__pager"
            onClick={() => go(1)}
            aria-label={`Product image ${index + 1} of ${mobileSlides.length}`}
          >
            <GalleryImage
              src={mobileSrc}
              alt={`${product.colourwayName} — view ${index + 1}`}
              priority
            />
            {mobileSlides.length > 1 ? (
              <span className="v4-product-gallery__pager-label">
                {index + 1} / {mobileSlides.length}
              </span>
            ) : null}
          </button>
        ) : (
          <div className="v4-product-gallery__pager">
            <GalleryPlaceholder />
          </div>
        )}
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
  onNotify: (email: string) => Promise<boolean>;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sent" | "invalid" | "unavailable"
  >("idle");

  return (
    <div className="v4-product-soldout">
      <p className="v4-product-soldout__help">
        {size.toLowerCase()} is sold out. leave your email and we will tell you
        when it is back.
      </p>
      <form
        className="v4-product-soldout__form"
        onSubmit={async (e) => {
          e.preventDefault();
          const trimmed = email.trim();
          if (!trimmed.includes("@")) {
            setStatus("invalid");
            return;
          }
          const ok = await onNotify(trimmed);
          setStatus(ok ? "sent" : "unavailable");
        }}
      >
        <label className="sr-only" htmlFor="v4-notify-email">
          Email for restock notification
        </label>
        <input
          id="v4-notify-email"
          type="email"
          autoComplete="email"
          placeholder="your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          className="v4-product-soldout__input"
        />
        <V4OutlineClayButton type="submit" className="v4-product-soldout__submit">
          NOTIFY ME →
        </V4OutlineClayButton>
      </form>
      {status === "sent" ? (
        <p className="v4-product-soldout__thanks">
          received — we will be in touch.
        </p>
      ) : null}
      {status === "invalid" ? (
        <p className="v4-product-soldout__thanks">enter a valid email.</p>
      ) : null}
      {status === "unavailable" ? (
        <p className="v4-product-soldout__thanks">
          notify unavailable — try again later.
        </p>
      ) : null}
    </div>
  );
}

function RelatedCard({ product }: { product: StandardProduct }) {
  const { addLine } = useCart();
  const [size, setSize] = useState<ProductSize>("M");
  const hasCardImage = Boolean(product.images.card);

  return (
    <article className="v4-product-related-card">
      <Link
        href={`/current?product=${product.slug}`}
        className="v4-product-related-card__link"
      >
        <div className="v4-product-related-card__media">
          {hasCardImage ? (
            <Image
              src={product.images.card}
              alt={product.colourwayName}
              fill
              sizes="280px"
              className="v4-product-gallery__img"
            />
          ) : (
            <div className="v4-product-gallery__placeholder" aria-hidden />
          )}
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

function ProductPurchasePanel({ product }: { product: StandardProduct }) {
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
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });
      return res.ok;
    } catch {
      return false;
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
          <span className="v4-product-sticky__variant">
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

  const related = relatedProducts();

  return (
    <div className="v4-product-page">
      <section className="v4-product-main wrap">
        <div className="v4-product-main__label-row">
          <div className="v4-product-main__crumb">
            <Link href="/#shop">← ALL SHIRTS</Link>
            <span aria-hidden> / </span>
            <span>{product.shirtName}</span>
            <span className="v4-product-main__crumb-colour" aria-hidden>
              {" "}
              /{" "}
            </span>
            <span className="v4-product-main__crumb-colour">
              {product.colourwayName.toUpperCase()}
            </span>
          </div>
          <span className="v4-badge v4-badge--studio v4-product-main__badge">
            OPEN YEAR ROUND
          </span>
        </div>

        <div className="v4-product__layout">
          <ProductGallery
            key={`gallery-${product.slug}`}
            product={product}
          />
          <ProductPurchasePanel
            key={`panel-${product.slug}`}
            product={product}
          />
        </div>
      </section>

      <section className="v4-product-more wrap">
        <div className="v4-product-more__head v4-product-more__head--desktop">
          <p className="lbl">[ 02 — MORE FROM THE STANDARD EDITION ]</p>
          <div className="v4-product-more__links">
            <span>ALL NINE</span>
            <Link href="/">→ SHOP →</Link>
          </div>
        </div>
        <div className="v4-product-more__head v4-product-more__head--mobile">
          <p className="lbl">[ MORE FROM THE STANDARD EDITION ]</p>
          <Link href="/" className="v4-product-more__all-nine">
            ALL NINE →
          </Link>
        </div>
        <div className="v4-product-related-grid">
          {related.map((item) => (
            <RelatedCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section className="v4-product-spec wrap">
        <div className="v4-product-spec__layout">
          <div className="v4-product-spec__poster">
            <p className="lbl">[ 03 — SPECIFICATION ]</p>
            <h2 className="v4-product-make">
              <span>THE</span>
              <span>MAKE.</span>
            </h2>
          </div>
          <dl className="v4-product-make-table">
            {productMakeTable.map((row) => (
              <div key={row.label} className="v4-product-make-table__row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="v4-product-director wrap">
        <blockquote className="v4-product-director__note">
          <p className="lbl">[ A MESSAGE FROM THE DIRECTOR ]</p>
          <p>
            [ director note — written per edition, signed. frozen on the archive
            record once the edition closes. ]
          </p>
          <footer className="v4-product-director__signoff">
            <span className="v4-product-director__name">— the.director</span>
            <span className="v4-product-director__edition">standard edition</span>
          </footer>
        </blockquote>
      </section>
    </div>
  );
}
