import { NextResponse } from "next/server";
import { addCartLineItem, createCart, retrieveCart } from "@/lib/medusa";
import { getCartIdFromCookie, setCartIdCookie } from "@/app/api/cart/cookies";

type AddLineItemBody = {
  quantity?: unknown;
  variantId?: unknown;
};

async function getOrCreateCart() {
  const cartId = await getCartIdFromCookie();

  if (cartId) {
    try {
      return await retrieveCart(cartId);
    } catch {
      // If the backend cart was deleted, create a fresh cart below.
    }
  }

  const cart = await createCart();
  await setCartIdCookie(cart.id);
  return cart;
}

export async function POST(request: Request) {
  const body = (await request.json()) as AddLineItemBody;
  const variantId = typeof body.variantId === "string" ? body.variantId : "";
  const quantity = typeof body.quantity === "number" ? body.quantity : 1;

  if (!variantId) {
    return NextResponse.json({ message: "variantId is required" }, { status: 400 });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return NextResponse.json({ message: "quantity must be a positive integer" }, { status: 400 });
  }

  const cart = await getOrCreateCart();
  const updatedCart = await addCartLineItem(cart.id, variantId, quantity);
  await setCartIdCookie(updatedCart.id);

  return NextResponse.json({ cart: updatedCart });
}
