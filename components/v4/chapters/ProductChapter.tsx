"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Reveal } from "@/components/v3/Reveal";
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
  productCardImage,
  productMakeTable,
  productSpecRows,
  relatedProducts,
  type ProductSize,
  type StandardProduct,
} from "@/lib/v4/products";

const SIZES: ProductSize[] = ["S", "M", "L", "XL", "2XL", "3XL"];
const DEFAULT_SLUG = "product-express-dispatch-black";

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
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={i === index ? "pdp-thumb is-active" : "pdp-thumb"}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              <Image src={src} alt="" fill sizes="120px" />
            </button>
          ))}
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
  selected: ProductSize;
  onSelect: (size: ProductSize) => void;
}) {
  return (
    <div className="pdp-sizes" role="group" aria-label="Size">
      {SIZES.map((size) => {
        const soldOut = isSizeSoldOut(product, size);
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
            onClick={() => onSelect(size)}
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

function PurchasePanel({ product }: { product: StandardProduct }) {
  const router = useRouter();
  const { addLine } = useCart();
  const [selectedSize, setSelectedSize] = useState<ProductSize>("M");
  const allColourways = [product, ...colourwaySiblings(product)].sort((a, b) =>
    a.colourwayName.localeCompare(b.colourwayName),
  );
  const soldOut = isSizeSoldOut(product, selectedSize);
  const atcLabel = soldOut ? `sold out in ${selectedSize}` : "add to cart →";

  return (
    <div className="pdp-panel">
      <p className="body-copy voice">
        a homage to streetwear and the y2k era. printed to order, packed by
        hand.
      </p>

      <dl className="pdp-spec-inline">
        {productSpecRows.map((row) => (
          <div key={row.label}>
            <dt className="lbl">{row.label}</dt>
            <dd className="voice">{row.value}</dd>
          </div>
        ))}
      </dl>

      {allColourways.length > 1 ? (
        <div className="pdp-field">
          <span className="lbl">[ colourway ]</span>
          <div className="pdp-links">
            {allColourways.map((cw) => (
              <button
                key={cw.slug}
                type="button"
                className={
                  cw.slug === product.slug ? "pdp-link is-selected" : "pdp-link"
                }
                onClick={() =>
                  router.push(`/current?product=${cw.slug}`, { scroll: false })
                }
              >
                {cw.colourwayName}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="pdp-field" id="size-guide">
        <div className="pdp-field__head">
          <span className="lbl">[ size ]</span>
          <Link
            href={`/current?product=${product.slug}#size-guide`}
            className="lbl lbl--clay"
          >
            size guide →
          </Link>
        </div>
        <SizeLinks
          product={product}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />
      </div>

      {soldOut ? <SoldOutNotify size={selectedSize} /> : null}

      <div className="cta-row">
        <button
          type="button"
          className="btn btn--clay pdp-atc"
          disabled={soldOut}
          onClick={() => addLine(product, selectedSize)}
        >
          {atcLabel}
        </button>
      </div>

      <div className="pdp-notes lbl">
        <p>open year round — drops friday 13 november</p>
        <p>
          item price excludes delivery. paxi economy R60 · speed R110 ·
          door-to-door R120, chosen at checkout.
        </p>
        <p>guest checkout — no account needed</p>
      </div>

      <div className="pdp-sticky">
        <span className="lbl lbl--sand">
          {formatPrice(product.priceCents)} · {product.colourwayName} ·{" "}
          {selectedSize}
        </span>
        <button
          type="button"
          className="btn btn--clay"
          disabled={soldOut}
          onClick={() => addLine(product, selectedSize)}
        >
          {atcLabel}
        </button>
      </div>
    </div>
  );
}

function RelatedTile({ product }: { product: StandardProduct }) {
  const src = productCardImage(product);
  return (
    <Link href={`/current?product=${product.slug}`} className="shop-tile">
      <div className="frame shop-tile__frame">
        {src ? (
          <Image
            src={src}
            alt={`${product.shirtName.toLowerCase()} in ${product.colourwayName}`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <span className="shop-tile__fill voice">{product.colourwayName}</span>
        )}
      </div>
      <div className="shop-tile__meta">
        <span className="lbl lbl--sand">
          {product.shirtName.toLowerCase()} — {product.colourwayName}
        </span>
        <span className="lbl">{formatPrice(product.priceCents)}</span>
      </div>
    </Link>
  );
}

export function ProductChapter() {
  const params = useSearchParams();
  const slug = params.get("product") ?? DEFAULT_SLUG;
  const product = productBySlug(slug) ?? productBySlug(DEFAULT_SLUG);

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
      <section
        id="current-head"
        className="wrap page-head pdp-head"
        tabIndex={-1}
      >
        <div className="hero-top">
          <span className="lbl lbl--sand">
            [ shirt {pad(product.shirtIndex)} of {pad(STANDARD_EDITION_TOTAL)} ]
          </span>
          <span className="state state--live">open year round</span>
        </div>
        <nav className="lbl pdp-crumb" aria-label="Breadcrumb">
          <Link href="/#shop">← all shirts</Link>
        </nav>
        <h1 className="display pdp-title voice">
          {product.shirtName.toLowerCase()}
        </h1>
        <p className="pdp-colourway">
          <span className="hero-mark__clay voice">{product.colourwayName}</span>
          <span className="lbl">
            {formatPrice(product.priceCents)} + delivery
          </span>
        </p>
      </section>

      <section className="wrap pad-sm pdp-main">
        <ProductGallery key={`gallery-${product.slug}`} product={product} />
        <PurchasePanel key={`panel-${product.slug}`} product={product} />
      </section>

      <section className="wrap pad-sm">
        <Reveal className="sect-head">
          <span className="lbl">[ 02 — more from the standard edition ]</span>
          <Link className="lbl lbl--clay" href="/#shop">
            all nine →
          </Link>
        </Reveal>
        <Reveal className="shop-row__grid pdp-related">
          {related.map((item) => (
            <RelatedTile key={item.id} product={item} />
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
