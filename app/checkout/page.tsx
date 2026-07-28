import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/checkout-page";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  title: "Checkout - DaVinci",
  description: "Complete a local demo checkout from your cart.",
};

export default function CheckoutRoute() {
  return (
    <SiteShell>
      <CheckoutPage />
    </SiteShell>
  );
}
