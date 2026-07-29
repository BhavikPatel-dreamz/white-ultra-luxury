import { NextResponse } from "next/server";
import { listCatalogTaxonomy } from "@/lib/medusa";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { categories, collections } = await listCatalogTaxonomy();

    return NextResponse.json(
      { categories, collections },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { message: "Store navigation is temporarily unavailable." },
      { status: 503 },
    );
  }
}
