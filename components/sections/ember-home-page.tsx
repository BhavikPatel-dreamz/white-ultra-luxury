import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { BrandCarousel } from "@/components/sections/brand-carousel";
import { EmberProductCard } from "@/components/sections/ember-product-card";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import {
  popularBrands,
  setupSteps,
  testimonials,
} from "@/lib/data";
import { cx } from "@/lib/utils";
import type { Category, Collection, Product, ProductStatusFlag } from "@/types/site";

type EmberHomePageProps = {
  categories: Category[];
  collections: Collection[];
  products: Product[];
};

export function EmberHomePage({
  categories,
  collections,
  products,
}: EmberHomePageProps) {
  const catalogue = products;
  const trending = selectProducts(catalogue, "featured", 0);
  const bestSellers = selectProducts(catalogue, "bestseller", 4);
  const newest = selectNewest(catalogue);

  return (
    <div className="overflow-hidden">
      <NightRitualHero collection={collections[0]} />
      <ServiceRail />
      <PromoBento collections={collections} />
      <FeaturedCategories categories={categories} />
      <FeaturedCollections collections={collections} />
      <ProductShelf
        actionHref="/products?sort=featured"
        actionLabel="Shop trending"
        accent="right now"
        eyebrow="The heat list · 01"
        products={trending}
        title="What’s moving"
      />
      <ProductShelf
        actionHref="/products?sort=popular"
        actionLabel="See all best sellers"
        accent="again and again"
        eyebrow="Community rotation · 02"
        products={bestSellers}
        title="Bought"
        tone="light"
      />
      <PopularBrands />
      <ProductShelf
        actionHref="/products?sort=newest"
        actionLabel="View the latest drop"
        accent="fresh from the box"
        eyebrow="Just landed · 03"
        products={newest}
        title="New energy"
      />
      <SetupGuide />
      <Testimonials />
      <SocialStudio />
      <Newsletter />
    </div>
  );
}

function selectProducts(products: Product[], flag: ProductStatusFlag, offset: number) {
  const preferred = products.filter(
    (product) => product.statusFlags.includes(flag) || product.tags.includes(flag),
  );
  return fillUnique([...preferred, ...products.slice(offset), ...products], 4);
}

function selectNewest(products: Product[]) {
  const sorted = [...products].sort((a, b) => {
    const aDate = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bDate = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bDate - aDate;
  });
  const markedNew = sorted.filter((product) => product.statusFlags.includes("new"));
  return fillUnique([...markedNew, ...sorted], 4);
}

function fillUnique(products: Product[], count: number) {
  const seen = new Set<string>();
  const result: Product[] = [];

  for (const product of products) {
    if (seen.has(product.id)) {
      continue;
    }
    seen.add(product.id);
    result.push(product);
    if (result.length === count) {
      break;
    }
  }

  return result;
}

