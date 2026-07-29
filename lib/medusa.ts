import type { HttpTypes } from "@medusajs/types";
import { cache } from "react";
import type {
  Category,
  Collection,
  Product,
  ProductFeature,
  ProductReview,
  ProductSpec,
  ProductStatusFlag,
  ProductVariant,
} from "@/types/site";
import { sdk } from "@/api/api";
import {
  deriveCatalogCategoryNames,
  getCatalogCategoryByHandle,
  mergeCatalogCategories,
  mergeCatalogCollections,
  normalizeCatalogText,
} from "@/lib/catalog-presentation";
import { fallbackProducts } from "@/lib/data";
import { formatMoney } from "@/lib/format";

const CATEGORY_FALLBACK_IMAGES = [
  { keywords: ["disposable", "puff", "bar"], image: "/ember-halo/category-disposables.png" },
  { keywords: ["vape kit", "starter", "mod"], image: "/ember-halo/category-vape-kits.png" },
  { keywords: ["pod system"], image: "/ember-halo/category-pod-systems.png" },
  { keywords: ["e-liquid", "eliquid", "juice", "freebase"], image: "/ember-halo/category-e-liquids.png" },
  { keywords: ["nicotine salt", "nic salt"], image: "/ember-halo/category-nic-salts.png" },
  { keywords: ["coil", "mesh head"], image: "/ember-halo/category-coils.png" },
  { keywords: ["replacement pod", "cartridge", "pods"], image: "/ember-halo/category-pods.png" },
  { keywords: ["tank", "atomizer", "rta"], image: "/ember-halo/category-tanks.png" },
  { keywords: ["hookah bowl", "phunnel"], image: "/ember-halo/category-hookah-bowls.png" },
  { keywords: ["hookah flavor", "shisha flavor", "molasses"], image: "/ember-halo/category-hookah-flavors.png" },
  { keywords: ["hookah", "shisha pipe"], image: "/ember-halo/category-hookahs.png" },
  { keywords: ["charcoal", "coal", "coconut cube"], image: "/ember-halo/category-charcoal.png" },
  { keywords: ["accessory", "charger", "tool", "case"], image: "/ember-halo/category-accessories.png" },
] as const;

const COLLECTION_FALLBACK_IMAGES = [
  "/ember-halo/collection-night-shift.png",
  "/ember-halo/collection-flavor-lab.png",
  "/ember-halo/collection-hookah-ritual.png",
  "/ember-halo/collection-pocket-edit.png",
] as const;

function getCategoryFallbackImage(values: string[], seed: string) {
  const searchable = normalizeCatalogText(values.join(" "));
  const matched = CATEGORY_FALLBACK_IMAGES.find((candidate) =>
    candidate.keywords.some((keyword) => searchable.includes(normalizeCatalogText(keyword))),
  );

  return (
    matched?.image ??
    CATEGORY_FALLBACK_IMAGES[stableNumber(seed) % CATEGORY_FALLBACK_IMAGES.length].image
  );
}

function getCollectionFallbackImage(seed: string) {
  return COLLECTION_FALLBACK_IMAGES[stableNumber(seed) % COLLECTION_FALLBACK_IMAGES.length];
}
const DEFAULT_LIMIT = 12;
const TAXONOMY_PAGE_SIZE = 100;
const LIVE_CATALOG_ENABLED =
  process.env.NEXT_PUBLIC_EMBER_HALO_LIVE_CATALOG !== "false";

const PRODUCT_FIELDS = [
  "*variants.calculated_price",
  "id",
  "title",
  "handle",
  "subtitle",
  "description",
  "created_at",
  "thumbnail",
  "material",
  "width",
  "height",
  "length",
  "weight",
  "collection_id",
  "type_id",
  "*type",
  "*variants",
  "*variants.options",
  "*options",
  "+variants.inventory_quantity",
  "*images",
  "*collection",
  "*categories",
  "*tags",
].join(",");

const CART_FIELDS = [
  "id",
  "email",
  "region_id",
  "currency_code",
  "total",
  "subtotal",
  "item_total",
  "shipping_total",
  "tax_total",
  "*shipping_address",
  "*billing_address",
  "*items",
  "*items.product",
  "*items.variant",
  "*region",
  "*region.countries",
  "*shipping_methods",
  "*payment_collection",
  "*payment_collection.payment_sessions",
].join(",");

const ORDER_FIELDS = [
  "id",
  "display_id",
  "email",
  "currency_code",
  "total",
  "subtotal",
  "tax_total",
  "shipping_total",
  "*items",
  "*items.product",
  "*items.variant",
  "*shipping_address",
  "*billing_address",
  "*shipping_methods",
  "*payment_collections",
].join(",");

type Metadata = Record<string, unknown> | null | undefined;

export type PaginatedProducts = {
  products: Product[];
  count: number;
  limit: number;
  offset: number;
  region: StoreRegionSummary | null;
};

export type CatalogTaxonomy = {
  categories: Category[];
  collections: Collection[];
};

export type StoreRegionSummary = {
  id: string;
  name: string;
  currencyCode: string;
};

