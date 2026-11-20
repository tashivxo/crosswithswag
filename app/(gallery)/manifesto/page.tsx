import { ManifestoChapter } from "@/components/v3/chapters/ManifestoChapter";
import { chapterMetadata } from "@/lib/seo";

export const metadata = chapterMetadata(
  "Manifesto",
  "Owe nothing. The CROSS WITH SWAG manifesto: authentic expression, internal authority, and wearable editions from Cape Town.",
  "/manifesto",
);

export default function ManifestoPage() {
  return <ManifestoChapter />;
}
