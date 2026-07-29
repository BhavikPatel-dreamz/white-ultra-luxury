import type {
  Collection,
  FooterGroup,
  NavItem,
  Product,
  Stat,
  Testimonial,
  TrustMetric,
} from "@/types/site";

export const brand = {
  name: "Ember & Halo",
  logo: "EMBER & HALO",
  href: "/",
  monogram: "E&H",
};

export const megaMenuGroups = [
  {
    title: "Vape",
    links: [
      { label: "Disposable vapes", href: "/categories/disposable-vapes" },
      { label: "Vape kits", href: "/categories/vape-kits" },
      { label: "Pod systems", href: "/categories/pod-systems" },
      { label: "Tanks", href: "/categories/tanks" },
    ],
  },
  {
    title: "Flavor",
    links: [
      { label: "E-liquids", href: "/categories/e-liquids" },
      { label: "Nicotine salts", href: "/categories/nicotine-salts" },
      { label: "Hookah flavors", href: "/categories/hookah-flavors" },
      { label: "Zero nicotine", href: "/search?q=zero+nicotine" },
    ],
  },
  {
    title: "Hookah",
    links: [
      { label: "Hookahs", href: "/categories/hookahs" },
      { label: "Bowls", href: "/categories/hookah-bowls" },
      { label: "Charcoal", href: "/categories/charcoal" },
      { label: "Accessories", href: "/categories/accessories" },
    ],
  },
  {
    title: "Rebuild",
    links: [
      { label: "Coils", href: "/categories/coils" },
      { label: "Pods", href: "/categories/pods" },
      { label: "Replacement glass", href: "/search?q=replacement+glass" },
      { label: "Tools & care", href: "/search?q=tools+care" },
    ],
  },
];

export const announcementMessages = [
  "Complimentary discreet shipping on orders $75+",
  "Fresh drop: Night Shift devices have landed",
  "Bundle any device + flavor and save 15%",
  "Adult signature delivery available nationwide",
];

export type HomeCategory = {
  handle: string;
  name: string;
  kicker: string;
  image: string;
  accent: "lime" | "violet" | "coral" | "cream";
};

export const homeCategories: HomeCategory[] = [
  {
    handle: "disposable-vapes",
    name: "Disposable vapes",
    kicker: "Pocket-ready",
    image: "/ember-halo/category-disposables.png",
    accent: "lime",
  },
  {
    handle: "vape-kits",
    name: "Vape kits",
    kicker: "Built to keep",
    image: "/ember-halo/category-vape-kits.png",
    accent: "violet",
  },
  {
    handle: "pod-systems",
    name: "Pod systems",
    kicker: "Small format",
    image: "/ember-halo/category-pod-systems.png",
    accent: "coral",
  },
  {
    handle: "e-liquids",
    name: "E-liquids",
    kicker: "Full spectrum",
    image: "/ember-halo/category-e-liquids.png",
    accent: "cream",
  },
  {
    handle: "nicotine-salts",
    name: "Nicotine salts",
    kicker: "Smooth draw",
    image: "/ember-halo/category-nic-salts.png",
    accent: "violet",
  },
  {
    handle: "coils",
    name: "Coils",
    kicker: "Fresh performance",
    image: "/ember-halo/category-coils.png",
    accent: "lime",
  },
  {
    handle: "pods",
    name: "Pods",
    kicker: "Swap & go",
    image: "/ember-halo/category-pods.png",
    accent: "coral",
  },
  {
    handle: "tanks",
    name: "Tanks",
    kicker: "Cloud architecture",
    image: "/ember-halo/category-tanks.png",
    accent: "cream",
  },
  {
    handle: "hookahs",
    name: "Hookahs",
    kicker: "The centrepiece",
    image: "/ember-halo/category-hookahs.png",
    accent: "lime",
  },
  {
    handle: "hookah-bowls",
    name: "Hookah bowls",
    kicker: "Heat, perfected",
    image: "/ember-halo/category-hookah-bowls.png",
    accent: "violet",
  },
  {
    handle: "charcoal",
    name: "Charcoal",
    kicker: "Clean-burning",
    image: "/ember-halo/category-charcoal.png",
    accent: "coral",
  },
  {
    handle: "hookah-flavors",
    name: "Hookah flavors",
    kicker: "Mix the mood",
    image: "/ember-halo/category-hookah-flavors.png",
    accent: "cream",
  },
  {
    handle: "accessories",
    name: "Accessories",
    kicker: "Finish the ritual",
    image: "/ember-halo/category-accessories.png",
    accent: "lime",
  },
];

