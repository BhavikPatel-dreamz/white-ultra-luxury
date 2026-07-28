import { SiteShell } from "@/components/layout/site-shell";
import { ProductListingLoading } from "@/components/sections/product-listing-loading";

export default function SearchLoading() {
  return (
    <SiteShell>
      <ProductListingLoading eyebrow="Search" title="Loading search" />
    </SiteShell>
  );
}
