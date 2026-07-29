import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";

export const metadata: Metadata = {
  title: "Order confirmed — Ember & Halo",
  description: "Your Ember & Halo order has been confirmed.",
};

type OrderSuccessRouteProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function OrderSuccessRoute({ searchParams }: OrderSuccessRouteProps) {
  const { order } = await searchParams;
  const orderLabel = order?.trim().slice(0, 32) || "E&H-DEMO";

  return (
    <SiteShell>
      <Container className="py-12 md:py-20">
        <div className="mx-auto max-w-5xl overflow-hidden border border-border bg-surface-elevated">
          <div className="relative overflow-hidden bg-primary px-6 py-14 text-primary-foreground md:px-12 md:py-20">
            <div className="absolute -right-8 -top-14 font-mono text-[11rem] font-bold leading-none text-black/10 md:text-[16rem]">OK</div>
            <div className="relative max-w-3xl">
              <div className="grid size-14 place-items-center bg-primary-foreground text-primary"><Icon className="size-6" name="check" /></div>
              <Eyebrow className="mt-7 text-primary-foreground/65">Order confirmed / {orderLabel}</Eyebrow>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.91] tracking-[-0.06em] md:text-7xl">The glow is<br />on its way.</h1>
            </div>
          </div>
          <div className="grid lg:grid-cols-[1fr_21rem]">
            <div className="p-6 md:p-10">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.04em]">What happens next</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">We’ll prepare your items in discreet packaging and send tracking to the email used at checkout once the carrier accepts the parcel.</p>
              <div className="mt-8 grid gap-px bg-border sm:grid-cols-3">
                {[
                  ["01", "Confirmed", "Your order joined the queue."],
                  ["02", "Packed", "Handled and packed discreetly."],
                  ["03", "Tracked", "Updates arrive by email."],
                ].map(([number, title, body]) => (
                  <div className="bg-surface p-5" key={title}><span className="font-mono text-xs text-primary">{number}</span><h3 className="mt-5 text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/products">Continue exploring <Icon className="size-4" name="arrow-right" /></ButtonLink>
                <ButtonLink href="/contact" variant="secondary">Get order help</ButtonLink>
              </div>
            </div>
            <aside className="border-t border-border bg-surface p-6 lg:border-l lg:border-t-0 md:p-8">
              <Eyebrow className="text-primary">Keep close</Eyebrow>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Reference</span><span className="font-mono">{orderLabel}</span></div>
                <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Packaging</span><span>Discreet</span></div>
                <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">Tracking</span><span>By email</span></div>
              </div>
              <div className="mt-6 flex items-start gap-3 border border-primary/25 bg-primary/5 p-4 text-xs leading-5 text-muted-foreground"><Icon className="mt-0.5 size-4 shrink-0 text-primary" name="shield-check" /><span>Adult signature or age verification may be required at delivery.</span></div>
            </aside>
          </div>
        </div>
      </Container>
    </SiteShell>
  );
}
