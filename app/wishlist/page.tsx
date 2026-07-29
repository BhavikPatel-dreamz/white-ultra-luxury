import type { Metadata } from "next";
import { WishlistPage } from "@/components/sections/wishlist-page";

export const metadata: Metadata = {
  title: "Wishlist — Ember & Halo",
  description: "Products saved locally in this browser.",
};

export default function WishlistRoute() {
  return (
    <>
      <WishlistPage />
    </>
  );
}
