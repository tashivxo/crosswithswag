import type { Metadata } from "next";
import { CurrentChapter } from "@/components/v3/chapters/CurrentChapter";

export const metadata: Metadata = {
  title: "kloofstreetnights",
};

export default function CurrentPage() {
  return <CurrentChapter />;
}
