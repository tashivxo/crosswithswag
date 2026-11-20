import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductChapter } from "@/components/v4/chapters/ProductChapter";
import { PdpGalleryReserve } from "@/components/v4/PdpGalleryReserve";
import { pdpMetadataTitle } from "@/lib/v4/pdp-switch";
import { productBySlug } from "@/lib/v4/products";
import { chapterMetadata } from "@/lib/seo";

const DEFAULT_SLUG = "product-express-dispatch-black";

export const dynamic = "force-dynamic";

type CurrentSearch = { product?: string };

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<CurrentSearch>;
}): Promise<Metadata> {
  const { product: slug } = await searchParams;
  const product =
    productBySlug(slug ?? DEFAULT_SLUG) ?? productBySlug(DEFAULT_SLUG);
  const title = product ? pdpMetadataTitle(product) : "standard edition";
  const description = product
    ? `${product.shirtName} in ${product.colourwayName} — CROSS WITH SWAG standard edition, Cape Town.`
    : "The CROSS WITH SWAG standard edition. Always open.";
  return chapterMetadata(title, description, "/current");
}

export default function CurrentPage() {
  return (
    <Suspense fallback={<PdpGalleryReserve />}>
      <ProductChapter />
    </Suspense>
  );
}
