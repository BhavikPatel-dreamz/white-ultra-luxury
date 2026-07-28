import Link from "next/link";
import { brand } from "@/lib/data";
import { cx } from "@/lib/utils";

export function Logo({ className = "text-lg" }: { className?: string }) {
  return (
    <Link
      aria-label="DaVinci home"
      className={cx("font-display font-semibold", className)}
      href={brand.href}
    >
      DA<span className="text-primary">{"\u00b7"}</span>VINCI
    </Link>
  );
}
