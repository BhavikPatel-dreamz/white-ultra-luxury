"use client";

import type { ButtonHTMLAttributes } from "react";
import type { Product } from "@/types/site";
import { cx } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { useWishlist } from "@/components/wishlist/wishlist-provider";

type WishlistButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  product: Product;
  showLabel?: boolean;
};

export function WishlistButton({
  className,
  product,
  showLabel = false,
  type = "button",
  ...props
}: WishlistButtonProps) {
  const { isWishlisted, toggleProduct } = useWishlist();
  const saved = isWishlisted(product.id);

  return (
    <button
      aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} wishlist`}
      aria-pressed={saved}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] border border-border bg-surface-elevated/90 px-3 py-2 text-xs font-semibold text-foreground backdrop-blur transition-[background,border-color,transform] duration-200 hover:-translate-y-px hover:border-primary hover:bg-background disabled:pointer-events-none disabled:opacity-50",
        saved ? "border-primary text-primary" : "",
        className,
      )}
      onClick={(event) => {
        event.stopPropagation();
        toggleProduct(product);
      }}
      type={type}
      {...props}
    >
      <Icon className={cx("size-4", saved ? "fill-primary text-primary" : "")} name="heart" />
      {showLabel ? <span>{saved ? "Saved" : "Wishlist"}</span> : null}
    </button>
  );
}
