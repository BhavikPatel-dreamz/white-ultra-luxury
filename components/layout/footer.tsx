import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { footerGroups, paymentLabels } from "@/lib/data";

function FooterGroup({
  links,
  title,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-primary">
        {title}
      </h3>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              className="inline-block text-muted-foreground transition-[color,transform] hover:translate-x-1 hover:text-foreground"
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
    <footer className="relative mt-20 overflow-hidden border-t border-border bg-[#07080c] md:mt-32">
      <div aria-hidden="true" className="eh-grid absolute inset-0 opacity-25" />
      <Container className="relative py-12 md:py-16">
        <div className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:pb-16">
          <div>
            <div className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-coral">
              Notes from the after hours
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.6rem,5vw,5.2rem)] font-bold leading-[0.88] tracking-[-0.06em]">
              Fresh drops.
              <br />
              <span className="font-accent font-medium italic text-primary">No inbox fog.</span>
            </h2>
          </div>
          <NewsletterForm variant="footer" />
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_repeat(4,0.65fr)] lg:gap-8 lg:py-20">
          <div>
            <Logo className="text-2xl" />
            <p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">
              A tightly edited destination for modern vape, hookah and flavor. Built for adults,
              delivered with discretion.
            </p>
            <div className="mt-7 flex gap-2">
              <SocialLink href="https://www.instagram.com/" icon="instagram" label="Instagram" />
              <SocialLink href="https://www.youtube.com/" icon="youtube" label="YouTube" />
              <SocialLink href="https://x.com/" icon="twitter" label="X" />
            </div>
          </div>
          {footerGroups.map((group) => (
            <FooterGroup key={group.title} links={group.links} title={group.title} />
          ))}
        </div>

        <div className="overflow-hidden border-y border-border py-2">
          <div
            aria-label="Ember and Halo"
            className="whitespace-nowrap text-center font-display text-[clamp(3.2rem,11vw,10rem)] font-bold uppercase leading-[0.82] tracking-[-0.085em] text-foreground"
          >
            Ember <span className="font-accent font-medium italic text-primary">&</span> Halo
          </div>
        </div>

        <div className="grid gap-6 pt-8 text-[0.66rem] leading-5 text-muted-foreground lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-4xl">
            <p>
              Adults of legal smoking age only. Nicotine is an addictive chemical. Products are
              not smoking-cessation devices and have not been evaluated by the FDA. Keep away
              from children and pets. Please follow all applicable laws in your jurisdiction.
            </p>
            <p className="mt-3">© 2026 Ember & Halo. All nights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {paymentLabels.map((label) => (
              <span
                className="border border-border bg-surface px-2.5 py-1.5 font-bold tracking-[0.12em] text-foreground/70"
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

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: "instagram" | "twitter" | "youtube";
  label: string;
}) {
  return (
    <a
      aria-label={label}
      className="grid size-11 place-items-center border border-border text-muted-foreground transition-[background,color,border-color,transform] hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <Icon className="size-4" name={icon} />
    </a>
  );
}
