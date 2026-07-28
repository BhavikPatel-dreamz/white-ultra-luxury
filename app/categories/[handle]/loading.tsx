import { SiteShell } from "@/components/layout/site-shell";
import { ProductListingLoading } from "@/components/sections/product-listing-loading";

export default function CategoryLoading() {
  return (
    <SiteShell>
      <ProductListingLoading eyebrow="Category" title="Loading category" />
    </SiteShell>
  );
}
