import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-title";

export function ProductListingLoading({
  eyebrow = "Shop",
  title = "Loading products",
}: {
  eyebrow?: string;
  title?: string;
}) {
  return (
    <>
      <section className="border-b border-border bg-background">
        <Container className="pb-10 pt-16 md:pb-12 md:pt-20">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">
            {title}
          </h1>
          <div className="mt-5 h-4 max-w-2xl rounded bg-muted" />
        </Container>
      </section>
      <Container className="grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <div className="hidden rounded-[var(--radius)] border border-border bg-surface-elevated p-5 lg:block">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="h-11 rounded-[var(--radius)] bg-muted" key={index} />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-4">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-10 w-36 rounded-[var(--radius)] bg-muted" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                className="rounded-[var(--radius)] border border-border bg-surface-elevated p-3"
                key={index}
              >
                <div className="aspect-[4/5] rounded-[var(--radius)] bg-muted" />
                <div className="mt-4 h-3 w-20 rounded bg-muted" />
                <div className="mt-3 h-4 w-4/5 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