export const collections: Collection[] = [
  {
    handle: "after-hours",
    name: "Night Shift",
    tagline: "Low light. High output.",
    description: "Statement devices and after-dark hardware selected for long sessions.",
    image: "/ember-halo/collection-night-shift.png",
  },
  {
    handle: "flavor-studio",
    name: "Flavor Lab",
    tagline: "Notes worth chasing.",
    description: "Fruit, ice, cream and botanical profiles, arranged like a tasting menu.",
    image: "/ember-halo/collection-flavor-lab.png",
  },
  {
    handle: "hookah-rituals",
    name: "Hookah Ritual",
    tagline: "Make a night of it.",
    description: "Modern hookahs, artisan bowls and the clean-burning essentials around them.",
    image: "/ember-halo/collection-hookah-ritual.png",
  },
  {
    handle: "the-essentials-edit",
    name: "The Pocket Edit",
    tagline: "Carry less. Expect more.",
    description: "Compact pod systems and disposables chosen for effortless everyday use.",
    image: "/ember-halo/collection-pocket-edit.png",
  },
];

export const popularBrands = [
  "VOOPOO",
  "GEEKVAPE",
  "ELFBAR",
  "LOST MARY",
  "VAPORESSO",
  "AL FAKHER",
  "KHALIL MAMOON",
  "NAKHLA",
];

export const setupSteps = [
  {
    number: "01",
    title: "Choose your pace",
    body: "Quick draws, all-day carry, or a slow table ritual — begin with how you actually use it.",
  },
  {
    number: "02",
    title: "Find your profile",
    body: "Bright fruit, clean ice, deep dessert or classic leaf. We map flavor without the guesswork.",
  },
  {
    number: "03",
    title: "Dial the strength",
    body: "Filter by nicotine level and compatibility, then add only the parts your setup needs.",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: "Feels less like a vape shop and more like a very well-edited record store. I found my setup in five minutes.",
    author: "Maya R.",
    product: "Arc Mini Pro Kit",
  },
  {
    quote: "My hookah arrived beautifully packed, completely discreet, and two days earlier than expected.",
    author: "Omar K.",
    product: "Nocturne Hookah",
  },
  {
    quote: "The flavor notes are actually useful. Velvet Mint is exactly as smooth and restrained as described.",
    author: "Jules T.",
    product: "Flavor Lab member",
  },
];

export const footerGroups: FooterGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/products" },
      { label: "New arrivals", href: "/products?sort=newest" },
      { label: "Categories", href: "/categories" },
      { label: "Collections", href: "/collections" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Shipping policy", href: "/policies/shipping" },
      { label: "Returns & refunds", href: "/policies/returns" },
    ],
  },
  {
    title: "Ember & Halo",
    links: [
      { label: "About us", href: "/about" },
      { label: "My account", href: "/account" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Track an order", href: "/account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/policies/privacy" },
      { label: "Terms & conditions", href: "/policies/terms" },
      { label: "Accessibility", href: "/policies/accessibility" },
      { label: "Age policy", href: "/policies/age" },
    ],
  },
];

export const paymentLabels = ["VISA", "MC", "AMEX", "PAYPAL"];

export const trustMetrics: TrustMetric[] = [
  { icon: "shield-check", title: "Age verified", body: "Responsible retail" },
  { icon: "truck", title: "Discreet delivery", body: "Free over $75" },
  { icon: "rotate-ccw", title: "Easy returns", body: "30-day support" },
  { icon: "zap", title: "Fresh inventory", body: "Weekly drops" },
];

export const hero = {
  eyebrow: "Objects for the after hours",
  title: "Make the night",
  accent: "your ritual.",
  body: "Premium vape, hookah and flavor — independently selected for better sessions and beautifully discreet delivery.",
  image: "/ember-halo/hero-night-ritual.png",
};

export const craftStats: Stat[] = [
  { value: "150+", label: "curated essentials" },
  { value: "48hr", label: "dispatch window" },
  { value: "21+", label: "verified community" },
];

export const craft = {
  image: "/ember-halo/collection-hookah-ritual.png",
  eyebrow: "The Ember edit",
  title: "Less noise. Better nights.",
  body: "We test for build, draw and flavor before anything reaches the edit. The result is a focused collection of modern devices, considered hookahs and essentials that work together.",
};

