import { NextResponse } from "next/server";
import { deleteCartLineItem, updateCartLineItem } from "@/lib/medusa";
import { getCartIdFromCookie } from "@/app/api/cart/cookies";

type LineItemRouteContext = {
  params: Promise<{ lineItemId: string }>;
};

type UpdateLineItemBody = {
  quantity?: unknown;
};

export async function PATCH(request: Request, { params }: LineItemRouteContext) {
  const cartId = await getCartIdFromCookie();
  const { lineItemId } = await params;
  let body: UpdateLineItemBody;

  try {
    body = (await request.json()) as UpdateLineItemBody;
  } catch {
    return NextResponse.json({ message: "Invalid cart payload" }, { status: 400 });
  }

  const quantity = typeof body.quantity === "number" ? body.quantity : 1;

  if (!cartId) {
    return NextResponse.json({ message: "Cart not found" }, { status: 404 });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return NextResponse.json({ message: "quantity must be a positive integer" }, { status: 400 });
  }

  try {
    const cart = await updateCartLineItem(cartId, lineItemId, quantity);

    return NextResponse.json({ cart });
  } catch {
    return NextResponse.json(
      { message: "Cart service is temporarily unavailable." },
      { status: 503 },
    );
  }
}

export async function DELETE(_request: Request, { params }: LineItemRouteContext) {
  const cartId = await getCartIdFromCookie();
  const { lineItemId } = await params;

  if (!cartId) {
    return NextResponse.json({ message: "Cart not found" }, { status: 404 });
  }

  try {
    const cart = await deleteCartLineItem(cartId, lineItemId);

    return NextResponse.json({ cart });
  } catch {
    return NextResponse.json(
      { message: "Cart service is temporarily unavailable." },
      { status: 503 },
    );
  }
}
