"use client";

import type { HttpTypes } from "@medusajs/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { fallbackProducts } from "@/lib/data";

type StoreCart = HttpTypes.StoreCart;

type CartResponse = {
  cart: StoreCart | null;
  message?: string;
};

type CartContextValue = {
  addLineItem: (
    variantId: string,
    quantity: number,
    options?: { openCart?: boolean },
  ) => Promise<StoreCart | null>;
  cart: StoreCart | null;
  clearCart: () => Promise<StoreCart | null>;
  closeCart: () => void;
  error: string | null;
  isCartOpen: boolean;
  isLoading: boolean;
  isMutating: boolean;
  itemCount: number;
  openCart: () => void;
  refreshCart: () => Promise<StoreCart | null>;
  removeLineItem: (lineItemId: string) => Promise<StoreCart | null>;
  updateLineItem: (lineItemId: string, quantity: number) => Promise<StoreCart | null>;
};

const CartContext = createContext<CartContextValue | null>(null);
const DEMO_CART_KEY = "ember_halo_demo_cart";
const LIVE_CATALOG_ENABLED =
  process.env.NEXT_PUBLIC_EMBER_HALO_LIVE_CATALOG !== "false";

type DemoCartItem = {
  id: string;
  product_title: string;
  quantity: number;
  thumbnail: string;
  title: string;
  unit_price: number;
  variant?: { id: string; title: string };
  variant_id: string;
  variant_title: string;
};

function createDemoCart(items: DemoCartItem[] = []) {
  const subtotal = items.reduce(
    (total, item) => total + item.unit_price * item.quantity,
    0,
  );

  return {
    currency_code: "usd",
    id: "demo-cart",
    item_total: subtotal,
    items,
    shipping_total: 0,
    subtotal,
    tax_total: 0,
    total: subtotal,
  } as unknown as StoreCart;
}

function isDemoCart(cart: StoreCart | null) {
  return cart?.id === "demo-cart";
}

function readDemoCart() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(DEMO_CART_KEY);
    const parsed = stored ? (JSON.parse(stored) as StoreCart) : null;
    return isDemoCart(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function resolveLoadedCart(serverCart: StoreCart | null) {
  if (LIVE_CATALOG_ENABLED) {
    writeDemoCart(null);
    return serverCart;
  }

  return readDemoCart() ?? serverCart;
}

function writeDemoCart(cart: StoreCart | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (cart && isDemoCart(cart) && (cart.items?.length ?? 0) > 0) {
    window.localStorage.setItem(DEMO_CART_KEY, JSON.stringify(cart));
  } else {
    window.localStorage.removeItem(DEMO_CART_KEY);
  }
}

function getDemoItems(cart: StoreCart | null) {
  return isDemoCart(cart)
    ? ([...(cart?.items ?? [])] as unknown as DemoCartItem[])
    : ((readDemoCart()?.items ?? []) as unknown as DemoCartItem[]);
}

function addDemoLineItem(
  cart: StoreCart | null,
  variantId: string,
  quantity: number,
) {
  const product = fallbackProducts.find((candidate) =>
    candidate.variants.some((variant) => variant.id === variantId),
  );

  if (!product) {
    return null;
  }

  const variant = product.variants.find((candidate) => candidate.id === variantId);
  const items = getDemoItems(cart);
  const lineId = `demo-line:${variantId}`;
  const existing = items.find((item) => item.id === lineId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      id: lineId,
      product_title: product.name,
      quantity,
      thumbnail: product.images[0] ?? "/ember-halo/category-accessories.png",
      title: product.name,
      unit_price: variant?.price ?? product.price,
      variant: { id: variantId, title: variant?.name ?? "Standard" },
      variant_id: variantId,
      variant_title: variant?.name ?? "Standard",
    });
  }

  return createDemoCart(items);
}

function updateDemoLineItem(
  cart: StoreCart | null,
  lineItemId: string,
  quantity?: number,
) {
  const items = getDemoItems(cart)
    .filter((item) => quantity !== undefined || item.id !== lineItemId)
    .map((item) =>
      item.id === lineItemId && quantity !== undefined
        ? { ...item, quantity: Math.max(1, quantity) }
        : item,
    );

  return createDemoCart(items);
}

