import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function InfoPage({ children, description, eyebrow, title }: InfoPageProps) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div className="absolute -right-28 -top-40 size-[28rem] rounded-full bg-primary/10 blur-3xl" />
        <Container className="relative py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div>
              <Eyebrow className="text-primary">{eyebrow}</Eyebrow>
              <h1 className="mt-5 max-w-5xl font-display text-5xl font-semibold leading-[0.94] tracking-[-0.055em] md:text-7xl">
                {title}
              </h1>
            </div>
            <div className="border-l border-primary pl-5">
              <span className="block font-mono text-[0.65rem] uppercase tracking-[0.24em] text-primary">
                Ember &amp; Halo / Customer care
              </span>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          </div>
        </Container>
      </section>
      <Container className="py-12 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
          <div className="border border-border bg-surface-elevated p-6 shadow-[var(--shadow-soft)] md:p-10">
            {children}
          </div>
          <aside className="border border-border bg-surface p-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between gap-4">
              <Eyebrow className="text-primary">Explore</Eyebrow>
              <span className="font-mono text-[0.65rem] text-muted-foreground">E&amp;H / 26</span>
            </div>
            <div className="mt-5 divide-y divide-border border-y border-border">
              {[
                ["Shop the latest drop", "/products"],
                ["Our story", "/about"],
                ["Help & FAQ", "/faq"],
                ["Contact the studio", "/contact"],
              ].map(([label, href]) => (
                <Link
                  className="group flex items-center justify-between gap-4 py-4 text-sm font-semibold transition-colors hover:text-primary"
                  href={href}
                  key={href}
                >
                  {label}
                  <Icon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" name="arrow-up-right" />
                </Link>
              ))}
            </div>
            <div className="mt-6 border border-primary/25 bg-primary/5 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <Icon className="size-4" name="shield-check" />
                Adults only
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                You must be of legal smoking age in your jurisdiction to browse or buy.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
