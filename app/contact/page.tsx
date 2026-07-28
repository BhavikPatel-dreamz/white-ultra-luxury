import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { InfoPage } from "@/components/sections/info-page";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Contact - DaVinci",
  description: "Contact information for the DaVinci storefront.",
};

export default function ContactRoute() {
  return (
    <SiteShell>
      <InfoPage
        description="Support contact points can be connected when the backend exposes a contact endpoint."
        eyebrow="Support"
        title="Contact and service."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["mail", "Email support", "Use your configured support inbox."],
            ["package", "Orders", "Have your order number ready."],
            ["map-pin", "Availability", "Follow local age and product laws."],
          ].map(([icon, title, body]) => (
            <div className="rounded-[var(--radius)] border border-border bg-surface p-5" key={title}>
              <Icon className="size-5 text-primary" name={icon as "mail" | "package" | "map-pin"} />
              <h2 className="mt-5 font-display text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </InfoPage>
    </SiteShell>
  );
}
