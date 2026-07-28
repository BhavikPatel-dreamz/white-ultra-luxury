import { NextResponse } from "next/server";
import {
  type CheckoutDetails,
  placeMedusaOrder,
} from "@/lib/medusa";
import {
  clearCartIdCookie,
  getCartIdFromCookie,
} from "@/app/api/cart/cookies";

type CheckoutRequestBody = Partial<Record<keyof CheckoutDetails, unknown>>;

const requiredFields: Array<keyof CheckoutDetails> = [
  "address1",
  "city",
  "countryCode",
  "email",
  "firstName",
  "lastName",
  "phone",
  "postalCode",
  "province",
];

function getBodyString(body: CheckoutRequestBody, key: keyof CheckoutDetails) {
  const value = body[key];
  return typeof value === "string" ? value.trim() : "";
}

function parseCheckoutDetails(body: CheckoutRequestBody) {
  const missingField = requiredFields.find((field) => !getBodyString(body, field));

  if (missingField) {
    return {
      details: null,
      message: `${missingField} is required.`,
    };
  }

  return {
    details: {
      address1: getBodyString(body, "address1"),
      address2: getBodyString(body, "address2"),
      cardName: getBodyString(body, "cardName"),
      cardNumber: getBodyString(body, "cardNumber"),
      city: getBodyString(body, "city"),
      countryCode: getBodyString(body, "countryCode"),
      email: getBodyString(body, "email"),
      firstName: getBodyString(body, "firstName"),
      lastName: getBodyString(body, "lastName"),
      paymentProviderId: getBodyString(body, "paymentProviderId") || undefined,
      phone: getBodyString(body, "phone"),
      postalCode: getBodyString(body, "postalCode"),
      province: getBodyString(body, "province"),
    } satisfies CheckoutDetails,
    message: null,
  };
}

export async function POST(request: Request) {
  const cartId = await getCartIdFromCookie();

  if (!cartId) {
    return NextResponse.json({ message: "No active cart was found." }, { status: 400 });
  }

  let body: CheckoutRequestBody;

  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ message: "Invalid checkout payload." }, { status: 400 });
  }

  const { details, message } = parseCheckoutDetails(body);

  if (!details) {
    return NextResponse.json({ message }, { status: 400 });
  }

  try {
    const { completion, paymentProviderId } = await placeMedusaOrder(cartId, details);

    if (completion.type === "cart") {
      return NextResponse.json(
        {
          cart: completion.cart,
          error: completion.error,
          message: completion.error.message,
        },
        { status: 422 },
      );
    }

    await clearCartIdCookie();

    return NextResponse.json({
      order: completion.order,
      paymentProviderId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to place the Medusa order.",
      },
      { status: 400 },
    );
  }
}
