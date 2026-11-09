import { Reveal } from "@/components/v3/Reveal";
import { landing } from "@/lib/copy";
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
        <span className="lbl">{landing.shop.barLabel}</span>
        <span className="lbl lbl--clay">
          {landing.shop.barStatus(STANDARD_EDITION_TOTAL)}
        </span>
      </Reveal>

      <Reveal className="land-shop__intro">
        <h2 className="land-shop__title">{landing.shop.title}</h2>
        <p className="land-shop__lede">{landing.shop.lede}</p>
      </Reveal>

      <Reveal className="land-shop__spec">
        <span className="lbl">{landing.shop.specLabel}</span>
        <p className="land-shop__spec-copy">
          <span>{landing.shop.specCopy}</span>
          <span className="land-shop__sizes-note">{landing.shop.sizesNote}</span>
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
          <p className="land-close__steps">{landing.shop.steps}</p>
          {/* DRAFT: delivery note copy mirrors the PDP notes until the Figma line is confirmed. */}
          <p className="land-close__note">{landing.shop.deliveryNote}</p>
        </div>
        <CartCountLink />
      </Reveal>
    </section>
  );
}