function NightRitualHero({ collection }: { collection?: Collection }) {
  return (
    <section className="relative isolate min-h-[46rem] border-b border-border bg-ink lg:min-h-[calc(100svh-10rem)]">
      <Image
        alt="A premium hookah, pen vaporizer and pod devices arranged on black stone"
        className="object-cover object-[65%_center] sm:object-[60%_center] lg:object-center"
        fill
        loading="eager"
        sizes="100vw"
        src="/ember-halo/hero-night-ritual.png"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#090b10_0%,rgba(9,11,16,0.96)_29%,rgba(9,11,16,0.48)_58%,rgba(9,11,16,0.1)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,#090b10_0%,transparent_30%,rgba(9,11,16,0.3)_100%)]" />
      <div aria-hidden="true" className="hero-grid absolute inset-0 opacity-55" />
      <div aria-hidden="true" className="eh-noise absolute inset-0 opacity-[0.08]" />

      <Container className="relative flex min-h-[46rem] flex-col justify-between py-8 lg:min-h-[calc(100svh-10rem)] lg:py-10">
        <div className="flex items-start justify-between">
          <p className="flex items-center gap-3 text-[0.58rem] font-bold uppercase tracking-[0.21em] text-primary">
            <span className="h-px w-8 bg-primary" />
            The Night Ritual · Edition 01
          </p>
          <p className="hidden text-right text-[0.55rem] font-bold uppercase leading-5 tracking-[0.17em] text-foreground/55 md:block">
            Curated for adults
            <br />
            of legal age
          </p>
        </div>

        <div className="max-w-[48rem] py-16 lg:py-20">
          <p className="mb-5 font-accent text-xl italic text-coral sm:text-2xl">
            Objects for the after hours.
          </p>
          <h1 className="text-balance font-display text-[clamp(4.2rem,9.2vw,9rem)] font-bold uppercase leading-[0.75] tracking-[-0.085em]">
            Make
            <br />
            the night
            <br />
            <span className="text-primary">yours.</span>
          </h1>
          <p className="mt-7 max-w-lg text-sm leading-6 text-foreground/68 sm:text-base sm:leading-7">
            Premium vape, hookah and flavor — independently selected for better sessions and
            beautifully discreet delivery.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              className="group inline-flex h-13 items-center gap-7 bg-primary px-6 text-[0.66rem] font-bold uppercase tracking-[0.15em] text-primary-foreground transition-[background,transform] hover:-translate-y-0.5 hover:bg-foreground"
              href="/products"
            >
              Shop the edit
              <Icon className="size-4 transition-transform group-hover:translate-x-1" name="arrow-right" />
            </Link>
            <Link
              className="inline-flex h-13 items-center gap-3 border border-foreground/30 bg-background/30 px-6 text-[0.66rem] font-bold uppercase tracking-[0.15em] backdrop-blur transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
              href={collection ? `/collections/${collection.handle}` : "/products"}
            >
              Enter the ritual
            </Link>
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-foreground/20 pt-5">
          <div className="grid grid-cols-3 gap-7 text-[0.55rem] font-bold uppercase leading-5 tracking-[0.15em] text-foreground/55 sm:gap-12">
            <span>
              <b className="block text-sm text-foreground">150+</b>
              Essentials
            </span>
            <span>
              <b className="block text-sm text-foreground">48hr</b>
              Dispatch
            </span>
            <span>
              <b className="block text-sm text-foreground">21+</b>
              Always
            </span>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <span className="text-[0.55rem] font-bold uppercase tracking-[0.15em] text-foreground/55">
              Scroll to explore
            </span>
            <span className="grid size-9 place-items-center rounded-full border border-foreground/25">
              <Icon className="size-3.5" name="chevron-down" />
            </span>
          </div>
        </div>
      </Container>

      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 xl:block">
        <div className="relative grid size-32 place-items-center rounded-full border border-foreground/20">
          <div className="eh-orbit absolute inset-2 rounded-full border border-dashed border-primary/45" />
          <span className="text-center text-[0.5rem] font-bold uppercase leading-4 tracking-[0.16em] text-primary">
            Ember
            <br />
            approved
          </span>
        </div>
      </div>
    </section>
  );
}

