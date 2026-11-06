"use client";

import Link from "next/link";
import { useCart } from "@/lib/v4/cart/CartProvider";

export function CartCountLink() {
  const { count } = useCart();
  return (
    <Link className="btn btn--clay" href="/cart">
      go to cart ({count}) →
    </Link>
  );
}
