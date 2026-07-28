"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import type { IconName, Product, ProductVariant } from "@/types/site";
import { cx } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-provider";
import { ProductCard } from "@/components/sections/product-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";
import { WishlistButton } from "@/components/wishlist/wishlist-button";

type ProductDetailPageProps = {
  product: Product;
  relatedProducts: Product[];
};

type ProductAccordionItem = {
  value: string;
  title: string;
  content: ReactNode;
  contentClassName?: string;
};

const trustItems: { icon: IconName; label: string }[] = [
  { icon: "shield-check", label: "10-year warranty" },
  { icon: "truck", label: "Free over $100" },
  { icon: "rotate-ccw", label: "30-day returns" },
];

export function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  const router = useRouter();
  const { addLineItem, error: cartError, isMutating } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [addingMode, setAddingMode] = useState<"cart" | "buy" | null>(null);
  const selectedVariant = product.variants[selectedVariantIndex] ?? product.variants[0];
  const comparisonProducts = [product, ...relatedProducts.slice(0, 2)];
  const canPurchase = Boolean(selectedVariant.id && selectedVariant.inStock);

  async function addSelectedVariant(action: "cart" | "buy" = "cart") {
    if (!canPurchase) {
      return;
    }

    setAddingMode(action);

    try {
      const nextCart = await addLineItem(selectedVariant.id, quantity);

      if (!nextCart) {
        return;
      }

      if (action === "buy") {
        router.push("/checkout");
        return;
      }

      setAdded(true);
      window.setTimeout(() => setAdded(false), 1500);
    } catch {
      // The cart provider owns the user-facing error state.
    } finally {
      setAddingMode(null);
    }
  }

  return (
    <>
      <Container className="pt-8">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link className="hover:text-foreground" href="/collections">
            Shop
          </Link>{" "}
          / <span className="text-foreground">{product.name}</span>
        </nav>
      </Container>

      <section>
        <Container className="grid gap-10 py-8 md:py-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
          <ProductGallery
            activeImage={activeImage}
            onImageChange={setActiveImage}
            product={product}
          />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductPurchasePanel
              added={added}
              addingMode={addingMode}
              canPurchase={canPurchase}
              cartError={cartError}
              onAddSelectedVariant={addSelectedVariant}
              onQuantityChange={setQuantity}
              onVariantChange={setSelectedVariantIndex}
              product={product}
              quantity={quantity}
              selectedVariant={selectedVariant}
              selectedVariantIndex={selectedVariantIndex}
              isMutating={isMutating}
            />
          </div>
        </Container>
      </section>

      <ProductSpecifications product={product} />
      <ProductFeatures product={product} />
      <ProductComparison comparisonProducts={comparisonProducts} product={product} />
      <ProductReviews product={product} />
      <ProductFaq product={product} />
      <RelatedProducts products={relatedProducts} />
      <div aria-hidden="true" className="h-28 md:hidden" />
      <MobilePurchaseBar
        added={added}
        addingMode={addingMode}
        canPurchase={canPurchase}
        isMutating={isMutating}
        onAddSelectedVariant={addSelectedVariant}
        product={product}
        selectedVariant={selectedVariant}
      />
    </>
  );
}

