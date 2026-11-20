import { PolicyChapter } from "@/components/v4/chapters/PolicyChapter";
import { privacyPolicy } from "@/lib/copy";
import { chapterMetadata } from "@/lib/seo";

export const metadata = chapterMetadata(
  "Privacy",
  "How GRISEUS REGIUS (PTY) LTD, trading as CROSS WITH SWAG, holds personal information.",
  "/privacy",
);

export default function PrivacyPage() {
  return <PolicyChapter copy={privacyPolicy} />;
}