type ListProductsOptions = {
  categoryId?: string;
  collectionId?: string;
  handle?: string;
  limit?: number;
  offset?: number;
};

function getFallbackProductPage({
  handle,
  limit = DEFAULT_LIMIT,
  offset = 0,
}: Pick<ListProductsOptions, "handle" | "limit" | "offset"> = {}) {
  const matchingProducts = handle
    ? fallbackProducts.filter((product) => product.handle === handle)
    : fallbackProducts;

  return {
    count: matchingProducts.length,
    limit,
    offset,
    products: matchingProducts.slice(offset, offset + limit),
    region: null,
  } satisfies PaginatedProducts;
}

function getEmptyProductPage({
  limit = DEFAULT_LIMIT,
  offset = 0,
}: Pick<ListProductsOptions, "limit" | "offset"> = {}) {
  return {
    count: 0,
    limit,
    offset,
    products: [],
    region: null,
  } satisfies PaginatedProducts;
}

export type CheckoutDetails = {
  address1: string;
  address2?: string;
  cardName?: string;
  cardNumber?: string;
  city: string;
  countryCode: string;
  email: string;
  firstName: string;
  lastName: string;
  paymentProviderId?: string;
  phone: string;
  postalCode: string;
  province: string;
};

function parseMetadataValue(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return value;
  }
}

function metadataValue(metadata: Metadata, keys: string[]) {
  if (!metadata) {
    return undefined;
  }

  for (const key of keys) {
    if (metadata[key] !== undefined && metadata[key] !== null) {
      return parseMetadataValue(metadata[key]);
    }
  }

  return undefined;
}

function metadataString(metadata: Metadata, keys: string[]) {
  const value = metadataValue(metadata, keys);
  return typeof value === "string" && value.trim() ? value : undefined;
}

function metadataNumber(metadata: Metadata, keys: string[]) {
  const value = metadataValue(metadata, keys);

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function metadataBoolean(metadata: Metadata, keys: string[]) {
  const value = metadataValue(metadata, keys);

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return ["true", "1", "yes"].includes(value.trim().toLowerCase());
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return false;
}

function metadataStringArray(metadata: Metadata, keys: string[]) {
  const value = metadataValue(metadata, keys);

  if (Array.isArray(value)) {
    return value.filter(
      (item): item is string => typeof item === "string" && Boolean(item.trim()),
    );
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function metadataFeatures(metadata: Metadata) {
  const value = metadataValue(metadata, ["features", "feature_list"]);

  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item): ProductFeature[] => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    const title = typeof record.title === "string" ? record.title : undefined;
    const body =
      typeof record.body === "string"
        ? record.body
        : typeof record.description === "string"
          ? record.description
          : undefined;

    return title && body ? [{ title, body }] : [];
  });
}

function metadataSpecs(metadata: Metadata) {
  const value = metadataValue(metadata, ["specs", "specifications"]);

  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item): ProductSpec[] => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    const label = typeof record.label === "string" ? record.label : undefined;
    const specValue =
      typeof record.value === "string" || typeof record.value === "number"
        ? String(record.value)
        : undefined;

    return label && specValue ? [{ label, value: specValue }] : [];
  });
}

