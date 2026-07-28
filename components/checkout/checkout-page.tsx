"use client";

import type { HttpTypes } from "@medusajs/types";
import Image from "next/image";
import {
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  useState,
} from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";
import { formatMoney } from "@/lib/format";
import { cx } from "@/lib/utils";

const inputClasses =
  "h-12 rounded-[var(--radius)] border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

type CheckoutCart = NonNullable<ReturnType<typeof useCart>["cart"]>;
type PlacedOrder = HttpTypes.StoreOrder;
type CheckoutResponse = {
  message?: string;
  order?: PlacedOrder;
  paymentProviderId?: string;
};
type CountryOption = {
  label: string;
  value: string;
};

function getRequiredValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function CheckoutPage() {
  const { cart, clearCart, error: cartError, isLoading, isMutating } = useCart();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [paymentProviderId, setPaymentProviderId] = useState<string | null>(null);
  const items = cart?.items ?? [];
  const currencyCode = cart?.currency_code ?? "usd";
  const countryOptions =
    cart?.region?.countries?.flatMap((country) =>
      country.iso_2
        ? [
            {
              label: country.display_name ?? country.name ?? country.iso_2.toUpperCase(),
              value: country.iso_2.toLowerCase(),
            },
          ]
        : [],
    ) ?? [];

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!cart || items.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const requiredFields = [
      "email",
      "firstName",
      "lastName",
      "phone",
      "address1",
      "city",
      "province",
      "postalCode",
      "country",
      "cardName",
      "cardNumber",
      "expiry",
      "cvc",
    ];
    const missingField = requiredFields.some((field) => !getRequiredValue(formData, field));

    if (missingField) {
      setFormError("Please complete all required fields before placing the order.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        body: JSON.stringify({
          address1: getRequiredValue(formData, "address1"),
          address2: getRequiredValue(formData, "address2"),
          cardName: getRequiredValue(formData, "cardName"),
          cardNumber: getRequiredValue(formData, "cardNumber"),
          city: getRequiredValue(formData, "city"),
          countryCode: getRequiredValue(formData, "country"),
          email: getRequiredValue(formData, "email"),
          firstName: getRequiredValue(formData, "firstName"),
          lastName: getRequiredValue(formData, "lastName"),
          phone: getRequiredValue(formData, "phone"),
          postalCode: getRequiredValue(formData, "postalCode"),
          province: getRequiredValue(formData, "province"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.order) {
        setFormError(data.message ?? "Unable to place the Medusa order.");
        return;
      }

      setOrder(data.order);
      setPaymentProviderId(data.paymentProviderId ?? null);
      await clearCart();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to place the order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (order) {
    return <CheckoutConfirmation order={order} paymentProviderId={paymentProviderId} />;
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="mb-10 border-b border-border pb-10">
        <Eyebrow>Checkout</Eyebrow>
        <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">
          Secure demo checkout.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          This uses your Medusa demo payment provider to create a real order in Admin. No real card is charged.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-[var(--radius)] border border-border bg-surface-elevated p-10 text-center text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
          Loading checkout...
        </div>
      ) : items.length === 0 || !cart ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius)] border border-border bg-surface-elevated px-6 py-24 text-center shadow-[var(--shadow-soft)]">
          <Icon className="size-8 text-muted-foreground" name="shopping-bag" />
          <h2 className="mt-5 font-display text-2xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Add a product before starting checkout.
          </p>
          <ButtonLink className="mt-6" href="/products">
            Browse products
          </ButtonLink>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
          <form className="space-y-6" onSubmit={submitCheckout}>
            <CheckoutPanel eyebrow="Step 01" title="Contact">
              <div className="grid gap-3 md:grid-cols-2">
                <CheckoutField autoComplete="email" label="Email" name="email" type="email" />
                <CheckoutField autoComplete="tel" label="Phone" name="phone" type="tel" />
                <CheckoutField autoComplete="given-name" label="First name" name="firstName" />
                <CheckoutField autoComplete="family-name" label="Last name" name="lastName" />
              </div>
            </CheckoutPanel>

            <CheckoutPanel eyebrow="Step 02" title="Shipping">
              <div className="grid gap-3">
                <CheckoutField
                  autoComplete="address-line1"
                  label="Address"
                  name="address1"
                />
                <CheckoutField
                  autoComplete="address-line2"
                  label="Apartment, suite, etc."
                  name="address2"
                  required={false}
                />
                <div className="grid gap-3 md:grid-cols-3">
                  <CheckoutField autoComplete="address-level2" label="City" name="city" />
                  <CheckoutField
                    autoComplete="address-level1"
                    label="State / province"
                    name="province"
                  />
                  <CheckoutField
                    autoComplete="postal-code"
                    label="Postal code"
                    name="postalCode"
                  />
                </div>
                <CheckoutSelect label="Country" name="country" options={countryOptions} />
              </div>
            </CheckoutPanel>

            <CheckoutPanel eyebrow="Step 03" title="Payment">
              <div className="rounded-[var(--radius)] border border-border bg-background p-4 text-sm text-muted-foreground">
                Dummy payment. Use any card-like values; the Medusa manual/system payment provider handles the order.
              </div>
              <div className="mt-3 grid gap-3">
                <CheckoutField autoComplete="cc-name" label="Name on card" name="cardName" />
                <CheckoutField
                  autoComplete="cc-number"
                  inputMode="numeric"
                  label="Card number"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <CheckoutField
                    autoComplete="cc-exp"
                    label="Expiry"
                    name="expiry"
                    placeholder="MM / YY"
                  />
                  <CheckoutField
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    label="CVC"
                    name="cvc"
                    placeholder="123"
                  />
                </div>
              </div>
            </CheckoutPanel>

            {formError || cartError ? (
              <p className="rounded-[var(--radius)] border border-primary/40 bg-primary/10 p-3 text-sm text-primary">
                {formError ?? cartError}
              </p>
            ) : null}

            <Button className="h-12 w-full" disabled={isMutating || isSubmitting} type="submit">
              {isSubmitting ? "Placing Medusa order..." : "Place order"}
            </Button>
          </form>

          <CheckoutSummary cart={cart} currencyCode={currencyCode} />
        </div>
      )}
    </Container>
  );
}