async function requestCart(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  let data: CartResponse;

  try {
    data = (await response.json()) as CartResponse;
  } catch {
    data = {
      cart: null,
      message: "Cart service is temporarily unavailable.",
    };
  }

  if (!response.ok) {
    throw new Error(data.message ?? "Cart request failed");
  }

  return data.cart;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StoreCart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const itemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  async function refreshCart() {
    setIsLoading(true);
    setError(null);

    try {
      const nextCart = await requestCart("/api/cart");
      const resolvedCart = resolveLoadedCart(nextCart);
      setCart(resolvedCart);
      return resolvedCart;
    } catch {
      const fallbackCart = LIVE_CATALOG_ENABLED ? null : readDemoCart();
      setCart(fallbackCart);
      setError(
        LIVE_CATALOG_ENABLED ? "Unable to reach the Medusa cart service." : null,
      );
      return fallbackCart;
    } finally {
      setIsLoading(false);
    }
  }

  async function addLineItem(
    variantId: string,
    quantity: number,
    options?: { openCart?: boolean },
  ) {
    setIsMutating(true);
    setError(null);

    try {
      if (variantId.startsWith("demo-")) {
        const nextCart = addDemoLineItem(cart, variantId, quantity);
        setCart(nextCart);
        writeDemoCart(nextCart);

        if (options?.openCart) {
          setIsCartOpen(true);
        }

        return nextCart;
      }

      const nextCart = await requestCart("/api/cart/line-items", {
        body: JSON.stringify({ quantity, variantId }),
        method: "POST",
      });
      setCart(nextCart);

      if (options?.openCart) {
        setIsCartOpen(true);
      }

      return nextCart;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to add item");
      return null;
    } finally {
      setIsMutating(false);
    }
  }

  async function updateLineItem(lineItemId: string, quantity: number) {
    setIsMutating(true);
    setError(null);

    try {
      if (lineItemId.startsWith("demo-line:")) {
        const nextCart = updateDemoLineItem(cart, lineItemId, quantity);
        setCart(nextCart);
        writeDemoCart(nextCart);
        return nextCart;
      }

      const nextCart = await requestCart(`/api/cart/line-items/${lineItemId}`, {
        body: JSON.stringify({ quantity }),
        method: "PATCH",
      });
      setCart(nextCart);
      return nextCart;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update item");
      return null;
    } finally {
      setIsMutating(false);
    }
  }

  async function removeLineItem(lineItemId: string) {
    setIsMutating(true);
    setError(null);

    try {
      if (lineItemId.startsWith("demo-line:")) {
        const nextCart = updateDemoLineItem(cart, lineItemId);
        setCart(nextCart);
        writeDemoCart(nextCart);
        return nextCart;
      }

      const nextCart = await requestCart(`/api/cart/line-items/${lineItemId}`, {
        method: "DELETE",
      });
      setCart(nextCart);
      return nextCart;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to remove item");
      return null;
    } finally {
      setIsMutating(false);
    }
  }

  async function clearCart() {
    setIsMutating(true);
    setError(null);

    try {
      if (isDemoCart(cart)) {
        const nextCart = createDemoCart();
        setCart(nextCart);
        writeDemoCart(null);
        return nextCart;
      }

      const nextCart = await requestCart("/api/cart", {
        method: "DELETE",
      });
      setCart(nextCart);
      return nextCart;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to clear cart");
      return null;
    } finally {
      setIsMutating(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function loadCart() {
      setIsLoading(true);
      setError(null);

      try {
        const nextCart = await requestCart("/api/cart");

        if (mounted) {
          setCart(resolveLoadedCart(nextCart));
        }
      } catch {
        if (mounted) {
          setCart(LIVE_CATALOG_ENABLED ? null : readDemoCart());
          setError(
            LIVE_CATALOG_ENABLED ? "Unable to reach the Medusa cart service." : null,
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        addLineItem,
        cart,
        clearCart,
        closeCart: () => setIsCartOpen(false),
        error,
        isCartOpen,
        isLoading,
        isMutating,
        itemCount,
        openCart: () => setIsCartOpen(true),
        refreshCart,
        removeLineItem,
        updateLineItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
