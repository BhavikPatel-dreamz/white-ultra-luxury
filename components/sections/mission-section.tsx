import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";

export function MissionSection() {
  return (
    <section className="overflow-hidden border-y border-border bg-surface/30">
      <Container className="py-24 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-background md:order-2">
            <Image
              alt="Precision device component showcasing clean engineering"
              className="object-cover"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              src="/assets/hero-device-BnN7IleR.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/65 via-transparent to-primary/10" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between border-t border-foreground/20 pt-4 text-[0.6rem] uppercase tracking-[0.18em] text-foreground/65 md:bottom-7 md:left-7 md:right-7">
              <span>Materials study<br />Series 02</span>
              <span>01 / 01</span>
            </div>
          </div>
          <div className="md:order-1">
            <Eyebrow className="text-primary">Our mission</Eyebrow>
            <h2 className="mt-4 max-w-xl text-balance font-display text-4xl leading-[1.03] tracking-[-0.045em] md:text-6xl">
              Clean materials. Long life.
            </h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">
              We build precision devices to one standard: make it cleaner, smarter, and more
              controlled. Engineered with materials you can trust, and support that actually shows up.
            </p>
            <div className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-y border-border py-6">
              <div>
                <div className="font-display text-2xl text-primary md:text-3xl">0</div>
                <div className="mt-1 text-xs text-muted-foreground">metal in the airpath</div>
              </div>
              <div>
                <div className="font-display text-2xl text-primary md:text-3xl">10yr</div>
                <div className="mt-1 text-xs text-muted-foreground">warranty on devices</div>
              </div>
              <div>
                <div className="font-display text-2xl text-primary md:text-3xl">1°</div>
                <div className="mt-1 text-xs text-muted-foreground">temperature precision</div>
              </div>
            </div>
            <Link
              className="mt-9 inline-flex items-center gap-2 text-sm transition-colors hover:text-primary"
              href="/collections/accessories"
            >
              Shop accessories
              <Icon className="size-4" name="arrow-up-right" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
