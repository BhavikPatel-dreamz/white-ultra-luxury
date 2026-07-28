import { NextResponse } from "next/server";
import { createCart, retrieveCart } from "@/lib/medusa";
import {
  clearCartIdCookie,
  getCartIdFromCookie,
  setCartIdCookie,
} from "@/app/api/cart/cookies";

export async function GET() {
  const cartId = await getCartIdFromCookie();

  if (!cartId) {
    return NextResponse.json({ cart: null });
  }

  try {
    const cart = await retrieveCart(cartId);
    return NextResponse.json({ cart });
  } catch {
    await clearCartIdCookie();
    return NextResponse.json({ cart: null });
  }
}

export async function POST() {
  const cart = await createCart();
  await setCartIdCookie(cart.id);

  return NextResponse.json({ cart }, { status: 201 });
}

export async function DELETE() {
  await clearCartIdCookie();

  return NextResponse.json({ cart: null });
}
