import Link from "next/link";
import { brand } from "@/lib/data";
import { cx } from "@/lib/utils";

export function Logo({
  className = "text-base",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      aria-label="Ember & Halo home"
      className={cx(
        "group inline-flex shrink-0 items-center gap-2.5 text-foreground",
        className,
      )}
      href={brand.href}
    >
      <span
        aria-hidden="true"
        className="relative grid size-[2.15em] place-items-center rounded-full border border-current transition-transform duration-500 group-hover:rotate-90"
      >
        <span className="absolute inset-[0.24em] rounded-full border border-current/35" />
        <span className="size-[0.34em] rounded-full bg-primary shadow-[0_0_14px_rgba(203,255,71,0.7)]" />
      </span>
      {compact ? null : (
        <span className="font-display text-[0.78em] font-bold uppercase leading-[0.86] tracking-[-0.045em]">
          <span className="block">Ember</span>
          <span className="block text-primary">& Halo</span>
        </span>
      )}
    </Link>
  );
}
