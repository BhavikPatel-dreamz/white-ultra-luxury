import Link from "next/link";
import type { Collection } from "@/types/site";
import { CollectionCard } from "@/components/sections/collection-card";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";

export function CollectionsIndexPage({ collections }: { collections: Collection[] }) {
  const catalogCollections = collections;

  return (
    <>
      <section className="border-b border-border bg-background">
        <Container className="grid gap-10 pb-14 pt-28 md:grid-cols-[minmax(0,1fr)_24rem] md:pb-20 md:pt-36">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-primary">
              Curated by Ember &amp; Halo
            </p>
            <h1 className="mt-5 max-w-4xl text-balance font-display text-6xl font-medium leading-[0.9] tracking-[-0.05em] sm:text-7xl md:text-9xl">
              Curated in Medusa.
            </h1>
          </div>
          <div className="self-end border-l border-border pl-7">
            <p className="text-sm leading-7 text-muted-foreground">
              Every collection here comes directly from Medusa Admin, while Ember &amp; Halo supplies the editorial presentation.
            </p>
            <Link
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]"
              href="/products"
            >
              Shop everything
              <Icon className="size-4" name="arrow-up-right" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-surface">
        <Container className="py-5 md:py-8">
          <div className="grid gap-5 md:grid-cols-3">
            {catalogCollections.map((collection, index) => (
              <CollectionCard
                collection={collection}
                ctaLabel="Enter collection"
                featured={index === 0}
                index={index}
                key={collection.id ?? collection.handle}
                reveal={false}
                showDescription
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-background">
        <Container className="grid gap-6 py-12 md:grid-cols-[1fr_auto] md:items-center md:py-16">
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-primary">
              Need a more precise path?
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-[-0.025em] md:text-4xl">
              Browse all live catalog categories.
            </h2>
          </div>
          <Link
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-xs font-semibold uppercase tracking-[0.14em] text-background transition-transform hover:-translate-y-0.5"
            href="/categories"
          >
            Explore categories
            <Icon className="size-4" name="arrow-right" />
          </Link>
        </Container>
      </section>
    </>
  );
}
