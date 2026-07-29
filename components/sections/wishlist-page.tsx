"use client";

import { ProductCard } from "@/components/sections/product-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";
import { useWishlist } from "@/components/wishlist/wishlist-provider";

export function WishlistPage() {
  const { clearWishlist, count, items } = useWishlist();

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <Container className="relative py-16 md:py-24">
          <div className="absolute -right-12 top-1/2 hidden -translate-y-1/2 font-mono text-[13rem] font-bold leading-none text-border/40 lg:block">
            {String(count).padStart(2, "0")}
          </div>
          <div className="relative max-w-4xl">
            <Eyebrow className="text-primary">The keep list / {String(count).padStart(2, "0")}</Eyebrow>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] md:text-7xl">
              Save the spark<br /><span className="font-accent font-normal italic text-primary">for later.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-6 text-muted-foreground">
              Your private shortlist stays on this device—ready when it’s time to compare flavors, hardware, or a full ritual setup.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 md:py-18">
          {count === 0 ? (
            <div className="grid min-h-[30rem] overflow-hidden border border-border bg-surface-elevated lg:grid-cols-2">
              <div className="relative min-h-72 overflow-hidden bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Premium pod device and e-liquid still life"
                  className="absolute inset-0 size-full object-cover opacity-75 transition-transform duration-700 hover:scale-[1.03]"
                  src="/ember-halo/category-pod-systems.png"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/70">Curate your rotation</span>
              </div>
              <div className="flex flex-col items-start justify-center p-8 md:p-12">
                <div className="grid size-14 place-items-center border border-primary text-primary">
                  <Icon className="size-6" name="heart" />
                </div>
                <h2 className="mt-7 font-display text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                  Your keep list is clear.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                  Tap the heart on any product to build a personal edit. We’ll keep it here on this browser.
                </p>
                <ButtonLink className="mt-8" href="/products">
                  Find your next favorite
                  <Icon className="size-4" name="arrow-right" />
                </ButtonLink>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Eyebrow className="text-primary">Your selection</Eyebrow>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {count} saved {count === 1 ? "piece" : "pieces"} · stored on this browser
                  </p>
                </div>
                <div className="flex gap-3">
                  <ButtonLink href="/products" variant="secondary">
                    Add more
                  </ButtonLink>
                  <Button onClick={clearWishlist} type="button" variant="ghost">
                    Clear all
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
                {items.map((product, index) => (
                  <ProductCard index={index} key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}
