import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { InfoPage } from "@/components/sections/info-page";

export const metadata: Metadata = {
  title: "Account - DaVinci",
  description: "Account area for the DaVinci storefront.",
};

export default function AccountRoute() {
  return (
    <SiteShell>
      <InfoPage
        description="Account services are not connected in this storefront build. Shopping, wishlist, cart, and checkout remain available."
        eyebrow="Account"
        title="Your store account."
      >
        <div className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            Sign-in and account sync require authentication services from the backend. This
            frontend keeps the surface ready without adding new auth logic.
          </p>
          <p>
            Your wishlist is currently stored locally in this browser, and checkout uses the
            existing demo order flow.
          </p>
        </div>
      </InfoPage>
    </SiteShell>
  );
}
