import type {
  Collection,
  FooterGroup,
  NavItem,
  Stat,
  Testimonial,
  TrustMetric,
} from "@/types/site";

export const brand = {
  name: "DaVinci",
  logo: "DA\u00b7VINCI",
  href: "/",
};

export const navItems: NavItem[] = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Shop all", href: "/collections" },
];

export const announcementMessages = [
  "Free discreet shipping on orders over $100",
  "10-year warranty on every device",
  "New: Atrium Desktop \u2014 now shipping",
  "Precision temperature control \u00b7 Ceramic airpath",
];

const portableImage = "/assets/product-portable-CFKnmSQP.jpg";
const desktopImage = "/assets/product-desktop-DdNf9Un2.jpg";
const accessoriesImage = "/assets/product-accessories-BrKIPgD4.jpg";

export const hero = {
  eyebrow: "The new IQ-C \u00b7 Series 02",
  title: "Engineered for",
  accent: "the exact moment.",
  body: "A precision instrument for people who notice the difference. Clean ceramic, exact temperature, and nothing between you and the experience.",
  image: "/assets/hero-campaign-v2.png",
};

export const trustMetrics: TrustMetric[] = [
  { icon: "thermometer", title: "1\u00b0 Precision", body: "130 \u2013 220\u00b0C" },
  { icon: "zap", title: "Ceramic Airpath", body: "Pure vapor, zero metal" },
  { icon: "shield-check", title: "10-Year Warranty", body: "Repaired, not replaced" },
  { icon: "truck", title: "Discreet Shipping", body: "Free over $100" },
];

export const collections: Collection[] = [
  {
    handle: "portable",
    name: "Portable Vaporizers",
    tagline: "Precision, pocketed.",
    description:
      "Session-ready devices engineered for pure vapor, discreet form factors, and all-day battery life.",
    image: portableImage,
  },
  {
    handle: "desktop",
    name: "Desktop Vaporizers",
    tagline: "Hi-fi for your extract.",
    description:
      "Reference-grade stationary units with medical-grade convection and analog-perfect temperature control.",
    image: desktopImage,
  },
  {
    handle: "accessories",
    name: "Accessories",
    tagline: "Every last detail.",
    description:
      "Grinders, mouthpieces, cleaning kits, and replacement parts machined to the same tolerances as our devices.",
    image: accessoriesImage,
  },
];

export const craftStats: Stat[] = [
  { value: "12yr", label: "of designing hardware" },
  { value: "0", label: "metal in the airpath" },
  { value: "10yr", label: "on every device" },
];

export const craft = {
  image: "/assets/story-macro-C-SsUhyi.jpg",
  eyebrow: "The craft",
  title: "We machine to a tenth of a millimeter, then check twice.",
  body: "Every DaVinci chamber begins as a solid block of zirconia ceramic. Every heater is hand-wound. Every device is bench-tested against a reference spectrum before it leaves our Portland facility. When something wears out, we send you the part \u2014 not a replacement device.",
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "The cleanest vapor I've had in ten years of trying every device on the market. Full stop.",
    author: "Marcus J.",
    product: "IQ-C",
  },
  {
    quote: "Feels like a piece of pro audio gear. The dial alone is worth the money.",
    author: "Sadie R.",
    product: "Atrium Desktop",
  },
  {
    quote: "Broke a mouthpiece after three years. They sent a new one in the mail, free.",
    author: "Chen L.",
    product: "MIQRO-C",
  },
];

export const footerGroups: FooterGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Collections", href: "/collections" },
      { label: "All products", href: "/products" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/policies/shipping" },
      { label: "Returns", href: "/policies/returns" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Account", href: "/account" },
      { label: "Search", href: "/search" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Checkout", href: "/checkout" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/policies/privacy" },
      { label: "Terms", href: "/policies/terms" },
      { label: "Accessibility", href: "/policies/accessibility" },
      { label: "Age policy", href: "/policies/age" },
    ],
  },
];

export const paymentLabels = ["VISA", "MC", "AMEX", "PAYPAL"];

export function getCollection(handle: string) {
  return collections.find((collection) => collection.handle === handle);
}
