import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { InfoPage } from "@/components/sections/info-page";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Help & FAQ — Ember & Halo",
  description: "Answers about age requirements, vape and hookah products, delivery, returns, and product care.",
};

const faqGroups = [
  {
    label: "Orders & delivery",
    questions: [
      ["How old do I need to be to order?", "You must meet the legal smoking age in the jurisdiction where you place and receive the order. Age verification and an adult signature may be required. Never purchase for a minor."],
      ["Is the packaging discreet?", "Yes. Orders ship in plain outer packaging without product names or category language. The shipping label contains only the information required by the carrier."],
      ["When will my order ship?", "In-stock orders are generally prepared within one to two business days. Carrier estimates begin after dispatch, and are not guarantees. Tracking is sent to the checkout email."],
      ["Can I change or cancel an order?", "Contact us immediately with your order number. We can usually update an order before it enters packing, but we cannot guarantee changes once fulfillment begins."],
    ],
  },
  {
    label: "Products & compatibility",
    questions: [
      ["How do I choose the right nicotine strength?", "Strength is personal and should be approached carefully. Product pages show available concentrations. If you do not currently use nicotine, do not start; nicotine is addictive and products must be kept away from children and pets."],
      ["Will this coil or pod fit my device?", "Match the exact device family and generation shown in the compatibility details. Similar-looking parts are not always interchangeable. Send our care team a photo or model name if you are unsure."],
      ["Why can a flavor look darker over time?", "E-liquid can naturally change color with age, light, heat, and nicotine oxidation. Store bottles sealed, upright, and away from direct sunlight. Do not use a product if its seal is damaged or it appears contaminated."],
      ["What is included with a hookah?", "Each product page lists its box contents. Unless explicitly stated, charcoal, tobacco or herbal flavor, foil, heat-management devices, and cleaning tools are sold separately."],
    ],
  },
  {
    label: "Returns & care",
    questions: [
      ["What can be returned?", "Unused, unopened, and resalable items may be eligible within 30 days of delivery. E-liquids, flavors, opened consumables, used mouthpieces, coils, pods, and clearance items are normally final sale for safety and hygiene."],
      ["What if something arrives damaged?", "Photograph the outer package, shipping label, and item, then contact us within 72 hours of delivery. Keep all packaging while we review the carrier or product claim."],
      ["How should I care for batteries?", "Use only compatible chargers and inspect wraps and contacts regularly. Never use a damaged, wet, swollen, or overheating battery. Keep loose cells in a protective case and away from metal objects."],
      ["Do products include a warranty?", "Manufacturer warranties vary by brand and product. Keep your receipt, serial number, and packaging. Our team can help identify the appropriate warranty route; consumable wear is generally excluded."],
    ],
  },
] as const;

export default function FaqRoute() {
  return (
    <SiteShell>
      <InfoPage
        description="Straight answers before and after you order—from device compatibility to discreet delivery and responsible product care."
        eyebrow="Help desk / Field notes"
        title="Know your gear. Know the process."
      >
        <div className="space-y-12">
          {faqGroups.map((group, groupIndex) => (
            <section key={group.label}>
              <div className="mb-4 flex items-center gap-4">
                <span className="font-mono text-xs text-primary">0{groupIndex + 1}</span>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.035em]">{group.label}</h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="border-y border-border">
                {group.questions.map(([question, answer], index) => (
                  <details className="group border-b border-border last:border-b-0" key={question} open={groupIndex === 0 && index === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-sm font-semibold marker:content-none md:text-base">
                      <span>{question}</span>
                      <span className="grid size-9 shrink-0 place-items-center border border-border text-primary transition-transform duration-300 group-open:rotate-45">
                        <Icon className="size-4" name="plus" />
                      </span>
                    </summary>
                    <p className="max-w-3xl pb-6 pr-12 text-sm leading-7 text-muted-foreground">{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <section className="flex flex-col gap-6 border border-primary/30 bg-primary/5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary">Still curious?</span>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.035em]">Ask a real person.</h2>
              <p className="mt-2 text-sm text-muted-foreground">Tell us the device, flavor, or order you’re working with.</p>
            </div>
            <ButtonLink className="shrink-0" href="/contact">Contact the studio <Icon className="size-4" name="arrow-right" /></ButtonLink>
          </section>
        </div>
      </InfoPage>
    </SiteShell>
  );
}
