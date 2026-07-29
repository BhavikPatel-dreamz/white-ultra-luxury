import Link from "next/link";
import type { Category } from "@/types/site";
import { CategoryCard } from "@/components/sections/category-card";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";

export function CategoriesIndexPage({ categories }: { categories: Category[] }) {
  const catalogCategories = categories;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-foreground text-background">
        <Container className="grid min-h-[30rem] items-end gap-10 pb-14 pt-28 md:grid-cols-[minmax(0,1fr)_20rem] md:pb-20 md:pt-36">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-primary">
              Find your ritual
            </p>
            <h1 className="mt-5 max-w-4xl text-balance font-display text-6xl font-medium leading-[0.88] tracking-[-0.05em] sm:text-7xl md:text-9xl">
              Shop by category.
            </h1>
          </div>
          <div className="border-l border-background/15 pl-7">
            <div className="font-display text-5xl tabular-nums">{catalogCategories.length}</div>
            <p className="mt-3 text-sm leading-6 text-background/60">
              Live categories from the storefront catalog, organized exactly as they are in Medusa Admin.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-surface">
        <Container className="flex gap-2 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {catalogCategories.map((category) => (
            <Link
              className="shrink-0 rounded-full border border-border bg-background px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] transition-colors hover:border-primary hover:text-primary"
              href={`/categories/${category.handle}`}
              key={category.id}
            >
              {category.name}
            </Link>
          ))}
        </Container>
      </section>

      <section className="bg-background">
        <Container className="py-12 md:py-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-primary">
                The full catalog
              </p>
              <h2 className="mt-3 max-w-xl font-display text-4xl leading-tight tracking-[-0.035em] md:text-5xl">
                Everything for the draw and the gathering.
              </h2>
            </div>
            <Link
              className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] md:flex"
              href="/products"
            >
              View all products
              <Icon className="size-4" name="arrow-right" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {catalogCategories.map((category, index) => (
              <CategoryCard
                category={category}
                featured={index === 0 || index === 7}
                index={index}
                key={category.id}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
