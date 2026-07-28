import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { CategoriesIndexPage } from "@/components/sections/categories-index-page";
import { listCategories } from "@/lib/medusa";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories \u2014 DaVinci",
  description: "Browse every category from the Medusa catalog.",
};

export default async function CategoriesRoute() {
  const categories = await listCategories();

  return (
    <SiteShell>
      <CategoriesIndexPage categories={categories} />
    </SiteShell>
  );
}
