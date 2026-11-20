import { PolicyChapter } from "@/components/v4/chapters/PolicyChapter";
import { termsPolicy } from "@/lib/copy";
import { chapterMetadata } from "@/lib/seo";

export const metadata = chapterMetadata(
  "Terms",
  "Terms of sale for CROSS WITH SWAG, trading as GRISEUS REGIUS (PTY) LTD.",
  "/terms",
);

export default function TermsPage() {
  return <PolicyChapter copy={termsPolicy} />;
}