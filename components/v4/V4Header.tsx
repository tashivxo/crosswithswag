"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/ui/Wordmark";
import { useCart } from "@/lib/v4/cart/CartProvider";
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
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className={
          pathname.startsWith("/current")
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
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={active ? "v4-nav__link is-active" : "v4-nav__link"}
                >
                  {navLabel(item.label, item.showCartCount, count)}
                </Link>
              );
            })}
          </nav>
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
      </header>
      <V4MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
