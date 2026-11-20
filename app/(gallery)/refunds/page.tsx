import type { Metadata } from "next";
import { PolicyChapter } from "@/components/v4/chapters/PolicyChapter";
import { refundsPolicy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Refunds",
};

export default function RefundsPage() {
  return <PolicyChapter copy={refundsPolicy} />;
}