type DemoProductInput = {
  handle: string;
  name: string;
  subtitle: string;
  brandName: string;
  categoryName: string;
  image: string;
  price: number;
  flavors?: string[];
  nicotineStrengths?: string[];
  badge?: string;
  flags?: Product["statusFlags"];
  compareAt?: number;
  createdAt?: string;
};

function getDemoGalleryImage(categoryName: string) {
  if (["E-liquids", "Nicotine salts", "Hookah flavors"].includes(categoryName)) {
    return "/ember-halo/collection-flavor-lab.png";
  }

  if (["Hookahs", "Hookah bowls", "Charcoal"].includes(categoryName)) {
    return "/ember-halo/collection-hookah-ritual.png";
  }

  if (["Disposable vapes", "Pod systems", "Vape kits"].includes(categoryName)) {
    return "/ember-halo/collection-pocket-edit.png";
  }

  return "/ember-halo/collection-night-shift.png";
}

function demoProduct({
  badge,
  brandName,
  categoryName,
  compareAt,
  createdAt = "2026-07-01T00:00:00.000Z",
  flags = [],
  flavors = [],
  handle,
  image,
  name,
  nicotineStrengths = [],
  price,
  subtitle,
}: DemoProductInput): Product {
  const money = (value: number) => `$${value.toFixed(2)}`;
  const variantSelections: Array<{
    flavor?: string;
    nicotineStrength?: string;
  }> = [];

  if (flavors.length > 0) {
    for (const flavor of flavors) {
      if (nicotineStrengths.length > 0) {
        for (const nicotineStrength of nicotineStrengths) {
          variantSelections.push({ flavor, nicotineStrength });
        }
      } else {
        variantSelections.push({ flavor });
      }
    }
  } else if (nicotineStrengths.length > 0) {
    for (const nicotineStrength of nicotineStrengths) {
      variantSelections.push({ nicotineStrength });
    }
  } else {
    variantSelections.push({});
  }

  const variants = variantSelections.map((selection, index) => {
    const optionValues = [selection.flavor, selection.nicotineStrength].filter(
      (value): value is string => Boolean(value),
    );
    const variantName = optionValues.join(" · ") || "Standard";
    const options = [
      ...(selection.flavor
        ? [{ name: "Flavor", value: selection.flavor }]
        : []),
      ...(selection.nicotineStrength
        ? [{ name: "Nicotine strength", value: selection.nicotineStrength }]
        : []),
      ...(!optionValues.length
        ? [{ name: "Style", value: "Standard" }]
        : []),
    ];

    return {
      id: `demo-${handle}-variant-${index + 1}`,
      name: variantName,
      color: index % 2 === 0 ? "#cbff47" : "#8e6bff",
      price,
      priceDisplay: money(price),
      inStock: true,
      options,
      flavor: selection.flavor,
      nicotineStrength: selection.nicotineStrength,
    };
  });

  return {
    id: `demo-${handle}`,
    handle,
    name,
    brand: brandName,
    subtitle,
    createdAt,
    price,
    priceDisplay: money(price),
    compareAt,
    compareAtDisplay: compareAt ? money(compareAt) : undefined,
    currencyCode: "usd",
    images: [image, getDemoGalleryImage(categoryName)],
    rating: 4.8,
    reviewCount: 24,
    badge,
    collections: [brandName.toLowerCase().replaceAll(" ", "-")],
    collectionNames: [brandName],
    collectionIds: [],
    categoryIds: [],
    categoryNames: [categoryName],
    flavors,
    nicotineStrengths,
    statusFlags: flags,
    variants,
    optionLabel: flavors.length ? "Flavor" : nicotineStrengths.length ? "Strength" : "Style",
    shortDescription: subtitle,
    description: `${name} is part of the Ember & Halo curated edit for adults of legal age.`,
    specs: [
      { label: "Category", value: categoryName },
      { label: "Availability", value: "In stock" },
    ],
    features: [
      { title: "Curated", body: "Selected for build, draw and everyday usability." },
    ],
    inBox: [name],
    reviews: [],
    tags: flags,
  };
}

