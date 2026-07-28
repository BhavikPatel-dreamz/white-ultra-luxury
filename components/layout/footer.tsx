import Link from "next/link";
import { footerGroups, paymentLabels } from "@/lib/data";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/layout/logo";
import { Eyebrow } from "@/components/ui/section-title";

function FooterGroup({
  links,
  title,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <Eyebrow className="mb-4">{title}</Eyebrow>
      <ul className="space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              className="text-muted-foreground transition-colors hover:text-foreground"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface md:mt-28">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.35fr_1fr_1fr_1fr_1fr]">
          <div>
            <Logo className="text-xl" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Precision vaporizers and accessories for adults of legal age, assembled with a
              service-first mindset.
            </p>
            <div className="mt-6 flex gap-2">
              <ButtonLink aria-label="Instagram" className="size-10 rounded-full px-0 py-0" href="#" variant="ghost">
                <Icon className="size-4" name="instagram" />
              </ButtonLink>
              <ButtonLink aria-label="YouTube" className="size-10 rounded-full px-0 py-0" href="#" variant="ghost">
                <Icon className="size-4" name="youtube" />
              </ButtonLink>
              <ButtonLink aria-label="Twitter" className="size-10 rounded-full px-0 py-0" href="#" variant="ghost">
                <Icon className="size-4" name="twitter" />
              </ButtonLink>
            </div>
          </div>

          {footerGroups.map((group) => (
            <FooterGroup key={group.title} links={group.links} title={group.title} />
          ))}
        </div>

        <div className="mt-16 grid items-center gap-6 border-t border-border pt-8 text-xs text-muted-foreground md:grid-cols-[1fr_auto]">
          <p className="max-w-3xl leading-relaxed">
            Age restricted: You must be 21 years or older to purchase. Products are not intended
            for use by persons under legal age. Keep all products out of reach of children and
            pets. Follow all applicable laws in your jurisdiction. {"\u00a9"} 2026 DaVinci
            Vaporizer.
          </p>
          <div className="flex gap-2 opacity-70">
            {paymentLabels.map((label) => (
              <span
                className="rounded border border-border px-2 py-1 text-[0.65rem] tracking-widest"
                key={label}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
