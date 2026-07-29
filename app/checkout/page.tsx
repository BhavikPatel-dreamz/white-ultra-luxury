import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Checkout — Ember & Halo",
  description: "Complete a local demo checkout from your cart.",
};

export default function CheckoutRoute() {
  return (
    <>
      <CheckoutPage />
    </>
  );
}
