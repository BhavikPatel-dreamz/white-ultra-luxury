import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPage } from "@/components/sections/info-page";

type PolicySection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

type Policy = {
  title: string;
  description: string;
  sections: PolicySection[];
};

const policies: Record<string, Policy> = {
  accessibility: {
    title: "Accessibility Statement",
    description: "Our commitment to a shopping experience that is clear, operable, and welcoming.",
    sections: [
      { heading: "Our commitment", paragraphs: ["Ember & Halo is committed to providing an accessible digital experience for people with disabilities. We work to support keyboard navigation, readable contrast, descriptive labels, logical headings, and responsive layouts across current browsers and assistive technology."] },
      { heading: "Ongoing work", paragraphs: ["Accessibility is an ongoing practice. We review key shopping journeys and aim to follow applicable guidance from the Web Content Accessibility Guidelines (WCAG). Some third-party payment, review, carrier, or media services may be outside our direct control, but we encourage our partners to provide accessible experiences."] },
      { heading: "Feedback and assistance", paragraphs: ["If you encounter a barrier, contact care@emberandhalo.com with the page URL, a description of the issue, and the device or assistive technology you use. We will make reasonable efforts to provide the information or service through an accessible alternative and address the underlying issue."] },
    ],
  },
  age: {
    title: "Age & Responsible Use Policy",
    description: "Adult-use products, sold only where lawful and intended only for responsible adults.",
    sections: [
      { heading: "Adults only", paragraphs: ["You must be at least 21 years old—or the higher legal smoking age that applies where you live—to enter, create an order, or receive age-restricted products. By using the store, you confirm that purchasing and possessing the products is lawful in your jurisdiction."], bullets: ["Never purchase for, supply to, or allow access by a minor.", "Age verification or an adult signature may be required before fulfillment or at delivery.", "An order may be cancelled if age, identity, or delivery eligibility cannot be verified."] },
      { heading: "Nicotine warning", paragraphs: ["Nicotine is an addictive chemical. Products containing nicotine are not intended for non-users, pregnant or breastfeeding people, or anyone with a condition for which a clinician advises avoiding nicotine. This store does not provide medical advice."] },
      { heading: "Safe storage and disposal", paragraphs: ["Keep every device, battery, e-liquid, charcoal product, and accessory away from children and pets. Avoid skin or eye contact with e-liquid. Follow local requirements for battery, electronic, charcoal, and nicotine-product disposal."] },
      { heading: "Local restrictions", paragraphs: ["Product, flavor, nicotine, and delivery rules vary. We may restrict catalog visibility, cancel items, or decline shipment where a product is prohibited. You remain responsible for knowing and following the law where you place and receive an order."] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description: "How Ember & Halo collects, uses, shares, and protects information across the storefront.",
    sections: [
      { heading: "Information we collect", paragraphs: ["We collect information you provide when you browse, contact us, create an account, or place an order. Depending on the features you use, this can include contact details, delivery and billing details, order history, support messages, age-verification results, and account preferences."], bullets: ["Device and usage data such as browser type, pages viewed, approximate location, and referring URL.", "Cart and checkout information required to maintain a session and complete an order.", "Wishlist selections stored locally in your browser unless account sync is enabled.", "Fraud, security, and compliance signals supplied by service providers."] },
      { heading: "How we use information", paragraphs: ["We use information to provide and improve the store, process and deliver orders, communicate about purchases, respond to requests, prevent abuse, meet legal duties, and—where permitted or with consent—send marketing you can opt out of."], bullets: ["To verify eligibility for age-restricted products.", "To calculate shipping, taxes, availability, and regional restrictions.", "To diagnose errors and understand storefront performance.", "To enforce our terms and protect customers, Ember & Halo, and our partners."] },
      { heading: "When information is shared", paragraphs: ["We share only what is reasonably necessary with vendors that help operate the store, including commerce hosting, payment, fraud prevention, age verification, analytics, customer support, warehouses, and carriers. We may also disclose information to comply with law, protect rights and safety, or complete a business transaction. We do not sell personal information for money."], bullets: ["Payment data is processed by the selected payment provider and is not intended to be stored in full by Ember & Halo.", "Carriers receive delivery details and may independently verify an adult recipient.", "Providers are expected to use data under contractual and legal safeguards."] },
      { heading: "Retention and security", paragraphs: ["We retain information for as long as reasonably needed for orders, support, accounting, fraud prevention, legal obligations, and dispute resolution. We use administrative, technical, and physical safeguards appropriate to the information, but no online system can be guaranteed completely secure."] },
      { heading: "Your choices and rights", paragraphs: ["You may unsubscribe from marketing through any message. Browser controls can limit cookies or clear locally stored wishlist and session data. Depending on your location, you may have rights to access, correct, delete, restrict, or receive a copy of certain personal information, or appeal a privacy decision."], bullets: ["Submit a request to privacy@emberandhalo.com and describe the right you wish to exercise.", "We may need to verify identity before responding.", "Authorized agents may be required to provide proof of authority."] },
      { heading: "Children, changes, and contact", paragraphs: ["The store is not directed to minors and we do not knowingly collect personal information from them. We may update this policy as the store, providers, or law changes. Material revisions will be identified by the effective date. Questions can be sent to privacy@emberandhalo.com."] },
    ],
  },
  returns: {
    title: "Returns & Refunds",
    description: "A practical return policy that protects product safety while treating every order fairly.",
    sections: [
      { heading: "30-day return window", paragraphs: ["Contact care@emberandhalo.com within 30 days of recorded delivery to request a return authorization. Eligible merchandise must be unused, unopened, undamaged, in resalable condition, and include original seals, packaging, accessories, serial labels, and proof of purchase. Do not send a product before authorization."] },
      { heading: "Items that cannot be returned", paragraphs: ["For health, safety, and regulatory reasons, some products are final sale once shipped or opened."], bullets: ["E-liquids, nicotine salts, hookah tobacco, herbal flavors, and other ingestible or consumable goods.", "Opened coils, pods, tanks, mouthpieces, hoses, bowls, and heat-management products.", "Used devices, batteries, chargers, or personal-care contact items.", "Gift cards, clearance/final-sale items, and products marked non-returnable.", "Items damaged by misuse, modification, improper charging, normal wear, or failure to follow instructions."] },
      { heading: "Damaged, defective, or incorrect orders", paragraphs: ["Report visible transit damage, shortages, or incorrect items within 72 hours of delivery. Include the order number and clear photos of the shipping label, outer package, internal packaging, and product. Keep all materials until the claim is resolved. Manufacturer defects may be handled under the brand’s warranty process."], bullets: ["Do not use a leaking, swollen, overheating, or visibly damaged product.", "A replacement, store credit, refund, or warranty referral may be offered after review.", "Minor packaging variation that does not affect safety or function is not necessarily a defect."] },
      { heading: "Return shipping", paragraphs: ["Customers are responsible for return shipping for preference-based returns. If we confirm that an item was sent incorrectly or arrived defective, we will provide appropriate return instructions or a label. Original expedited shipping charges are not refundable unless required by law or the return resulted from our error."] },
      { heading: "Inspection and refunds", paragraphs: ["Authorized returns are inspected after arrival. Approved refunds are sent to the original payment method, usually within 5–10 business days after inspection; financial institutions may take additional time to post the credit. Shipping, adult-signature, and verification fees may be deducted when they are not refundable."], bullets: ["Returns received used, incomplete, damaged, or outside the authorization may be declined or subject to a restocking deduction where lawful.", "If the original payment method is unavailable, we may issue store credit where permitted.", "Refunds cannot be released before a required carrier or fraud review is completed."] },
    ],
  },
  refunds: {
    title: "Returns & Refunds",
    description: "A practical return policy that protects product safety while treating every order fairly.",
    sections: [],
  },
  shipping: {
    title: "Shipping Policy",
    description: "Where we ship, how orders move, and what to expect from age-restricted delivery.",
    sections: [
      { heading: "Processing", paragraphs: ["In-stock orders are usually prepared in one to two business days, excluding holidays and exceptional volume. Orders placed after the daily cutoff begin processing the next business day. An order confirmation is not a guarantee of shipment; inventory, payment, age, fraud, and address reviews may occur first."] },
      { heading: "Rates and delivery estimates", paragraphs: ["Available services, charges, and estimated transit times are displayed at checkout from the destination and cart contents. Estimates begin after carrier acceptance and are not guaranteed. Weather, regulatory screening, peak periods, and carrier disruptions may cause delay."], bullets: ["Expedited service changes transit time, not order-processing time.", "A carrier may require an adult signature and government-issued photo identification.", "We cannot request that an age-restricted package be left unattended."] },
      { heading: "Restrictions", paragraphs: ["We ship only where the selected products and delivery method are lawful and serviceable. Certain states, provinces, cities, territories, PO boxes, military addresses, and forwarding services may be excluded. We may remove a restricted item or cancel and refund an ineligible order."] },
      { heading: "Tracking and delivery", paragraphs: ["Tracking is sent to the checkout email when a label is created; movement may take up to one business day to appear. Make sure the delivery address is complete and secure. Ownership and risk transfer as allowed by applicable law, but we will help investigate documented carrier issues."], bullets: ["Contact us promptly if tracking shows delivered but the parcel is missing.", "Check household members, parcel rooms, and the carrier before opening a claim.", "Carrier claims can require a waiting period, identity verification, photographs, or a signed statement."] },
      { heading: "Address changes, refusals, and returns", paragraphs: ["Contact us immediately to request an address correction. We cannot guarantee changes after packing and carriers may prohibit redirection of age-restricted parcels. Shipping and return-to-sender fees may be deducted from a refund when an order is refused, unclaimed, undeliverable because of an incorrect address, or cannot be released to an eligible adult."] },
      { heading: "International duties", paragraphs: ["Where international shipping is offered, the recipient is responsible for import eligibility, duties, taxes, brokerage, and local compliance unless checkout states otherwise. Orders rejected by customs may not qualify for reimbursement of shipping, duties, or restricted products."] },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    description: "The ground rules for browsing, ordering, and using the Ember & Halo storefront.",
    sections: [
      { heading: "Acceptance and eligibility", paragraphs: ["By accessing or using this store, you agree to these Terms, the Privacy Policy, Age Policy, Shipping Policy, and Returns & Refunds Policy. You must meet the legal smoking age where you live and use the store only for lawful personal purposes. If you do not agree, do not use the store."] },
      { heading: "Accounts and information", paragraphs: ["You are responsible for accurate account, age, billing, delivery, and contact information and for keeping credentials confidential. Notify us of unauthorized activity. We may suspend access or require additional verification to protect the store, comply with law, or investigate misuse."] },
      { heading: "Products and orders", paragraphs: ["Product appearance, packaging, specifications, and availability may change. We work to present descriptions and prices accurately, but errors can occur. Placing an order is an offer to buy; acceptance occurs only when we confirm fulfillment or shipment."], bullets: ["We may limit quantities, reject orders, remove restricted items, or cancel for pricing, inventory, verification, fraud, payment, delivery, or legal reasons.", "If an order is cancelled after payment authorization, the authorization will be voided or refunded as appropriate.", "You are responsible for determining product compatibility and lawful possession and use."] },
      { heading: "Responsible product use", paragraphs: ["Follow manufacturer instructions, warnings, charging limits, and storage requirements. Do not modify devices or use damaged batteries, incompatible chargers, or unsuitable components. Nicotine is addictive. Products are not smoking-cessation or medical devices unless expressly approved and identified as such."] },
      { heading: "Content and intellectual property", paragraphs: ["Store text, photography, graphics, branding, and software are owned by Ember & Halo or licensed to us and are protected by applicable law. You may use the store for personal shopping but may not scrape, copy, resell, reverse engineer, or commercially exploit content without written permission."] },
      { heading: "Reviews and submissions", paragraphs: ["If you submit a review, photo, suggestion, or other content, you confirm that it is lawful, accurate to your experience, and does not violate another person’s rights. You grant us a non-exclusive, worldwide, royalty-free license to display and adapt the submission in connection with the store, subject to applicable privacy law."] },
      { heading: "Disclaimers and liability", paragraphs: ["To the fullest extent permitted by law, the store and content are provided without warranties beyond those that cannot legally be excluded. We are not liable for indirect, incidental, special, or consequential loss arising from use of the store or products. Nothing in these Terms limits rights or liability that applicable law does not allow us to limit."] },
      { heading: "Changes, governing terms, and contact", paragraphs: ["We may update the store or these Terms prospectively. The version posted when you use the store applies to that use. Applicable governing law and dispute terms depend on the operating entity and customer location and do not override mandatory consumer protections. Questions may be sent to legal@emberandhalo.com."] },
    ],
  },
};

policies.refunds.sections = policies.returns.sections;

type PolicyRouteProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: PolicyRouteProps): Promise<Metadata> {
  const { handle } = await params;
  const policy = policies[handle];

  if (!policy) {
    return { title: "Policy not found — Ember & Halo" };
  }

  return {
    title: `${policy.title} — Ember & Halo`,
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
    <>
      <InfoPage description={policy.description} eyebrow="Policy archive / 2026" title={policy.title}>
        <div className="mb-10 flex flex-col gap-3 border-b border-border pb-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono uppercase tracking-[0.16em] text-primary">Effective July 29, 2026</span>
          <span>Questions: legal@emberandhalo.com</span>
        </div>
        <div className="space-y-12">
          {policy.sections.map((section, index) => (
            <section className="grid gap-4 md:grid-cols-[3rem_1fr]" key={section.heading}>
              <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.035em]">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {section.bullets ? (
                    <ul className="space-y-3 border-l border-primary/40 pl-5">
                      {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                    </ul>
                  ) : null}
                </div>
              </div>
            </section>
          ))}
        </div>
        <div className="mt-12 border border-border bg-surface p-5 text-xs leading-6 text-muted-foreground">
          This policy is presented for the Ember &amp; Halo demonstration storefront. The operating merchant should review and adapt it with qualified counsel for its products, locations, providers, and applicable law before launch.
        </div>
      </InfoPage>
    </>
  );
}
