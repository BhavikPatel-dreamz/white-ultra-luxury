import type { Metadata } from "next";
import Image from "next/image";
import { SiteShell } from "@/components/layout/site-shell";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";

export const metadata: Metadata = {
  title: "Account — Ember & Halo",
  description: "Access Ember & Halo orders, saved details, and personal recommendations.",
};

type AccountRouteProps = {
  searchParams: Promise<{ preview?: string }>;
};

export default async function AccountRoute({ searchParams }: AccountRouteProps) {
  const { preview } = await searchParams;

  return (
    <SiteShell>
      {preview === "1" ? <AccountPreview /> : <GuestAccount />}
    </SiteShell>
  );
}

function GuestAccount() {
  return (
    <>
      <section className="overflow-hidden border-b border-border bg-surface">
        <Container className="grid min-h-[35rem] gap-0 lg:grid-cols-[1fr_0.85fr]">
          <div className="flex flex-col justify-center py-16 pr-0 lg:pr-16">
            <Eyebrow className="text-primary">Private shelf / Account</Eyebrow>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] md:text-7xl">
              Your ritual,<br /><span className="font-accent font-normal italic text-primary">remembered.</span>
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground">
              Keep order details, delivery addresses, and future recommendations together—without losing the personal edit.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/auth?mode=login">Sign in <Icon className="size-4" name="arrow-right" /></ButtonLink>
              <ButtonLink href="/auth?mode=register" variant="secondary">Create account</ButtonLink>
            </div>
          </div>
          <div className="relative min-h-80 overflow-hidden border-x border-border lg:border-r-0">
            <Image alt="Ember & Halo premium vape collection" className="object-cover" fill preload sizes="(min-width: 1024px) 42vw, 100vw" src="/ember-halo/collection-pocket-edit.png" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary">Members / 01</span>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/75">Faster checkout, order history, and a home for every considered favorite.</p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-12 md:py-18">
        <div className="grid gap-px bg-border md:grid-cols-3">
          {[
            { icon: "package" as const, number: "01", title: "Track every order", body: "Find delivery updates, receipts, and support details in one place." },
            { icon: "zap" as const, number: "02", title: "Checkout with less friction", body: "Keep preferred delivery details ready for the next drop." },
            { icon: "heart" as const, number: "03", title: "Shape your edit", body: "Save the devices, flavors, and accessories worth returning to." },
          ].map((item) => (
            <div className="bg-surface-elevated p-7 md:p-8" key={item.title}>
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-primary" name={item.icon} />
                <span className="font-mono text-xs text-muted-foreground">{item.number}</span>
              </div>
              <h2 className="mt-10 font-display text-2xl font-semibold tracking-[-0.035em]">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">Account authentication is presented as a storefront preview and can be connected to the merchant’s customer service before launch.</p>
      </Container>
    </>
  );
}

function AccountPreview() {
  return (
    <Container className="py-12 md:py-16">
      <div className="flex flex-col gap-6 border-b border-border pb-9 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow className="text-primary">Account preview / E&amp;H member</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Welcome back, Alex.</h1>
          <p className="mt-3 text-sm text-muted-foreground">A client-demo view of the connected customer dashboard.</p>
        </div>
        <ButtonLink href="/account" variant="secondary">Exit preview</ButtonLink>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <main className="space-y-6">
          <section className="border border-border bg-surface-elevated">
            <div className="flex items-center justify-between border-b border-border p-5 md:p-6">
              <div><Eyebrow className="text-primary">Latest order</Eyebrow><h2 className="mt-2 font-display text-2xl font-semibold">E&amp;H-2048</h2></div>
              <span className="border border-primary/30 bg-primary/5 px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-primary">Delivered</span>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-[96px_1fr_auto] md:p-6">
              <div className="relative aspect-square overflow-hidden bg-surface"><Image alt="Arc Mini pod kit" className="object-cover" fill sizes="96px" src="/ember-halo/category-pod-systems.png" /></div>
              <div><h3 className="font-semibold">Arc Mini Pod Kit</h3><p className="mt-1 text-xs text-muted-foreground">Obsidian / 1 item</p><p className="mt-4 text-xs text-muted-foreground">Delivered July 24, 2026</p></div>
              <div className="text-sm font-semibold">$54.00</div>
            </div>
          </section>
          <section className="border border-border bg-surface-elevated p-6">
            <Eyebrow className="text-primary">Recommended next</Eyebrow>
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface sm:w-52"><Image alt="Curated e-liquid bottles" className="object-cover" fill sizes="208px" src="/ember-halo/category-e-liquids.png" /></div>
              <div><h2 className="font-display text-2xl font-semibold">Explore the live catalog</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Discover the latest products available for this storefront, curated directly from the current Medusa catalog.</p><ButtonLink className="mt-5" href="/products" variant="secondary">Browse products</ButtonLink></div>
            </div>
          </section>
        </main>
        <aside className="space-y-px bg-border">
          {["Profile details", "Addresses", "Order history", "Saved products", "Support"].map((label, index) => (
            <div className="flex items-center justify-between bg-surface px-5 py-4 text-sm font-semibold" key={label}><span>{label}</span><span className="font-mono text-[0.62rem] text-muted-foreground">0{index + 1}</span></div>
          ))}
        </aside>
      </div>
    </Container>
  );
}
