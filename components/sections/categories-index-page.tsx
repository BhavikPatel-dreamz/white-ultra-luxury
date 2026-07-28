import type { Category } from "@/types/site";
import { CategoryCard } from "@/components/sections/category-card";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-title";

export function CategoriesIndexPage({ categories }: { categories: Category[] }) {
  return (
    <>
      <section className="border-b border-border bg-background">
        <Container className="pb-10 pt-16 md:pb-12 md:pt-20">
          <Eyebrow>Shop</Eyebrow>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">
            Categories
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Browse every active category from the Medusa catalog.
          </p>
        </Container>
      </section>

      <section>
        <Container className="py-12">
          {categories.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 md:gap-6">
              {categories.map((category) => (
                <CategoryCard category={category} key={category.id} />
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--radius)] border border-border bg-surface-elevated py-24 text-center text-sm text-muted-foreground">
              No categories are available yet.
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
