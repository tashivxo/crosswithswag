import { Reveal } from "@/components/v3/Reveal";
import { CartCountLink } from "@/components/v4/cart/CartCountLink";
import { ShopCard } from "@/components/v4/shop/ShopCard";
import {
  productFamilies,
  standardProducts,
  STANDARD_EDITION_TOTAL,
  type ProductFamily,
} from "@/lib/v4/products";

// Figma 21:277 order: EXPRESS x2, HALO x3, SUPER x2, DAILY x2 (one grid row per family).
const FAMILIES: ProductFamily[] = ["express", "halo", "super", "daily"];

// DRAFT: pricing, 3XL and range copy below stay draft until Marcus signs off.
export function ShopChapter() {
  return (
    <section id="shop" className="wrap land-shop" tabIndex={-1}>
      <Reveal className="land-shop__bar">
        <span className="lbl">[ 01 — shop ]</span>
        <span className="lbl lbl--clay">
          standard edition — {STANDARD_EDITION_TOTAL} shirts — drops 13.11
        </span>
      </Reveal>

      <Reveal className="land-shop__intro">
        <h2 className="land-shop__title">standard edition</h2>
        <p className="land-shop__lede">
          nine shirts, 220gsm, 100% cotton. a homage to streetwear and the y2k
          era. always open.
        </p>
      </Reveal>

      <Reveal className="land-shop__spec">
        <span className="lbl">[ the shirt ]</span>
        <p className="land-shop__spec-copy">
          <span>adult unisex, crew neck, short sleeve.</span>
          <span className="land-shop__sizes-note">sizes s to 3xl.</span>
        </p>
      </Reveal>

      <div className="land-families">
        {FAMILIES.map((family) => {
          const items = standardProducts.filter((p) => p.family === family);
          if (items.length === 0) return null;
          return (
            <Reveal key={family}>
              <div
                className="land-family"
                role="group"
                aria-label={productFamilies[family].title.toLowerCase()}
              >
                {items.map((product) => (
                  <ShopCard key={product.id} product={product} />
                ))}
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="land-close">
        <div className="land-close__copy">
          <p className="land-close__steps">
            pick a size → add → pay. no account needed.
          </p>
          {/* DRAFT: delivery note copy mirrors the PDP notes until the Figma line is confirmed. */}
          <p className="land-close__note">
            item price excludes delivery. paxi economy R60 · speed R110 ·
            door-to-door R120, chosen at checkout.
          </p>
        </div>
        <CartCountLink />
      </Reveal>
    </section>
  );
}
