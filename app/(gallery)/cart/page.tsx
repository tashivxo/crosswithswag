import { CartChapter } from "@/components/v4/chapters/CommerceChapter";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Cart");

export default function CartPage() {
  return <CartChapter />;
}
