import type { HTMLAttributes } from "react";
import { cx } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cx(
        "rounded border border-border bg-surface-elevated/90 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-foreground backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
