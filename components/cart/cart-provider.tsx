"use client";

import type { HttpTypes } from "@medusajs/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

async function requestCart(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  const data = (await response.json()) as CartResponse;

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
      setCart(nextCart);
      return nextCart;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Cart unavailable");
      return null;
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
          setCart(nextCart);
        }
      } catch (requestError) {
        if (mounted) {
          setError(
            requestError instanceof Error ? requestError.message : "Cart unavailable",
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
