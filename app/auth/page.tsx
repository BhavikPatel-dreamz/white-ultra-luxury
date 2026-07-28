import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { InfoPage } from "@/components/sections/info-page";

export const metadata: Metadata = {
  title: "Authentication - DaVinci",
  description: "Authentication status for the DaVinci storefront.",
};

export default function AuthRoute() {
  return (
    <SiteShell>
      <InfoPage
        description="Authentication forms and redirects are not present in this frontend build, so no new auth calls were added."
        eyebrow="Authentication"
        title="Sign-in is not configured."
      >
        <p className="text-sm leading-7 text-muted-foreground">
          When backend authentication is available, this page can host the existing sign-in,
          registration, and password recovery flows without changing the store catalog or checkout
          logic.
        </p>
      </InfoPage>
    </SiteShell>
  );
}
