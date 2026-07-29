import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/site";
import { Icon } from "@/components/ui/icon";
import { cx } from "@/lib/utils";

export function CategoryCard({
  category,
  featured = false,
  index = 0,
}: {
  category: Category;
  featured?: boolean;
  index?: number;
}) {
  return (
    <Link
      className={cx(
        "group relative isolate block min-h-[24rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-foreground text-white shadow-sm",
        featured ? "md:col-span-2 md:min-h-[31rem]" : "md:min-h-[27rem]",
      )}
      href={`/categories/${category.handle}`}
    >
      <Image
        alt={category.name}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
        fill
        sizes={featured ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
        src={category.image}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.08)_20%,rgba(0,0,0,.8)_100%)] transition-colors group-hover:bg-[linear-gradient(180deg,rgba(0,0,0,.02)_10%,rgba(0,0,0,.86)_100%)]"
      />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
        <span className="rounded-full border border-white/25 bg-black/15 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </span>
        {typeof category.productCount === "number" ? (
          <span className="text-[0.62rem] uppercase tracking-[0.15em] text-white/70">
            {category.productCount} pieces
          </span>
        ) : null}
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-white/60">
              Ember &amp; Halo / Category
            </p>
            <h3
              className={cx(
                "mt-2 max-w-lg font-display font-medium leading-[0.95] tracking-[-0.035em]",
                featured ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
              )}
            >
              {category.name}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/65 opacity-90 transition-opacity md:opacity-0 md:group-hover:opacity-100">
              {category.description}
            </p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-[background,color,transform] duration-300 group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-4" name="arrow-up-right" />
          </span>
        </div>
      </div>
    </Link>
  );
}
