import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-title";

const partnerMarks = [
  { name: "Authorized retailers", detail: "in-store expertise" },
  { name: "Design partners", detail: "considered materials" },
  { name: "Service network", detail: "support that shows up" },
  { name: "Independent makers", detail: "made with intention" },
  { name: "Explorer's Club", detail: "community & education" },
  { name: "Global distribution", detail: "precision, everywhere" },
];

export function PartnersSection() {
  return (
    <section>
      <Container className="py-24 md:py-28">
        <div className="rounded-2xl border border-border bg-surface/35 p-8 md:p-12">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Eyebrow className="text-primary">In good company</Eyebrow>
              <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-[-0.03em] md:text-4xl">
                Built with people who care about the details.
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              From the people who make it to the people who use it, our network shares one standard.
            </p>
          </div>
          <div className="mt-10 grid border-y border-border sm:grid-cols-2 md:grid-cols-3">
            {partnerMarks.map((partner, index) => (
              <div
                className="group flex min-h-28 flex-col justify-center border-border py-5 sm:px-6 md:min-h-32 md:border-l md:px-7 md:first:border-l-0"
                key={partner.name}
              >
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-foreground/80 transition-colors group-hover:text-primary">
                  {partner.name}
                </span>
                <span className="mt-2 text-xs text-muted-foreground">{partner.detail}</span>
                <span className="mt-4 h-px w-8 bg-primary/45 transition-all duration-300 group-hover:w-14" />
                <span className="sr-only">Partner {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
