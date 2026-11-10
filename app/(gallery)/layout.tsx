import { SiteChrome } from "@/components/v3/SiteChrome";
import { CartDrawer } from "@/components/v4/cart/CartDrawer";
import { CartLiveRegion } from "@/components/v4/cart/CartUi";
import { CartProvider } from "@/lib/v4/cart/CartProvider";

export default function GalleryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <SiteChrome>{children}</SiteChrome>
      <CartLiveRegion scope="page" />
      <CartDrawer />
    </CartProvider>
  );
}
