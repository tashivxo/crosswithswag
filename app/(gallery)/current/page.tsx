import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductChapter } from "@/components/v4/chapters/ProductChapter";

export const metadata: Metadata = {
  title: "standard edition",
};

export default function CurrentPage() {
  return (
    <Suspense fallback={null}>
      <ProductChapter />
    </Suspense>
  );
}