function ProductPurchasePanel({
  added,
  addingMode,
  canPurchase,
  cartError,
  isMutating,
  onAddSelectedVariant,
  onQuantityChange,
  onVariantChange,
  product,
  quantity,
  selectedVariant,
  selectedVariantIndex,
}: {
  added: boolean;
  addingMode: "cart" | "buy" | null;
  canPurchase: boolean;
  cartError: string | null;
  isMutating: boolean;
  onAddSelectedVariant: (action?: "cart" | "buy") => Promise<void>;
  onQuantityChange: (value: number) => void;
  onVariantChange: (variantIndex: number) => void;
  product: Product;
  quantity: number;
  selectedVariant: ProductVariant;
  selectedVariantIndex: number;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-border bg-surface-elevated p-5 shadow-[var(--shadow-soft)] md:p-6">
      {product.badge ? <Eyebrow className="text-primary">{product.badge}</Eyebrow> : null}
      <h1 className="mt-2 font-display text-4xl font-semibold leading-tight md:text-5xl">
        {product.name}
      </h1>
      <p className="mt-2 text-muted-foreground">{product.subtitle}</p>

      {product.rating && product.reviewCount ? (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <StarRating iconClassName="size-3.5" />
          <span className="text-muted-foreground">
            {product.rating} / {product.reviewCount} reviews
          </span>
        </div>
      ) : null}

      <div className="mt-6 flex items-baseline gap-3">
        <div className="text-3xl font-semibold tabular-nums">
          {selectedVariant.priceDisplay}
        </div>
        {product.compareAt ? (
          <div className="text-lg text-muted-foreground line-through tabular-nums">
            {product.compareAtDisplay}
          </div>
        ) : null}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        {product.shortDescription}
      </p>

      <VariantSelector
        onChange={onVariantChange}
        optionLabel={product.optionLabel}
        selectedIndex={selectedVariantIndex}
        variants={product.variants}
      />

      <div className="mt-8 grid grid-cols-[auto_1fr] gap-3">
        <QuantityControl onChange={onQuantityChange} quantity={quantity} />

        <Button
          className="relative h-12 w-full overflow-hidden disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canPurchase || isMutating}
          onClick={() => void onAddSelectedVariant("cart")}
          type="button"
        >
          {added ? (
            <span className="inline-flex animate-[ticker-in_180ms_ease-out_both] items-center gap-2">
              <Icon className="size-4" name="check" />
              Added
            </span>
          ) : (
            <span className="animate-[ticker-in_180ms_ease-out_both]">
              {addingMode === "cart" ? "Adding..." : canPurchase ? "Add to cart" : "Sold out"}
            </span>
          )}
        </Button>
      </div>

      <Button
        className="mt-3 h-12 w-full disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!canPurchase || isMutating}
        onClick={() => void onAddSelectedVariant("buy")}
        type="button"
        variant="secondary"
      >
        {addingMode === "buy" ? "Preparing..." : "Buy now"}
      </Button>
      <WishlistButton className="mt-3 h-12 w-full" product={product} showLabel />
      {cartError ? <p className="mt-3 text-xs text-primary">{cartError}</p> : null}

      <div className="mt-4 text-xs text-muted-foreground">
        {selectedVariant.inStock ? (
          <span className="text-primary">In stock - ships in 1-2 days</span>
        ) : (
          <span>Currently sold out</span>
        )}
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
        {trustItems.map((item) => (
          <TrustItem icon={item.icon} key={item.label} label={item.label} />
        ))}
      </div>

      <ProductAccordion items={getProductAccordionItems(product)} />
    </div>
  );
}

