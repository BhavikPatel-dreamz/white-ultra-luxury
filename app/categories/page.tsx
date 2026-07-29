import type { Metadata } from "next";
import { CategoriesIndexPage } from "@/components/sections/categories-index-page";
import { listCategories } from "@/lib/medusa";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories — Ember & Halo",
  description: "Browse every category from the Medusa catalog.",
};

export default async function CategoriesRoute() {
  const categories = await listCategories();

  return (
    <>
      <CategoriesIndexPage categories={categories} />
    </>
  );
}
