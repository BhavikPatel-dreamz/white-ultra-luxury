import type { HTMLAttributes } from "react";
import { cx } from "@/lib/utils";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("mx-auto w-full max-w-[1400px] px-5 md:px-8", className)}
      {...props}
    />
  );
}
