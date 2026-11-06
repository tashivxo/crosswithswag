import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/v3/Reveal";
import {
  formatPrice,
  productFamilies,
  productCardImage,
  standardProducts,
  STANDARD_EDITION_TOTAL,
  type ProductFamily,
  type StandardProduct,
} from "@/lib/v4/products";

const FAMILIES: ProductFamily[] = ["express", "halo", "super", "daily"];

function ShopTile({ product }: { product: StandardProduct }) {
  const src = productCardImage(product);
  return (
    <Link
      href={`/current?product=${product.slug}`}
      className="shop-tile"
      aria-label={`${product.shirtName.toLowerCase()} — ${product.colourwayName}`}
    >
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
        <span className="lbl lbl--sand">{product.colourwayName}</span>
        <span className="lbl">{formatPrice(product.priceCents)}</span>
      </div>
    </Link>
  );
}

export function ShopChapter() {
  return (
    <section id="shop" className="wrap pad shop" tabIndex={-1}>
      <Reveal className="sect-head">
        <span className="lbl">[ 01 — shop ]</span>
        <span className="lbl">
          standard edition — {STANDARD_EDITION_TOTAL} shirts — drops 13.11
        </span>
      </Reveal>
      <Reveal className="shop-intro">
        <h2 className="display shop-title voice">standard edition</h2>
        <p className="body-copy voice">
          a homage to streetwear and the y2k era. always open. drops 13.11.
        </p>
        <p className="lbl shop-spec">
          adult unisex — crew neck — short sleeve — sizes s to 3xl
        </p>
      </Reveal>

      {FAMILIES.map((family) => {
        const items = standardProducts.filter((p) => p.family === family);
        if (items.length === 0) return null;
        return (
          <div key={family} className="shop-row">
            <Reveal className="sect-head shop-row__head">
              <span className="lbl lbl--clay">
                {productFamilies[family].title.toLowerCase()}
              </span>
              <span className="lbl">
                {items.length} colourway{items.length === 1 ? "" : "s"}
              </span>
            </Reveal>
            <Reveal className="shop-row__grid">
              {items.map((product) => (
                <ShopTile key={product.id} product={product} />
              ))}
            </Reveal>
          </div>
        );
      })}

      <Reveal className="cta-row shop-cta">
        <Link className="btn btn--clay" href="/cart">
          go to cart →
        </Link>
      </Reveal>
    </section>
  );
}
