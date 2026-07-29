export type IconName =
  | "arrow-up-down"
  | "arrow-right"
  | "arrow-up-right"
  | "check"
  | "chevron-down"
  | "heart"
  | "instagram"
  | "lock"
  | "mail"
  | "map-pin"
  | "menu"
  | "package"
  | "minus"
  | "plus"
  | "rotate-ccw"
  | "search"
  | "shield-check"
  | "sliders-horizontal"
  | "shopping-bag"
  | "star"
  | "thermometer"
  | "truck"
  | "twitter"
  | "user"
  | "x"
  | "youtube"
  | "zap";

export type NavItem = {
  label: string;
  href: string;
};

export type TrustMetric = {
  icon: IconName;
  title: string;
  body: string;
};

export type Collection = {
  id?: string;
  handle: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  productCount?: number;
};

export type Category = {
  id: string;
  handle: string;
  name: string;
  description: string;
  image: string;
  parentId?: string | null;
  productCount?: number;
};

export type ProductVariant = {
  id: string;
  name: string;
  color: string;
  price: number;
  priceDisplay: string;
  inStock: boolean;
  options: ProductVariantOption[];
  flavor?: string;
  nicotineStrength?: string;
};

export type ProductVariantOption = {
  name: string;
  value: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductFeature = {
  title: string;
  body: string;
};

export type ProductReview = {
  author: string;
  title: string;
  body: string;
};

export type ProductStatusFlag = "featured" | "bestseller" | "new" | "sale";

export type Product = {
  id: string;
  handle: string;
  name: string;
  brand: string;
  subtitle: string;
  createdAt?: string;
  price: number;
  priceDisplay: string;
  compareAt?: number;
  compareAtDisplay?: string;
  currencyCode: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  badge?: string;
  collections: string[];
  collectionNames: string[];
  collectionIds: string[];
  categoryIds: string[];
  categoryNames: string[];
  flavors: string[];
  nicotineStrengths: string[];
  statusFlags: ProductStatusFlag[];
  variants: ProductVariant[];
  optionLabel: string;
  shortDescription: string;
  description: string;
  specs: ProductSpec[];
  features: ProductFeature[];
  inBox: string[];
  reviews: ProductReview[];
  tags: string[];
};

export type Stat = {
  value: string;
  label: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  product: string;
};

export type FooterGroup = {
  title: string;
  links: NavItem[];
};
