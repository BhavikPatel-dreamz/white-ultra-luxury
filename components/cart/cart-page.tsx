"use client";

import Image from "next/image";
import { useCart } from "@/components/cart/cart-provider";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";
import { formatMoney } from "@/lib/format";

export function CartPage() {
  const { cart, error, isLoading, isMutating, itemCount, removeLineItem, updateLineItem } =
    useCart();
  const currencyCode = cart?.currency_code ?? "usd";
  const items = cart?.items ?? [];

  return (
    <>
      <section className="border-b border-border bg-background">
        <Container className="pb-10 pt-16 md:pb-12 md:pt-20">
          <Eyebrow>Cart</Eyebrow>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">
            Review your order.
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Cart totals and availability are managed by the existing commerce backend.
          </p>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        {isLoading ? (
          <div className="rounded-[var(--radius)] border border-border bg-surface-elevated p-10 text-center text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
            Loading cart...
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-border bg-surface-elevated px-6 py-24 text-center shadow-[var(--shadow-soft)]">
            <Icon className="size-8 text-muted-foreground" name="shopping-bag" />
            <h2 className="mt-5 font-display text-2xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Add a product before starting checkout.
            </p>
            <ButtonLink className="mt-6" href="/products">
              Browse products
            </ButtonLink>
            {error ? <p className="mt-4 max-w-xs text-xs text-primary">{error}</p> : null}
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="rounded-[var(--radius)] border border-border bg-surface-elevated p-5 shadow-[var(--shadow-soft)]">
              <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
                <Eyebrow>{itemCount} items</Eyebrow>
                <ButtonLink href="/products" variant="secondary">
                  Continue shopping
                </ButtonLink>
              </div>
              <div className="divide-y divide-border">
                {items.map((item) => {
                  const thumbnail =
                    item.thumbnail ?? item.product?.thumbnail ?? "/assets/product-accessories-BrKIPgD4.jpg";
                  const title = item.product_title ?? item.title;
                  const variantTitle = item.variant_title ?? item.variant?.title;

                  return (
                    <div className="grid gap-4 py-5 first:pt-0 last:pb-0 md:grid-cols-[96px_1fr_auto]" key={item.id}>
                      <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] bg-surface">
                        <Image
                          alt={title}
                          className="object-cover"
                          fill
                          sizes="96px"
                          src={thumbnail}
                        />
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold">{title}</h2>
                        {variantTitle ? (
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {variantTitle}
                          </p>
                        ) : null}
                        <div className="mt-4 inline-flex h-9 items-center rounded-[var(--radius)] border border-border">
                          <button
                            aria-label={`Decrease ${title}`}
                            className="grid size-9 place-items-center transition-colors hover:bg-secondary disabled:opacity-40"
                            disabled={isMutating || item.quantity <= 1}
                            onClick={() => updateLineItem(item.id, item.quantity - 1)}
                            type="button"
                          >
                            <Icon className="size-3.5" name="minus" />
                          </button>
                          <span className="w-8 text-center text-xs tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            aria-label={`Increase ${title}`}
                            className="grid size-9 place-items-center transition-colors hover:bg-secondary disabled:opacity-40"
                            disabled={isMutating}
                            onClick={() => updateLineItem(item.id, item.quantity + 1)}
                            type="button"
                          >
                            <Icon className="size-3.5" name="plus" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 md:block md:text-right">
                        <div className="text-sm font-semibold tabular-nums">
                          {formatMoney((item.unit_price ?? 0) * item.quantity, currencyCode)}
                        </div>
                        <button
                          className="mt-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                          disabled={isMutating}
                          onClick={() => removeLineItem(item.id)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {error ? <p className="mt-5 text-xs text-primary">{error}</p> : null}
            </div>

            <aside className="sticky top-24 rounded-[var(--radius)] border border-border bg-surface-elevated p-5 shadow-[var(--shadow-soft)]">
              <Eyebrow>Summary</Eyebrow>
              <div className="mt-5 space-y-2 text-sm">
                <CartTotalRow label="Subtotal" value={formatMoney(cart?.subtotal, currencyCode)} />
                <CartTotalRow label="Shipping" value={formatMoney(cart?.shipping_total, currencyCode)} />
                <CartTotalRow label="Taxes" value={formatMoney(cart?.tax_total, currencyCode)} />
                <CartTotalRow label="Total" strong value={formatMoney(cart?.total, currencyCode)} />
              </div>
              <ButtonLink
                className={isMutating ? "mt-6 w-full pointer-events-none opacity-60" : "mt-6 w-full"}
                href="/checkout"
              >
                Checkout
              </ButtonLink>
            </aside>
          </div>
        )}
      </Container>
    </>
  );
}

function CartTotalRow({
  label,
  strong,
  value,
}: {
  label: string;
  strong?: boolean;
  value: string;
}) {
  return (
    <div className={strong ? "flex items-center justify-between text-base" : "flex items-center justify-between"}>
      <span className={strong ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
