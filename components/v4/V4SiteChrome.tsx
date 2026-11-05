"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CartDrawer } from "@/components/v4/cart/CartDrawer";
import { CartProvider } from "@/lib/v4/cart/CartProvider";
import { useMediaQuery } from "@/lib/v4/useMediaQuery";
import { V4Footer } from "@/components/v4/V4Footer";
import { V4Header } from "@/components/v4/V4Header";

export function V4SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mobileCartSheet =
    useMediaQuery("(max-width: 899px)") && pathname === "/cart";

  useEffect(() => {
    const onCurrent = pathname.startsWith("/current");
    document.documentElement.classList.toggle("v4-route-current", onCurrent);
    document.documentElement.classList.toggle(
      "v4-route-cart-sheet",
      mobileCartSheet,
    );
    return () => {
      document.documentElement.classList.remove("v4-route-current");
      document.documentElement.classList.remove("v4-route-cart-sheet");
    };
  }, [pathname, mobileCartSheet]);

  return (
    <CartProvider>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      {!mobileCartSheet ? <V4Header /> : null}
      <main id="content">{children}</main>
      {!mobileCartSheet ? <V4Footer /> : null}
      <CartDrawer />
    </CartProvider>
  );
}
