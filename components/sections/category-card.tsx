import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/site";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      className="group block overflow-hidden rounded-[var(--radius)] border border-border bg-surface-elevated transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-hover)]"
      href={`/categories/${category.handle}`}
    >
      <div className="relative aspect-[4/5] bg-surface">
        <Image
          alt={category.name}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          src={category.image}
        />
      </div>
      <div className="p-5 md:p-6">
        <Eyebrow className="text-primary">Category</Eyebrow>
        <h3 className="mt-2 font-display text-2xl md:text-3xl">
          {category.name}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
          {category.description}
        </p>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
          Shop
          <Icon
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            name="arrow-right"
          />
        </div>
      </div>
    </Link>
  );
}
