import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { InfoPage } from "@/components/sections/info-page";

export const metadata: Metadata = {
  title: "FAQ - DaVinci",
  description: "Frequently asked questions for the DaVinci storefront.",
};

const faqs = [
  ["Who can buy from this store?", "Only adults of legal age may purchase. Follow all applicable laws in your jurisdiction."],
  ["How does shipping work?", "In-stock orders are prepared with discreet packaging. Free shipping messaging follows the current storefront benefit copy."],
  ["Can I return an item?", "Eligible items can be returned within the stated return window. Keep products out of reach of children and pets."],
  ["Where do product details come from?", "Product names, images, categories, variants, pricing, stock, reviews, and specifications come from the existing catalog data."],
];

export default function FaqRoute() {
  return (
    <SiteShell>
      <InfoPage
        description="Clear answers for adult customers before they browse, save, or check out."
        eyebrow="FAQ"
        title="Store questions."
      >
        <div className="divide-y divide-border">
          {faqs.map(([question, answer]) => (
            <div className="py-5 first:pt-0 last:pb-0" key={question}>
              <h2 className="font-display text-xl font-semibold">{question}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{answer}</p>
            </div>
          ))}
        </div>
      </InfoPage>
    </SiteShell>
  );
}
