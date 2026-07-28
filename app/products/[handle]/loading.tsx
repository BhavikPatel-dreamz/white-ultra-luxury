import { SiteShell } from "@/components/layout/site-shell";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-title";

export default function ProductLoading() {
  return (
    <SiteShell>
      <Container className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16">
        <div>
          <div className="aspect-square rounded-[var(--radius)] border border-border bg-muted" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="aspect-square rounded-[var(--radius)] bg-muted" key={index} />
            ))}
          </div>
        </div>
        <div className="rounded-[var(--radius)] border border-border bg-surface-elevated p-6 shadow-[var(--shadow-soft)]">
          <Eyebrow>Product</Eyebrow>
          <div className="mt-4 h-12 rounded bg-muted" />
          <div className="mt-4 h-4 w-2/3 rounded bg-muted" />
          <div className="mt-8 h-8 w-36 rounded bg-muted" />
          <div className="mt-8 space-y-3">
            <div className="h-11 rounded-[var(--radius)] bg-muted" />
            <div className="h-12 rounded-[var(--radius)] bg-muted" />
            <div className="h-12 rounded-[var(--radius)] bg-muted" />
          </div>
        </div>
      </Container>
    </SiteShell>
  );
}
