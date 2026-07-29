import type { Metadata } from "next";
import Image from "next/image";
import { SiteShell } from "@/components/layout/site-shell";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";

export const metadata: Metadata = {
  title: "Our Story — Ember & Halo",
  description: "Meet Ember & Halo, an independent edit of modern vape hardware, flavor, and hookah ritual essentials.",
};

export default function AboutRoute() {
  return (
    <SiteShell>
      <section className="relative min-h-[44rem] overflow-hidden border-b border-border bg-black text-white">
        <Image alt="A considered evening hookah ritual" className="object-cover opacity-65" fill preload sizes="100vw" src="/ember-halo/collection-hookah-ritual.png" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
        <Container className="relative flex min-h-[44rem] items-end py-14 md:py-20">
          <div className="max-w-4xl">
            <Eyebrow className="text-primary">Independent since 2021 / Brooklyn</Eyebrow>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.87] tracking-[-0.07em] sm:text-7xl md:text-[7rem]">
              Built for the<br /><span className="font-accent font-normal italic text-primary">after hours.</span>
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-white/70 md:text-base">
              Ember &amp; Halo is a tighter, smarter edit of contemporary vape hardware, grown-up flavor, and the objects that make a hookah table feel intentional.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-primary text-primary-foreground">
        <Container className="grid grid-cols-2 gap-px bg-black/15 md:grid-cols-4">
          {[
            ["2021", "Studio founded"],
            ["60+", "Brands tested"],
            ["24h", "Care response goal"],
            ["21+", "Adults only"],
          ].map(([value, label]) => (
            <div className="bg-primary px-4 py-7 text-center md:py-9" key={label}>
              <div className="font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">{value}</div>
              <div className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.17em] opacity-65">{label}</div>
            </div>
          ))}
        </Container>
      </section>

      <section>
        <Container className="py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <Eyebrow className="text-primary">The idea / 01</Eyebrow>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.055em] md:text-5xl">A shop with a point of view.</h2>
            </div>
            <div className="grid gap-6 text-base leading-8 text-muted-foreground md:grid-cols-2">
              <p>Too much of the category feels like a wall of noise: impossible product names, louder graphics, and very little help. We started Ember &amp; Halo to make the experience feel considered—without sanding away the culture that makes it interesting.</p>
              <p>We look for hardware that earns its footprint, flavor with a clear identity, and hookah pieces that work as beautifully as they look. Then we explain the details in plain language, including compatibility, care, and who a product is actually for.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface">
        <Container className="grid lg:grid-cols-2">
          <div className="relative min-h-[34rem] overflow-hidden border-x border-border lg:border-r-0">
            <Image alt="Ember & Halo flavor curation studio" className="object-cover" fill sizes="(min-width: 1024px) 50vw, 100vw" src="/ember-halo/collection-flavor-lab.png" />
            <span className="absolute bottom-5 left-5 bg-black px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white">Flavor lab / Brooklyn</span>
          </div>
          <div className="flex flex-col justify-center border-x border-t border-border p-7 lg:border-t-0 md:p-12">
            <Eyebrow className="text-primary">The filter / 02</Eyebrow>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[0.96] tracking-[-0.05em] md:text-5xl">Nothing gets in just because it’s new.</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">Our product edit is built around four questions: Is it dependable? Is the experience legible? Is there a real reason to choose it? Can we stand behind the guidance? If the answer is vague, it stays off the shelf.</p>
            <div className="mt-8 grid gap-px bg-border sm:grid-cols-2">
              {[
                ["01", "Material and build"],
                ["02", "Flavor clarity"],
                ["03", "Parts availability"],
                ["04", "Responsible labeling"],
              ].map(([number, label]) => (
                <div className="flex items-center gap-3 bg-surface-elevated p-4" key={label}><span className="font-mono text-[0.62rem] text-primary">{number}</span><span className="text-xs font-semibold uppercase tracking-[0.1em]">{label}</span></div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-16 md:py-24">
          <div className="mb-10 max-w-2xl">
            <Eyebrow className="text-primary">How we show up / 03</Eyebrow>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] md:text-5xl">Care is part of the product.</h2>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            {[
              { icon: "search" as const, title: "Clarity over hype", body: "Useful specifications, honest compatibility notes, and recommendations with a reason behind them." },
              { icon: "package" as const, title: "Discreet by design", body: "Plain outer packaging, careful handling, and delivery options built around adult-only products." },
              { icon: "shield-check" as const, title: "Responsible access", body: "No sales to minors, clear nicotine warnings, and a willingness to say when a product is not the right fit." },
            ].map((item, index) => (
              <article className="group bg-surface-elevated p-7 transition-colors hover:bg-secondary md:p-9" key={item.title}>
                <div className="flex items-center justify-between"><Icon className="size-6 text-primary" name={item.icon} /><span className="font-mono text-xs text-muted-foreground">0{index + 1}</span></div>
                <h3 className="mt-14 font-display text-2xl font-semibold tracking-[-0.035em]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface">
        <Container className="grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-center md:py-20">
          <div>
            <Eyebrow className="text-primary">Find your next ritual</Eyebrow>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.05em] md:text-5xl">The shelf is open.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Explore the edit, or ask us to narrow it down with you.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/products">Shop all products <Icon className="size-4" name="arrow-right" /></ButtonLink>
            <ButtonLink href="/contact" variant="secondary">Talk to the studio</ButtonLink>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
