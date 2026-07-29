import { EmberHomePage } from "@/components/sections/ember-home-page";
import { listAllProducts, listCatalogTaxonomy } from "@/lib/medusa";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [{ products }, { categories, collections }] = await Promise.all([
    listAllProducts({ limit: 100 }),
    listCatalogTaxonomy(),
  ]);

  return (
    <>
      <EmberHomePage
        categories={categories}
        collections={collections}
        products={products}
      />
    </>
  );
}
