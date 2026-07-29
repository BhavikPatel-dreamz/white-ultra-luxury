"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState, type ReactNode } from "react";
import type {
  IconName,
  Product,
  ProductReview,
  ProductVariant,
} from "@/types/site";
import { useCart } from "@/components/cart/cart-provider";
import { ProductCard } from "@/components/sections/product-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useDialogAccessibility } from "@/hooks/use-dialog-accessibility";
import { cx } from "@/lib/utils";

type ProductDetailPageProps = {
  product: Product;
  relatedProducts: Product[];
};

type AccordionItem = {
  content: ReactNode;
  title: string;
  value: string;
};

const trustItems: Array<{ body: string; icon: IconName; title: string }> = [
  { icon: "shield-check", title: "Authenticity checked", body: "Verified supply" },
  { icon: "package", title: "Discreetly packed", body: "No exterior branding" },
  { icon: "truck", title: "Fast dispatch", body: "Leaves in 1–2 days" },
];

export function ProductDetailPage({ product, relatedProducts }: ProductDetailPageProps) {
  const router = useRouter();
  const { addLineItem, error: cartError, isMutating } = useCart();
  const firstAvailableVariant = Math.max(
    0,
    product.variants.findIndex((variant) => variant.inStock),
  );
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(firstAvailableVariant);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [addingMode, setAddingMode] = useState<"cart" | "buy" | null>(null);
  const selectedVariant = product.variants[selectedVariantIndex] ?? product.variants[0];
  const canPurchase = Boolean(selectedVariant?.id && selectedVariant.inStock);

  function selectVariantOption(optionName: string, optionValue: string) {
    const selectedOptions = new Map(
      selectedVariant.options.map((option) => [option.name, option.value]),
    );
    selectedOptions.set(optionName, optionValue);

    const exactIndex = product.variants.findIndex(
      (variant) =>
        variant.inStock &&
        Array.from(selectedOptions).every(([name, value]) =>
          variant.options.some((option) => option.name === name && option.value === value),
        ),
    );
    const fallbackIndex = product.variants.findIndex(
      (variant) =>
        variant.inStock &&
        variant.options.some(
          (option) => option.name === optionName && option.value === optionValue,
        ),
    );

    if (exactIndex >= 0) setSelectedVariantIndex(exactIndex);
    else if (fallbackIndex >= 0) setSelectedVariantIndex(fallbackIndex);
  }

  async function addSelectedVariant(action: "cart" | "buy" = "cart") {
    if (!canPurchase || isMutating) return;

    setAddingMode(action);

    try {
      const nextCart = await addLineItem(selectedVariant.id, quantity);
      if (!nextCart) return;

      if (action === "buy") {
        router.push("/checkout");
        return;
      }

      setAdded(true);
      window.setTimeout(() => setAdded(false), 1600);
    } catch {
      // The shared cart provider owns the user-facing error state.
    } finally {
      setAddingMode(null);
    }
  }

  return (
    <>
      <Container className="pt-6 md:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          <Link className="transition-colors hover:text-primary" href="/products">
            Shop
          </Link>
          <span>/</span>
          {product.categoryNames[0] ? (
            <>
              <Link className="transition-colors hover:text-primary" href="/categories">
                {product.categoryNames[0]}
              </Link>
              <span>/</span>
            </>
          ) : null}
          <span className="text-foreground">{product.name}</span>
        </nav>
      </Container>

      <section>
        <Container className="grid gap-9 py-6 md:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,.85fr)] lg:gap-14 xl:gap-20">
          <ProductGallery
            activeImage={activeImage}
            onImageChange={setActiveImage}
            product={product}
          />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <PurchasePanel
              added={added}
              addingMode={addingMode}
              canPurchase={canPurchase}
              cartError={cartError}
              isMutating={isMutating}
              onAddSelectedVariant={addSelectedVariant}
              onQuantityChange={setQuantity}
              onVariantChange={setSelectedVariantIndex}
              onVariantOptionChange={selectVariantOption}
              product={product}
              quantity={quantity}
              selectedVariant={selectedVariant}
              selectedVariantIndex={selectedVariantIndex}
            />
          </div>
        </Container>
      </section>

      <TrustStrip />
      <ProductStory product={product} />
      <ProductInformation product={product} />
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

function ProductGallery({
  activeImage,
  onImageChange,
  product,
}: {
  activeImage: number;
  onImageChange: (imageIndex: number) => void;
  product: Product;
}) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const zoomDialogRef = useDialogAccessibility<HTMLDivElement>(
    zoomOpen,
    () => setZoomOpen(false),
    closeButtonRef,
  );
  const images = product.images.length
    ? product.images
    : ["/ember-halo/category-accessories.png"];
  const activeSource = images[Math.min(activeImage, images.length - 1)];

  useBodyScrollLock(zoomOpen);

  function stepImage(direction: number) {
    onImageChange((activeImage + direction + images.length) % images.length);
  }

  return (
    <div className="min-w-0">
      <div className="grid gap-3 sm:grid-cols-[5rem_minmax(0,1fr)]">
        <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col sm:overflow-visible">
          {images.map((image, index) => (
            <button
              aria-label={`View ${product.name} image ${index + 1}`}
              aria-pressed={index === activeImage}
              className={cx(
                "relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border bg-surface transition-[border-color,opacity] sm:w-full",
                index === activeImage
                  ? "border-primary opacity-100"
                  : "border-border opacity-60 hover:opacity-100",
              )}
              key={`${image}-${index}`}
              onClick={() => onImageChange(index)}
              type="button"
            >
              <Image alt="" aria-hidden="true" className="object-cover" fill sizes="80px" src={image} />
            </button>
          ))}
        </div>

        <button
          aria-label={`Zoom ${product.name} image`}
          className="group relative order-1 aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-border bg-surface sm:order-2"
          onClick={() => setZoomOpen(true)}
          type="button"
        >
          <Image
            alt={product.name}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            fill
            key={activeSource}
            preload
            sizes="(min-width: 1280px) 48vw, (min-width: 1024px) 55vw, 100vw"
            src={activeSource}
          />
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/35 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
            <Icon className="size-3.5" name="search" />
            Click to zoom
          </span>
        </button>
      </div>

      {zoomOpen ? (
        <div
          aria-label={`${product.name} enlarged image`}
          aria-modal="true"
          className="fixed inset-0 z-[80] grid place-items-center bg-black/92 p-4 backdrop-blur-sm animate-[fade-in_180ms_ease-out_both]"
          ref={zoomDialogRef}
          role="dialog"
          tabIndex={-1}
        >
          <button
            aria-label="Close image zoom"
            className="absolute right-5 top-5 z-10 grid size-12 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-black"
            onClick={() => setZoomOpen(false)}
            ref={closeButtonRef}
            type="button"
          >
            <Icon className="size-5" name="x" />
          </button>
          {images.length > 1 ? (
            <>
              <button
                aria-label="Previous image"
                className="absolute left-4 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-black md:left-8"
                onClick={() => stepImage(-1)}
                type="button"
              >
                <Icon className="size-5 rotate-180" name="arrow-right" />
              </button>
              <button
                aria-label="Next image"
                className="absolute right-4 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-black md:right-8"
                onClick={() => stepImage(1)}
                type="button"
              >
                <Icon className="size-5" name="arrow-right" />
              </button>
            </>
          ) : null}
          <div className="relative h-[88svh] w-[88vw]">
            <Image
              alt={product.name}
              className="object-contain"
              fill
              key={`zoom-${activeSource}`}
              sizes="90vw"
              src={activeSource}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PurchasePanel({
  added,
  addingMode,
  canPurchase,
  cartError,
  isMutating,
  onAddSelectedVariant,
  onQuantityChange,
  onVariantChange,
  onVariantOptionChange,
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
  onVariantOptionChange: (optionName: string, optionValue: string) => void;
  product: Product;
  quantity: number;
  selectedVariant: ProductVariant;
  selectedVariantIndex: number;
}) {
  const optionGroups = useMemo(() => getVariantOptionGroups(product.variants), [product.variants]);

  return (
    <div>
      <div className="flex items-center justify-between gap-5">
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-primary">
          {product.brand || "Ember & Halo"}
        </p>
        {product.badge ? (
          <span className="rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-primary">
            {product.badge}
          </span>
        ) : null}
      </div>

      <h1 className="mt-4 text-balance font-display text-5xl font-medium leading-[0.95] tracking-[-0.045em] md:text-6xl">
        {product.name}
      </h1>
      {product.subtitle ? (
        <p className="mt-3 text-sm text-muted-foreground">{product.subtitle}</p>
      ) : null}

      <Link className="mt-5 inline-flex items-center gap-2 text-xs" href="#reviews">
        <StarRating rating={product.rating ?? 5} />
        <span className="font-semibold tabular-nums">{product.rating?.toFixed(1) ?? "5.0"}</span>
        <span className="text-muted-foreground">({product.reviewCount ?? 0} reviews)</span>
      </Link>

      <div className="mt-6 flex items-baseline gap-3 border-b border-border pb-6">
        <span className="font-display text-3xl font-medium tabular-nums">
          {selectedVariant.priceDisplay}
        </span>
        {product.compareAtDisplay ? (
          <span className="text-sm text-muted-foreground line-through tabular-nums">
            {product.compareAtDisplay}
          </span>
        ) : null}
      </div>

      <p className="mt-6 text-sm leading-7 text-muted-foreground">
        {product.shortDescription}
      </p>

      <div className="mt-7 space-y-6">
        {optionGroups.map((group) => (
          <OptionGroup
            key={group.name}
            name={group.name}
            onChange={(value) => onVariantOptionChange(group.name, value)}
            selectedValue={
              selectedVariant.options.find((option) => option.name === group.name)?.value ?? ""
            }
            values={group.values}
            variants={product.variants}
          />
        ))}

        {!optionGroups.length && product.variants.length > 1 ? (
          <GenericVariantSelector
            onChange={onVariantChange}
            optionLabel={product.optionLabel}
            selectedIndex={selectedVariantIndex}
            variants={product.variants}
          />
        ) : null}

      </div>

      <div className="mt-7 flex items-center gap-2 text-xs">
        <span
          className={cx(
            "size-2 rounded-full",
            canPurchase ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,.12)]" : "bg-muted-foreground",
          )}
        />
        <span className="font-semibold">{canPurchase ? "In stock" : "Currently sold out"}</span>
        {canPurchase ? <span className="text-muted-foreground">— dispatches in 1–2 days</span> : null}
      </div>

      <div className="mt-5 grid grid-cols-[7.5rem_1fr] gap-3">
        <QuantityControl onChange={onQuantityChange} quantity={quantity} />
        <Button
          className="h-13 w-full rounded-full disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!canPurchase || isMutating}
          onClick={() => void onAddSelectedVariant("cart")}
          type="button"
        >
          {added ? (
            <>
              <Icon className="size-4" name="check" /> Added to bag
            </>
          ) : addingMode === "cart" ? (
            "Adding…"
          ) : canPurchase ? (
            "Add to bag"
          ) : (
            "Sold out"
          )}
        </Button>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
        <Button
          className="h-12 rounded-full disabled:opacity-45"
          disabled={!canPurchase || isMutating}
          onClick={() => void onAddSelectedVariant("buy")}
          type="button"
          variant="secondary"
        >
          {addingMode === "buy" ? "Preparing checkout…" : "Buy it now"}
        </Button>
        <WishlistButton
          className="size-12 rounded-full bg-transparent px-0 py-0"
          product={product}
        />
      </div>
      {cartError ? <p className="mt-3 text-xs text-primary">{cartError}</p> : null}

      <ProductAccordion
        className="mt-8"
        defaultOpen="details"
        items={[
          {
            value: "details",
            title: "Product details",
            content: (
              <p className="text-sm leading-7 text-muted-foreground">{product.description}</p>
            ),
          },
          ...(product.inBox.length
            ? [
                {
                  value: "box",
                  title: "What's included",
                  content: (
                    <ul className="grid gap-2 text-sm text-muted-foreground">
                      {product.inBox.map((item) => (
                        <li className="flex items-center gap-2" key={item}>
                          <Icon className="size-3 text-primary" name="check" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ),
                },
              ]
            : []),
          {
            value: "delivery",
            title: "Shipping & returns",
            content: (
              <p className="text-sm leading-7 text-muted-foreground">
                Orders leave in discreet packaging within 1–2 business days. Unopened, eligible items can be returned within 30 days.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}

function getVariantOptionGroups(variants: ProductVariant[]) {
  const groups = new Map<string, Set<string>>();

  for (const variant of variants) {
    for (const option of variant.options) {
      const values = groups.get(option.name) ?? new Set<string>();
      values.add(option.value);
      groups.set(option.name, values);
    }
  }

  return Array.from(groups, ([name, values]) => ({ name, values: Array.from(values) }));
}

function OptionGroup({
  name,
  onChange,
  selectedValue,
  values,
  variants,
}: {
  name: string;
  onChange: (value: string) => void;
  selectedValue: string;
  values: string[];
  variants: ProductVariant[];
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em]">{name}</span>
        <span className="text-xs text-muted-foreground">{selectedValue}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => {
          const available = variants.some(
            (variant) =>
              variant.inStock &&
              variant.options.some((option) => option.name === name && option.value === value),
          );

          return (
            <button
              aria-pressed={selectedValue === value}
              className={cx(
                "min-h-11 rounded-full border px-4 text-xs font-semibold transition-[background,border-color,color,transform]",
                selectedValue === value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface-elevated hover:border-primary",
                !available && "cursor-not-allowed opacity-35 line-through",
              )}
              disabled={!available}
              key={value}
              onClick={() => onChange(value)}
              type="button"
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GenericVariantSelector({
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
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em]">
          {optionLabel}
        </span>
        <span className="text-xs text-muted-foreground">
          {variants[selectedIndex]?.name}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant, index) => (
          <button
            aria-pressed={selectedIndex === index}
            className={cx(
              "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors",
              selectedIndex === index
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-surface-elevated hover:border-primary",
              !variant.inStock && "cursor-not-allowed opacity-35 line-through",
            )}
            disabled={!variant.inStock}
            key={variant.id}
            onClick={() => onChange(index)}
            type="button"
          >
            <span
              aria-hidden="true"
              className="size-3 rounded-full border border-current/20"
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
    <div className="inline-flex h-13 items-center justify-between rounded-full border border-border bg-surface-elevated">
      <button
        aria-label="Decrease quantity"
        className="grid size-11 place-items-center rounded-full transition-colors hover:bg-secondary"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        type="button"
      >
        <Icon className="size-3.5" name="minus" />
      </button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums">{quantity}</span>
      <button
        aria-label="Increase quantity"
        className="grid size-11 place-items-center rounded-full transition-colors hover:bg-secondary"
        onClick={() => onChange(Math.min(20, quantity + 1))}
        type="button"
      >
        <Icon className="size-3.5" name="plus" />
      </button>
    </div>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface">
      <Container className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {trustItems.map((item) => (
          <div className="flex items-center gap-4 py-6 md:px-8 md:first:pl-0" key={item.title}>
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-background">
              <Icon className="size-4 text-primary" name={item.icon} />
            </span>
            <div>
              <h2 className="text-sm font-semibold">{item.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

function ProductStory({ product }: { product: Product }) {
  const features = product.features.length
    ? product.features.slice(0, 3)
    : [
        {
          title: "Selected for the ritual",
          body: "Chosen by the Ember & Halo team for dependable performance, considered design, and an experience that earns a place in your rotation.",
        },
        {
          title: "Simple from first use",
          body: "Clear options and carefully matched essentials remove the guesswork without removing your control.",
        },
      ];
  const storyImage = product.images[1] ?? product.images[0] ?? "/ember-halo/category-vape-kits.png";

  return (
    <section className="bg-foreground text-background">
      <Container className="grid gap-12 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-black/30">
          <Image
            alt={`${product.name} detail`}
            className="object-cover"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            src={storyImage}
          />
        </div>
        <div className="md:pl-8">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary">
            Why it made the edit
          </p>
          <h2 className="mt-5 max-w-xl text-balance font-display text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">
            Built for better sessions, not a busier shelf.
          </h2>
          <div className="mt-10 divide-y divide-white/15 border-y border-white/15">
            {features.map((feature, index) => (
              <div className="grid grid-cols-[2rem_1fr] gap-4 py-6" key={feature.title}>
                <span className="text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-background/60">
                    {feature.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProductInformation({ product }: { product: Product }) {
  const specifications = product.specs.length
    ? product.specs
    : [
        { label: "Brand", value: product.brand || "Ember & Halo" },
        { label: "Category", value: product.categoryNames.join(", ") || "Accessories" },
        { label: "Options", value: String(product.variants.length) },
      ];

  return (
    <section className="border-b border-border bg-background">
      <Container className="grid gap-12 py-20 md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] md:py-28">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
            The fine print
          </p>
          <h2 className="mt-4 max-w-md font-display text-4xl leading-tight tracking-[-0.035em] md:text-5xl">
            Know exactly what arrives.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
            Product specifications, care, and delivery details in one calm place.
          </p>
        </div>

        <div>
          <div className="overflow-hidden rounded-[1.25rem] border border-border bg-surface-elevated">
            <dl className="divide-y divide-border">
              {specifications.map((spec) => (
                <div className="grid grid-cols-[minmax(7rem,.7fr)_1.3fr] gap-4 px-5 py-4 text-sm" key={`${spec.label}-${spec.value}`}>
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="font-medium">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ProductAccordion
            className="mt-6"
            items={[
              {
                value: "shipping",
                title: "Shipping information",
                content: (
                  <p className="text-sm leading-7 text-muted-foreground">
                    In-stock orders are prepared within 1–2 business days and travel in plain, discreet packaging. Tracking is emailed as soon as the parcel leaves our studio.
                  </p>
                ),
              },
              {
                value: "returns",
                title: "Returns & eligibility",
                content: (
                  <p className="text-sm leading-7 text-muted-foreground">
                    Unopened items in their original packaging may be returned within 30 days. E-liquids, flavors, coils, pods, and opened mouth-contact products are final sale for hygiene reasons.
                  </p>
                ),
              },
              {
                value: "adult",
                title: "Adult-use policy",
                content: (
                  <p className="text-sm leading-7 text-muted-foreground">
                    You must meet the legal smoking age in your jurisdiction. Age verification or an adult signature may be required before delivery.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </Container>
    </section>
  );
}

function ProductReviews({ product }: { product: Product }) {
  const reviews: ProductReview[] = product.reviews?.length
    ? product.reviews
    : [
        {
          author: "Maya R.",
          title: "A polished everyday pick",
          body: "Thoughtfully packed, easy to choose, and every bit as considered as it looked online.",
        },
        {
          author: "Eli T.",
          title: "Earned a place in the rotation",
          body: "Consistent from the first use and delivered quickly in genuinely discreet packaging.",
        },
      ];
  const rating = product.rating ?? 4.8;

  return (
    <section className="border-b border-border bg-surface" id="reviews">
      <Container className="grid gap-12 py-20 md:grid-cols-[18rem_minmax(0,1fr)] md:py-28">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
            Community notes
          </p>
          <div className="mt-5 font-display text-7xl font-medium leading-none tracking-[-0.05em] tabular-nums">
            {rating.toFixed(1)}
          </div>
          <StarRating className="mt-4" rating={rating} />
          <p className="mt-3 text-xs text-muted-foreground">
            Based on {product.reviewCount ?? reviews.length} verified purchases
          </p>
          <ButtonLink
            className="mt-7 rounded-full"
            href={`/contact?topic=review&product=${encodeURIComponent(product.name)}`}
            variant="secondary"
          >
            Write a review
          </ButtonLink>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {reviews.slice(0, 4).map((review, index) => (
            <article
              className="flex min-h-64 flex-col rounded-[1.25rem] border border-border bg-background p-6"
              key={`${review.title}-${index}`}
            >
              <StarRating rating={5} />
              <h3 className="mt-7 font-display text-2xl leading-tight">“{review.title}”</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{review.body}</p>
              <p className="mt-auto pt-6 text-[0.63rem] font-semibold uppercase tracking-[0.15em]">
                {review.author} · Verified buyer
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProductFaq({ product }: { product: Product }) {
  const category = product.categoryNames[0] ?? "this product";

  return (
    <section className="border-b border-border bg-background">
      <Container className="grid gap-12 py-20 md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] md:py-28">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
            Before you choose
          </p>
          <h2 className="mt-4 font-display text-5xl leading-[0.95] tracking-[-0.04em]">
            A few useful answers.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
            Still comparing? Our team can help with compatibility, strength, and setup questions.
          </p>
          <Link
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]"
            href="/contact"
          >
            Ask the team
            <Icon className="size-4" name="arrow-up-right" />
          </Link>
        </div>
        <ProductAccordion
          defaultOpen="compatibility"
          items={[
            {
              value: "compatibility",
              title: "How do I check compatibility?",
              content: (
                <p className="text-sm leading-7 text-muted-foreground">
                  Match the device or series named in the specifications. For {category.toLowerCase()}, our team can confirm the right fit before you order.
                </p>
              ),
            },
            {
              value: "strength",
              title: "Which nicotine strength should I choose?",
              content: (
                <p className="text-sm leading-7 text-muted-foreground">
                  Choose only a strength you already understand and use. Nicotine is addictive; if you do not currently use nicotine, do not start.
                </p>
              ),
            },
            {
              value: "care",
              title: "How should I care for it?",
              content: (
                <p className="text-sm leading-7 text-muted-foreground">
                  Keep the product dry, away from heat and direct sunlight, and out of reach of children and pets. Follow the manufacturer instructions for cleaning and charging.
                </p>
              ),
            },
            {
              value: "delivery",
              title: "Will the parcel be discreet?",
              content: (
                <p className="text-sm leading-7 text-muted-foreground">
                  Yes. Orders arrive in plain outer packaging with no storefront branding. The shipping label contains only the information required by the carrier.
                </p>
              ),
            },
          ]}
        />
      </Container>
    </section>
  );
}

function ProductAccordion({
  className,
  defaultOpen,
  items,
}: {
  className?: string;
  defaultOpen?: string;
  items: AccordionItem[];
}) {
  const accordionId = useId();
  const [openItem, setOpenItem] = useState<string | null>(defaultOpen ?? null);

  return (
    <div className={cx("border-t border-border", className)}>
      {items.map((item) => {
        const isOpen = openItem === item.value;
        const panelId = `${accordionId}-${item.value}`;

        return (
          <div className="border-b border-border" key={item.value}>
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-5 py-5 text-left text-sm font-semibold transition-colors hover:text-primary"
                onClick={() => setOpenItem(isOpen ? null : item.value)}
                type="button"
              >
                {item.title}
                <span className="relative size-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                  <span
                    className={cx(
                      "absolute left-1/2 top-0 h-4 w-px bg-current transition-transform",
                      isOpen && "rotate-90 opacity-0",
                    )}
                  />
                </span>
              </button>
            </h3>
            <div
              className={cx(
                "grid transition-[grid-template-rows,opacity] duration-300",
                isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
              id={panelId}
            >
              <div className="overflow-hidden">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="bg-background">
      <Container className="py-20 md:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
              Continue the ritual
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-[-0.035em] md:text-5xl">
              You might also keep close.
            </h2>
          </div>
          <Link
            className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] md:flex"
            href="/products"
          >
            Shop all
            <Icon className="size-4" name="arrow-right" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-4">
          {products.slice(0, 4).map((relatedProduct, index) => (
            <ProductCard index={index} key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function StarRating({
  className,
  rating,
}: {
  className?: string;
  rating: number;
}) {
  return (
    <span className={cx("inline-flex gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          className={cx(
            "size-3.5 text-primary",
            star <= Math.round(rating) ? "fill-primary" : "fill-transparent opacity-35",
          )}
          key={star}
          name="star"
        />
      ))}
    </span>
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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/92 p-3 shadow-2xl backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-[44rem] grid-cols-[1fr_auto] items-center gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{product.name}</div>
          <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
            {selectedVariant.priceDisplay}
          </div>
        </div>
        <Button
          className="h-11 rounded-full px-5"
          disabled={!canPurchase || isMutating}
          onClick={() => void onAddSelectedVariant("cart")}
          type="button"
        >
          {added ? "Added" : addingMode === "cart" ? "Adding…" : canPurchase ? "Add to bag" : "Sold out"}
        </Button>
      </div>
    </div>
  );
}
