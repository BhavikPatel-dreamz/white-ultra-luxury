"use client";

import { useRef } from "react";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useDialogAccessibility } from "@/hooks/use-dialog-accessibility";
import { useCart } from "@/components/cart/cart-provider";
import { ButtonLink } from "@/components/ui/button";
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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useDialogAccessibility<HTMLElement>(open, onClose, closeButtonRef);

  useBodyScrollLock(open);

  if (!open) {
    return null;
  }

  return (
    <>
      <button
        aria-label="Close cart"
        className="fixed inset-0 z-50 animate-[fade-in_200ms_ease-out_both] bg-black/70 backdrop-blur-md"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label="Shopping cart"
        aria-modal="true"
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full animate-[drawer-in_420ms_cubic-bezier(.22,1,.36,1)_both] flex-col border-l border-border bg-background shadow-[-32px_0_90px_rgba(0,0,0,.4)] sm:w-[500px]"
        ref={drawerRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex min-h-20 items-center justify-between border-b border-border px-5 sm:px-7">
          <div>
            <Eyebrow className="text-primary">Your edit</Eyebrow>
            <div className="mt-1 text-sm text-muted-foreground">
              {isLoading ? "Loading your bag..." : `${itemCount} ${itemCount === 1 ? "piece" : "pieces"}`}
            </div>
          </div>
          <button
            aria-label="Close cart"
            className="grid size-11 place-items-center border border-border transition-colors hover:border-primary hover:bg-secondary"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <Icon className="size-5" name="x" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="size-10 animate-pulse border border-primary bg-primary/10" />
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">Loading your bag</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="grid size-20 place-items-center border border-border bg-surface text-primary">
              <Icon className="size-8" name="shopping-bag" />
            </div>
            <div>
              <h3 className="mt-7 font-display text-3xl font-semibold tracking-[-0.04em]">
                Nothing in the rotation.
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                Build your next session from fresh hardware, flavor, and ritual essentials.
              </p>
            </div>
            <ButtonLink className="mt-7" href="/products" onClick={onClose}>
              Explore the shop
            </ButtonLink>
            {error ? <p className="max-w-xs text-xs text-primary">{error}</p> : null}
          </div>
        ) : (
          <>
            <div className="border-b border-border bg-primary px-5 py-3 text-center text-[0.68rem] font-bold uppercase tracking-[0.18em] text-primary-foreground sm:px-7">
              Discreet delivery · Adult signature may be required
            </div>
            <div className="flex-1 overflow-y-auto px-5 sm:px-7">
              {items.map((item) => {
                const thumbnail =
                  item.thumbnail ?? item.product?.thumbnail ?? "/ember-halo/category-vape-kits.png";
                const title = item.product_title ?? item.title;
                const variantTitle = item.variant_title ?? item.variant?.title;

                return (
                  <div className="grid grid-cols-[92px_1fr] gap-4 border-b border-border py-6" key={item.id}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={title}
                        className="size-full object-cover"
                        src={thumbnail}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-border pb-3">
                        <div>
                          <h3 className="line-clamp-2 text-sm font-semibold leading-5">{title}</h3>
                          {variantTitle ? (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {variantTitle}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-right text-sm font-semibold tabular-nums">
                          {formatMoney((item.unit_price ?? 0) * item.quantity, currencyCode)}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
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
                          <span className="w-7 text-center text-xs font-semibold tabular-nums">
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
                        <button
                          className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
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

            <div className="border-t border-border bg-surface px-5 py-6 sm:px-7">
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
                className={isMutating ? "mt-6 w-full pointer-events-none opacity-60" : "mt-6 w-full"}
                href="/checkout"
                onClick={onClose}
              >
                Secure checkout
                <Icon className="size-4" name="arrow-right" />
              </ButtonLink>
              <ButtonLink
                className="mt-3 w-full"
                href="/cart"
                onClick={onClose}
                variant="secondary"
              >
                View full bag
              </ButtonLink>
              <p className="mt-4 text-center text-[0.68rem] leading-5 text-muted-foreground">
                By ordering, you confirm you are of legal smoking age in your jurisdiction.
              </p>
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
