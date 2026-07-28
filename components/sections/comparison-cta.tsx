import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";

const compatibilityGroups = [
  ["Portable", "Mouthpieces, stems, cases"],
  ["Desktop", "Glassware, bowls, maintenance"],
  ["Care", "Cleaning tools and replacement parts"],
];

export function ComparisonCta() {
  return (
    <section className="border-y border-border bg-surface">
      <Container className="grid gap-10 py-20 md:grid-cols-[0.92fr_1.08fr] md:items-center md:py-28">
        <div>
          <Eyebrow className="text-primary">Accessory compatibility</Eyebrow>
          <h3 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight md:text-5xl">
            Everything should fit the device you already own.
          </h3>
          <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">
            Shop replacement parts, cleaning tools, mouthpieces, and carrying pieces with clear
            setup context. No invented bundles, no confusing claims.
          </p>
          <ButtonLink className="mt-8" href="/search?q=accessories" variant="secondary">
            Find accessories
            <Icon className="size-4" name="arrow-right" />
          </ButtonLink>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {compatibilityGroups.map(([title, body]) => (
            <div className="rounded-[var(--radius)] border border-border bg-surface-elevated p-5" key={title}>
              <Icon className="size-5 text-primary" name="package" />
              <h4 className="mt-5 font-display text-xl">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
