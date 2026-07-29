import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { InputHTMLAttributes } from "react";
import { SiteShell } from "@/components/layout/site-shell";
import { InfoPage } from "@/components/sections/info-page";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Contact — Ember & Halo",
  description: "Talk to Ember & Halo about an order, product, or your next vape and hookah setup.",
};

const fieldClasses =
  "mt-2 h-13 w-full border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";

async function sendDemoInquiry(formData: FormData) {
  "use server";

  const required = ["name", "email", "topic", "message"];
  const isComplete = required.every((field) => {
    const value = formData.get(field);
    return typeof value === "string" && value.trim().length > 0;
  });

  redirect(isComplete ? "/contact?sent=1" : "/contact?sent=0");
}

type ContactRouteProps = {
  searchParams: Promise<{ product?: string; sent?: string; topic?: string }>;
};

export default async function ContactRoute({ searchParams }: ContactRouteProps) {
  const { product, sent, topic } = await searchParams;
  const selectedTopic = topic === "review" ? "review" : "";

  return (
    <SiteShell>
      <InfoPage
        description="Product guidance, order support, and setup advice from people who know the details. We typically reply within one business day."
        eyebrow="Talk to the studio"
        title="Good questions deserve human answers."
      >
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            {sent === "1" ? (
              <div className="mb-7 flex items-start gap-3 border border-primary/35 bg-primary/5 p-4 text-sm" role="status">
                <Icon className="mt-0.5 size-5 text-primary" name="check" />
                <div>
                  <p className="font-semibold">Your demo inquiry is ready.</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">This storefront demonstrates the submission flow; connect your support service to deliver messages in production.</p>
                </div>
              </div>
            ) : null}
            {sent === "0" ? (
              <p className="mb-7 border border-[var(--coral)] p-4 text-sm text-[var(--coral)]" role="alert">
                Please complete each required field so we know how to help.
              </p>
            ) : null}

            <div className="mb-8">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary">Send a note / 01</span>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">What can we help with?</h2>
            </div>
            <form action={sendDemoInquiry} className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <ContactField autoComplete="name" label="Your name" name="name" placeholder="Alex Morgan" />
                <ContactField autoComplete="email" label="Email address" name="email" placeholder="alex@example.com" type="email" />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  What’s this about?
                  <select className={fieldClasses} defaultValue={selectedTopic} name="topic" required>
                    <option disabled value="">Choose a topic</option>
                    <option value="review">Product review</option>
                    <option value="order">Order support</option>
                    <option value="recommendation">Product recommendation</option>
                    <option value="compatibility">Pod, coil, or parts compatibility</option>
                    <option value="shipping">Shipping or returns</option>
                    <option value="wholesale">Wholesale and partnerships</option>
                    <option value="other">Something else</option>
                  </select>
                </label>
                <ContactField label="Order number (optional)" name="orderNumber" placeholder="E&H-2048" required={false} />
              </div>
              <label className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Tell us more
                <textarea
                  className="mt-2 min-h-40 w-full resize-y border border-input bg-background p-4 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                  defaultValue={product ? `I’d like to share a review of ${product}.` : undefined}
                  name="message"
                  placeholder="Include the product name, device model, or any order details that will help us answer faster."
                  required
                />
              </label>
              <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-xs leading-5 text-muted-foreground">Never send payment card details. For age-restricted orders, we may ask for verification through a secure channel.</p>
                <Button className="shrink-0" type="submit">Send inquiry <Icon className="size-4" name="arrow-right" /></Button>
              </div>
            </form>
          </div>

          <aside className="space-y-px bg-border">
            {[
              { icon: "mail" as const, label: "Email", value: "care@emberandhalo.com", note: "Replies within one business day" },
              { icon: "package" as const, label: "Order desk", value: "Mon–Fri / 9–6 ET", note: "Have your order number ready" },
              { icon: "map-pin" as const, label: "Studio", value: "Brooklyn, New York", note: "Online store · no walk-ins" },
            ].map((item) => (
              <div className="bg-surface p-5" key={item.label}>
                <Icon className="size-5 text-primary" name={item.icon} />
                <div className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">{item.label}</div>
                <div className="mt-1 break-words text-sm font-semibold">{item.value}</div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </aside>
        </div>
      </InfoPage>
    </SiteShell>
  );
}

function ContactField({
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
    <label className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {label}
      <input className={fieldClasses} name={name} required={required} {...props} />
    </label>
  );
}
