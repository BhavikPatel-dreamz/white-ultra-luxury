import { SiteShell } from "@/components/layout/site-shell";
import { EmberHomePage } from "@/components/sections/ember-home-page";
import { listAllProducts, listCatalogTaxonomy } from "@/lib/medusa";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ products }, { categories, collections }] = await Promise.all([
    listAllProducts({ limit: 100 }),
    listCatalogTaxonomy(),
  ]);

  return (
    <SiteShell>
      <EmberHomePage
        categories={categories}
        collections={collections}
        products={products}
      />
    </SiteShell>
  );
}
