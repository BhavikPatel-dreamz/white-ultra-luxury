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
    <div className="relative flex min-h-screen flex-col bg-background">
      <a
        className="fixed left-4 top-4 z-[120] -translate-y-24 bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-transform focus:translate-y-0"
        href="#main-content"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Navbar
        cartCount={itemCount}
        onCartOpen={openCart}
        wishlistCount={wishlistCount}
      />
      <main className="flex-1" id="main-content">
        {children}
      </main>
      <Footer />
      <CartDrawer onClose={closeCart} open={isCartOpen} />
      <AgeGate />
    </div>
  );
}
