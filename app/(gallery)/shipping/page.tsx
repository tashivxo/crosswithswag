import { PolicyChapter } from "@/components/v4/chapters/PolicyChapter";
import { shippingPolicy } from "@/lib/copy";
import { chapterMetadata } from "@/lib/seo";

export const metadata = chapterMetadata(
  "Shipping",
  "Shipping and delivery for CROSS WITH SWAG orders in South Africa.",
  "/shipping",
);

export default function ShippingPage() {
  return <PolicyChapter copy={shippingPolicy} />;
}