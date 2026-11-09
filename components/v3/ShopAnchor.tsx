"use client";

import Link from "next/link";
import { scrollToShop } from "@/lib/home-scroll";

export function ShopAnchor({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href="/#shop"
      className={className}
      onClick={(event) => {
        if (
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button === 1
        ) {
          return;
        }
        event.preventDefault();
        scrollToShop();
      }}
    >
      {children}
    </Link>
  );
}
