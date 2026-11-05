"use client";

import { CartChapter } from "@/components/v4/chapters/CommerceChapter";
import { useMediaQuery } from "@/lib/v4/useMediaQuery";

export default function CartPage() {
  const isMobileSheet = useMediaQuery("(max-width: 899px)");

  return <CartChapter sheet={isMobileSheet} />;
}
