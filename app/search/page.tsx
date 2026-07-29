import type { Metadata } from "next";
import { ProductListingPage } from "@/components/sections/product-listing-page";
import { listAllProducts } from "@/lib/medusa";
import {
  getOffsetFromPage,
  getPageFromSearchParams,
  PRODUCT_PAGE_SIZE,
  type PageSearchParams,
} from "@/lib/pagination";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search — Ember & Halo",
  description: "Search the Ember & Halo vape and hookah catalog.",
};

type SearchRouteProps = {
  searchParams: Promise<PageSearchParams>;
};

export default async function SearchRoute({ searchParams }: SearchRouteProps) {
  const page = getPageFromSearchParams(await searchParams);
  const { count, products } = await listAllProducts();

  return (
    <>
      <ProductListingPage
        basePath="/search"
        count={count}
        description="Search products, categories, collections, and tags from the current catalog."
        emptyMessage="No products match that search."
        eyebrow="Search"
        limit={PRODUCT_PAGE_SIZE}
        offset={getOffsetFromPage(page)}
        products={products}
        title="Search"
      />
    </>
  );
}
