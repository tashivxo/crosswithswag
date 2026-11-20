import { OrderConfirmedChapter } from "@/components/v4/chapters/CommerceChapter";
import { privatePageMetadata } from "@/lib/seo";

export const metadata = privatePageMetadata("Order");

export default function OrderConfirmedPage() {
  return <OrderConfirmedChapter />;
}
