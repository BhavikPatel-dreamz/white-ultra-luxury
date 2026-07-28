"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Product } from "@/types/site";

const WISHLIST_KEY = "davinci_wishlist";
const EMPTY_WISHLIST: Product[] = [];
const subscribers = new Set<() => void>();

let wishlistCache: Product[] | null = null;

type WishlistContextValue = {
  addProduct: (product: Product) => void;
  clearWishlist: () => void;
  count: number;
  isWishlisted: (productId: string) => boolean;
  items: Product[];
  removeProduct: (productId: string) => void;
  toggleProduct: (product: Product) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readStoredWishlist() {
  if (typeof window === "undefined") {
    return EMPTY_WISHLIST;
  }

  try {
    const stored = window.localStorage.getItem(WISHLIST_KEY);
    const parsed = stored ? (JSON.parse(stored) as unknown) : [];

    return Array.isArray(parsed)
      ? parsed.filter((item): item is Product => {
          if (!item || typeof item !== "object") {
            return false;
          }

          const candidate = item as Partial<Product>;
          return Boolean(candidate.id && candidate.handle && candidate.name);
        })
      : EMPTY_WISHLIST;
  } catch {
    return EMPTY_WISHLIST;
  }
}

function getWishlistSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_WISHLIST;
  }

  if (!wishlistCache) {
    wishlistCache = readStoredWishlist();
  }

  return wishlistCache;
}

function getServerWishlistSnapshot() {
  return EMPTY_WISHLIST;
}

function notifySubscribers() {
  subscribers.forEach((subscriber) => subscriber());
}

function writeWishlist(items: Product[]) {
  wishlistCache = items;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  }

  notifySubscribers();
}

function subscribeWishlist(subscriber: () => void) {
  subscribers.add(subscriber);

  function handleStorage(event: StorageEvent) {
    if (event.key === WISHLIST_KEY) {
      wishlistCache = readStoredWishlist();
      notifySubscribers();
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    subscribers.delete(subscriber);

    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getServerWishlistSnapshot,
  );

  function addProduct(product: Product) {
    const current = getWishlistSnapshot();

    if (current.some((item) => item.id === product.id)) {
      return;
    }

    writeWishlist([product, ...current]);
  }

  function removeProduct(productId: string) {
    writeWishlist(getWishlistSnapshot().filter((item) => item.id !== productId));
  }

  function toggleProduct(product: Product) {
    const current = getWishlistSnapshot();

    writeWishlist(
      current.some((item) => item.id === product.id)
        ? current.filter((item) => item.id !== product.id)
        : [product, ...current],
    );
  }

  return (
    <WishlistContext.Provider
      value={{
        addProduct,
        clearWishlist: () => writeWishlist([]),
        count: items.length,
        isWishlisted: (productId) => items.some((item) => item.id === productId),
        items,
        removeProduct,
        toggleProduct,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
}
