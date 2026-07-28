import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { CollectionsIndexPage } from "@/components/sections/collections-index-page";
import { listCollections } from "@/lib/medusa";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Collections \u2014 DaVinci",
  description: "Portable and desktop vaporizers, and every accessory.",
};

export default async function CollectionsRoute() {
  const collections = await listCollections();

  return (
    <SiteShell>
      <CollectionsIndexPage collections={collections} />
    </SiteShell>
  );
}
