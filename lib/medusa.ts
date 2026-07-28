import type { HttpTypes } from "@medusajs/types";
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
import { formatMoney } from "@/lib/format";

const PLACEHOLDER_IMAGE = "/assets/product-accessories-BrKIPgD4.jpg";
const DEFAULT_LIMIT = 12;

const PRODUCT_FIELDS = [
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
  "*variants.calculated_price",
  "*variants.options",
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

function mapVariant(variant: HttpTypes.StoreProductVariant, fallbackCurrency: string) {
  const calculatedPrice = variant.calculated_price;
  const currencyCode = calculatedPrice?.currency_code ?? fallbackCurrency;
  const price = calculatedPrice?.calculated_amount ?? 0;

  return {
    color: getVariantColor(variant),
    id: variant.id,
    inStock: getVariantStock(variant),
    name: getVariantName(variant),
    price,
    priceDisplay: formatMoney(price, currencyCode),
  } satisfies ProductVariant;
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
  const badge =
    metadataString(product.metadata, ["badge", "label"]) ??
    tags.find((tag) => ["new", "bestseller", "featured"].includes(tag.toLowerCase()));
  const images = uniqueStrings([
    product.thumbnail,
    ...(product.images?.sort((first, second) => first.rank - second.rank).map((image) => image.url) ??
      []),
  ]);
  const specs = buildSpecs(product);
  const optionLabel = product.options?.[0]?.title ?? "Variant";
  const statusFlags = getProductStatusFlags({
    badge,
    compareAt,
    metadata: product.metadata,
    tags,
  });

  return {
    badge,
    categoryIds: product.categories?.map((category) => category.id) ?? [],
    categoryNames: product.categories?.map((category) => category.name).filter(Boolean) ?? [],
    collectionIds: product.collection_id ? [product.collection_id] : [],
    collectionNames: product.collection?.title ? [product.collection.title] : [],
    collections: product.collection?.handle ? [product.collection.handle] : [],
    compareAt,
    compareAtDisplay: compareAt ? formatMoney(compareAt, currencyCode) : undefined,
    createdAt: product.created_at ?? undefined,
    currencyCode,
    description,
    features: metadataFeatures(product.metadata),
    handle: product.handle,
    id: product.id,
    images: images.length > 0 ? images : [PLACEHOLDER_IMAGE],
    inBox: metadataStringArray(product.metadata, ["in_box", "inBox", "box_contents"]),
    name: product.title,
    optionLabel,
    price,
    priceDisplay: formatMoney(price, currencyCode),
    rating: metadataNumber(product.metadata, ["rating", "rating_average"]),
    reviewCount: metadataNumber(product.metadata, ["review_count", "reviewCount", "reviews"]),
    reviews: metadataReviews(product.metadata),
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
              price: 0,
              priceDisplay: formatMoney(0, currencyCode),
            },
          ],
  } satisfies Product;
}

export function mapCollection(collection: HttpTypes.StoreCollection) {
  return {
    description:
      metadataString(collection.metadata, ["description", "short_description"]) ??
      `Explore ${collection.title}.`,
    handle: collection.handle,
    id: collection.id,
    image: metadataString(collection.metadata, ["image", "thumbnail"]) ?? PLACEHOLDER_IMAGE,
    name: collection.title,
    productCount: collection.products?.length,
    tagline: metadataString(collection.metadata, ["tagline", "eyebrow"]) ?? "Curated collection",
  } satisfies Collection;
}

export function mapCategory(category: HttpTypes.StoreProductCategory) {
  return {
    description: category.description || `Explore ${category.name}.`,
    handle: category.handle,
    id: category.id,
    image: metadataString(category.metadata, ["image", "thumbnail"]) ?? PLACEHOLDER_IMAGE,
    name: category.name,
    parentId: category.parent_category_id,
    productCount: category.products?.length,
  } satisfies Category;
}

export async function getDefaultRegion() {
  const configuredCountry = process.env.NEXT_PUBLIC_DEFAULT_REGION?.trim().toLowerCase();
  const { regions } = await sdk.store.region.list({
    fields: "id,name,currency_code,*countries",
    limit: 50,
  });

  const selectedRegion =
    (configuredCountry
      ? regions.find((region) =>
          region.countries?.some((country) => country.iso_2 === configuredCountry),
        )
      : undefined) ?? regions[0];

  if (!selectedRegion) {
    return null;
  }

  return {
    currencyCode: selectedRegion.currency_code,
    id: selectedRegion.id,
    name: selectedRegion.name,
  } satisfies StoreRegionSummary;
}

export async function listProducts({
  categoryId,
  collectionId,
  handle,
  limit = DEFAULT_LIMIT,
  offset = 0,
}: ListProductsOptions = {}) {
  const region = await getDefaultRegion();
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
}

export async function listAllProducts({
  categoryId,
  collectionId,
  handle,
  limit = 100,
}: Omit<ListProductsOptions, "offset"> = {}) {
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
  const response = await sdk.store.collection.list({
    fields: "id,title,handle,metadata,*products",
    limit,
  });

  return response.collections.map(mapCollection);
}

export async function getCollectionByHandle(handle: string) {
  const response = await sdk.store.collection.list({
    fields: "id,title,handle,metadata,*products",
    handle,
    limit: 1,
  });

  return response.collections[0] ? mapCollection(response.collections[0]) : null;
}

export async function listCategories(limit = 100) {
  const response = await sdk.store.category.list({
    fields:
      "id,name,description,handle,parent_category_id,metadata,*products,*category_children",
    limit,
  });

  return response.product_categories.map(mapCategory);
}

export async function getCategoryByHandle(handle: string) {
  const response = await sdk.store.category.list({
    fields: "id,name,description,handle,parent_category_id,metadata,*products",
    handle,
    limit: 1,
  });

  return response.product_categories[0] ? mapCategory(response.product_categories[0]) : null;
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
