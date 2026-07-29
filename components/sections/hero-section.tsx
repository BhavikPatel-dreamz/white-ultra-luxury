import Image from "next/image";
import { hero } from "@/lib/data";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-title";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[calc(100svh-6.75rem)] overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-0">
        <Image
          alt="Ember & Halo premium hookah and vape collection"
          className="object-cover object-[66%_center] sm:object-center"
          fill
          preload
          sizes="100vw"
          src={hero.image}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(252,250,246,0.97)_0%,rgba(252,250,246,0.92)_36%,rgba(252,250,246,0.3)_68%,rgba(252,250,246,0.08)_100%)]" />
        <div className="hero-grid absolute inset-0 opacity-70" />
      </div>

      <Container className="relative flex min-h-[calc(100svh-6.75rem)] flex-col justify-between pb-7 pt-14 md:pb-8 md:pt-20">
        <div className="flex items-center justify-between text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <span>Adult-use precision store</span>
          <span className="hidden items-center gap-2 sm:flex">
            <span className="size-1.5 rounded-full bg-primary" />
            Available now
          </span>
        </div>

        <div className="max-w-[48rem] py-14 md:py-20">
          <Reveal>
            <Eyebrow className="flex items-center gap-3 text-primary">
              <span className="h-px w-8 bg-primary" />
              {hero.eyebrow}
            </Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 max-w-4xl text-balance font-display text-[clamp(3rem,7vw,6.6rem)] font-semibold leading-[0.95]">
              {hero.title}
              <br />
              <span className="text-primary">{hero.accent}</span>
            </h1>
          </Reveal>
          <Reveal delay={250}>
            <p className="mt-8 max-w-[34rem] text-base leading-7 text-muted-foreground md:text-lg">
              {hero.body}
            </p>
          </Reveal>
          <Reveal className="mt-10 flex flex-wrap items-center gap-3" delay={400}>
            <ButtonLink className="min-w-44" href="/products">
              Shop featured
              <Icon className="size-4" name="arrow-right" />
            </ButtonLink>
            <ButtonLink href="/collections" variant="secondary">
              View the collection
            </ButtonLink>
          </Reveal>
        </div>

        <div className="grid gap-5 border-t border-border pt-5 text-xs text-muted-foreground sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <span>
              <b className="mr-2 font-medium text-foreground">1 deg</b>
              exact control
            </span>
            <span>
              <b className="mr-2 font-medium text-foreground">51 sec</b>
              heat-up
            </span>
            <span>
              <b className="mr-2 font-medium text-foreground">10 yr</b>
              warranty
            </span>
          </div>
          <span className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.16em] sm:block">
            Scroll to explore
          </span>
        </div>
      </Container>
    </section>
  );
}
