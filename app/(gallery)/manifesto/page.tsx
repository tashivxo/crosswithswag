import type { Metadata } from "next";
import { ManifestoChapter } from "@/components/v3/chapters/ManifestoChapter";

export const metadata: Metadata = {
  title: "Manifesto",
};

export default function ManifestoPage() {
  return <ManifestoChapter />;
}