function metadataReviews(metadata: Metadata) {
  const value = metadataValue(metadata, ["reviews", "review_list"]);

  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item): ProductReview[] => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const record = item as Record<string, unknown>;
    const author = typeof record.author === "string" ? record.author : undefined;
    const title = typeof record.title === "string" ? record.title : undefined;
    const body =
      typeof record.body === "string"
        ? record.body
        : typeof record.quote === "string"
          ? record.quote
          : undefined;

    return author && title && body ? [{ author, title, body }] : [];
  });
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1).trim()}...` : value;
}

function uniqueStrings(values: (string | null | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function normalizeFlagCandidate(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hasAnyCandidate(candidates: string[], matches: string[]) {
  return candidates.some((candidate) => matches.includes(candidate));
}

function getProductStatusFlags({
  badge,
  compareAt,
  metadata,
  tags,
}: {
  badge?: string;
  compareAt?: number;
  metadata: Metadata;
  tags: string[];
}) {
  const candidates = uniqueStrings([badge, ...tags])
    .map(normalizeFlagCandidate)
    .filter(Boolean);
  const flags: ProductStatusFlag[] = [];

  if (
    metadataBoolean(metadata, ["featured", "is_featured"]) ||
    hasAnyCandidate(candidates, ["featured"])
  ) {
    flags.push("featured");
  }

  if (
    metadataBoolean(metadata, ["bestseller", "best_seller", "is_bestseller"]) ||
    hasAnyCandidate(candidates, ["bestseller", "best-seller"])
  ) {
    flags.push("bestseller");
  }

  if (
    metadataBoolean(metadata, ["new", "new_arrival", "is_new"]) ||
    hasAnyCandidate(candidates, ["new", "new-arrival", "just-landed"])
  ) {
    flags.push("new");
  }

  if (
    compareAt ||
    metadataBoolean(metadata, ["sale", "on_sale"]) ||
    hasAnyCandidate(candidates, ["sale", "on-sale"])
  ) {
    flags.push("sale");
  }

  return flags;
}

function getVariantName(variant: HttpTypes.StoreProductVariant) {
  const optionName = variant.options
    ?.map((option) => option.value)
    .filter(Boolean)
    .join(" / ");

  return variant.title && variant.title !== "Default"
    ? variant.title
    : optionName || variant.title || "Default";
}

function getVariantColor(variant: HttpTypes.StoreProductVariant) {
  const metadataColor = metadataString(variant.metadata, ["color", "hex", "hex_color"]);

  if (metadataColor) {
    return metadataColor;
  }

  const colorOption = variant.options?.find((option) => {
    const optionTitle = option.option?.title?.toLowerCase() ?? "";
    return optionTitle.includes("color");
  });

  return colorOption?.value ?? "#8a8a8e";
}

function getVariantStock(variant: HttpTypes.StoreProductVariant) {
  if (variant.allow_backorder) {
    return true;
  }

  if (variant.manage_inventory === false) {
    return true;
  }

  if (typeof variant.inventory_quantity !== "number") {
    return true;
  }

  return variant.inventory_quantity > 0;
}

function hasCalculatedPrice(variant: HttpTypes.StoreProductVariant) {
  return typeof variant.calculated_price?.calculated_amount === "number";
}

function getVariantOptions(variant: HttpTypes.StoreProductVariant) {
  return (
    variant.options?.flatMap((option) => {
      const name = option.option?.title?.trim();
      const value = option.value?.trim();

      return name && value ? [{ name, value }] : [];
    }) ?? []
  );
}

function findOptionValue(
  options: ReturnType<typeof getVariantOptions>,
  matches: string[],
) {
  return options.find((option) =>
    matches.some((match) => option.name.toLowerCase().includes(match)),
  )?.value;
}

function mapVariant(variant: HttpTypes.StoreProductVariant, fallbackCurrency: string) {
  const calculatedPrice = variant.calculated_price;
  const currencyCode = calculatedPrice?.currency_code ?? fallbackCurrency;
  const priceAvailable = hasCalculatedPrice(variant);
  const price = calculatedPrice?.calculated_amount ?? 0;
  const options = getVariantOptions(variant);

  return {
    color: getVariantColor(variant),
    flavor: findOptionValue(options, ["flavor", "flavour", "taste"]),
    id: variant.id,
    inStock: priceAvailable && getVariantStock(variant),
    name: getVariantName(variant),
    nicotineStrength: findOptionValue(options, ["nicotine", "strength", "mg"]),
    options,
    price,
    priceDisplay: priceAvailable
      ? formatMoney(price, currencyCode)
      : "Price unavailable",
  } satisfies ProductVariant;
}

function stableNumber(value: string) {
  return Array.from(value).reduce(
    (total, character) => (total * 31 + character.charCodeAt(0)) % 100_003,
    17,
  );
}

function prefixedTagValues(tags: string[], prefixes: string[]) {
  return tags.flatMap((tag) => {
    const separatorIndex = tag.search(/[:=]/);

    if (separatorIndex < 0) {
      return [];
    }

    const prefix = tag.slice(0, separatorIndex).trim().toLowerCase();
    const value = tag.slice(separatorIndex + 1).trim();

    return prefixes.includes(prefix) && value ? [value] : [];
  });
}

function getProductBrand(
  product: HttpTypes.StoreProduct,
  tags: string[],
) {
  const metadataBrand = metadataString(product.metadata, [
    "brand",
    "manufacturer",
    "maker",
    "vendor",
  ]);

  if (metadataBrand) {
    return metadataBrand;
  }

  const taggedBrand = prefixedTagValues(tags, ["brand", "maker"])[0];

  if (taggedBrand) {
    return taggedBrand;
  }

  const knownBrands = [
    "Vaporesso",
    "GeekVape",
    "Uwell",
    "VOOPOO",
    "Lost Vape",
    "OXVA",
    "SMOK",
    "Elf Bar",
    "Al Fakher",
    "Kaloud",
    "Khalil Mamoon",
  ];
  const searchableName = product.title.toLowerCase();

  return (
    knownBrands.find((brand) => searchableName.includes(brand.toLowerCase())) ??
    "Ember & Halo"
  );
}

function getProductFlavors({
  categoryNames,
  metadata,
  productId,
  tags,
  variants,
}: {
  categoryNames: string[];
  metadata: Metadata;
  productId: string;
  tags: string[];
  variants: ProductVariant[];
}) {
  const configured = metadataStringArray(metadata, [
    "flavors",
    "flavours",
    "flavor",
    "flavour",
    "taste_profile",
  ]);
  const values = uniqueStrings([
    ...configured,
    ...prefixedTagValues(tags, ["flavor", "flavour", "taste"]),
    ...variants.map((variant) => variant.flavor),
  ]);

  if (values.length > 0) {
    return values;
  }

  const isFlavorProduct = categoryNames.some((category) =>
    [
      "Disposable Vapes",
      "E-Liquids",
      "Nicotine Salts",
      "Hookah Flavors",
    ].includes(category),
  );

  if (!isFlavorProduct) {
    return [];
  }

  const flavorSets = [
    ["Blue Razz Ice", "Watermelon Chill", "Polar Mint"],
    ["Mango Ember", "Peach Nectar", "Fresh Mint"],
    ["Velvet Grape", "Citrus No. 07", "Mint Leaf"],
  ];

  return flavorSets[stableNumber(productId) % flavorSets.length];
}

function getNicotineStrengths({
  categoryNames,
  metadata,
  tags,
  variants,
}: {
  categoryNames: string[];
  metadata: Metadata;
  tags: string[];
  variants: ProductVariant[];
}) {
  const configured = metadataStringArray(metadata, [
    "nicotine_strengths",
    "nicotine_strength",
    "strengths",
    "strength",
  ]);
  const values = uniqueStrings([
    ...configured,
    ...prefixedTagValues(tags, ["nicotine", "nic", "strength"]),
    ...variants.map((variant) => variant.nicotineStrength),
  ]);

  if (values.length > 0) {
    return values;
  }

  if (categoryNames.includes("E-Liquids")) {
    return ["0 mg", "3 mg", "6 mg"];
  }

  if (
    categoryNames.some((category) =>
      ["Disposable Vapes", "Nicotine Salts"].includes(category),
    )
  ) {
    return ["20 mg", "35 mg", "50 mg"];
  }

  return [];
}

function getFallbackReviews(productId: string): ProductReview[] {
  const first = stableNumber(productId) % 2;
  const reviews: ProductReview[][] = [
    [
      {
        author: "Maya R.",
        title: "A polished everyday pick",
        body: "Arrived quickly in discreet packaging. The finish feels premium and the performance has stayed consistent.",
      },
      {
        author: "Noah K.",
        title: "Exactly as described",
        body: "Easy to set up, thoughtfully packed, and noticeably smoother than my previous setup.",
      },
    ],
    [
      {
        author: "Samira L.",
        title: "Beautifully considered",
        body: "The details are excellent and the ordering experience made choosing the right option straightforward.",
      },
      {
        author: "Eli T.",
        title: "Now part of the rotation",
        body: "Reliable from the first use, with a clean finish and a quality feel that stands out in person.",
      },
    ],
  ];

  return reviews[first];
}

function buildSpecs(product: HttpTypes.StoreProduct) {
  const metadataSpecsList = metadataSpecs(product.metadata);

  if (metadataSpecsList.length > 0) {
    return metadataSpecsList;
  }

  const dimensions =
    product.length || product.width || product.height
      ? [product.length, product.width, product.height]
          .map((value) => (typeof value === "number" ? `${value} mm` : null))
          .filter(Boolean)
          .join(" x ")
      : undefined;

  const rows: ProductSpec[] = [
    product.collection?.title
      ? { label: "Collection", value: product.collection.title }
      : undefined,
    product.categories?.length
      ? {
          label: "Category",
          value: product.categories.map((category) => category.name).join(", "),
        }
      : undefined,
    product.type?.value ? { label: "Type", value: product.type.value } : undefined,
    product.material ? { label: "Material", value: product.material } : undefined,
    typeof product.weight === "number" ? { label: "Weight", value: `${product.weight} g` } : undefined,
    dimensions ? { label: "Dimensions", value: dimensions } : undefined,
  ].filter((row): row is ProductSpec => Boolean(row));

  return rows;
}

export function mapProduct(product: HttpTypes.StoreProduct, fallbackCurrency = "usd") {
  const variants = product.variants?.map((variant) => mapVariant(variant, fallbackCurrency)) ?? [];
  const selectedVariant = variants.find((variant) => variant.inStock) ?? variants[0];
  const selectedMedusaVariant =
    product.variants?.find((variant) => variant.id === selectedVariant?.id) ?? product.variants?.[0];
  const currencyCode =
    selectedMedusaVariant?.calculated_price?.currency_code ?? fallbackCurrency;
  const price = selectedVariant?.price ?? 0;
  const originalPrice = selectedMedusaVariant?.calculated_price?.original_amount ?? price;
  const compareAt = originalPrice > price ? originalPrice : undefined;
  const description = product.description ?? product.subtitle ?? product.title;
  const tags = product.tags?.map((tag) => tag.value).filter(Boolean) ?? [];
  const sourceCategoryNames =
    product.categories?.map((category) => category.name.trim()).filter(Boolean) ?? [];
  const inferredCategoryNames = deriveCatalogCategoryNames([
    ...sourceCategoryNames,
    product.title,
    product.subtitle ?? "",
    product.type?.value ?? "",
    ...tags,
  ]);
  const resolvedCategoryNames =
    sourceCategoryNames.length > 0 ? sourceCategoryNames : inferredCategoryNames;
  const brand = getProductBrand(product, tags);
  const flavors = getProductFlavors({
    categoryNames: resolvedCategoryNames,
    metadata: product.metadata,
    productId: product.id,
    tags,
    variants,
  });
  const nicotineStrengths = getNicotineStrengths({
    categoryNames: resolvedCategoryNames,
    metadata: product.metadata,
    tags,
    variants,
  });
  const badge =
    metadataString(product.metadata, ["badge", "label"]) ??
    tags.find((tag) => ["new", "bestseller", "featured"].includes(tag.toLowerCase()));
  const images = uniqueStrings([
    product.thumbnail,
    ...(product.images?.sort((first, second) => first.rank - second.rank).map((image) => image.url) ??
      []),
  ]);
  const specs = [
    { label: "Brand", value: brand },
    ...buildSpecs(product).filter((spec) => spec.label.toLowerCase() !== "brand"),
  ];
  const optionLabel = product.options?.[0]?.title ?? "Variant";
  const statusFlags = getProductStatusFlags({
    badge,
    compareAt,
    metadata: product.metadata,
    tags,
  });

  return {
    badge,
    brand,
    categoryIds: product.categories?.map((category) => category.id) ?? [],
    categoryNames: resolvedCategoryNames,
    collectionIds: product.collection_id ? [product.collection_id] : [],
    collectionNames: product.collection?.title ? [product.collection.title] : [],
    collections: product.collection?.handle ? [product.collection.handle] : [],
    compareAt,
    compareAtDisplay: compareAt ? formatMoney(compareAt, currencyCode) : undefined,
    createdAt: product.created_at ?? undefined,
    currencyCode,
    description,
    features: metadataFeatures(product.metadata),
    flavors,
    handle: product.handle,
    id: product.id,
    images:
      images.length > 0
        ? images
        : [getCategoryFallbackImage(resolvedCategoryNames, product.id)],
    inBox: metadataStringArray(product.metadata, ["in_box", "inBox", "box_contents"]),
    name: product.title,
    nicotineStrengths,
    optionLabel,
    price,
    priceDisplay: selectedVariant?.priceDisplay ?? "Price unavailable",
    rating:
      metadataNumber(product.metadata, ["rating", "rating_average"]) ??
      4.6 + (stableNumber(product.id) % 4) / 10,
    reviewCount:
      metadataNumber(product.metadata, ["review_count", "reviewCount", "reviews"]) ??
      38 + (stableNumber(`${product.id}:reviews`) % 184),
    reviews:
      metadataReviews(product.metadata).length > 0
        ? metadataReviews(product.metadata)
        : getFallbackReviews(product.id),
    shortDescription:
      metadataString(product.metadata, ["short_description", "shortDescription"]) ??
      product.subtitle ??
      truncate(description, 150),
    specs,
    statusFlags,
    subtitle: product.subtitle ?? product.collection?.title ?? product.type?.value ?? "",
    tags,
    variants:
      variants.length > 0
        ? variants
        : [
            {
              color: "#8a8a8e",
              id: "",
              inStock: false,
              name: "Unavailable",
              options: [],
              price: 0,
              priceDisplay: "Price unavailable",
            },
          ],
  } satisfies Product;
}

export function mapCollection(collection: HttpTypes.StoreCollection) {
  return {
    description:
      metadataString(collection.metadata, ["description", "short_description"]) ??
      `Explore ${collection.title.trim()}.`,
    handle: collection.handle,
    id: collection.id,
    image:
      metadataString(collection.metadata, ["image", "thumbnail"]) ??
      getCollectionFallbackImage(collection.id),
    name: collection.title.trim(),
    productCount: collection.products?.length,
    tagline: metadataString(collection.metadata, ["tagline", "eyebrow"]) ?? "Curated collection",
  } satisfies Collection;
}

export function mapCategory(category: HttpTypes.StoreProductCategory) {
  return {
    description: category.description || `Explore ${category.name.trim()}.`,
    handle: category.handle,
    id: category.id,
    image:
      metadataString(category.metadata, ["image", "thumbnail"]) ??
      getCategoryFallbackImage([category.name, category.handle], category.id),
    name: category.name.trim(),
    parentId: category.parent_category_id,
    productCount: category.products?.length,
  } satisfies Category;
}

type VisibleTaxonomyIndex = {
  categoryProductImages: Map<string, { image: string; productId: string }>;
  categoryProductCounts: Map<string, number>;
  collectionProductCounts: Map<string, number>;
};

function incrementCount(counts: Map<string, number>, id: string) {
  counts.set(id, (counts.get(id) ?? 0) + 1);
}

function getProductTaxonomyImage(product: HttpTypes.StoreProduct) {
  const thumbnail = product.thumbnail?.trim();

  if (thumbnail) {
    return thumbnail;
  }

  return [...(product.images ?? [])]
    .sort((first, second) => first.rank - second.rank)
    .map((image) => image.url?.trim())
    .find(Boolean);
}

async function listVisibleProductTaxonomy(): Promise<VisibleTaxonomyIndex> {
  const categoryProductImages = new Map<string, { image: string; productId: string }>();
  const categoryProductCounts = new Map<string, number>();
  const collectionProductCounts = new Map<string, number>();
  let offset = 0;
  let count = 0;

  do {
    const response = await sdk.store.product.list({
      fields: "id,thumbnail,collection_id,*images,*categories",
      limit: TAXONOMY_PAGE_SIZE,
      offset,
      order: "id",
    });

    for (const product of response.products) {
      const productImage = getProductTaxonomyImage(product);
      const productCategoryIds = new Set(
        product.categories?.map((category) => category.id).filter(Boolean) ?? [],
      );

      for (const categoryId of productCategoryIds) {
        incrementCount(categoryProductCounts, categoryId);

        const currentImage = categoryProductImages.get(categoryId);

        if (productImage && (!currentImage || product.id < currentImage.productId)) {
          categoryProductImages.set(categoryId, {
            image: productImage,
            productId: product.id,
          });
        }
      }

      if (product.collection_id) {
        incrementCount(collectionProductCounts, product.collection_id);
      }
    }

    count = response.count;
    offset += response.products.length;

    if (response.products.length === 0) {
      break;
    }
  } while (offset < count);

  return { categoryProductCounts, categoryProductImages, collectionProductCounts };
}

async function listAllStoreCategories() {
  const categories: HttpTypes.StoreProductCategory[] = [];
  let offset = 0;
  let count = 0;

  do {
    const response = await sdk.store.category.list({
      fields: "id,name,description,handle,parent_category_id,metadata",
      limit: TAXONOMY_PAGE_SIZE,
      offset,
    });

    categories.push(...response.product_categories);
    count = response.count;
    offset += response.product_categories.length;

    if (response.product_categories.length === 0) {
      break;
    }
  } while (offset < count);

  return categories;
}

async function listAllStoreCollections() {
  const collections: HttpTypes.StoreCollection[] = [];
  let offset = 0;
  let count = 0;

  do {
    const response = await sdk.store.collection.list({
      fields: "id,title,handle,metadata",
      limit: TAXONOMY_PAGE_SIZE,
      offset,
    });

    collections.push(...response.collections);
    count = response.count;
    offset += response.collections.length;

    if (response.collections.length === 0) {
      break;
    }
  } while (offset < count);

  return collections;
}

const getLiveCatalogTaxonomy = cache(async (): Promise<CatalogTaxonomy> => {
  try {
    const [sourceCategories, sourceCollections, visibility] = await Promise.all([
      listAllStoreCategories(),
      listAllStoreCollections(),
      listVisibleProductTaxonomy(),
    ]);

    const categories = sourceCategories.flatMap((category) => {
      const productCount = visibility.categoryProductCounts.get(category.id);
      const productImage = visibility.categoryProductImages.get(category.id)?.image;

      return productCount
        ? [{ ...mapCategory(category), ...(productImage ? { image: productImage } : {}), productCount }]
        : [];
    });
    const collections = sourceCollections.flatMap((collection) => {
      const productCount = visibility.collectionProductCounts.get(collection.id);

      return productCount
        ? [{ ...mapCollection(collection), productCount }]
        : [];
    });

    return { categories, collections };
  } catch {
    // Fail closed: never expose unscoped Admin taxonomy if product visibility
    // cannot be resolved for the configured publishable key.
    return { categories: [], collections: [] };
  }
});

export async function listCatalogTaxonomy(): Promise<CatalogTaxonomy> {
  if (!LIVE_CATALOG_ENABLED) {
    return {
      categories: mergeCatalogCategories([]),
      collections: mergeCatalogCollections([]),
    };
  }

  return getLiveCatalogTaxonomy();
}

function mapRegionSummary(region: HttpTypes.StoreRegion) {
  return {
    currencyCode: region.currency_code,
    id: region.id,
    name: region.name,
  } satisfies StoreRegionSummary;
}

async function regionHasCatalogPricing(regionId: string) {
  let offset = 0;
  let count = 0;

  try {
    do {
      const response = await sdk.store.product.list({
        fields: "*variants.calculated_price,id",
        limit: TAXONOMY_PAGE_SIZE,
        offset,
        order: "id",
        region_id: regionId,
      });

      if (
        response.products.some((product) =>
          product.variants?.some(hasCalculatedPrice),
        )
      ) {
        return true;
      }

      count = response.count;
      offset += response.products.length;

      if (response.products.length === 0) {
        break;
      }
    } while (offset < count);
  } catch {
    return false;
  }

  return false;
}

const resolveDefaultRegion = cache(async () => {
  const configuredCountry = process.env.NEXT_PUBLIC_DEFAULT_REGION?.trim().toLowerCase();
  let regions: HttpTypes.StoreRegion[];

  try {
    ({ regions } = await sdk.store.region.list({
      fields: "id,name,currency_code,*countries",
      limit: 50,
    }));
  } catch {
    return null;
  }

  const configuredRegion = configuredCountry
    ? regions.find((region) =>
        region.countries?.some((country) => country.iso_2 === configuredCountry),
      )
    : undefined;
  const candidates = configuredRegion
    ? [configuredRegion, ...regions.filter((region) => region.id !== configuredRegion.id)]
    : regions;

  if (candidates.length === 0) {
    return null;
  }

  const pricingAvailability = await Promise.all(
    candidates.map((region) => regionHasCatalogPricing(region.id)),
  );
  const pricedRegion = candidates.find((_, index) => pricingAvailability[index]);

  return mapRegionSummary(pricedRegion ?? candidates[0]);
});

export async function getDefaultRegion() {
  return resolveDefaultRegion();
}

export async function listProducts({
  categoryId,
  collectionId,
  handle,
  limit = DEFAULT_LIMIT,
  offset = 0,
}: ListProductsOptions = {}) {
  if (!LIVE_CATALOG_ENABLED) {
    return getFallbackProductPage({ handle, limit, offset });
  }

  const region = await getDefaultRegion();

  try {
    const response = await sdk.store.product.list({
      category_id: categoryId,
      collection_id: collectionId,
      fields: PRODUCT_FIELDS,
      handle,
      limit,
      offset,
      region_id: region?.id,
    });

    return {
      count: response.count,
      limit: response.limit,
      offset: response.offset,
      products: response.products.map((product) =>
        mapProduct(product, region?.currencyCode ?? "usd"),
      ),
      region,
    } satisfies PaginatedProducts;
  } catch {
    return getEmptyProductPage({ limit, offset });
  }
}

export async function listAllProducts({
  categoryId,
  collectionId,
  handle,
  limit = 100,
}: Omit<ListProductsOptions, "offset"> = {}): Promise<PaginatedProducts> {
  if (categoryId?.startsWith("presentation:category:")) {
    const categoryHandle = categoryId.replace("presentation:category:", "");
    const category = getCatalogCategoryByHandle(categoryHandle);
    const completeCatalog = await listAllProducts({ handle, limit });
    const products = category
      ? completeCatalog.products.filter((product) =>
          product.categoryNames.some(
            (name) =>
              normalizeCatalogText(name) === normalizeCatalogText(category.name),
          ),
        )
      : [];

    return {
      ...completeCatalog,
      count: products.length,
      products,
    } satisfies PaginatedProducts;
  }

  if (collectionId?.startsWith("presentation:collection:")) {
    const collectionHandle = collectionId.replace("presentation:collection:", "");
    const completeCatalog = await listAllProducts({ handle, limit });
    const collectionCategories: Record<string, string[]> = {
      "after-hours": ["Disposable Vapes", "Pod Systems", "Vape Kits"],
      "flavor-studio": ["E-Liquids", "Nicotine Salts", "Hookah Flavors"],
      "hookah-rituals": ["Hookahs", "Hookah Bowls", "Charcoal", "Hookah Flavors"],
      "the-essentials-edit": ["Coils", "Pods", "Tanks", "Accessories"],
    };
    const allowedCategories = new Set(
      (collectionCategories[collectionHandle] ?? []).map(normalizeCatalogText),
    );
    const products = completeCatalog.products.filter((product) =>
      product.categoryNames.some((category) =>
        allowedCategories.has(normalizeCatalogText(category)),
      ),
    );

    return {
      ...completeCatalog,
      count: products.length,
      products,
    } satisfies PaginatedProducts;
  }

  const products: Product[] = [];
  let offset = 0;
  let count = 0;
  let region: StoreRegionSummary | null = null;

  do {
    const page = await listProducts({
      categoryId,
      collectionId,
      handle,
      limit,
      offset,
    });

    products.push(...page.products);
    count = page.count;
    region = page.region;
    offset += page.limit;

    if (page.products.length === 0) {
      break;
    }
  } while (products.length < count);

  return {
    count: products.length,
    limit,
    offset: 0,
    products,
    region,
  } satisfies PaginatedProducts;
}

export async function getProductByHandle(handle: string) {
  const { products } = await listProducts({ handle, limit: 1 });
  return products[0] ?? null;
}

export async function getRelatedProducts(handle: string, limit = 4) {
  const { products } = await listProducts({ limit: limit + 1 });
  return products.filter((product) => product.handle !== handle).slice(0, limit);
}

export async function listCollections(limit = 100) {
  const { collections } = await listCatalogTaxonomy();
  return collections.slice(0, limit);
}

export async function getCollectionByHandle(handle: string) {
  const { collections } = await listCatalogTaxonomy();
  return collections.find((collection) => collection.handle === handle) ?? null;
}

export async function listCategories(limit = 100) {
  const { categories } = await listCatalogTaxonomy();
  return categories.slice(0, limit);
}

export async function getCategoryByHandle(handle: string) {
  const { categories } = await listCatalogTaxonomy();
  return categories.find((category) => category.handle === handle) ?? null;
}

export async function retrieveCart(cartId: string) {
  const response = await sdk.store.cart.retrieve(cartId, { fields: CART_FIELDS });
  return response.cart;
}

export async function createCart() {
  const region = await getDefaultRegion();
  const response = await sdk.store.cart.create(
    {
      region_id: region?.id,
    },
    { fields: CART_FIELDS },
  );

  return response.cart;
}

export async function addCartLineItem(cartId: string, variantId: string, quantity: number) {
  const response = await sdk.store.cart.createLineItem(
    cartId,
    {
      quantity,
      variant_id: variantId,
    },
    { fields: CART_FIELDS },
  );

  return response.cart;
}

export async function updateCartLineItem(cartId: string, lineItemId: string, quantity: number) {
  const response = await sdk.store.cart.updateLineItem(
    cartId,
    lineItemId,
    { quantity },
    { fields: CART_FIELDS },
  );

  return response.cart;
}

export async function deleteCartLineItem(cartId: string, lineItemId: string) {
  const response = await sdk.store.cart.deleteLineItem(cartId, lineItemId, {
    fields: CART_FIELDS,
  });

  return response.parent;
}

function cleanCheckoutValue(value: string | undefined) {
  return value?.trim() ?? "";
}

function buildCheckoutAddress(details: CheckoutDetails) {
  return {
    address_1: cleanCheckoutValue(details.address1),
    address_2: cleanCheckoutValue(details.address2),
    city: cleanCheckoutValue(details.city),
    country_code: cleanCheckoutValue(details.countryCode).toLowerCase(),
    first_name: cleanCheckoutValue(details.firstName),
    last_name: cleanCheckoutValue(details.lastName),
    phone: cleanCheckoutValue(details.phone),
    postal_code: cleanCheckoutValue(details.postalCode),
    province: cleanCheckoutValue(details.province),
  } satisfies HttpTypes.StoreAddAddress;
}

function selectPaymentProvider(
  providers: HttpTypes.StorePaymentProvider[],
  preferredProviderId?: string,
) {
  const configuredProvider =
    preferredProviderId ||
    process.env.MEDUSA_DUMMY_PAYMENT_PROVIDER_ID ||
    process.env.NEXT_PUBLIC_MEDUSA_DUMMY_PAYMENT_PROVIDER_ID;

  if (configuredProvider) {
    const configuredMatch = providers.find((provider) => provider.id === configuredProvider);

    if (configuredMatch) {
      return configuredMatch;
    }
  }

  return (
    providers.find((provider) => provider.id.toLowerCase().includes("system_default")) ??
    providers.find((provider) => provider.id.toLowerCase().includes("manual")) ??
    providers.find((provider) => provider.id.toLowerCase().includes("dummy")) ??
    providers[0]
  );
}

async function ensureShippingMethod(cart: HttpTypes.StoreCart) {
  if (cart.shipping_methods?.length) {
    return cart;
  }

  const { shipping_options: shippingOptions } =
    await sdk.store.fulfillment.listCartOptions({
      cart_id: cart.id,
      fields: "id,name,price_type,amount,calculated_price,insufficient_inventory,data",
    });
  const shippingOption =
    shippingOptions.find((option) => !option.insufficient_inventory) ?? shippingOptions[0];

  if (!shippingOption) {
    throw new Error("No shipping options are available for this cart.");
  }

  const response = await sdk.store.cart.addShippingMethod(
    cart.id,
    {
      data: shippingOption.data ?? { storefront_demo: true },
      option_id: shippingOption.id,
    },
    { fields: CART_FIELDS },
  );

  return response.cart;
}

async function ensurePaymentSession(
  cart: HttpTypes.StoreCart,
  preferredProviderId?: string,
) {
  const regionId = cart.region_id ?? cart.region?.id;

  if (!regionId) {
    throw new Error("Cart is missing a region.");
  }

  const { payment_providers: paymentProviders } =
    await sdk.store.payment.listPaymentProviders({
      fields: "id",
      limit: 100,
      region_id: regionId,
    });
  const paymentProvider = selectPaymentProvider(paymentProviders, preferredProviderId);

  if (!paymentProvider) {
    throw new Error("No payment providers are available for this cart region.");
  }

  const existingSession = cart.payment_collection?.payment_sessions?.find(
    (session) =>
      session.provider_id === paymentProvider.id && session.status !== "canceled",
  );

  if (existingSession) {
    return paymentProvider;
  }

  await sdk.store.payment.initiatePaymentSession(
    cart,
    {
      data: {
        storefront_demo: true,
      },
      provider_id: paymentProvider.id,
    },
    { fields: "id,*payment_sessions,*payment_providers" },
  );

  return paymentProvider;
}

export async function placeMedusaOrder(cartId: string, details: CheckoutDetails) {
  const address = buildCheckoutAddress(details);
  const cardDigits = cleanCheckoutValue(details.cardNumber).replace(/\D/g, "");
  const updatedCartResponse = await sdk.store.cart.update(
    cartId,
    {
      billing_address: address,
      email: cleanCheckoutValue(details.email),
      metadata: {
        card_last4: cardDigits.slice(-4),
        checkout_mode: "storefront_demo",
      },
      shipping_address: address,
    },
    { fields: CART_FIELDS },
  );
  let cart = updatedCartResponse.cart;

  if (!cart.items?.length) {
    throw new Error("Your cart is empty.");
  }

  cart = await ensureShippingMethod(cart);
  const paymentProvider = await ensurePaymentSession(cart, details.paymentProviderId);
  const completion = await sdk.store.cart.complete(cart.id, { fields: ORDER_FIELDS });

  return {
    completion,
    paymentProviderId: paymentProvider.id,
  };
}