function CheckoutPanel({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="rounded-[var(--radius)] border border-border bg-surface-elevated p-5 shadow-[var(--shadow-soft)] md:p-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-2 font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function CheckoutField({
  label,
  name,
  required = true,
  ...props
}: {
  label: string;
  name: string;
  required?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {label}
      <input
        className={inputClasses}
        name={name}
        required={required}
        {...props}
      />
    </label>
  );
}

function CheckoutSelect({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: CountryOption[];
}) {
  const defaultValue = options[0]?.value ?? "";

  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {label}
      <select className={inputClasses} defaultValue={defaultValue} name={name} required>
        {options.length === 0 ? (
          <option value="">No countries available for this region</option>
        ) : (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
    </label>
  );
}

function CheckoutSummary({
  cart,
  currencyCode,
}: {
  cart: CheckoutCart;
  currencyCode: string;
}) {
  const items = cart.items ?? [];

  return (
    <aside className="sticky top-24 rounded-[var(--radius)] border border-border bg-surface-elevated p-5 shadow-[var(--shadow-soft)] md:p-6">
      <Eyebrow>Order summary</Eyebrow>
      <div className="mt-5 space-y-5">
        {items.map((item) => {
          const thumbnail =
            item.thumbnail ?? item.product?.thumbnail ?? "/assets/product-accessories-BrKIPgD4.jpg";
          const title = item.product_title ?? item.title ?? "Untitled product";
          const variantTitle = item.variant_title ?? item.variant?.title;

          return (
            <div className="grid grid-cols-[72px_1fr] gap-4" key={item.id}>
              <div className="relative aspect-square overflow-hidden rounded-[var(--radius)] bg-surface">
                <Image
                  alt={title}
                  className="object-cover"
                  fill
                  sizes="72px"
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
                    <p className="mt-1 text-xs text-muted-foreground">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <div className="text-right text-sm tabular-nums">
                    {formatMoney((item.unit_price ?? 0) * item.quantity, currencyCode)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
        <SummaryRow label="Subtotal" value={formatMoney(cart.subtotal, currencyCode)} />
        <SummaryRow label="Shipping" value={formatMoney(cart.shipping_total, currencyCode)} />
        <SummaryRow label="Taxes" value={formatMoney(cart.tax_total, currencyCode)} />
        <SummaryRow label="Total" strong value={formatMoney(cart.total, currencyCode)} />
      </div>

      <div className="mt-5 rounded-[var(--radius)] border border-border bg-background p-4 text-xs leading-relaxed text-muted-foreground">
        Checkout will create a real Medusa order using the configured dummy/manual payment provider.
      </div>
    </aside>
  );
}

function CheckoutConfirmation({
  order,
  paymentProviderId,
}: {
  order: PlacedOrder;
  paymentProviderId: string | null;
}) {
  const orderLabel = order.display_id ? `#${order.display_id}` : order.id;
  const itemCount = order.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-3xl rounded-[var(--radius)] border border-border bg-surface-elevated p-6 text-center shadow-[var(--shadow-soft)] md:p-10">
        <div className="mx-auto grid size-12 place-items-center rounded-full border border-primary text-primary">
          <Icon className="size-5" name="check" />
        </div>
        <Eyebrow className="mt-6">Order placed</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
          Medusa order {orderLabel} is ready.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          The order was completed through the Store API and should now appear in your Medusa Admin. No real card was charged.
        </p>

        <div className="mt-8 rounded-[var(--radius)] border border-border bg-background p-4 text-left">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Email</span>
            <span>{order.email}</span>
          </div>
          <SummaryRow
            className="mt-2"
            label="Total"
            strong
            value={formatMoney(order.total, order.currency_code)}
          />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Items</span>
            <span>{itemCount}</span>
          </div>
          {paymentProviderId ? (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payment provider</span>
              <span>{paymentProviderId}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/products">Keep shopping</ButtonLink>
          <ButtonLink href="/wishlist" variant="secondary">
            View wishlist
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}

function SummaryRow({
  className,
  label,
  strong,
  value,
}: {
  className?: string;
  label: string;
  strong?: boolean;
  value: string;
}) {
  return (
    <div
      className={cx(
        strong ? "flex items-center justify-between text-base" : "flex items-center justify-between",
        className,
      )}
    >
      <span className={strong ? "font-medium" : "text-muted-foreground"}>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
