"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-title";

export function NewsletterSection() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section>
      <Container className="py-24 md:py-28">
        <div className="border-y border-border py-12 md:grid md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-12">
          <div>
            <Eyebrow className="text-primary">Newsletter</Eyebrow>
            <h3 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-5xl">
              Minimal updates, useful details.
            </h3>
            <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
              Product drops, maintenance notes, and service updates for adults of legal age.
            </p>
          </div>
          <form className="mt-8 flex flex-col gap-3 md:mt-0 sm:flex-row" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              className="h-12 min-w-0 flex-1 rounded-[var(--radius)] border border-border bg-surface-elevated px-4 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              id="newsletter-email"
              placeholder="Email address"
              required
              type="email"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