function ServiceRail() {
  const services = [
    ["shield-check", "Adult verified", "Responsible retail"],
    ["truck", "Discreet delivery", "Free on $75+"],
    ["zap", "Weekly drops", "Always fresh"],
    ["rotate-ccw", "Human support", "No chatbot maze"],
  ] as const;

  return (
    <section aria-label="Store benefits" className="border-b border-border bg-surface">
      <Container className="grid grid-cols-2 lg:grid-cols-4">
        {services.map(([icon, title, body], index) => (
          <div
            className={cx(
              "flex min-h-24 items-center gap-4 px-3 py-5 sm:px-5",
              index % 2 === 0 ? "border-r border-border" : "",
              index > 1 ? "border-t border-border lg:border-t-0" : "",
              index > 0 ? "lg:border-l lg:border-r-0" : "",
            )}
            key={title}
          >
            <Icon className="size-5 text-primary" name={icon} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.1em]">{title}</p>
              <p className="mt-1 text-[0.66rem] text-muted-foreground">{body}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}

function PromoBento({ collections }: { collections: Collection[] }) {
  const primaryCollection = collections[0];
  const secondaryCollection = collections[1];

  if (!primaryCollection) {
    return null;
  }

  return (
    <section className="bg-background py-20 md:py-28">
      <Container>
        <SectionHeading
          accent="one good night"
          eyebrow="Current mood · The Ember edit"
          title="Everything for"
        />
        <div className="mt-12 grid gap-4 md:grid-cols-12 md:auto-rows-[15rem]">
          <Link
            className="eh-shine group relative min-h-[28rem] overflow-hidden border border-border md:col-span-7 md:row-span-2 md:min-h-0"
            href={`/collections/${primaryCollection.handle}`}
          >
            <Image
              alt={`${primaryCollection.name} collection`}
              className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              src={primaryCollection.image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 sm:p-8">
              <div>
                <p className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-primary">
                  Curated collection 001
                </p>
                <h3 className="mt-2 font-display text-4xl font-bold uppercase leading-none sm:text-6xl">
                  {primaryCollection.name}
                </h3>
                <p className="mt-3 max-w-sm text-sm text-foreground/70">
                  {primaryCollection.description}
                </p>
              </div>
              <span className="grid size-12 shrink-0 place-items-center border border-white/25 bg-ink/35 backdrop-blur transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-ink">
                <Icon className="size-5" name="arrow-up-right" />
              </span>
            </div>
          </Link>

          <Link
            className="group relative flex min-h-64 flex-col justify-between overflow-hidden bg-primary p-6 text-primary-foreground md:col-span-5 md:min-h-0 md:p-8"
            href="/products"
          >
            <div className="flex items-center justify-between text-[0.55rem] font-bold uppercase tracking-[0.17em]">
              <span>This week only</span>
              <span>Code: AFTER15</span>
            </div>
            <div>
              <p className="font-accent text-2xl italic">Pair it your way.</p>
              <h3 className="mt-2 max-w-md font-display text-[clamp(3rem,6vw,5.5rem)] font-bold uppercase leading-[0.78] tracking-[-0.07em]">
                15% off
                <br />
                any setup
              </h3>
            </div>
            <Icon className="absolute bottom-8 right-8 size-7 transition-transform group-hover:translate-x-1" name="arrow-right" />
          </Link>

          <Link
            className="group relative min-h-72 overflow-hidden border border-border bg-violet md:col-span-5 md:min-h-0"
            href={
              secondaryCollection
                ? `/collections/${secondaryCollection.handle}`
                : "/products?sort=newest"
            }
          >
            <Image
              alt={
                secondaryCollection
                  ? `${secondaryCollection.name} collection`
                  : "Latest products in the Ember and Halo catalog"
              }
              className="object-cover opacity-70 transition-[opacity,transform] duration-700 group-hover:scale-105 group-hover:opacity-90"
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              src={
                secondaryCollection?.image ??
                "/ember-halo/collection-pocket-edit.png"
              }
            />
            <div className="absolute inset-0 bg-gradient-to-r from-violet via-violet/45 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
              <span className="text-[0.55rem] font-bold uppercase tracking-[0.17em]">
                {secondaryCollection ? "Collection spotlight" : "Fresh in store"}
              </span>
              <div>
                <h3 className="font-display text-3xl font-bold uppercase leading-none">
                  {secondaryCollection?.name ?? "Latest arrivals"}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-white/75">
                  {secondaryCollection?.description ??
                    "Explore the newest products available in this storefront."}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function FeaturedCategories({ categories }: { categories: Category[] }) {
  const accentClasses = {
    coral: "bg-coral text-ink",
    cream: "bg-cream text-ink",
    lime: "bg-primary text-primary-foreground",
    violet: "bg-violet text-white",
  } as const;

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="border-y border-border bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading
          accent="your kind of ritual"
          action={<TextLink href="/categories" label="Browse all categories" />}
          eyebrow={`Shop by category · ${categories.length} ways in`}
          title="Find"
        />
        <div className="mt-12 grid auto-rows-[13.5rem] grid-cols-2 gap-3 md:auto-rows-[16rem] lg:grid-cols-4">
          {categories.map((category, index) => {
            const featured = index === 0 || index === Math.min(7, categories.length - 1);
            const accent = (["lime", "violet", "coral", "cream"] as const)[index % 4];

            return (
              <Link
                className={cx(
                  "group relative isolate overflow-hidden border border-border bg-background",
                  featured ? "col-span-2 row-span-2" : "",
                )}
                href={`/categories/${category.handle}`}
                key={category.handle}
              >
                <Image
                  alt={category.name}
                  className="object-cover transition-[transform,filter] duration-700 group-hover:scale-[1.055] group-hover:saturate-125"
                  fill
                  sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                  src={category.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/5 to-transparent" />
                <span
                  className={cx(
                    "absolute right-3 top-3 px-2 py-1 text-[0.5rem] font-bold uppercase tracking-[0.14em]",
                    accentClasses[accent],
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={cx("absolute inset-x-0 bottom-0 p-4", featured ? "sm:p-7" : "")}>
                  <p className="text-[0.5rem] font-bold uppercase tracking-[0.17em] text-primary">
                    Explore the edit
                  </p>
                  <div className="mt-1 flex items-end justify-between gap-2">
                    <h3
                      className={cx(
                        "font-display font-bold uppercase leading-[0.92] tracking-[-0.045em]",
                        featured ? "text-3xl sm:text-5xl" : "text-lg sm:text-2xl",
                      )}
                    >
                      {category.name}
                    </h3>
                    <Icon className="size-4 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" name="arrow-up-right" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function FeaturedCollections({ collections }: { collections: Collection[] }) {
  const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-20 md:py-32">
      <Container>
        <SectionHeading
          accent="moods, not aisles"
          action={<TextLink href="/collections" label="All curated collections" />}
          eyebrow="Featured collections · The long edit"
          title="Shop by"
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          {collections.map((collection, index) => (
            <Link
              className={cx(
                "group relative min-h-[27rem] overflow-hidden border border-border sm:min-h-[34rem]",
                collections.length === 1 ? "lg:col-span-12" : spans[index % spans.length],
              )}
              href={`/collections/${collection.handle}`}
              key={collection.handle}
            >
              <Image
                alt={collection.name}
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.045]"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                src={collection.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="mb-3 flex items-center gap-3 text-[0.55rem] font-bold uppercase tracking-[0.18em] text-primary">
                  <span className="h-px w-7 bg-primary" />
                  Collection {String(index + 1).padStart(2, "0")}
                </div>
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <h3 className="font-display text-4xl font-bold uppercase leading-none tracking-[-0.055em] sm:text-6xl">
                      {collection.name}
                    </h3>
                    <p className="mt-3 max-w-lg text-sm text-foreground/70">{collection.description}</p>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center border border-white/25 bg-ink/30 backdrop-blur transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-ink">
                    <Icon className="size-5" name="arrow-up-right" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProductShelf({
  accent,
  actionHref,
  actionLabel,
  eyebrow,
  products,
  title,
  tone = "dark",
}: {
  accent: string;
  actionHref: string;
  actionLabel: string;
  eyebrow: string;
  products: Product[];
  title: string;
  tone?: "dark" | "light";
}) {
  return (
    <section
      className={cx(
        "border-y py-20 md:py-28",
        tone === "light" ? "border-ink/15 bg-cream text-ink" : "border-border bg-surface",
      )}
    >
      <Container>
        <SectionHeading
          accent={accent}
          action={<TextLink href={actionHref} label={actionLabel} tone={tone} />}
          eyebrow={eyebrow}
          title={title}
          tone={tone}
        />
        <div className="mt-12 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <EmberProductCard index={index} key={product.id} product={product} tone={tone} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function PopularBrands() {
  return (
    <section aria-label="Popular brands" className="overflow-hidden bg-background py-12 sm:py-16">
      <Container className="mb-8 flex items-center justify-between">
        <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-primary">Brands in rotation</span>
        <TextLink href="/products" label="Shop every brand" />
      </Container>
      <Container>
        <BrandCarousel brands={popularBrands} />
      </Container>
    </section>
  );
}

function SetupGuide() {
  return (
    <section className="bg-background py-20 md:py-32" id="setup-guide">
      <Container>
        <div className="relative overflow-hidden bg-violet p-6 text-white sm:p-10 lg:p-16">
          <div aria-hidden="true" className="eh-grid absolute inset-0 opacity-35" />
          <div className="relative grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
            <div>
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.19em] text-primary">
                The three-minute setup guide
              </p>
              <h2 className="mt-6 text-balance font-display text-[clamp(3.5rem,7vw,7rem)] font-bold uppercase leading-[0.78] tracking-[-0.075em]">
                Find your
                <br />
                <span className="font-accent font-medium normal-case italic text-primary">frequency.</span>
              </h2>
              <p className="mt-7 max-w-md text-sm leading-7 text-white/72 sm:text-base">
                New setup, no jargon spiral. Start with your pace and palate; we’ll narrow the
                field to the right hardware, strength and essentials.
              </p>
              <Link
                className="mt-9 inline-flex h-13 items-center gap-7 bg-primary px-6 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-primary-foreground transition-[background,transform] hover:-translate-y-0.5 hover:bg-white"
                href="/products"
              >
                Build my setup
                <Icon className="size-4" name="arrow-right" />
              </Link>
            </div>
            <div className="divide-y divide-white/25 border-y border-white/25">
              {setupSteps.map((step) => (
                <div className="group grid gap-4 py-7 sm:grid-cols-[4rem_1fr_auto] sm:items-center" key={step.number}>
                  <span className="font-accent text-3xl italic text-primary">{step.number}</span>
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-[-0.035em] sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-white/68">{step.body}</p>
                  </div>
                  <Icon className="hidden size-5 transition-transform group-hover:translate-x-1 sm:block" name="arrow-right" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="border-y border-border bg-surface py-20 md:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.42fr_1fr] lg:gap-16">
          <div>
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-coral">Good nights, reported</p>
            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-7xl font-bold leading-none tracking-[-0.07em]">4.9</span>
              <span className="pb-2 text-primary">★★★★★</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Based on 2,814 verified orders</p>
          </div>
          <div className="grid border-l border-t border-border md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <article
                className="flex min-h-80 flex-col justify-between border-b border-r border-border p-6 transition-colors hover:bg-background sm:p-7"
                key={testimonial.author}
              >
                <div>
                  <span className="font-accent text-5xl italic text-primary/65">“</span>
                  <blockquote className="mt-3 font-accent text-2xl italic leading-[1.18] text-foreground/90">
                    {testimonial.quote}
                  </blockquote>
                </div>
                <footer className="mt-8">
                  <div className="text-xs font-bold uppercase tracking-[0.11em]">{testimonial.author}</div>
                  <div className="mt-1 text-[0.64rem] text-muted-foreground">{testimonial.product}</div>
                  <span className="mt-4 block text-[0.52rem] font-bold uppercase tracking-[0.16em] text-primary">
                    Verified night · {String(index + 1).padStart(2, "0")}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function SocialStudio() {
  return (
    <section className="bg-background py-20 md:py-32">
      <Container>
        <SectionHeading
          accent="after hours"
          action={<TextLink href="https://www.instagram.com/" label="Follow @emberandhalo" />}
          eyebrow="From the community · Studio 21"
          title="Seen"
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.55fr_0.75fr]">
          <a
            className="group relative min-h-[32rem] overflow-hidden border border-border sm:min-h-[42rem]"
            href="https://www.instagram.com/"
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt="Ember & Halo community studio wall"
              className="object-cover transition-transform duration-1000 group-hover:scale-[1.035]"
              fill
              sizes="(min-width: 1024px) 68vw, 100vw"
              src="/ember-halo/social-studio.png"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 sm:p-8">
              <div>
                <p className="text-[0.56rem] font-bold uppercase tracking-[0.18em] text-primary">Community frame 027</p>
                <p className="mt-2 font-accent text-3xl italic">The glow belongs to everyone.</p>
              </div>
              <Icon className="size-6" name="instagram" />
            </div>
          </a>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="flex min-h-64 flex-col justify-between bg-coral p-6 text-ink sm:p-8">
              <Icon className="size-7" name="instagram" />
              <div>
                <div className="font-display text-5xl font-bold tracking-[-0.06em]">38.2K</div>
                <p className="mt-2 text-sm">night owls in the loop</p>
              </div>
            </div>
            <div className="relative flex min-h-64 flex-col justify-between overflow-hidden border border-border bg-surface p-6 sm:p-8">
              <div aria-hidden="true" className="eh-grid absolute inset-0 opacity-40" />
              <span className="relative text-[0.56rem] font-bold uppercase tracking-[0.18em] text-primary">Tag the ritual</span>
              <div className="relative">
                <p className="font-display text-3xl font-bold uppercase leading-none">#emberafterdark</p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
                  Share your setup for a chance to join the next studio edit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="border-y border-ink/15 bg-primary py-16 text-primary-foreground md:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-end">
          <div>
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em]">The after-hours memo</p>
            <h2 className="mt-5 max-w-4xl font-display text-[clamp(3.8rem,8vw,8rem)] font-bold uppercase leading-[0.78] tracking-[-0.08em]">
              Stay ahead
              <br />
              of the <span className="font-accent font-medium normal-case italic">cloud.</span>
            </h2>
          </div>
          <div>
            <p className="max-w-md text-sm leading-6 text-ink/68">
              Fresh drops, quiet restocks, flavor notes and member-only bundles. Sent occasionally,
              only when there is something worth opening.
            </p>
            <NewsletterForm variant="home" />
            <p className="mt-3 text-[0.58rem] leading-5 text-ink/55">
              By joining, you confirm you are 21+ and agree to our privacy policy.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function SectionHeading({
  accent,
  action,
  eyebrow,
  title,
  tone = "dark",
}: {
  accent: string;
  action?: ReactNode;
  eyebrow: string;
  title: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-end">
      <div>
        <p
          className={cx(
            "flex items-center gap-3 text-[0.58rem] font-bold uppercase tracking-[0.2em]",
            tone === "light" ? "text-violet" : "text-coral",
          )}
        >
          <span className={cx("h-px w-8", tone === "light" ? "bg-violet" : "bg-coral")} />
          {eyebrow}
        </p>
        <h2 className="mt-5 text-balance font-display text-[clamp(3.5rem,7vw,7rem)] font-bold uppercase leading-[0.8] tracking-[-0.075em]">
          {title}
          <br />
          <span
            className={cx(
              "font-accent font-medium normal-case italic",
              tone === "light" ? "text-violet" : "text-primary",
            )}
          >
            {accent}.
          </span>
        </h2>
      </div>
      {action ? <div className="md:pb-2">{action}</div> : null}
    </div>
  );
}

function TextLink({
  href,
  label,
  tone = "dark",
}: {
  href: string;
  label: string;
  tone?: "dark" | "light";
}) {
  const external = href.startsWith("http");

  return (
    <Link
      className={cx(
        "group inline-flex items-center gap-3 border-b pb-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] transition-colors",
        tone === "light"
          ? "border-ink/25 text-ink/65 hover:border-ink hover:text-ink"
          : "border-foreground/25 text-muted-foreground hover:border-primary hover:text-foreground",
      )}
      href={href}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      {label}
      <Icon className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" name="arrow-up-right" />
    </Link>
  );
}
