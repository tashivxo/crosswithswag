"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { CartProvider } from "@/lib/v4/cart/CartProvider";
import { V4Footer } from "@/components/v4/V4Footer";
import { V4Header } from "@/components/v4/V4Header";

export function V4SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const onCurrent = pathname.startsWith("/current");
    document.documentElement.classList.toggle("v4-route-current", onCurrent);
    return () => {
      document.documentElement.classList.remove("v4-route-current");
    };
  }, [pathname]);

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
