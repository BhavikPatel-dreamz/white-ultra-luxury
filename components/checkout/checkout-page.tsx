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
  "h-13 w-full border border-input bg-background px-4 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";

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
  const regionCountryOptions =
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
  const countryOptions =
    regionCountryOptions.length > 0
      ? regionCountryOptions
      : [{ label: "United States", value: "us" }];

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
      if (cart.id === "demo-cart") {
        const reference = Math.floor(100000 + Math.random() * 900000);
        const demoOrder = {
          currency_code: cart.currency_code ?? "usd",
          display_id: reference,
          email: getRequiredValue(formData, "email"),
          id: `EH-DEMO-${reference}`,
          items: cart.items ?? [],
          shipping_total: cart.shipping_total ?? 0,
          subtotal: cart.subtotal ?? 0,
          tax_total: cart.tax_total ?? 0,
          total: cart.total ?? 0,
        } as unknown as PlacedOrder;

        setOrder(demoOrder);
        setPaymentProviderId("ember-halo-demo");
        await clearCart();
        return;
      }

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
        setFormError(data.message ?? "Unable to place your order. Please review your details and try again.");
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
    <Container className="py-10 md:py-16">
      <div className="mb-10 grid gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Eyebrow className="text-primary">Secure checkout</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-7xl">
            Finish the ritual.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Discreetly packed and dispatched with tracking. Your order is limited to adults of legal smoking age.
          </p>
        </div>
        <ol className="grid grid-cols-3 border border-border text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {["Contact", "Delivery", "Payment"].map((step, index) => (
            <li className="border-r border-border px-4 py-3 last:border-r-0" key={step}>
              <span className="mr-1.5 text-primary">0{index + 1}</span>{step}
            </li>
          ))}
        </ol>
      </div>

      {isLoading ? (
        <div className="border border-border bg-surface-elevated p-12 text-center text-sm text-muted-foreground">
          Preparing secure checkout...
        </div>
      ) : items.length === 0 || !cart ? (
        <div className="flex min-h-[30rem] flex-col items-center justify-center border border-border bg-surface-elevated px-6 py-24 text-center">
          <div className="grid size-16 place-items-center border border-border bg-surface text-primary">
            <Icon className="size-7" name="shopping-bag" />
          </div>
          <h2 className="mt-7 font-display text-3xl font-semibold tracking-[-0.04em]">There’s nothing to check out—yet.</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Add a device, flavor, or hookah essential before returning here.
          </p>
          <ButtonLink className="mt-7" href="/products">
            Explore the shop
            <Icon className="size-4" name="arrow-right" />
          </ButtonLink>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start">
          <form className="space-y-5" onSubmit={submitCheckout}>
            <CheckoutPanel eyebrow="01 / Contact" title="Where should we send updates?">
              <div className="grid gap-4 md:grid-cols-2">
                <CheckoutField autoComplete="email" label="Email" name="email" type="email" />
                <CheckoutField autoComplete="tel" label="Phone" name="phone" type="tel" />
                <CheckoutField autoComplete="given-name" label="First name" name="firstName" />
                <CheckoutField autoComplete="family-name" label="Last name" name="lastName" />
              </div>
            </CheckoutPanel>

            <CheckoutPanel eyebrow="02 / Delivery" title="Where is it going?">
              <div className="grid gap-4">
                <CheckoutField
                  autoComplete="address-line1"
                  label="Street address"
                  name="address1"
                />
                <CheckoutField
                  autoComplete="address-line2"
                  label="Apartment, suite, etc."
                  name="address2"
                  required={false}
                />
                <div className="grid gap-4 md:grid-cols-3">
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
                <div className="flex items-start gap-3 border border-border bg-surface p-4">
                  <Icon className="mt-0.5 size-4 text-primary" name="package" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em]">Discreet tracked delivery</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">Plain outer packaging. Available services and exact rates are calculated from your address.</p>
                  </div>
                </div>
              </div>
            </CheckoutPanel>

            <CheckoutPanel eyebrow="03 / Payment" title="Complete your order.">
              <div className="flex items-start justify-between gap-4 border border-primary/25 bg-primary/5 p-4 text-sm">
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 text-primary" name="lock" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Demo payment</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">Use any card-like test values. No card will be charged.</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[0.62rem] text-muted-foreground">SSL / 256</span>
              </div>
              <div className="mt-4 grid gap-4">
                <CheckoutField autoComplete="cc-name" label="Name on card" name="cardName" />
                <CheckoutField
                  autoComplete="cc-number"
                  inputMode="numeric"
                  label="Card number"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                />
                <div className="grid gap-4 md:grid-cols-2">
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
                <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
                  <input className="mt-0.5 size-4 accent-[var(--primary)]" name="ageConfirm" required type="checkbox" />
                  <span>I confirm that I am of legal smoking age in my jurisdiction and agree to Ember &amp; Halo’s terms and age policy.</span>
                </label>
              </div>
            </CheckoutPanel>

            {formError || cartError ? (
              <p aria-live="polite" className="border border-[var(--coral)] bg-surface p-4 text-sm text-[var(--coral)]">
                {formError ?? cartError}
              </p>
            ) : null}

            <Button className="h-14 w-full" disabled={isMutating || isSubmitting} type="submit">
              {isSubmitting ? "Securing your order..." : `Place order · ${formatMoney(cart.total, currencyCode)}`}
              {!isSubmitting ? <Icon className="size-4" name="lock" /> : null}
            </Button>
            <p className="text-center text-[0.68rem] leading-5 text-muted-foreground">By placing an order, you accept our Terms, Privacy Policy, and Return Policy.</p>
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
    <section className="border border-border bg-surface-elevated">
      <div className="grid gap-2 border-b border-border p-5 md:grid-cols-[8rem_1fr] md:items-center md:p-6">
        <Eyebrow className="text-primary">{eyebrow}</Eyebrow>
        <h2 className="font-display text-2xl font-semibold tracking-[-0.035em]">{title}</h2>
      </div>
      <div className="p-5 md:p-6">{children}</div>
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
    <label className="grid gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
    <label className="grid gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
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
    <aside className="sticky top-24 border border-border bg-surface-elevated">
      <div className="flex items-center justify-between border-b border-border p-5 md:p-6">
        <div>
          <Eyebrow className="text-primary">Your order</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.035em]">The final edit.</h2>
        </div>
        <span className="grid size-10 place-items-center bg-primary font-mono text-sm font-bold text-primary-foreground">
          {items.reduce((total, item) => total + item.quantity, 0)}
        </span>
      </div>
      <div className="divide-y divide-border px-5 md:px-6">
        {items.map((item) => {
          const thumbnail =
            item.thumbnail ?? item.product?.thumbnail ?? "/ember-halo/category-vape-kits.png";
          const title = item.product_title ?? item.title ?? "Untitled product";
          const variantTitle = item.variant_title ?? item.variant?.title;

          return (
            <div className="grid grid-cols-[76px_1fr] gap-4 py-5" key={item.id}>
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
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
                    <h3 className="line-clamp-2 text-sm font-semibold leading-5">{title}</h3>
                    {variantTitle ? (
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {variantTitle}
                      </p>
                    ) : null}
                    <p className="mt-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">
                      Quantity / {String(item.quantity).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="text-right text-sm font-semibold tabular-nums">
                    {formatMoney((item.unit_price ?? 0) * item.quantity, currencyCode)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 border-t border-border p-5 text-sm md:p-6">
        <SummaryRow label="Subtotal" value={formatMoney(cart.subtotal, currencyCode)} />
        <SummaryRow label="Shipping" value={formatMoney(cart.shipping_total, currencyCode)} />
        <SummaryRow label="Taxes" value={formatMoney(cart.tax_total, currencyCode)} />
        <SummaryRow className="mt-4 border-t border-border pt-5" label="Total" strong value={formatMoney(cart.total, currencyCode)} />
        <div className="mt-5 flex items-start gap-3 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
          <Icon className="mt-0.5 size-4 shrink-0 text-primary" name="shield-check" />
          <span>Protected checkout · Discreet packaging · Age verification may apply on delivery.</span>
        </div>
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
    <Container className="py-12 md:py-20">
      <div className="mx-auto max-w-5xl overflow-hidden border border-border bg-surface-elevated">
        <div className="relative overflow-hidden border-b border-border bg-primary px-6 py-14 text-primary-foreground md:px-12 md:py-20">
          <div className="absolute -right-8 -top-12 font-mono text-[10rem] font-bold leading-none text-black/10 md:text-[15rem]">OK</div>
          <div className="relative max-w-3xl">
            <div className="grid size-14 place-items-center border border-primary-foreground/30 bg-primary-foreground text-primary">
              <Icon className="size-6" name="check" />
            </div>
            <Eyebrow className="mt-7 text-primary-foreground/70">Order confirmed / {orderLabel}</Eyebrow>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] md:text-7xl">
              Your next ritual<br />is in motion.
            </h1>
          </div>
        </div>
        <div className="grid lg:grid-cols-[1fr_22rem]">
          <div className="p-6 md:p-10">
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              Thanks for shopping Ember &amp; Halo. A confirmation has been prepared for <span className="font-semibold text-foreground">{order.email}</span>. We’ll send tracking as soon as your discreet package leaves our studio.
            </p>
            <div className="mt-8 grid gap-px bg-border sm:grid-cols-3">
              {[
                ["01", "Confirmed", "Your order is in our queue."],
                ["02", "Packed", "Prepared in discreet packaging."],
                ["03", "Tracked", "Delivery updates by email."],
              ].map(([number, title, body], index) => (
                <div className="bg-surface p-5" key={title}>
                  <div className={index === 0 ? "font-mono text-xs text-primary" : "font-mono text-xs text-muted-foreground"}>{number}</div>
                  <h2 className="mt-5 text-sm font-semibold">{title}</h2>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/products">Continue exploring <Icon className="size-4" name="arrow-right" /></ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Get order help
              </ButtonLink>
            </div>
          </div>
          <aside className="border-t border-border bg-surface p-6 lg:border-l lg:border-t-0 md:p-8">
            <Eyebrow className="text-primary">Order receipt</Eyebrow>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Order</span>
                <span className="font-mono">{orderLabel}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Items</span>
                <span>{itemCount}</span>
              </div>
              <SummaryRow
                className="border-t border-border pt-4"
                label="Total"
                strong
                value={formatMoney(order.total, order.currency_code)}
              />
              {paymentProviderId ? (
                <div className="flex items-center gap-2 border border-primary/25 bg-primary/5 p-3 text-xs text-primary">
                  <Icon className="size-4" name="check" /> Demo payment authorized
                </div>
              ) : null}
            </div>
            <p className="mt-6 border-t border-border pt-5 text-[0.68rem] leading-5 text-muted-foreground">
              No real card was charged for this demonstration order. Adults of legal smoking age only.
            </p>
          </aside>
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
        strong ? "flex items-end justify-between text-base" : "flex items-center justify-between",
        className,
      )}
    >
      <span className={strong ? "font-medium" : "text-muted-foreground"}>{label}</span>
      <span className={strong ? "font-display text-xl font-semibold tabular-nums" : "tabular-nums"}>{value}</span>
    </div>
  );
}
