import { cookies } from "next/headers";

export const CART_COOKIE = "medusa_cart_id";

const cartCookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
  sameSite: "lax" as const,
};

export async function getCartIdFromCookie() {
  return (await cookies()).get(CART_COOKIE)?.value;
}

export async function setCartIdCookie(cartId: string) {
  (await cookies()).set(CART_COOKIE, cartId, cartCookieOptions);
}

export async function clearCartIdCookie() {
  (await cookies()).delete(CART_COOKIE);
}
