import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/types/site";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-title";

export function CollectionCard({
  collection,
  index,
  reveal = true,
  showDescription = false,
  ctaLabel,
}: {
  collection: Collection;
  index: number;
  reveal?: boolean;
  showDescription?: boolean;
  ctaLabel?: string;
}) {
  const delay = [0, 80, 150][index] ?? 0;
  const card = (
    <Link
      className="group block overflow-hidden rounded-[var(--radius)] border border-border bg-surface-elevated transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-hover)]"
      href={`/collections/${collection.handle}`}
    >
      <div className="relative aspect-[4/5] bg-surface">
        <Image
          alt={collection.name}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          src={collection.image}
        />
      </div>
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Eyebrow className="text-primary">{collection.tagline}</Eyebrow>
            <h3 className="mt-2 font-display text-2xl md:text-3xl">
              {collection.name}
            </h3>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-background transition-colors group-hover:border-primary group-hover:text-primary">
            <Icon className="size-3.5" name="arrow-up-right" />
          </span>
        </div>
        {showDescription ? (
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            {collection.description}
          </p>
        ) : null}
        <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-foreground">
          {ctaLabel ?? `Shop ${collection.name.toLowerCase()}`}
          <Icon
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            name="arrow-right"
          />
        </div>
      </div>
    </Link>
  );

  if (!reveal) {
    return card;
  }

  return <Reveal delay={delay as 0 | 80 | 150}>{card}</Reveal>;
}
