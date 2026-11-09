"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/v3/Reveal";
import { productPage } from "@/lib/copy";
import { ShopCard } from "@/components/v4/shop/ShopCard";
import { useCart } from "@/lib/v4/cart/CartProvider";
import { INITIAL_SIZE, pdpPath, stripSizeParam } from "@/lib/v4/pdp-url";
import { isStickyBarHidden } from "@/lib/v4/pdp-sticky";
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
  sizeButtonState,
  relatedProducts,
  sizeAfterColourwaySwitch,
  type ProductSize,
  type StandardProduct,
} from "@/lib/v4/products";

const SIZES: ProductSize[] = ["S", "M", "L", "XL", "2XL", "3XL"];
const DEFAULT_SLUG = "product-express-dispatch-black";
const SIZE_HINT_ID = "pdp-size-hint";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function galleryImages(product: StandardProduct): string[] {
  const main = galleryDesktopMain(product);
  const all = [
    ...(main ? [main] : []),
    ...galleryDesktopThumbs(product),
    ...galleryMobileSlides(product),
  ];
  return Array.from(new Set(all));
}

function ProductGallery({ product }: { product: StandardProduct }) {
  const images = useMemo(() => galleryImages(product), [product]);
  const [index, setIndex] = useState(0);
  const active = images[index];

  return (
    <div className="pdp-gallery">
      <div className="frame pdp-gallery__main">
        {active ? (
          <Image
            src={active}
            alt={`${product.colourwayName} — view ${index + 1}`}
            fill
            sizes="(max-width: 899px) 100vw, 55vw"
            priority
          />
        ) : (
          <span className="shop-tile__fill voice">{product.colourwayName}</span>
        )}
      </div>
      {images.length > 1 ? (
        <div className="pdp-gallery__thumbs">
          {images.map((src, i) =>
            i === index ? null : (
            <button
              key={src}
              type="button"
              className={src.includes("print") ? "pdp-thumb pdp-thumb--print" : "pdp-thumb"}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              onClick={() => setIndex(i)}
            >
              <Image src={src} alt="" fill sizes="(max-width: 899px) 50vw, 25vw" />
            </button>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}

function SizeLinks({
  product,
  selected,
  onSelect,
}: {
  product: StandardProduct;
  selected: ProductSize | null;
  onSelect: (size: ProductSize) => void;
}) {
  return (
    <div className="pdp-sizes" role="group" aria-label="Size">
      {SIZES.map((size) => {
        const { soldOut, selectable, label } = sizeButtonState(product, size);
        const isSelected = selected === size;
        return (
          <button
            key={size}
            type="button"
            className={[
              "pdp-size",
              isSelected ? "is-selected" : "",
              soldOut ? "is-sold-out" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={isSelected}
            aria-disabled={soldOut || undefined}
            aria-label={soldOut ? label : undefined}
            onClick={() => {
              if (selectable) onSelect(size);
            }}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

function SoldOutNotify({ size }: { size: ProductSize }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent" | "invalid">("idle");

  return (
    <div className="pdp-notify">
      <p className="body-copy voice">
        {size.toLowerCase()} is sold out. leave your email and we will tell you
        when it is back.
      </p>
      <form
        className="pdp-notify__form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email.trim().includes("@")) {
            setStatus("invalid");
            return;
          }
          setStatus("sent");
        }}
      >
        <label className="sr-only" htmlFor="pdp-notify-email">
          Email for restock notification
        </label>
        <input
          id="pdp-notify-email"
          type="email"
          autoComplete="email"
          placeholder="your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          className="pdp-notify__input"
        />
        <button type="submit" className="btn btn--clay">
          notify me →
        </button>
      </form>
      {status === "sent" ? (
        <p className="lbl lbl--clay">received — we will be in touch.</p>
      ) : null}
      {status === "invalid" ? <p className="lbl">enter a valid email.</p> : null}
    </div>
  );
}

function PurchasePanel({
  product,
  selectedSize,
  onSelectSize,
  onSelectColourway,
}: {
  product: StandardProduct;
  selectedSize: ProductSize | null;
  onSelectSize: (size: ProductSize) => void;
  onSelectColourway: (slug: string) => void;
}) {
  const { addLine } = useCart();
  const mainAtcRef = useRef<HTMLButtonElement>(null);
  const [mainAtcInView, setMainAtcInView] = useState<boolean | null>(null);
  useEffect(() => {
    const el = mainAtcRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setMainAtcInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const allColourways = [product, ...colourwaySiblings(product)].sort((a, b) =>
    a.colourwayName.localeCompare(b.colourwayName),
  );
  const soldOut = selectedSize ? isSizeSoldOut(product, selectedSize) : false;
  const needsSize = selectedSize === null;
  const canAdd = selectedSize !== null && !soldOut;
  const atcLabel = !selectedSize
    ? productPage.selectSize
    : soldOut
      ? `sold out in ${selectedSize}`
      : "add to cart →";

  return (
    <div className="pdp-panel">
      <span className="lbl pdp-kicker">
        [ shirt {pad(product.shirtIndex)} of {pad(STANDARD_EDITION_TOTAL)} ]
      </span>
      <h1 className="pdp-title voice">{product.shirtName.toLowerCase()}</h1>
      <p className="pdp-colourway-name voice">{product.colourwayName}</p>
      <div className="pdp-price">
        <span className="pdp-price__amount">
          {formatPrice(product.priceCents)}
        </span>
        <span className="lbl">{productPage.priceNote}</span>
      </div>
      <p className="pdp-desc voice">{productPage.description}</p>

      <dl className="pdp-spec">
        {productSpecRows.map((row) => (
          <div key={row.label} className="pdp-spec__row">
            <dt className="lbl">{row.label}</dt>
            <dd className="voice">{row.value}</dd>
          </div>
        ))}
      </dl>

      {allColourways.length > 1 ? (
        <div className="pdp-field pdp-field--colourway">
          <span className="lbl">{productPage.colourwayLabel}</span>
          <div className="pdp-links">
            {allColourways.map((cw) => (
              <button
                key={cw.slug}
                type="button"
                className="pdp-link"
                aria-pressed={cw.slug === product.slug}
                onClick={() => onSelectColourway(cw.slug)}
              >
                {cw.colourwayName}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="pdp-field" id="size-guide">
        <div className="pdp-field__head">
          <span className="lbl">{productPage.sizeLabel}</span>
          <Link
            href={`/current?product=${product.slug}#size-guide`}
            className="lbl pdp-size-guide"
          >
            {productPage.sizeGuide}
          </Link>
        </div>
        <SizeLinks
          product={product}
          selected={selectedSize}
          onSelect={onSelectSize}
        />
      </div>

      {soldOut && selectedSize ? <SoldOutNotify size={selectedSize} /> : null}

      {needsSize ? (
        <span id={SIZE_HINT_ID} className="sr-only">
          {productPage.sizeHint}
        </span>
      ) : null}

      <button
        type="button"
        ref={mainAtcRef}
        className="btn btn--clay pdp-atc"
        disabled={soldOut}
        aria-disabled={needsSize || undefined}
        aria-describedby={needsSize ? SIZE_HINT_ID : undefined}
        onClick={() => canAdd && selectedSize && addLine(product, selectedSize)}
      >
        {atcLabel}
      </button>

      <div className="pdp-notes">
        <p className="lbl pdp-notes__open">{productPage.notes.open}</p>
        <p className="pdp-notes__body">{productPage.notes.delivery}</p>
        <p className="lbl pdp-notes__guest">{productPage.notes.guest}</p>
      </div>

      <div className="pdp-sticky" data-hidden={isStickyBarHidden(mainAtcInView) || undefined}>
        <span className="lbl pdp-sticky__label">
          {formatPrice(product.priceCents)} · {product.colourwayName} ·{" "}
          {selectedSize ?? productPage.pickSize}
        </span>
        <button
          type="button"
          className="btn btn--clay pdp-sticky__atc"
          disabled={soldOut}
          aria-disabled={needsSize || undefined}
          aria-describedby={needsSize ? SIZE_HINT_ID : undefined}
          onClick={() => canAdd && selectedSize && addLine(product, selectedSize)}
        >
          {atcLabel}
        </button>
      </div>
    </div>
  );
}

export function ProductChapter() {
  const params = useSearchParams();
  const urlSlug = params.get("product") ?? DEFAULT_SLUG;
  const [slug, setSlug] = useState(urlSlug);
  const [seenUrlSlug, setSeenUrlSlug] = useState(urlSlug);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(INITIAL_SIZE);

  // Shared URLs carry the colourway only: never read a size, and drop one if a link brought it.
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    const cleaned = stripSizeParam(search);
    if (cleaned === null) return;
    window.history.replaceState(window.history.state, "", `${pathname}${cleaned}${hash}`);
  }, [params]);

  // Back/forward, shared links and shop-card links change the URL: follow it.
  if (urlSlug !== seenUrlSlug) {
    setSeenUrlSlug(urlSlug);
    setSlug(urlSlug);
  }

  const product = productBySlug(slug) ?? productBySlug(DEFAULT_SLUG);

  // The visible shirt is local state so a colourway click never waits on a navigation.
  // The URL is mirrored with replaceState (no history entry, no scroll jump).
  const selectColourway = (nextSlug: string) => {
    const next = productBySlug(nextSlug);
    if (!next || nextSlug === slug) return;
    setSlug(nextSlug);
    setSelectedSize((size) => sizeAfterColourwaySwitch(next, size));
    const { pathname, hash } = window.location;
    window.history.replaceState(
      window.history.state,
      "",
      pdpPath(pathname, nextSlug, hash),
    );
  };

  if (!product) {
    return (
      <section className="wrap pad">
        <p className="body-copy voice">product not found.</p>
      </section>
    );
  }

  const related = relatedProducts();

  return (
    <section id="current" className="chapter pdp">
      <div id="current-head" className="wrap pdp-top" tabIndex={-1}>
        <nav className="lbl pdp-crumb" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/#shop">← {productPage.crumbAll}</Link>
            </li>
            <li>{product.shirtName.toLowerCase()}</li>
            <li aria-current="page">{product.colourwayName}</li>
          </ol>
        </nav>
        <span className="pdp-badge">{productPage.badge}</span>
      </div>

      <section className="wrap pad-sm pdp-main">
        <ProductGallery key={`gallery-${product.slug}`} product={product} />
        <PurchasePanel
          product={product}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          onSelectColourway={selectColourway}
        />
      </section>

      <section className="wrap pad-sm">
        <Reveal className="sect-head pdp-related-head">
          <span className="lbl">{productPage.relatedLabel}</span>
          <Link className="lbl lbl--clay" href="/#shop">
            {productPage.relatedAll}
          </Link>
        </Reveal>
        <Reveal className="land-family pdp-related">
          {related.map((item) => (
            <ShopCard key={item.id} product={item} />
          ))}
        </Reveal>
      </section>

      <section className="wrap pad-sm">
        <Reveal className="feature current-spec">
          <div>
            <span className="lbl">[ 03 — specification ]</span>
            <h2 className="sect current-spec__title">
              THE
              <br />
              MAKE.
            </h2>
          </div>
          <table className="spec">
            <tbody>
              {productMakeTable.map((row) => (
                <tr key={row.label}>
                  <td>{row.label.toLowerCase()}</td>
                  <td className="voice">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <section className="wrap pad">
        <Reveal className="sig current-sig">
          <span className="lbl">[ a message from the director ]</span>
          <div className="body-copy voice current-sig__copy">
            <p>
              [ director note — written per edition, signed. frozen on the
              archive record once the edition closes. ]
            </p>
          </div>
          <div className="sig-name voice">— the.director</div>
          <div className="sig-ed voice">standard edition</div>
        </Reveal>
      </section>
    </section>
  );
}
