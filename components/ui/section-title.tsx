import type { ReactNode } from "react";
import { cx } from "@/lib/utils";

type SectionTitleProps = {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  action,
  className,
  eyebrow,
  title,
  titleClassName,
}: SectionTitleProps) {
  return (
    <div className={cx("grid items-end gap-6 md:grid-cols-[1fr_auto]", className)}>
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2
          className={cx(
            "mt-3 max-w-2xl font-display text-4xl leading-tight md:text-5xl",
            titleClassName,
          )}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
