"use client";

import { useEffect, useRef, useState, type ButtonHTMLAttributes } from "react";
import type { Product } from "@/types/site";
import { useCart } from "@/components/cart/cart-provider";
import { Icon } from "@/components/ui/icon";
import { cx } from "@/lib/utils";

type ProductCardAddToCartButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  product: Product;
};

export function ProductCardAddToCartButton({
  className,
  product,
  type = "button",
  ...props
}: ProductCardAddToCartButtonProps) {
  const { addLineItem } = useCart();
  const [added, setAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const resetTimeoutRef = useRef<number | null>(null);
  const selectedVariant =
    product.variants.find((variant) => variant.inStock) ?? product.variants[0];
  const canPurchase = Boolean(selectedVariant?.id && selectedVariant.inStock);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  async function handleAddToCart() {
    if (!canPurchase || isAdding) {
      return;
    }

    setIsAdding(true);

    try {
      const nextCart = await addLineItem(selectedVariant.id, 1);

      if (!nextCart) {
        return;
      }

      setAdded(true);

      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }

      resetTimeoutRef.current = window.setTimeout(() => setAdded(false), 1500);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <button
      aria-label={
        canPurchase
          ? `Add ${product.name} to cart`
          : `${product.name} is sold out`
      }
      className={cx(
        "inline-flex items-center justify-center rounded-full border border-border bg-surface-elevated/90 text-foreground backdrop-blur transition-[background,border-color,transform] duration-200 hover:-translate-y-px hover:border-primary hover:bg-background disabled:pointer-events-none disabled:opacity-50",
        added ? "border-primary text-primary" : "",
        className,
      )}
      disabled={!canPurchase || isAdding}
      onClick={(event) => {
        event.stopPropagation();
        void handleAddToCart();
      }}
      title={
        canPurchase
          ? `Add ${selectedVariant.name} to cart`
          : "Sold out"
      }
      type={type}
      {...props}
    >
      <Icon
        className={cx("size-4", added ? "text-primary" : "text-black")}
        name={added ? "check" : "shopping-bag"}
      />
    </button>
  );
}
