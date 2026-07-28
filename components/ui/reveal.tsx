import type { HTMLAttributes } from "react";
import { cx } from "@/lib/utils";

const delayClasses = {
  0: "",
  50: "[animation-delay:50ms]",
  80: "[animation-delay:80ms]",
  100: "[animation-delay:100ms]",
  150: "[animation-delay:150ms]",
  200: "[animation-delay:200ms]",
  250: "[animation-delay:250ms]",
  300: "[animation-delay:300ms]",
  400: "[animation-delay:400ms]",
} as const;

type RevealProps = HTMLAttributes<HTMLDivElement> & {
  delay?: keyof typeof delayClasses;
};

export function Reveal({ className, delay = 0, ...props }: RevealProps) {
  return (
    <div
      className={cx(
        "motion-safe:animate-[fade-up_600ms_ease-out_both] motion-reduce:animate-none",
        delayClasses[delay],
        className,
      )}
      {...props}
    />
  );
}
