import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { listCatalogTaxonomy } from "@/lib/medusa";

export async function CategoryNavSection() {
  const { categories, collections } = await listCatalogTaxonomy().catch(() => ({
    categories: [],
    collections: [],
  }));
  const items = [
    ...categories.slice(0, 6).map((category) => ({
      detail: category.productCount ? `${category.productCount} items` : "Category",
      href: `/categories/${category.handle}`,
      label: category.name,
    })),
    ...collections.slice(0, 3).map((collection) => ({
      detail: collection.productCount ? `${collection.productCount} items` : "Collection",
      href: `/collections/${collection.handle}`,
      label: collection.name,
    })),
  ].slice(0, 8);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-border bg-surface-elevated">
      <Container className="py-5">
        <nav aria-label="Shop categories" className="flex gap-3 overflow-x-auto pb-1">
          {items.map((item) => (
            <Link
              className="group flex min-w-[11rem] items-center justify-between rounded-[var(--radius)] border border-border bg-background px-4 py-3 transition-[background,border-color,transform] duration-200 hover:-translate-y-px hover:border-primary hover:bg-surface"
              href={item.href}
              key={item.href}
            >
              <span>
                <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{item.detail}</span>
              </span>
              <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" name="arrow-up-right" />
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  );
}
