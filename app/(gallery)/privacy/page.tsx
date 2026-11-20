import type { Metadata } from "next";
import { PolicyChapter } from "@/components/v4/chapters/PolicyChapter";
import { privacyPolicy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return <PolicyChapter copy={privacyPolicy} />;
}