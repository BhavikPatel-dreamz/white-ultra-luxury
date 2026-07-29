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
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-primary lg:block" />
        <Container className="relative py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
              <Eyebrow className="text-primary">Bag / {String(itemCount).padStart(2, "0")}</Eyebrow>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] md:text-7xl">
                Your session,<br />assembled.
              </h1>
            </div>
            <div className="relative border border-border bg-background p-5 lg:border-black/15 lg:bg-black lg:text-white">
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 text-primary" name="shield-check" />
                <p className="text-sm leading-6 text-muted-foreground">
                  Encrypted checkout. Discreet packaging. Adult signature may be required.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-16">
        {isLoading ? (
          <div className="border border-border bg-surface-elevated p-12 text-center text-sm text-muted-foreground">
            Loading your bag...
          </div>
        ) : items.length === 0 ? (
          <div className="relative flex min-h-[32rem] flex-col items-center justify-center overflow-hidden border border-border bg-surface-elevated px-6 py-24 text-center">
            <div className="absolute left-0 top-0 h-1 w-1/3 bg-primary" />
            <span className="font-mono text-[5rem] font-semibold leading-none text-border md:text-[8rem]">00</span>
            <h2 className="-mt-4 font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">Your rotation is wide open.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Start with a pocket-ready disposable, build a new kit, or restock the flavor shelf.
            </p>
            <ButtonLink className="mt-8" href="/products">
              Shop all gear
              <Icon className="size-4" name="arrow-right" />
            </ButtonLink>
            {error ? <p className="mt-4 max-w-xs text-xs text-primary">{error}</p> : null}
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
            <div className="border border-border bg-surface-elevated">
              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-5 md:px-7">
                <div>
                  <Eyebrow className="text-primary">Selected pieces</Eyebrow>
                  <p className="mt-1 text-xs text-muted-foreground">Inventory is reserved at checkout.</p>
                </div>
                <ButtonLink className="hidden sm:inline-flex" href="/products" variant="secondary">
                  Keep browsing
                </ButtonLink>
              </div>
              <div className="divide-y divide-border">
                {items.map((item) => {
                  const thumbnail =
                    item.thumbnail ?? item.product?.thumbnail ?? "/ember-halo/category-vape-kits.png";
                  const title = item.product_title ?? item.title;
                  const variantTitle = item.variant_title ?? item.variant?.title;

                  return (
                    <div className="grid gap-5 p-5 md:grid-cols-[128px_1fr_auto] md:p-7" key={item.id}>
                      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                        <Image
                          alt={title}
                          className="object-cover"
                          fill
                          sizes="128px"
                          src={thumbnail}
                        />
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <span className="mb-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary">Ember &amp; Halo selection</span>
                        <h2 className="line-clamp-2 font-display text-xl font-semibold tracking-[-0.025em]">{title}</h2>
                        {variantTitle ? (
                          <p className="mt-1.5 truncate text-xs text-muted-foreground">
                            {variantTitle}
                          </p>
                        ) : null}
                        <div className="mt-auto pt-5">
                          <div className="inline-flex h-10 items-center border border-border bg-surface">
                          <button
                            aria-label={`Decrease ${title}`}
                            className="grid size-10 place-items-center transition-colors hover:bg-secondary disabled:opacity-40"
                            disabled={isMutating || item.quantity <= 1}
                            onClick={() => updateLineItem(item.id, item.quantity - 1)}
                            type="button"
                          >
                            <Icon className="size-3.5" name="minus" />
                          </button>
                          <span className="w-9 text-center text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            aria-label={`Increase ${title}`}
                            className="grid size-10 place-items-center transition-colors hover:bg-secondary disabled:opacity-40"
                            disabled={isMutating}
                            onClick={() => updateLineItem(item.id, item.quantity + 1)}
                            type="button"
                          >
                            <Icon className="size-3.5" name="plus" />
                          </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-end justify-between gap-4 border-t border-border pt-4 md:block md:border-0 md:pt-0 md:text-right">
                        <div className="text-base font-semibold tabular-nums">
                          {formatMoney((item.unit_price ?? 0) * item.quantity, currencyCode)}
                        </div>
                        <button
                          className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
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

            <aside className="sticky top-24 border border-border bg-surface-elevated">
              <div className="border-b border-border p-6">
                <Eyebrow className="text-primary">Order summary</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">Ready when you are.</h2>
              </div>
              <div className="space-y-3 p-6 text-sm">
                <CartTotalRow label="Subtotal" value={formatMoney(cart?.subtotal, currencyCode)} />
                <CartTotalRow label="Shipping" value={formatMoney(cart?.shipping_total, currencyCode)} />
                <CartTotalRow label="Taxes" value={formatMoney(cart?.tax_total, currencyCode)} />
                <CartTotalRow label="Total" strong value={formatMoney(cart?.total, currencyCode)} />
                <p className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                  Final shipping options and taxes are confirmed at checkout.
                </p>
              <ButtonLink
                className={isMutating ? "mt-6 w-full pointer-events-none opacity-60" : "mt-6 w-full"}
                href="/checkout"
              >
                Checkout securely
                <Icon className="size-4" name="lock" />
              </ButtonLink>
              </div>
              <div className="grid grid-cols-2 border-t border-border text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <div className="flex items-center gap-2 border-r border-border p-4"><Icon className="size-4 text-primary" name="package" /> Discreet pack</div>
                <div className="flex items-center gap-2 p-4"><Icon className="size-4 text-primary" name="shield-check" /> Adult only</div>
              </div>
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
    <div className={strong ? "mt-4 flex items-end justify-between border-t border-border pt-5 text-lg" : "flex items-center justify-between"}>
      <span className={strong ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={strong ? "font-display text-2xl font-semibold tabular-nums" : "tabular-nums"}>{value}</span>
    </div>
  );
}
