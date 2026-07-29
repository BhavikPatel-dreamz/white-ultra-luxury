import Image from "next/image";
import Link from "next/link";
import type { Collection } from "@/types/site";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { cx } from "@/lib/utils";

export function CollectionCard({
  collection,
  ctaLabel,
  featured = false,
  index,
  reveal = true,
  showDescription = false,
}: {
  collection: Collection;
  ctaLabel?: string;
  featured?: boolean;
  index: number;
  reveal?: boolean;
  showDescription?: boolean;
}) {
  const delay = ([0, 80, 150, 200] as const)[index % 4];
  const card = (
    <Link
      className={cx(
        "group relative isolate block min-h-[30rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-foreground text-white",
        featured ? "md:col-span-2 md:min-h-[38rem]" : "md:min-h-[32rem]",
      )}
      href={`/collections/${collection.handle}`}
    >
      <Image
        alt={collection.name}
        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
        fill
        sizes={featured ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
        src={collection.image}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.78))]" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/70">
          Collection {String(index + 1).padStart(2, "0")}
        </span>
        <span className="grid size-11 place-items-center rounded-full border border-white/25 bg-black/10 backdrop-blur-md transition-[background,color,transform] group-hover:rotate-45 group-hover:bg-white group-hover:text-black">
          <Icon className="size-4" name="arrow-up-right" />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">
          {collection.tagline}
        </p>
        <h3
          className={cx(
            "mt-3 max-w-2xl font-display font-medium leading-[0.95] tracking-[-0.04em]",
            featured ? "text-5xl sm:text-6xl" : "text-4xl",
          )}
        >
          {collection.name}
        </h3>
        {showDescription ? (
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
            {collection.description}
          </p>
        ) : null}
        <div className="mt-6 inline-flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em]">
          {ctaLabel ?? "Explore the edit"}
          <span className="h-px w-8 bg-white/50 transition-[width,background] group-hover:w-12 group-hover:bg-primary" />
        </div>
      </div>
    </Link>
  );

  return reveal ? <Reveal delay={delay}>{card}</Reveal> : card;
}
