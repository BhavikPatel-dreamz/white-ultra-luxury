import type { Category, Collection } from "@/types/site";

type CategoryProfile = Omit<Category, "id" | "parentId" | "productCount"> & {
  keywords: string[];
  shortLabel: string;
};

type CollectionProfile = Omit<Collection, "id" | "productCount"> & {
  keywords: string[];
};

export const catalogCategoryProfiles: CategoryProfile[] = [
  {
    handle: "disposable-vapes",
    name: "Disposable Vapes",
    shortLabel: "Disposables",
    description: "Pocket-ready, prefilled devices with vivid flavor and zero setup.",
    image: "/ember-halo/category-disposables.png",
    keywords: ["disposable", "puff", "bar"],
  },
  {
    handle: "vape-kits",
    name: "Vape Kits",
    shortLabel: "Vape Kits",
    description: "Complete, considered setups for first draws and daily rituals.",
    image: "/ember-halo/category-vape-kits.png",
    keywords: ["vape kit", "starter kit", "mod kit", "vaporizer", "portable"],
  },
  {
    handle: "pod-systems",
    name: "Pod Systems",
    shortLabel: "Pod Systems",
    description: "Refined compact systems balancing control, clarity, and convenience.",
    image: "/ember-halo/category-pod-systems.png",
    keywords: ["pod system", "pod kit"],
  },
  {
    handle: "e-liquids",
    name: "E-Liquids",
    shortLabel: "E-Liquids",
    description: "Layered freebase blends, selected for clean flavor and a smooth finish.",
    image: "/ember-halo/category-e-liquids.png",
    keywords: ["e-liquid", "eliquid", "e liquid", "e-juice", "ejuice", "freebase"],
  },
  {
    handle: "nicotine-salts",
    name: "Nicotine Salts",
    shortLabel: "Nic Salts",
    description: "Satisfying, low-vapor blends made for compact pod systems.",
    image: "/ember-halo/category-nic-salts.png",
    keywords: ["nicotine salt", "nic salt", "salt nic"],
  },
  {
    handle: "coils",
    name: "Coils",
    shortLabel: "Coils",
    description: "Authentic replacement coils for precise flavor and dependable performance.",
    image: "/ember-halo/category-coils.png",
    keywords: ["coil", "mesh head"],
  },
  {
    handle: "pods",
    name: "Pods",
    shortLabel: "Pods",
    description: "Fresh cartridges and replacement pods for the systems you reach for daily.",
    image: "/ember-halo/category-pods.png",
    keywords: ["replacement pod", "cartridge", "pod pack", "pods"],
  },
  {
    handle: "tanks",
    name: "Tanks",
    shortLabel: "Tanks",
    description: "Precision tanks engineered for dense vapor, easy filling, and clean lines.",
    image: "/ember-halo/category-tanks.png",
    keywords: ["tank", "atomizer", "rta", "rdta"],
  },
  {
    handle: "hookahs",
    name: "Hookahs",
    shortLabel: "Hookahs",
    description: "Statement pieces that bring sculptural design to the shared session.",
    image: "/ember-halo/category-hookahs.png",
    keywords: ["hookah", "shisha pipe", "water pipe"],
  },
  {
    handle: "hookah-bowls",
    name: "Hookah Bowls",
    shortLabel: "Bowls",
    description: "Hand-finished bowls shaped for even heat and expressive flavor.",
    image: "/ember-halo/category-hookah-bowls.png",
    keywords: ["hookah bowl", "phunnel", "shisha bowl"],
  },
  {
    handle: "charcoal",
    name: "Charcoal",
    shortLabel: "Charcoal",
    description: "Clean-burning natural cubes for steady, long-form heat management.",
    image: "/ember-halo/category-charcoal.png",
    keywords: ["charcoal", "coal", "coconut cube"],
  },
  {
    handle: "hookah-flavors",
    name: "Hookah Flavors",
    shortLabel: "Shisha Flavor",
    description: "Modern shisha blends spanning bright fruit, cool botanicals, and rich classics.",
    image: "/ember-halo/category-hookah-flavors.png",
    keywords: ["hookah flavor", "shisha flavor", "shisha tobacco", "molasses"],
  },
  {
    handle: "accessories",
    name: "Accessories",
    shortLabel: "Accessories",
    description: "Chargers, tools, cases, mouthpieces, and the details that complete a setup.",
    image: "/ember-halo/category-accessories.png",
    keywords: ["accessory", "accessories", "charger", "battery", "mouthpiece", "case"],
  },
];

