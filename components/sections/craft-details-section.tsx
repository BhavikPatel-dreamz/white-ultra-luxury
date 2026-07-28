import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";

const principles = [
  {
    icon: "zap" as const,
    label: "Flavor purity",
    title: "Every hit. Same taste.",
    body: "Zirconia-lined airpaths and glass-on-glass construction keep vapor isolated from everything else.",
  },
  {
    icon: "shield-check" as const,
    label: "Material integrity",
    title: "Built to outlast.",
    body: "Brushed aluminum, replaceable batteries, and serviceable parts make longevity part of the design.",
  },
  {
    icon: "thermometer" as const,
    label: "Thermal intelligence",
    title: "Your temp. Your ritual.",
    body: "Precise control and considered airflow help every session arrive exactly how you want it.",
  },
];

export function CraftDetailsSection() {
  return (
    <section className="border-y border-border bg-surface/30">
      <Container className="py-24 md:py-28">
        <div className="grid gap-10 md:grid-cols-[0.72fr_1.28fr] md:gap-20">
          <div>
            <Eyebrow className="text-primary">Why DaVinci</Eyebrow>
            <h2 className="mt-4 max-w-sm text-balance font-display text-4xl leading-[1.02] tracking-[-0.04em] md:text-5xl">
              Engineered different.
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              We do not chase trends. We solve problems with better materials, smarter thermals,
              and devices built to last.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {principles.map((principle, index) => (
              <article
                className="group rounded-xl border border-border bg-background/50 p-6 transition-colors hover:border-primary/45"
                key={principle.label}
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full border border-primary/25 bg-primary/5">
                    <Icon className="size-4 text-primary" name={principle.icon} />
                  </span>
                  <span className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <Eyebrow className="mt-8 text-primary/80">{principle.label}</Eyebrow>
                <h3 className="mt-2 font-display text-xl tracking-tight">{principle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
