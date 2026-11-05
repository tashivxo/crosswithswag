"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/v4/cart/CartProvider";
import { v4NavItems } from "@/lib/v4/sections.config";

type V4MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function V4MobileMenu({ open, onClose }: V4MobileMenuProps) {
  const pathname = usePathname();
  const { count } = useCart();

  if (!open) return null;

  return (
    <div id="v4-mobile-menu" className="v4-mobile-menu" role="dialog" aria-modal>
      <div className="v4-mobile-menu__panel">
        {v4NavItems.map((item) => {
          const label = item.showCartCount
            ? `${item.label} (${count})`
            : item.label;
          const active =
            item.id === "shop"
              ? pathname === "/" || pathname.startsWith("/current")
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={
                active ? "v4-mobile-menu__item is-active" : "v4-mobile-menu__item"
              }
              onClick={onClose}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
