import type { Collection } from "@/types/site";
import { CollectionCard } from "@/components/sections/collection-card";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-title";

export function CollectionsIndexPage({ collections }: { collections: Collection[] }) {
  return (
    <>
      <section className="border-b border-border bg-background">
        <Container className="pb-10 pt-16 md:pb-12 md:pt-20">
          <Eyebrow>Shop</Eyebrow>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">
            Collections
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Choose your form factor. Every product ships with a 10-year warranty and free
            discreet delivery over $100.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-12">
          {collections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              {collections.map((collection, index) => (
                <CollectionCard
                  collection={collection}
                  ctaLabel="Shop"
                  index={index}
                  key={collection.id ?? collection.handle}
                  reveal={false}
                  showDescription
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius)] border border-border bg-surface-elevated py-24 text-center text-sm text-muted-foreground">
              No collections are available yet.
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
