import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { ProductListingPage } from "@/components/sections/product-listing-page";
import { getCategoryByHandle, listAllProducts } from "@/lib/medusa";
import {
  getOffsetFromPage,
  getPageFromSearchParams,
  PRODUCT_PAGE_SIZE,
  type PageSearchParams,
} from "@/lib/pagination";

export const dynamic = "force-dynamic";

type CategoryRouteProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<PageSearchParams>;
};

export async function generateMetadata({
  params,
}: CategoryRouteProps): Promise<Metadata> {
  const { handle } = await params;
  const category = await getCategoryByHandle(handle);

  if (!category) {
    return {
      title: "Category not found \u2014 DaVinci",
    };
  }

  return {
    title: `${category.name} \u2014 DaVinci`,
    description: category.description,
  };
}

export default async function CategoryRoute({
  params,
  searchParams,
}: CategoryRouteProps) {
  const { handle } = await params;
  const category = await getCategoryByHandle(handle);

  if (!category) {
    notFound();
  }

  const page = getPageFromSearchParams(await searchParams);
  const { count, products } = await listAllProducts({
    categoryId: category.id,
  });

  return (
    <SiteShell>
      <ProductListingPage
        basePath={`/categories/${category.handle}`}
        count={count}
        description={category.description}
        emptyMessage="No products are available in this category yet."
        eyebrow="Category"
        limit={PRODUCT_PAGE_SIZE}
        offset={getOffsetFromPage(page)}
        products={products}
        title={category.name}
      />
    </SiteShell>
  );
}
