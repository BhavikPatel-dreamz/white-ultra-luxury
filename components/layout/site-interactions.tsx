"use client";

import { useCart } from "@/components/cart/cart-provider";
import { AgeGate } from "@/components/layout/age-gate";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Navbar } from "@/components/layout/navbar";
import { useWishlist } from "@/components/wishlist/wishlist-provider";

export function SiteHeader() {
  const { itemCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();

  return (
    <Navbar
      cartCount={itemCount}
      onCartOpen={openCart}
      wishlistCount={wishlistCount}
    />
  );
}

export function SiteOverlays() {
  const { closeCart, isCartOpen } = useCart();

  return (
    <>
      <CartDrawer onClose={closeCart} open={isCartOpen} />
      <AgeGate />
    </>
  );
}
