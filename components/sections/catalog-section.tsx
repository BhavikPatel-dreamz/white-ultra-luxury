import Link from "next/link";
import { CollectionCard } from "@/components/sections/collection-card";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionTitle } from "@/components/ui/section-title";
import { listCollections } from "@/lib/medusa";

export async function CatalogSection() {
  const collections = (await listCollections().catch(() => [])).slice(0, 3);

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-background">
      <Container className="relative py-24 md:py-32">
        <SectionTitle
          action={
            <Link
              className="inline-flex items-center gap-2 border-b border-border pb-2 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              href="/collections"
            >
              All collections
              <Icon className="size-4" name="arrow-up-right" />
            </Link>
          }
          className="mb-14"
          eyebrow="Designed for your setup"
          title="A cleaner way to build the kit."
          titleClassName="text-balance md:text-6xl"
        />
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {collections.map((collection, index) => (
            <CollectionCard
              collection={collection}
              index={index}
              key={collection.id ?? collection.handle}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
