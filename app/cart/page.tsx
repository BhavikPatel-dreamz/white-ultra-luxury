import type { Metadata } from "next";
import { CartPage } from "@/components/cart/cart-page";
import { SiteShell } from "@/components/layout/site-shell";

export const metadata: Metadata = {
  title: "Cart — Ember & Halo",
  description: "Review your Ember & Halo storefront cart.",
};

export default function CartRoute() {
  return (
    <SiteShell>
      <CartPage />
    </SiteShell>
  );
}
