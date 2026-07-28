import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
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
      title: "Product not found \u2014 DaVinci",
    };
  }

  return {
    title: `${product.name} \u2014 DaVinci`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} \u2014 DaVinci`,
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
    <SiteShell>
      <ProductDetailPage
        product={product}
        relatedProducts={await getRelatedProducts(product.handle)}
      />
    </SiteShell>
  );
}
