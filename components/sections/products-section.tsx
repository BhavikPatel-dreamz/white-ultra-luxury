import Link from "next/link";
import { ProductCard } from "@/components/sections/product-card";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { SectionTitle } from "@/components/ui/section-title";
import { listProducts } from "@/lib/medusa";

export async function ProductsSection() {
  const { products } = await listProducts({ limit: 8 }).catch(() => ({
    products: [],
  }));
  const bestsellers = products.filter((product) => product.statusFlags.includes("bestseller"));
  const featuredProducts = (bestsellers.length > 0 ? bestsellers : products).slice(0, 4);

  return (
    <section className="border-y border-border bg-surface">
      <Container className="py-24 md:py-32">
        <SectionTitle
          action={
            <Link
              className="inline-flex items-center gap-2 border-b border-border pb-2 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              href="/products"
            >
              Shop all devices
              <Icon className="size-4" name="arrow-up-right" />
            </Link>
          }
          className="mb-14"
          eyebrow="Bestsellers"
          title="Most selected by adult customers."
          titleClassName="text-balance"
        />
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard index={index} key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius)] border border-border bg-surface-elevated p-8 text-sm text-muted-foreground">
            Products are loaded from the live catalog when the storefront API is available.
          </div>
        )}
      </Container>
    </section>
  );
}
