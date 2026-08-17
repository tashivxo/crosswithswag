import type { Metadata } from "next";
import { ContactChapter } from "@/components/v3/chapters/ContactChapter";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return <ContactChapter />;
}
