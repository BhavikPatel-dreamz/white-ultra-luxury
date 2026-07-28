import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/site";
import { ProductCardAddToCartButton } from "@/components/cart/product-card-add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { WishlistButton } from "@/components/wishlist/wishlist-button";

export function ProductCard({ index, product }: { index: number; product: Product }) {
  const [primaryImage, hoverImage] = product.images;
  const delay = ([0, 50, 100, 150] as const)[index % 4];
  const brandLabel = product.collectionNames[0] ?? product.subtitle ?? "DaVinci";
  const inStock = product.variants.some((variant) => variant.inStock);
  const variantCount = product.variants.filter((variant) => variant.inStock).length;

  return (
    <Reveal delay={delay}>
      <article className="group h-full">
        <div className="relative overflow-hidden rounded-[var(--radius)] border border-border bg-surface-elevated transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-hover)]">
          <div className="relative aspect-[4/5] overflow-hidden bg-surface">
            <Link aria-label={`View ${product.name}`} className="block size-full" href={`/products/${product.handle}`}>
              <Image
                alt={product.name}
                className="object-cover transition-[opacity,transform] duration-700 group-hover:scale-[1.035] group-hover:opacity-0"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                src={primaryImage}
              />
              {hoverImage ? (
                <Image
                  alt=""
                  aria-hidden="true"
                  className="scale-[1.035] object-cover opacity-0 transition-[opacity,transform] duration-700 group-hover:scale-100 group-hover:opacity-100"
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  src={hoverImage}
                />
              ) : null}
            </Link>
            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
              {product.badge ? <Badge>{product.badge}</Badge> : null}
              <Badge className={inStock ? "border-primary/30 text-primary" : "text-muted-foreground"}>
                {inStock ? "In stock" : "Sold out"}
              </Badge>
            </div>
            <div className="absolute right-3 top-3 flex flex-col gap-2">
              <WishlistButton
                className="size-9 rounded-full px-0 py-0"
                product={product}
              />
              <ProductCardAddToCartButton
                className="size-9"
                product={product}
              />
            </div>
          </div>

          <div className="p-4 md:p-5">
            <Link className="block" href={`/products/${product.handle}`}>
              <div className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {brandLabel}
              </div>
              <div className="mt-2 grid grid-cols-[1fr_auto] gap-4">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-semibold">{product.name}</h3>
                  <p className="mt-1 truncate text-xs text-muted-foreground">{product.subtitle}</p>
                </div>
                <div className="text-right text-sm tabular-nums">
                  {product.compareAt ? (
                    <div className="text-xs text-muted-foreground line-through">
                      {product.compareAtDisplay}
                    </div>
                  ) : null}
                  <div className="font-semibold">{product.priceDisplay}</div>
                </div>
              </div>
            </Link>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
              {product.rating && product.reviewCount ? (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="size-3 fill-primary text-primary" name="star" />
                  <span className="tabular-nums">{product.rating}</span>
                  <span>/</span>
                  <span>{product.reviewCount}</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">No reviews yet</span>
              )}
              <div className="flex items-center gap-1.5" aria-label={`${variantCount} available variants`}>
                {product.variants.slice(0, 4).map((variant) => (
                  <span
                    className="size-3 rounded-full border border-border"
                    key={variant.id}
                    style={{ backgroundColor: variant.color }}
                    title={`${variant.name}${variant.inStock ? "" : " - sold out"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
