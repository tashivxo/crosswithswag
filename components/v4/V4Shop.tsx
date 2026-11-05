import Link from "next/link";
import {
  formatPrice,
  productFamilies,
  standardProducts,
  type ProductFamily,
  type ProductSize,
} from "@/lib/v4/products";

const SIZES: ProductSize[] = ["S", "M", "L", "XL", "2XL", "3XL"];

type V4FilledButtonProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export function V4OutlineClayButton({
  href,
  children,
  className,
  onClick,
  type = "button",
  disabled,
}: V4FilledButtonProps & { disabled?: boolean }) {
  const cls = ["v4-btn", "v4-btn--outline-clay", className]
    .filter(Boolean)
    .join(" ");
  if (href && !disabled) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function V4FilledButton({
  href,
  children,
  className,
  onClick,
  type = "button",
}: V4FilledButtonProps) {
  const cls = ["v4-btn", className].filter(Boolean).join(" ");
  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

export function V4ProductCard({
  product,
  onAdd,
}: {
  product: (typeof standardProducts)[number];
  onAdd?: (size: ProductSize) => void;
}) {
  return (
    <article className="v4-product-card">
      <div className="v4-product-card__media" aria-hidden />
      <p className="lbl">{product.shirtName}</p>
      <p className="v4-product-card__colourway">{product.colourwayName}</p>
      <p className="v4-product-card__price">{formatPrice(product.priceCents)}</p>
      {onAdd ? (
        <div className="v4-product-card__sizes">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              className="v4-size-btn"
              onClick={() => onAdd(size)}
            >
              {size}
            </button>
          ))}
        </div>
      ) : (
        <V4FilledButton href={`/current?product=${product.slug}`}>
          VIEW →
        </V4FilledButton>
      )}
    </article>
  );
}

export function V4ShopGridByFamily({ family }: { family: ProductFamily }) {
  const items = standardProducts.filter((p) => p.family === family);
  const meta = productFamilies[family];
  if (items.length === 0) return null;
  return (
    <section className="v4-shop-row">
      <h3 className="v4-shop-row__title">{meta.title}</h3>
      <div className="v4-shop-row__grid">
        {items.map((product) => (
          <V4ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