export const fallbackProducts: Product[] = [
  demoProduct({ handle: "pulse-x-25k", name: "Pulse X 25K", subtitle: "Frozen white peach · 5%", brandName: "NOVA", categoryName: "Disposable vapes", image: "/ember-halo/category-disposables.png", price: 24.99, flavors: ["Frozen White Peach", "Blue Razz Ice", "Strawberry Kiwi"], nicotineStrengths: ["0mg", "20mg", "50mg"], badge: "Trending", flags: ["featured", "bestseller"] }),
  demoProduct({ handle: "arc-mini-pro", name: "Arc Mini Pro Kit", subtitle: "80W · ultraviolet", brandName: "ARC", categoryName: "Vape kits", image: "/ember-halo/category-vape-kits.png", price: 69, badge: "Editor's pick", flags: ["featured"] }),
  demoProduct({ handle: "halo-node-s", name: "Halo Node S", subtitle: "Variable airflow pod system", brandName: "HALO LABS", categoryName: "Pod systems", image: "/ember-halo/category-pod-systems.png", price: 39.5, badge: "New", flags: ["new"], createdAt: "2026-07-25T00:00:00.000Z" }),
  demoProduct({ handle: "prism-berry-100", name: "Prism Berry 100", subtitle: "Blackcurrant · yuzu · ice", brandName: "FLAVOR THEORY", categoryName: "E-liquids", image: "/ember-halo/category-e-liquids.png", price: 21, flavors: ["Blackcurrant Yuzu Ice", "White Grape Aloe", "Mango Bergamot"], nicotineStrengths: ["0mg", "3mg", "6mg"], flags: ["bestseller"] }),
  demoProduct({ handle: "salt-theory-no-07", name: "Salt Theory No. 07", subtitle: "Lychee tea · 30mg", brandName: "SALT THEORY", categoryName: "Nicotine salts", image: "/ember-halo/category-nic-salts.png", price: 18.5, flavors: ["Lychee Tea", "Peach Oolong", "Cucumber Mint"], nicotineStrengths: ["20mg", "30mg", "50mg"], badge: "Bestseller", flags: ["bestseller"] }),
  demoProduct({ handle: "flux-mesh-p5", name: "Flux Mesh P5", subtitle: "0.2Ω · pack of five", brandName: "FLUX", categoryName: "Coils", image: "/ember-halo/category-coils.png", price: 14, flags: ["featured"] }),
  demoProduct({ handle: "airlock-pods", name: "Airlock Pods", subtitle: "2ml · pack of three", brandName: "AIRLOCK", categoryName: "Pods", image: "/ember-halo/category-pods.png", price: 12, badge: "New", flags: ["new"], createdAt: "2026-07-22T00:00:00.000Z" }),
  demoProduct({ handle: "obsidian-tank", name: "Obsidian Tank", subtitle: "5ml · top airflow", brandName: "OBSIDIAN", categoryName: "Tanks", image: "/ember-halo/category-tanks.png", price: 36, flags: ["featured"] }),
  demoProduct({ handle: "nocturne-hookah", name: "Nocturne Hookah", subtitle: "Smoked glass · 62cm", brandName: "NOCTURNE", categoryName: "Hookahs", image: "/ember-halo/category-hookahs.png", price: 189, badge: "Icon", flags: ["bestseller"], compareAt: 219 }),
  demoProduct({ handle: "orbit-phunnel", name: "Orbit Phunnel Bowl", subtitle: "Hand-thrown stoneware", brandName: "ORBIT", categoryName: "Hookah bowls", image: "/ember-halo/category-hookah-bowls.png", price: 32, badge: "New", flags: ["new"], createdAt: "2026-07-26T00:00:00.000Z" }),
  demoProduct({ handle: "ember-cubes", name: "Ember Cubes", subtitle: "Coconut charcoal · 72pc", brandName: "EMBERWORKS", categoryName: "Charcoal", image: "/ember-halo/category-charcoal.png", price: 13, flags: ["bestseller"] }),
  demoProduct({ handle: "velvet-mint", name: "Velvet Mint", subtitle: "Mint leaf · vanilla · 250g", brandName: "MAISON 27", categoryName: "Hookah flavors", image: "/ember-halo/category-hookah-flavors.png", price: 19, flavors: ["Velvet Mint", "Lemon Cardamom", "Blueberry Earl Grey"], badge: "New", flags: ["new"], createdAt: "2026-07-27T00:00:00.000Z" }),
  demoProduct({ handle: "ritual-tool-roll", name: "Ritual Tool Roll", subtitle: "Six-piece session kit", brandName: "EMBER & HALO", categoryName: "Accessories", image: "/ember-halo/category-accessories.png", price: 28, flags: ["featured"] }),
];

export function getCollection(handle: string) {
  return collections.find((collection) => collection.handle === handle);
}
