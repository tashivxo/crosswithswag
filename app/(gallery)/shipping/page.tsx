import type { Metadata } from "next";
import { PolicyChapter } from "@/components/v4/chapters/PolicyChapter";
import { shippingPolicy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Shipping",
};

export default function ShippingPage() {
  return <PolicyChapter copy={shippingPolicy} />;
}