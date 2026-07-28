"use client";

import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useCart } from "@/components/cart/cart-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";
import { formatMoney } from "@/lib/format";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ onClose, open }: CartDrawerProps) {
  const { cart, error, isLoading, isMutating, itemCount, removeLineItem, updateLineItem } =
    useCart();
  const currencyCode = cart?.currency_code ?? "usd";
  const items = cart?.items ?? [];

  useBodyScrollLock(open);

  if (!open) {
    return null;
  }

  return (
    <>
      <button
        aria-label="Close cart"
        className="fixed inset-0 z-50 animate-[fade-in_200ms_ease-out_both] bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label="Shopping cart"
        aria-modal="true"
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full animate-[drawer-in_420ms_cubic-bezier(.22,1,.36,1)_both] flex-col border-l border-border bg-surface-elevated shadow-[var(--shadow-soft)] sm:w-[440px]"
        role="dialog"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div>
            <Eyebrow>Your cart</Eyebrow>
            <div className="text-sm text-muted-foreground">
              {isLoading ? "Loading..." : `${itemCount} items`}
            </div>
          </div>
          <Button aria-label="Close cart" onClick={onClose} type="button" variant="ghost">
            <Icon className="size-4" name="x" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <Icon className="size-8 text-muted-foreground" name="shopping-bag" />
            <div>
              <h3 className="font-display text-lg">Your cart is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a device or accessory to begin.
              </p>
            </div>
            <ButtonLink className="mt-2" href="/collections" onClick={onClose}>
              Shop collections
            </ButtonLink>
            {error ? <p className="max-w-xs text-xs text-primary">{error}</p> : null}
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {items.map((item) => {
                const thumbnail =
                  item.thumbnail ?? item.product?.thumbnail ?? "/assets/product-accessories-BrKIPgD4.jpg";
                const title = item.product_title ?? item.title;
                const variantTitle = item.variant_title ?? item.variant?.title;

                return (
                  <div className="grid grid-cols-[80px_1fr] gap-4 border-b border-border pb-5 last:border-b-0" key={item.id}>
                    <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={title}
                        className="size-full object-cover"
                        src={thumbnail}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="grid grid-cols-[1fr_auto] gap-3">
                        <div>
                          <h3 className="truncate text-sm font-medium">{title}</h3>
                          {variantTitle ? (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {variantTitle}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-right text-sm tabular-nums">
                          {formatMoney(item.unit_price, currencyCode)}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex h-9 items-center rounded-[var(--radius)] border border-border">
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
                        <button
                          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                          disabled={isMutating}
                          onClick={() => removeLineItem(item.id)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {error ? <p className="text-xs text-primary">{error}</p> : null}
            </div>

            <div className="border-t border-border bg-surface p-6">
              <div className="space-y-2 text-sm">
                <CartTotalRow
                  label="Subtotal"
                  value={formatMoney(cart?.subtotal, currencyCode)}
                />
                <CartTotalRow
                  label="Shipping"
                  value={formatMoney(cart?.shipping_total, currencyCode)}
                />
                <CartTotalRow label="Taxes" value={formatMoney(cart?.tax_total, currencyCode)} />
                <CartTotalRow
                  label="Total"
                  strong
                  value={formatMoney(cart?.total, currencyCode)}
                />
              </div>
              <ButtonLink
                className={isMutating ? "mt-5 w-full pointer-events-none opacity-60" : "mt-5 w-full"}
                href="/checkout"
                onClick={onClose}
              >
                Checkout
              </ButtonLink>
              <ButtonLink
                className="mt-3 w-full"
                href="/products"
                onClick={onClose}
                variant="secondary"
              >
                Continue shopping
              </ButtonLink>
            </div>
          </>
        )}
      </aside>
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
    <div
      className={strong ? "flex items-center justify-between text-base" : "flex items-center justify-between"}
    >
      <span className={strong ? "font-medium" : "text-muted-foreground"}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