function ProductGallery({
  activeImage,
  onImageChange,
  product,
}: {
  activeImage: number;
  onImageChange: (imageIndex: number) => void;
  product: Product;
}) {
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] border border-border bg-surface">
        <Image
          alt={product.name}
          className="animate-[gallery-in_350ms_ease-out_both] object-cover"
          fill
          key={product.images[activeImage]}
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          src={product.images[activeImage]}
        />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {product.images.map((image, index) => (
          <button
            aria-label={`View ${product.name} image ${index + 1}`}
            className={cx(
              "relative aspect-square overflow-hidden rounded-[var(--radius)] border bg-surface transition-colors",
              index === activeImage
                ? "border-primary"
                : "border-border hover:border-muted-foreground",
            )}
            key={image}
            onClick={() => onImageChange(index)}
            type="button"
          >
            <Image
              alt=""
              aria-hidden="true"
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 110px, 25vw"
              src={image}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function VariantSelector({
  onChange,
  optionLabel,
  selectedIndex,
  variants,
}: {
  onChange: (variantIndex: number) => void;
  optionLabel: string;
  selectedIndex: number;
  variants: ProductVariant[];
}) {
  const selectedVariant = variants[selectedIndex] ?? variants[0];

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <Eyebrow>{optionLabel}</Eyebrow>
        <div className="text-xs text-muted-foreground">{selectedVariant.name}</div>
      </div>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant, index) => (
          <button
            aria-label={`Select ${variant.name}`}
            aria-pressed={index === selectedIndex}
            className={cx(
              "relative grid min-h-11 min-w-11 place-items-center rounded-[var(--radius)] border px-3 text-xs font-semibold transition-[border-color,background,transform]",
              index === selectedIndex
                ? "border-primary bg-surface text-primary"
                : "border-border bg-background",
              variant.inStock ? "hover:border-primary" : "opacity-45",
            )}
            disabled={!variant.inStock}
            key={variant.id}
            onClick={() => onChange(index)}
            title={`${variant.name}${variant.inStock ? "" : " - sold out"}`}
            type="button"
          >
            <span
              aria-hidden="true"
              className="mr-2 inline-block size-3 rounded-full border border-border align-middle"
              style={{ backgroundColor: variant.color }}
            />
            {variant.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuantityControl({
  onChange,
  quantity,
}: {
  onChange: (value: number) => void;
  quantity: number;
}) {
  return (
    <div className="inline-flex h-12 items-center rounded-[var(--radius)] border border-border">
      <button
        aria-label="Decrease"
        className="grid size-12 place-items-center transition-colors hover:bg-secondary"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        type="button"
      >
        <Icon className="size-4" name="minus" />
      </button>
      <span className="w-10 text-center text-sm tabular-nums">{quantity}</span>
      <button
        aria-label="Increase"
        className="grid size-12 place-items-center transition-colors hover:bg-secondary"
        onClick={() => onChange(quantity + 1)}
        type="button"
      >
        <Icon className="size-4" name="plus" />
      </button>
    </div>
  );
}

function ProductAccordion({ items }: { items: ProductAccordionItem[] }) {
  const [openItem, setOpenItem] = useState<string | null>("desc");

  return (
    <div className="mt-6 border-t border-border">
      {items.map((item) => {
        const isOpen = openItem === item.value;
        const panelId = `product-accordion-${item.value}`;

        return (
          <div className="border-b border-border" key={item.value}>
            <h3 className="flex">
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="flex flex-1 cursor-pointer items-center justify-between py-4 text-left text-sm font-semibold transition-colors hover:text-primary"
                onClick={() => setOpenItem(isOpen ? null : item.value)}
                type="button"
              >
                {item.title}
                <Icon
                  className={cx(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen ? "rotate-180" : "",
                  )}
                  name="chevron-down"
                />
              </button>
            </h3>
            {isOpen ? (
              <div
                className={cx(
                  "animate-[fade-in_200ms_ease-out_both] pb-4 pt-0",
                  item.contentClassName,
                )}
                id={panelId}
              >
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function getProductAccordionItems(product: Product): ProductAccordionItem[] {
  const items: ProductAccordionItem[] = [
    {
      value: "desc",
      title: "Description",
      content: product.description,
      contentClassName: "text-sm leading-relaxed text-muted-foreground",
    },
    {
      value: "ship",
      title: "Shipping and returns",
      content:
        "Free discreet shipping on orders over $100. 30-day returns, no questions asked. Devices ship with a 10-year hardware warranty; batteries and accessories 1-year.",
      contentClassName: "text-sm leading-relaxed text-muted-foreground",
    },
  ];

  if (product.inBox.length > 0) {
    items.splice(1, 0, {
      value: "box",
      title: "What's in the box",
      content: (
        <ul className="space-y-1.5 text-sm">
          {product.inBox.map((item) => (
            <li className="text-muted-foreground" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ),
    });
  }

  return items;
}

function ProductSpecifications({ product }: { product: Product }) {
  if (product.specs.length === 0 && product.categoryNames.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border bg-surface">
      <Container className="grid gap-10 py-20 md:grid-cols-[0.7fr_1.3fr]">
        <div>
          <Eyebrow className="text-primary">Specifications</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
            Details at a glance.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
            Compatibility, materials, and product data pulled from the current catalog record.
          </p>
        </div>
        <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-surface-elevated">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-border">
              {product.collectionNames.length > 0 ? (
                <tr>
                  <td className="w-1/3 px-4 py-3 text-muted-foreground">Collection</td>
                  <td className="px-4 py-3">{product.collectionNames.join(", ")}</td>
                </tr>
              ) : null}
              {product.categoryNames.length > 0 ? (
                <tr>
                  <td className="w-1/3 px-4 py-3 text-muted-foreground">Category</td>
                  <td className="px-4 py-3">{product.categoryNames.join(", ")}</td>
                </tr>
              ) : null}
              {product.specs.map((spec) => (
                <tr key={spec.label}>
                  <td className="w-1/3 px-4 py-3 text-muted-foreground">{spec.label}</td>
                  <td className="px-4 py-3">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}

function ProductFeatures({ product }: { product: Product }) {
  if (product.features.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border bg-background">
      {product.features.map((feature, index) => (
        <Container
          className={cx(
            "grid items-center gap-12 py-16 md:grid-cols-2 md:py-24",
            index % 2 ? "md:[&>*:first-child]:order-2" : "",
          )}
          key={feature.title}
        >
          <div>
            <Eyebrow>Feature {String(index + 1).padStart(2, "0")}</Eyebrow>
            <h3 className="mt-3 max-w-md font-display text-3xl font-semibold leading-tight md:text-4xl">
              {feature.title}
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
              {feature.body}
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius)] border border-border bg-surface">
            <Image
              alt=""
              aria-hidden="true"
              className="object-cover"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              src={product.images[index % product.images.length]}
            />
          </div>
        </Container>
      ))}
    </section>
  );
}

function ProductComparison({
  comparisonProducts,
  product,
}: {
  comparisonProducts: Product[];
  product: Product;
}) {
  return (
    <section className="border-t border-border bg-surface">
      <Container className="py-20">
        <Eyebrow>Compare</Eyebrow>
        <h3 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
          {product.name} in context.
        </h3>
        <div className="mt-10 overflow-x-auto rounded-[var(--radius)] border border-border bg-surface-elevated">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-4 text-left font-normal text-muted-foreground" />
                {comparisonProducts.map((comparisonProduct) => (
                  <th
                    className="px-4 py-4 text-left font-semibold"
                    key={comparisonProduct.handle}
                  >
                    {comparisonProduct.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {product.specs.slice(0, 4).map((spec) => (
                <tr key={spec.label}>
                  <td className="px-4 py-3 text-muted-foreground">{spec.label}</td>
                  {comparisonProducts.map((comparisonProduct) => {
                    const matchingSpec = comparisonProduct.specs.find(
                      (candidate) => candidate.label === spec.label,
                    );

                    return (
                      <td className="px-4 py-3" key={comparisonProduct.handle}>
                        {matchingSpec ? matchingSpec.value : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="px-4 py-3 text-muted-foreground">Price</td>
                {comparisonProducts.map((comparisonProduct) => (
                  <td className="px-4 py-3 tabular-nums" key={comparisonProduct.handle}>
                    {comparisonProduct.priceDisplay}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}

function ProductReviews({ product }: { product: Product }) {
  if (!product.rating || !product.reviewCount) {
    return null;
  }

  return (
    <section className="border-t border-border bg-background">
      <Container className="grid gap-12 py-20 md:grid-cols-[280px_1fr]">
        <div>
          <div className="font-display text-5xl font-semibold tabular-nums">{product.rating}</div>
          <StarRating className="mt-2" iconClassName="size-4" />
          <div className="mt-1 text-xs text-muted-foreground">
            {product.reviewCount} verified reviews
          </div>
          <Button className="mt-6 w-full" type="button" variant="secondary">
            Write a review
          </Button>
        </div>

        <div className="space-y-6">
          {product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div className="border-b border-border pb-6" key={review.title}>
                <StarRating className="mb-2" iconClassName="size-3" />
                <h4 className="font-semibold">{review.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {review.body}
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  {review.author}, verified buyer
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[var(--radius)] border border-border bg-surface-elevated p-6 text-sm text-muted-foreground">
              Written reviews are not configured for this product yet.
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function ProductFaq({ product }: { product: Product }) {
  const faqs = [
    {
      question: "Which accessories fit this product?",
      answer:
        product.categoryNames.length > 0
          ? `Start with accessories listed for ${product.categoryNames.join(", ")} products.`
          : "Use the product category and variant information on this page to match accessories.",
    },
    {
      question: "When will it ship?",
      answer: "In-stock items usually ship in 1-2 business days with discreet packaging.",
    },
    {
      question: "Can I return it?",
      answer: "Eligible items can be returned within 30 days. Devices include hardware warranty coverage.",
    },
  ];

  return (
    <section className="border-t border-border bg-surface">
      <Container className="grid gap-10 py-20 md:grid-cols-[0.7fr_1.3fr]">
        <div>
          <Eyebrow className="text-primary">FAQ</Eyebrow>
          <h3 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
            Practical answers before checkout.
          </h3>
        </div>
        <div className="divide-y divide-border rounded-[var(--radius)] border border-border bg-surface-elevated">
          {faqs.map((faq) => (
            <div className="p-5" key={faq.question}>
              <h4 className="font-semibold">{faq.question}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <section className="border-t border-border bg-background">
      <Container className="py-20">
        <Eyebrow>You may also like</Eyebrow>
        <h3 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
          Pairs well with.
        </h3>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {products.map((product, index) => (
            <ProductCard index={index} key={product.handle} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function StarRating({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cx("flex gap-0.5", className)}>
      {[0, 1, 2, 3, 4].map((star) => (
        <Icon
          className={cx("fill-primary text-primary", iconClassName)}
          key={star}
          name="star"
        />
      ))}
    </div>
  );
}

function TrustItem({ icon, label }: { icon: IconName; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-4 text-primary" name={icon} />
      <span>{label}</span>
    </div>
  );
}

function MobilePurchaseBar({
  added,
  addingMode,
  canPurchase,
  isMutating,
  onAddSelectedVariant,
  product,
  selectedVariant,
}: {
  added: boolean;
  addingMode: "cart" | "buy" | null;
  canPurchase: boolean;
  isMutating: boolean;
  onAddSelectedVariant: (action?: "cart" | "buy") => Promise<void>;
  product: Product;
  selectedVariant: ProductVariant;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-elevated/95 p-3 shadow-[var(--shadow-soft)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-[44rem] grid-cols-[1fr_auto] items-center gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{product.name}</div>
          <div className="text-xs text-muted-foreground">{selectedVariant.priceDisplay}</div>
        </div>
        <Button
          className="h-11 px-4"
          disabled={!canPurchase || isMutating}
          onClick={() => void onAddSelectedVariant("cart")}
          type="button"
        >
          {added ? "Added" : addingMode === "cart" ? "Adding..." : canPurchase ? "Add" : "Sold out"}
        </Button>
      </div>
    </div>
  );
}
