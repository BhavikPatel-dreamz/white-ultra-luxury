import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { WishlistPage } from "@/components/sections/wishlist-page";

export const metadata: Metadata = {
  title: "Wishlist — DaVinci",
  description: "Products saved locally in this browser.",
};

export default function WishlistRoute() {
  return (
    <SiteShell>
      <WishlistPage />
    </SiteShell>
  );
}
