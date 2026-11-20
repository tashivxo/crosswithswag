import { CheckoutChapter } from "@/components/v4/chapters/CommerceChapter";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Checkout");

export default function CheckoutPage() {
  return <CheckoutChapter />;
}
