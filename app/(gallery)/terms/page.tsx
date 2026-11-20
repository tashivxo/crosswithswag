import type { Metadata } from "next";
import { PolicyChapter } from "@/components/v4/chapters/PolicyChapter";
import { termsPolicy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return <PolicyChapter copy={termsPolicy} />;
}