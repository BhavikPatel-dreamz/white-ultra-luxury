import { SiteShell } from "@/components/layout/site-shell";
import { ProductListingLoading } from "@/components/sections/product-listing-loading";

export default function ProductsLoading() {
  return (
    <SiteShell>
      <ProductListingLoading title="Loading products" />
    </SiteShell>
  );
}