export const catalogCollectionProfiles: CollectionProfile[] = [
  {
    handle: "after-hours",
    name: "After Hours",
    tagline: "Pocket ritual",
    description: "Low-light favorites: discreet devices, icy disposables, and compact everyday kits.",
    image: "/ember-halo/collection-night-shift.png",
    keywords: ["portable", "disposable", "pod", "night", "after hours"],
  },
  {
    handle: "flavor-studio",
    name: "Flavor Studio",
    tagline: "Curated by note",
    description: "A rotating edit of bright fruits, cool finishes, dessert layers, and modern salts.",
    image: "/ember-halo/collection-flavor-lab.png",
    keywords: ["flavor", "liquid", "salt", "juice"],
  },
  {
    handle: "hookah-rituals",
    name: "Hookah Rituals",
    tagline: "Made to gather",
    description: "Sculptural hookahs, artisan bowls, heat systems, and flavors for longer sessions.",
    image: "/ember-halo/collection-hookah-ritual.png",
    keywords: ["hookah", "shisha", "desktop", "session"],
  },
  {
    handle: "the-essentials-edit",
    name: "The Essentials Edit",
    tagline: "Keep it dialed",
    description: "Fresh coils, pods, chargers, tools, and spares selected for a seamless rotation.",
    image: "/ember-halo/collection-pocket-edit.png",
    keywords: ["accessory", "essential", "coil", "replacement", "care"],
  },
];

export function normalizeCatalogText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchesProfile(
  value: string,
  profile: { handle: string; name: string; keywords: string[] },
) {
  const normalized = normalizeCatalogText(value);
  const profileNames = [profile.handle, profile.name, ...profile.keywords].map(
    normalizeCatalogText,
  );

  return profileNames.some(
    (candidate) => normalized === candidate || normalized.includes(candidate),
  );
}

export function findCatalogCategoryProfile(value: string) {
  const normalized = normalizeCatalogText(value);

  // More specific profiles win before their broader parent term (for example,
  // "hookah bowl" should not collapse into "hookahs").
  const priority = [
    "hookah-bowls",
    "hookah-flavors",
    "nicotine-salts",
    "pod-systems",
    "disposable-vapes",
    "e-liquids",
    "coils",
    "pods",
    "tanks",
    "charcoal",
    "hookahs",
    "vape-kits",
    "accessories",
  ];

  return priority
    .map((handle) => catalogCategoryProfiles.find((profile) => profile.handle === handle))
    .find((profile) => profile && matchesProfile(normalized, profile));
}

export function applyCatalogCategoryPresentation(category: Category): Category {
  const profile = findCatalogCategoryProfile(`${category.handle} ${category.name}`);

  return profile
    ? {
        ...category,
        description: profile.description,
        image: profile.image,
        name: profile.name,
      }
    : category;
}

export function deriveCatalogCategoryNames(values: string[]) {
  const names = values.flatMap((value) => {
    const profile = findCatalogCategoryProfile(value);
    return profile ? [profile.name] : [];
  });

  return Array.from(new Set(names));
}

export function getCatalogCategoryByHandle(handle: string): Category | undefined {
  const profile = catalogCategoryProfiles.find((candidate) => candidate.handle === handle);

  return profile
    ? {
        ...profile,
        id: `presentation:category:${profile.handle}`,
        parentId: null,
        productCount: undefined,
      }
    : undefined;
}

export function mergeCatalogCategories(categories: Category[]) {
  const available = [...categories];

  return catalogCategoryProfiles.map((profile) => {
    const sourceIndex = available.findIndex((category) =>
      matchesProfile(`${category.handle} ${category.name}`, profile),
    );
    const source = sourceIndex >= 0 ? available.splice(sourceIndex, 1)[0] : undefined;

    return {
      ...profile,
      id: source?.id ?? `presentation:category:${profile.handle}`,
      handle: source?.handle ?? profile.handle,
      parentId: source?.parentId ?? null,
      productCount: source?.productCount,
    } satisfies Category;
  });
}

export function getCatalogCollectionByHandle(handle: string): Collection | undefined {
  const profile = catalogCollectionProfiles.find((candidate) => candidate.handle === handle);

  return profile
    ? {
        ...profile,
        id: `presentation:collection:${profile.handle}`,
        productCount: undefined,
      }
    : undefined;
}

export function applyCatalogCollectionPresentation(collection: Collection): Collection {
  const profile = catalogCollectionProfiles.find((candidate) =>
    matchesProfile(
      `${collection.handle} ${collection.name} ${collection.tagline}`,
      candidate,
    ),
  );

  return profile
    ? {
        ...collection,
        description: profile.description,
        image: profile.image,
        name: profile.name,
        tagline: profile.tagline,
      }
    : collection;
}

export function mergeCatalogCollections(collections: Collection[]) {
  const available = [...collections];
  const assigned = new Map<string, Collection>();

  // Claim semantic matches first so a generic fallback cannot consume a source
  // intended for a later, more specific collection profile.
  for (const profile of catalogCollectionProfiles) {
    const sourceIndex = available.findIndex((collection) =>
      matchesProfile(
        `${collection.handle} ${collection.name} ${collection.tagline}`,
        profile,
      ),
    );

    if (sourceIndex >= 0) {
      assigned.set(profile.handle, available.splice(sourceIndex, 1)[0]);
    }
  }

  for (const profile of catalogCollectionProfiles) {
    if (!assigned.has(profile.handle) && available.length > 0) {
      assigned.set(profile.handle, available.shift() as Collection);
    }
  }

  return catalogCollectionProfiles.map((profile) => {
    const source = assigned.get(profile.handle);

    return {
      ...profile,
      id: source?.id ?? `presentation:collection:${profile.handle}`,
      handle: source?.handle ?? profile.handle,
      productCount: source?.productCount,
    } satisfies Collection;
  });
}
