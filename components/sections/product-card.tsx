import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/site";
import { ProductCardAddToCartButton } from "@/components/cart/product-card-add-to-cart-button";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { cx } from "@/lib/utils";

export function ProductCard({
  index,
  layout = "grid",
  product,
}: {
  index: number;
  layout?: "grid" | "list";
  product: Product;
}) {
  const primaryImage = product.images[0] ?? "/ember-halo/category-accessories.png";
  const hoverImage = product.images[1];
  const delay = ([0, 50, 100, 150] as const)[index % 4];
  const brandLabel = product.brand || "Ember & Halo";
  const inStock = product.variants.some((variant) => variant.inStock);
  const availableVariants = product.variants.filter((variant) => variant.inStock).length;
  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0;

  return (
    <Reveal className="h-full" delay={delay}>
      <article
        className={cx(
          "group relative h-full",
          layout === "list"
            ? "grid grid-cols-[8.5rem_minmax(0,1fr)] overflow-hidden rounded-[1.25rem] border border-border bg-surface-elevated p-2 transition-colors hover:border-primary sm:grid-cols-[11rem_minmax(0,1fr)] md:grid-cols-[12rem_minmax(0,1fr)_auto] md:items-center md:p-3"
            : "flex flex-col",
        )}
      >
        <div
          className={cx(
            "relative isolate overflow-hidden bg-surface",
            layout === "list"
              ? "aspect-[4/5] rounded-[0.95rem]"
              : "aspect-[4/5] rounded-[1.35rem] border border-border",
          )}
        >
          <Link
            aria-label={`View ${product.name}`}
            className="absolute inset-0"
            href={`/products/${product.handle}`}
          >
            <Image
              alt={product.name}
              className="object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.045] group-hover:opacity-0"
              fill
              sizes={
                layout === "list"
                  ? "(min-width: 768px) 192px, 136px"
                  : "(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
              }
              src={primaryImage}
            />
            {hoverImage ? (
              <Image
                alt=""
                aria-hidden="true"
                className="scale-[1.04] object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
                fill
                sizes={
                  layout === "list"
                    ? "(min-width: 768px) 192px, 136px"
                    : "(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw"
                }
                src={hoverImage}
              />
            ) : null}
          </Link>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3">
            <div className="flex flex-wrap gap-1.5">
              {product.badge ? (
                <span className="rounded-full bg-foreground/90 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-background backdrop-blur">
                  {product.badge}
                </span>
              ) : null}
              {discount ? (
                <span className="rounded-full bg-primary px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                  −{discount}%
                </span>
              ) : null}
            </div>
            <WishlistButton
              className="pointer-events-auto size-9 rounded-full border-white/20 bg-black/25 px-0 py-0 text-white hover:bg-black/45"
              product={product}
            />
          </div>

          <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between gap-2 opacity-100 transition-[opacity,transform] duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
            <span
              className={cx(
                "rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] backdrop-blur",
                inStock
                  ? "bg-black/50 text-white"
                  : "bg-surface-elevated/90 text-muted-foreground",
              )}
            >
              {inStock ? "Ready to ship" : "Sold out"}
            </span>
            <ProductCardAddToCartButton
              className="size-10 border-white/20 bg-white text-black hover:bg-primary hover:text-primary-foreground"
              product={product}
            />
          </div>
        </div>

        <div
          className={cx(
            "min-w-0",
            layout === "list" ? "px-4 py-3 sm:px-6" : "flex flex-1 flex-col pt-4",
          )}
        >
          <div className="flex items-center gap-2 text-[0.61rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            <span>{brandLabel}</span>
            <span className="size-1 rounded-full bg-primary" />
            <span>{product.categoryNames[0] ?? "The edit"}</span>
          </div>

          <Link className="mt-2 block" href={`/products/${product.handle}`}>
            <h3
              className={cx(
                "font-display font-medium leading-tight tracking-[-0.02em] transition-colors group-hover:text-primary",
                layout === "list" ? "text-xl sm:text-2xl" : "text-base sm:text-lg",
              )}
            >
              {product.name}
            </h3>
          </Link>

          {layout === "list" ? (
            <>
              <p className="mt-3 hidden max-w-xl text-sm leading-6 text-muted-foreground sm:line-clamp-2 sm:block">
                {product.shortDescription}
              </p>
              <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
                {product.flavors?.slice(0, 2).map((flavor) => (
                  <span
                    className="rounded-full border border-border px-2.5 py-1 text-[0.65rem] text-muted-foreground"
                    key={flavor}
                  >
                    {flavor}
                  </span>
                ))}
                {product.nicotineStrengths?.slice(0, 1).map((strength) => (
                  <span
                    className="rounded-full border border-border px-2.5 py-1 text-[0.65rem] text-muted-foreground"
                    key={strength}
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </>
          ) : null}

          <div
            className={cx(
              "mt-auto flex items-end justify-between gap-3",
              layout === "list" ? "pt-5" : "pt-3",
            )}
          >
            <div>
              <div className="flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
                <Icon className="size-3 fill-primary text-primary" name="star" />
                <span className="font-semibold text-foreground tabular-nums">
                  {product.rating?.toFixed(1) ?? "New"}
                </span>
                {product.reviewCount ? <span>({product.reviewCount})</span> : null}
              </div>
              {availableVariants > 1 ? (
                <p className="mt-1 text-[0.62rem] text-muted-foreground">
                  {availableVariants} options
                </p>
              ) : null}
            </div>
            <div className="text-right">
              {product.compareAtDisplay ? (
                <div className="text-[0.68rem] text-muted-foreground line-through tabular-nums">
                  {product.compareAtDisplay}
                </div>
              ) : null}
              <div className="text-sm font-semibold tabular-nums sm:text-base">
                {product.priceDisplay}
              </div>
            </div>
          </div>
        </div>

        {layout === "list" ? (
          <Link
            aria-label={`Explore ${product.name}`}
            className="mr-5 hidden size-12 place-items-center rounded-full border border-border transition-[background,color,border-color,transform] hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground md:grid"
            href={`/products/${product.handle}`}
          >
            <Icon className="size-4" name="arrow-up-right" />
          </Link>
        ) : null}
      </article>
    </Reveal>
  );
}
