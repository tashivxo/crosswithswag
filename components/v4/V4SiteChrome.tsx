"use client";

import { CartProvider } from "@/lib/v4/cart/CartProvider";
import { V4Footer } from "@/components/v4/V4Footer";
import { V4Header } from "@/components/v4/V4Header";

export function V4SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <V4Header />
      <main id="content">{children}</main>
      <V4Footer />
    </CartProvider>
  );
}
