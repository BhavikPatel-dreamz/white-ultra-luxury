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
      <section className="border-b border-border bg-background">
        <Container className="pb-10 pt-16 md:pb-12 md:pt-20">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>
        </Container>
      </section>
      <Container className="py-12 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
          <div className="rounded-[var(--radius)] border border-border bg-surface-elevated p-6 md:p-8">
            {children}
          </div>
          <aside className="rounded-[var(--radius)] border border-border bg-surface p-6">
            <Eyebrow className="text-primary">Quick links</Eyebrow>
            <div className="mt-5 divide-y divide-border border-y border-border">
              {[
                ["Shop products", "/products"],
                ["Wishlist", "/wishlist"],
                ["Checkout", "/checkout"],
                ["FAQ", "/faq"],
              ].map(([label, href]) => (
                <Link
                  className="flex items-center justify-between py-4 text-sm font-semibold transition-colors hover:text-primary"
                  href={href}
                  key={href}
                >
                  {label}
                  <Icon className="size-4" name="arrow-up-right" />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
