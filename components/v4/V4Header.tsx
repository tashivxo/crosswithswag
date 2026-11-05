"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { useCart } from "@/lib/v4/cart/CartProvider";
import { useMediaQuery } from "@/lib/v4/useMediaQuery";
import { v4NavItems } from "@/lib/v4/sections.config";
import { V4MobileMenu } from "@/components/v4/V4MobileMenu";

function navLabel(
  label: string,
  showCartCount: boolean | undefined,
  count: number,
): string {
  if (!showCartCount) return label;
  return `${label} (${count})`;
}

export function V4Header() {
  const pathname = usePathname();
  const { count, openDrawer } = useCart();
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className={
          pathname.startsWith("/current") || pathname.startsWith("/cart")
            ? "v4-header v4-header--studio"
            : "v4-header"
        }
      >
        <div className="v4-header__inner wrap">
          <Link href="/" className="v4-header__logo" aria-label="swag. home">
            <Wordmark className="wordmark--v4-nav" />
          </Link>
          <nav className="v4-nav v4-nav--desktop" aria-label="Primary">
            {v4NavItems.map((item) => {
              const active =
                item.id === "shop"
                  ? pathname === "/" || pathname.startsWith("/current")
                  : pathname.startsWith(item.href);
              const label = navLabel(item.label, item.showCartCount, count);

              if (item.id === "cart" && isDesktop) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={
                      active ? "v4-nav__link is-active" : "v4-nav__link"
                    }
                    onClick={openDrawer}
                  >
                    {label}
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={active ? "v4-nav__link is-active" : "v4-nav__link"}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="v4-header__mobile-actions">
            {pathname.startsWith("/current") ? (
              <Link href="/cart" className="v4-header__cart-mobile">
                CART ({count})
              </Link>
            ) : null}
            <button
              type="button"
              className="v4-nav__menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="v4-mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? "CLOSE" : "MENU"}
            </button>
          </div>
        </div>
      </header>
      <V4MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
