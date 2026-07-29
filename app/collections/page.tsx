import type { Metadata } from "next";
import { CollectionsIndexPage } from "@/components/sections/collections-index-page";
import { listCollections } from "@/lib/medusa";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Collections — Ember & Halo",
  description: "Curated vape, flavor, hookah, and everyday essentials for the modern ritual.",
};

export default async function CollectionsRoute() {
  const collections = await listCollections();

  return (
    <>
      <CollectionsIndexPage collections={collections} />
    </>
  );
}
