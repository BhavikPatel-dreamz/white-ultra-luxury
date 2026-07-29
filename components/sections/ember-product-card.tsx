import Image from "next/image";
import Link from "next/link";
import { ProductCardAddToCartButton } from "@/components/cart/product-card-add-to-cart-button";
import { Icon } from "@/components/ui/icon";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { cx } from "@/lib/utils";
import type { Product } from "@/types/site";

export function EmberProductCard({
  index,
  product,
  tone = "dark",
}: {
  index: number;
  product: Product;
  tone?: "dark" | "light";
}) {
  const [primaryImage, hoverImage] = product.images;
  const image = primaryImage || "/ember-halo/category-accessories.png";
  const isDemoProduct = product.id.startsWith("demo-");
  const inStock = product.variants.some((variant) => variant.inStock);
  const brandLabel = product.collectionNames[0] ?? product.subtitle ?? "Ember & Halo";

  return (
    <article className="group h-full" style={{ animationDelay: `${(index % 4) * 70}ms` }}>
      <div
        className={cx(
          "relative flex h-full flex-col border transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1",
          tone === "light"
            ? "border-ink/15 bg-[#e8e5db] text-ink hover:border-ink/60 hover:shadow-[0_22px_60px_rgba(9,11,16,0.16)]"
            : "border-border bg-surface text-foreground hover:border-primary/65 hover:shadow-[var(--shadow-hover)]",
        )}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-elevated">
          <Link aria-label={`View ${product.name}`} className="relative block size-full" href={`/products/${product.handle}`}>
            <Image
              alt={product.name}
              className="object-cover transition-[opacity,transform,filter] duration-700 group-hover:scale-[1.045] group-hover:saturate-[1.08]"
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 70vw"
              src={image}
            />
            {hoverImage ? (
              <Image
                alt=""
                aria-hidden="true"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                fill
                sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 70vw"
                src={hoverImage}
              />
            ) : null}
          </Link>
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
            <div className="flex flex-wrap gap-1.5">
              {product.badge ? (
                <span className="bg-primary px-2.5 py-1 text-[0.52rem] font-bold uppercase tracking-[0.15em] text-primary-foreground">
                  {product.badge}
                </span>
              ) : null}
              {!inStock ? (
                <span className="bg-ink/80 px-2.5 py-1 text-[0.52rem] font-bold uppercase tracking-[0.15em] text-cream backdrop-blur">
                  Sold out
                </span>
              ) : null}
            </div>
            <WishlistButton
              className="size-9 rounded-none border-white/20 bg-ink/70 px-0 py-0 text-white hover:bg-primary hover:text-ink"
              product={product}
            />
          </div>
          <span className="absolute bottom-3 left-3 border border-white/20 bg-ink/65 px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.14em] text-white/75 backdrop-blur">
            No. {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div
            className={cx(
              "text-[0.56rem] font-bold uppercase tracking-[0.17em]",
              tone === "light" ? "text-ink/55" : "text-muted-foreground",
            )}
          >
            {brandLabel}
          </div>
          <Link className="mt-2 block" href={`/products/${product.handle}`}>
            <h3 className="line-clamp-1 font-display text-lg font-bold tracking-[-0.035em]">
              {product.name}
            </h3>
            <p
              className={cx(
                "mt-1 line-clamp-1 text-xs",
                tone === "light" ? "text-ink/55" : "text-muted-foreground",
              )}
            >
              {product.subtitle}
            </p>
          </Link>

          <div
            className={cx(
              "mt-auto flex items-end justify-between gap-3 border-t pt-4",
              tone === "light" ? "border-ink/15" : "border-border",
            )}
          >
            <div>
              {product.compareAt ? (
                <span
                  className={cx(
                    "mr-2 text-[0.68rem] line-through",
                    tone === "light" ? "text-ink/45" : "text-muted-foreground",
                  )}
                >
                  {product.compareAtDisplay}
                </span>
              ) : null}
              <span className="text-sm font-bold tabular-nums">{product.priceDisplay}</span>
            </div>
            {isDemoProduct ? (
              <Link
                aria-label={`Explore ${product.name}`}
                className={cx(
                  "grid size-10 place-items-center border transition-[background,color,border-color]",
                  tone === "light"
                    ? "border-ink/20 hover:border-ink hover:bg-ink hover:text-cream"
                    : "border-border hover:border-primary hover:bg-primary hover:text-primary-foreground",
                )}
                href={`/products/${product.handle}`}
              >
                <Icon className="size-4" name="arrow-up-right" />
              </Link>
            ) : (
              <ProductCardAddToCartButton
                className={cx(
                  "size-10 rounded-none",
                  tone === "light" ? "border-ink/20 bg-transparent text-ink hover:bg-ink hover:text-cream" : "",
                )}
                product={product}
              />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
