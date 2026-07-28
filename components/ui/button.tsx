import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] bg-foreground px-6 py-[0.85rem] text-[0.9rem] font-semibold text-background transition-[background,transform] duration-200 hover:-translate-y-px hover:bg-primary active:translate-y-0",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] border border-border bg-surface-elevated px-6 py-[0.85rem] text-[0.9rem] font-semibold text-foreground transition-[background,border-color,transform] duration-200 hover:-translate-y-px hover:border-primary hover:bg-background active:translate-y-0",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] px-4 py-[0.6rem] text-[0.85rem] font-semibold text-foreground transition-colors duration-200 hover:bg-secondary",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
};

export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  return cx(variants[variant], className);
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}

export function ButtonLink({ className, variant = "primary", ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
