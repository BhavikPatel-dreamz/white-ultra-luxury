import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/sections/product-detail-page";
import { getProductByHandle, getRelatedProducts } from "@/lib/medusa";

export const dynamic = "force-dynamic";

type ProductRouteProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: ProductRouteProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {
      title: "Product not found — Ember & Halo",
    };
  }

  return {
    title: `${product.name} — Ember & Halo`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — Ember & Halo`,
      description: product.shortDescription,
    },
  };
}

export default async function ProductRoute({ params }: ProductRouteProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetailPage
        product={product}
        relatedProducts={await getRelatedProducts(product.handle)}
      />
    </>
  );
}
