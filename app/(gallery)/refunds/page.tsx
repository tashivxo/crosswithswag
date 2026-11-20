import { PolicyChapter } from "@/components/v4/chapters/PolicyChapter";
import { refundsPolicy } from "@/lib/copy";
import { chapterMetadata } from "@/lib/seo";

export const metadata = chapterMetadata(
  "Refunds",
  "Returns and refunds for CROSS WITH SWAG wearable editions.",
  "/refunds",
);

export default function RefundsPage() {
  return <PolicyChapter copy={refundsPolicy} />;
}