import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListingPage } from "@/components/sections/product-listing-page";
import { getCollectionByHandle, listAllProducts } from "@/lib/medusa";
import {
  getOffsetFromPage,
  getPageFromSearchParams,
  PRODUCT_PAGE_SIZE,
  type PageSearchParams,
} from "@/lib/pagination";

export const dynamic = "force-dynamic";

type CollectionRouteProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<PageSearchParams>;
};

export async function generateMetadata({
  params,
}: CollectionRouteProps): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return {
      title: "Collection not found — Ember & Halo",
    };
  }

  return {
    title: `${collection.name} — Ember & Halo`,
    description: collection.description,
  };
}

export default async function CollectionRoute({
  params,
  searchParams,
}: CollectionRouteProps) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    notFound();
  }

  const page = getPageFromSearchParams(await searchParams);
  const { count, products } = await listAllProducts({
    collectionId: collection.id,
  });

  return (
    <>
      <ProductListingPage
        basePath={`/collections/${collection.handle}`}
        count={count}
        description={collection.description}
        emptyMessage="No products are available in this collection yet."
        eyebrow="Collection"
        limit={PRODUCT_PAGE_SIZE}
        offset={getOffsetFromPage(page)}
        products={products}
        title={collection.name}
      />
    </>
  );
}
