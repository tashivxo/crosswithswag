import { SiteChrome } from "@/components/v3/SiteChrome";
import { CartDrawer } from "@/components/v4/cart/CartDrawer";
import { CartLiveRegion } from "@/components/v4/cart/CartUi";
import { CartProvider } from "@/lib/v4/cart/CartProvider";
import type { SurfaceTone } from "@/lib/sections.config";

export function GalleryShell({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: SurfaceTone;
}) {
  return (
    <CartProvider>
      <SiteChrome tone={tone}>{children}</SiteChrome>
      <CartLiveRegion scope="page" />
      <CartDrawer />
    </CartProvider>
  );
}
