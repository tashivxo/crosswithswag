import { ContactChapter } from "@/components/v3/chapters/ContactChapter";
import { chapterMetadata } from "@/lib/seo";

export const metadata = chapterMetadata(
  "Contact",
  "Write CROSS WITH SWAG at support@crosswithswag.co.za or follow @crosswithswag. Cape Town, South Africa.",
  "/contact",
);

export default function ContactPage() {
  return <ContactChapter />;
}
