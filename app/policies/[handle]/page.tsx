import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { InfoPage } from "@/components/sections/info-page";

const policies: Record<string, { title: string; description: string; body: string[] }> = {
  accessibility: {
    title: "Accessibility",
    description: "A clear, keyboard-friendly shopping experience.",
    body: [
      "The storefront uses semantic markup, visible focus states, strong contrast, and responsive layouts.",
      "If an accessibility issue is discovered, it should be handled through the configured support channel.",
    ],
  },
  age: {
    title: "Age Policy",
    description: "Age-restricted products require adult confirmation.",
    body: [
      "You must be 21 years or older, or the legal age required in your jurisdiction, to enter and purchase.",
      "Products are not for minors and should be kept out of reach of children and pets.",
    ],
  },
  privacy: {
    title: "Privacy",
    description: "Privacy information for this storefront.",
    body: [
      "This frontend uses the existing cart and wishlist behavior. Wishlist items are stored locally in the browser.",
      "Checkout data is submitted through the existing checkout endpoint when an order is placed.",
    ],
  },
  returns: {
    title: "Returns",
    description: "Return information for eligible orders.",
    body: [
      "Eligible items can be returned within the stated return window.",
      "Do not send items back until the configured support flow authorizes the return.",
    ],
  },
  shipping: {
    title: "Shipping",
    description: "Shipping information for eligible orders.",
    body: [
      "In-stock items are prepared for discreet shipment.",
      "Shipping totals and eligibility are calculated by the existing cart and checkout logic.",
    ],
  },
  terms: {
    title: "Terms",
    description: "Store terms for adult customers.",
    body: [
      "By using this storefront, you agree to comply with all applicable age restrictions and local laws.",
      "Pricing, stock, taxes, shipping, and order placement are controlled by the existing commerce backend.",
    ],
  },
};

type PolicyRouteProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: PolicyRouteProps): Promise<Metadata> {
  const { handle } = await params;
  const policy = policies[handle];

  if (!policy) {
    return {
      title: "Policy not found - DaVinci",
    };
  }

  return {
    title: `${policy.title} - DaVinci`,
    description: policy.description,
  };
}

export default async function PolicyRoute({ params }: PolicyRouteProps) {
  const { handle } = await params;
  const policy = policies[handle];

  if (!policy) {
    notFound();
  }

  return (
    <SiteShell>
      <InfoPage
        description={policy.description}
        eyebrow="Policy"
        title={policy.title}
      >
        <div className="space-y-4 text-sm leading-7 text-muted-foreground">
          {policy.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </InfoPage>
    </SiteShell>
  );
}
