import { Container } from "@/components/ui/container";

export function ProductListingLoading({
  eyebrow = "Shop",
  title = "Loading the edit",
}: {
  eyebrow?: string;
  title?: string;
}) {
  return (
    <div aria-busy="true" aria-live="polite">
      <section className="border-b border-border bg-foreground text-background">
        <Container className="flex min-h-[22rem] flex-col justify-end pb-12 pt-28">
          <div className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-primary">
            Ember &amp; Halo / {eyebrow}
          </div>
          <h1 className="mt-5 font-display text-5xl font-medium leading-none tracking-[-0.04em] md:text-7xl">
            {title}
          </h1>
          <div className="mt-7 h-2.5 w-full max-w-xl animate-pulse rounded-full bg-background/10" />
        </Container>
      </section>

      <Container className="grid gap-8 py-8 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:py-12">
        <div className="hidden border-t border-border lg:block">
          <div className="flex items-center justify-between border-b border-border py-5">
            <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-10 animate-pulse rounded-full bg-muted" />
          </div>
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="border-b border-border py-5" key={index}>
              <div className="h-3 w-28 animate-pulse rounded-full bg-muted" />
              <div className="mt-4 h-10 animate-pulse rounded-full bg-muted" />
            </div>
          ))}
        </div>

        <div>
          <div className="mb-7 flex items-center justify-between gap-4 border-b border-border pb-4">
            <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-11 w-40 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="animate-pulse" key={index}>
                <div className="aspect-[4/5] rounded-[1.35rem] border border-border bg-muted" />
                <div className="mt-4 h-2.5 w-24 rounded-full bg-muted" />
                <div className="mt-3 h-4 w-4/5 rounded-full bg-muted" />
                <div className="mt-4 flex justify-between gap-4">
                  <div className="h-3 w-14 rounded-full bg-muted" />
                  <div className="h-3 w-16 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
