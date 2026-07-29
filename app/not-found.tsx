import { SiteShell } from "@/components/layout/site-shell";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";

const routes = [
  {
    eyebrow: "The full edit",
    href: "/products",
    title: "Shop all products",
  },
  {
    eyebrow: "Curated drops",
    href: "/collections",
    title: "Browse collections",
  },
  {
    eyebrow: "Find an object",
    href: "/search",
    title: "Search the store",
  },
] as const;

export default function NotFound() {
  return (
    <SiteShell>
      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <div aria-hidden="true" className="hero-grid absolute inset-0 opacity-70" />
        <div
          aria-hidden="true"
          className="absolute -right-32 top-10 size-[32rem] rounded-full bg-violet/15 blur-[110px] md:size-[42rem]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-40 left-1/4 size-[28rem] rounded-full bg-primary/10 blur-[120px]"
        />

        <Container className="relative grid min-h-[42rem] items-center gap-12 py-16 lg:min-h-[48rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(25rem,1.1fr)] lg:py-24">
          <div className="relative z-10 max-w-2xl">
            <Eyebrow className="text-primary">Error 404 / Signal lost</Eyebrow>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.9] tracking-[-0.065em] sm:text-6xl md:text-7xl">
              This page slipped
              <br />
              out of <span className="font-accent font-normal italic text-primary">rotation.</span>
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              The address may have changed, or the piece you were looking for is no longer on
              this shelf. The rest of the after-hours edit is still within reach.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/">
                Return home
                <Icon className="size-4" name="arrow-right" />
              </ButtonLink>
              <ButtonLink href="/products" variant="secondary">
                Explore the catalog
              </ButtonLink>
            </div>
          </div>

          <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[34rem]">
            <div className="absolute inset-[4%] rounded-full border border-foreground/10" />
            <div className="eh-orbit absolute inset-[15%] rounded-full border border-dashed border-primary/35">
              <span className="absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_30px_rgba(203,255,71,0.9)]" />
            </div>
            <div className="absolute inset-[27%] rounded-full border border-foreground/15 bg-surface/70 shadow-[0_0_80px_rgba(140,108,255,0.2)] backdrop-blur-sm" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="font-display text-[7.5rem] font-semibold leading-none tracking-[-0.1em] text-foreground sm:text-[9rem]">
                  404
                </div>
                <div className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.42em] text-primary">
                  Object not found
                </div>
              </div>
            </div>
            <span className="absolute left-[7%] top-1/2 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-muted-foreground [writing-mode:vertical-rl]">
              Ember &amp; Halo / 404
            </span>
            <span className="absolute bottom-[9%] right-[4%] size-2 rounded-full bg-coral shadow-[0_0_20px_rgba(255,115,93,0.75)]" />
          </div>
        </Container>
      </section>

      <section className="bg-surface">
        <Container className="py-12 md:py-16">
          <div className="mb-7 flex items-center justify-between gap-6">
            <Eyebrow>Pick up the trail</Eyebrow>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-muted-foreground">
              Three ways back in
            </span>
          </div>
          <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
            {routes.map((route, index) => (
              <ButtonLink
                className="group min-h-32 justify-between rounded-none bg-surface-elevated px-6 py-6 text-left hover:bg-secondary md:min-h-40"
                href={route.href}
                key={route.href}
                variant="ghost"
              >
                <span className="self-end">
                  <span className="block font-mono text-[0.58rem] uppercase tracking-[0.18em] text-primary">
                    0{index + 1} / {route.eyebrow}
                  </span>
                  <span className="mt-2 block font-display text-xl font-semibold tracking-[-0.035em]">
                    {route.title}
                  </span>
                </span>
                <Icon
                  className="size-5 self-start transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                  name="arrow-up-right"
                />
              </ButtonLink>
            ))}
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
