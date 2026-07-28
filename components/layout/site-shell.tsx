"use client";

import type { ReactNode } from "react";
import { CartProvider, useCart } from "@/components/cart/cart-provider";
import { AgeGate } from "@/components/layout/age-gate";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { WishlistProvider, useWishlist } from "@/components/wishlist/wishlist-provider";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <SiteShellContent>{children}</SiteShellContent>
      </WishlistProvider>
    </CartProvider>
  );
}

function SiteShellContent({ children }: { children: ReactNode }) {
  const { closeCart, isCartOpen, itemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="relative flex min-h-screen flex-col">
        <AnnouncementBar />
        <Navbar
          cartCount={itemCount}
          onCartOpen={openCart}
          wishlistCount={wishlistCount}
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <CartDrawer onClose={closeCart} open={isCartOpen} />
      <AgeGate />
    </div>
  );
}
