import type { Product } from "@/types/site";
import { ProductListingClient } from "@/components/sections/product-listing-client";
import { Container } from "@/components/ui/container";

type ProductListingPageProps = {
  basePath: string;
  count: number;
  description: string;
  emptyMessage?: string;
  eyebrow: string;
  limit: number;
  offset: number;
  products: Product[];
  title: string;
};

export function ProductListingPage({
  count,
  description,
  eyebrow,
  title,
  ...catalogProps
}: ProductListingPageProps) {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border bg-foreground text-background">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_78%_20%,color-mix(in_oklab,var(--primary)_65%,transparent),transparent_30%),linear-gradient(120deg,transparent_0%,color-mix(in_oklab,var(--background)_8%,transparent)_50%,transparent_51%)]"
        />
        <Container className="relative grid min-h-[22rem] items-end gap-10 pb-10 pt-24 md:grid-cols-[1fr_auto] md:pb-14 md:pt-32">
          <div>
            <div className="flex items-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-background/55">
              <span>Ember &amp; Halo</span>
              <span className="h-px w-8 bg-primary" />
              <span>{eyebrow}</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-balance font-display text-5xl font-medium leading-[0.95] tracking-[-0.04em] sm:text-6xl md:text-8xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-background/65 md:text-base">
              {description}
            </p>
          </div>
          <div className="hidden min-w-40 border-l border-background/15 pl-7 md:block">
            <div className="font-display text-4xl tabular-nums">
              {String(count).padStart(2, "0")}
            </div>
            <div className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-background/50">
              Pieces in the edit
            </div>
          </div>
        </Container>
      </section>

      <ProductListingClient {...catalogProps} />
    </>
  );
}
