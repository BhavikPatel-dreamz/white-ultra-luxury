import { SiteShell } from "@/components/layout/site-shell";
import { ProductListingLoading } from "@/components/sections/product-listing-loading";

export default function CollectionLoading() {
  return (
    <SiteShell>
      <ProductListingLoading eyebrow="Collection" title="Loading collection" />
    </SiteShell>
  );
}
