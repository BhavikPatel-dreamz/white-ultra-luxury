"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cx } from "@/lib/utils";

const ROTATION_DELAY = 4800;

type BrandCarouselProps = {
  brands: string[];
};

export function BrandCarousel({ brands }: BrandCarouselProps) {
  const items = useMemo(
    () =>
      Array.from(
        new Set(brands.map((brand) => brand.trim()).filter(Boolean)),
      ),
    [brands],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isFocusInside, setIsFocusInside] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const itemCount = items.length;
  const safeIndex = itemCount ? activeIndex % itemCount : 0;
  const activeBrand = items[safeIndex];
  const isAutoPaused =
    isManuallyPaused || isPointerInside || isFocusInside || prefersReducedMotion;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (itemCount < 2 || isAutoPaused) return;

    const rotationTimer = window.setTimeout(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % itemCount);
    }, ROTATION_DELAY);

    return () => window.clearTimeout(rotationTimer);
  }, [activeIndex, isAutoPaused, itemCount]);

  if (!activeBrand) return null;

  const goToBrand = (index: number) => {
    setActiveIndex(index);
  };

  const showPreviousBrand = () => {
    setActiveIndex((currentIndex) =>
      (currentIndex - 1 + itemCount) % itemCount,
    );
  };

  const showNextBrand = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % itemCount);
  };

  return (
    <div
      aria-label="Popular brand carousel"
      aria-roledescription="carousel"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocusInside(false);
        }
      }}
      onFocusCapture={() => setIsFocusInside(true)}
      onMouseEnter={() => setIsPointerInside(true)}
      onMouseLeave={() => setIsPointerInside(false)}
      role="region"
    >
      <div className="relative isolate overflow-hidden border-y border-border bg-surface px-5 py-9 sm:px-8 sm:py-12 lg:px-12">
        <div
          aria-hidden="true"
          className="eh-grid absolute inset-0 opacity-35 [mask-image:linear-gradient(to_right,black,transparent_85%)]"
        />
        <span
          aria-hidden="true"
          className="absolute -right-3 -top-10 font-display text-[11rem] font-bold leading-none tracking-[-0.09em] text-white/[0.025] sm:text-[15rem]"
        >
          {String(safeIndex + 1).padStart(2, "0")}
        </span>

        <div className="relative grid min-h-[16rem] items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div
            aria-atomic="true"
            aria-label={`Brand ${safeIndex + 1} of ${itemCount}: ${activeBrand}`}
            className="eh-brand-slide min-w-0"
            key={`${safeIndex}-${activeBrand}`}
          >
            <div className="flex items-center gap-3 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-primary">
              <span>{String(safeIndex + 1).padStart(2, "0")}</span>
              <span className="h-px w-10 bg-primary/50" />
              <span>{String(itemCount).padStart(2, "0")}</span>
            </div>
            <p className="mt-6 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-muted">
              Maker spotlight
            </p>
            <h3 className="mt-3 max-w-[13ch] text-balance font-display text-[clamp(3.4rem,9vw,8.5rem)] font-bold uppercase leading-[0.78] tracking-[-0.075em] text-foreground">
              {activeBrand}
            </h3>
            <Link
              className="mt-8 inline-flex items-center gap-5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:text-primary"
              href="/products"
            >
              Explore the collection
              <Icon className="size-4" name="arrow-right" />
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:pb-1" role="group" aria-label="Brand carousel controls">
            <button
              aria-label="Show previous brand"
              className="grid size-12 place-items-center border border-white/20 text-foreground transition-[background,border-color,color] hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 sm:size-14"
              disabled={itemCount < 2}
              onClick={showPreviousBrand}
              type="button"
            >
              <Icon className="size-4 rotate-180" name="arrow-right" />
            </button>
            <button
              aria-label="Show next brand"
              className="grid size-12 place-items-center border border-white/20 text-foreground transition-[background,border-color,color] hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40 sm:size-14"
              disabled={itemCount < 2}
              onClick={showNextBrand}
              type="button"
            >
              <Icon className="size-4" name="arrow-right" />
            </button>
            <button
              aria-label={isManuallyPaused ? "Resume brand rotation" : "Pause brand rotation"}
              aria-pressed={isManuallyPaused}
              className="ml-2 h-12 border border-white/20 px-4 text-[0.56rem] font-bold uppercase tracking-[0.15em] text-muted transition-colors hover:border-primary hover:text-primary sm:h-14 sm:px-5"
              disabled={itemCount < 2 || prefersReducedMotion}
              onClick={() => setIsManuallyPaused((isPaused) => !isPaused)}
              type="button"
            >
              {prefersReducedMotion ? "Motion off" : isManuallyPaused ? "Play" : "Pause"}
            </button>
          </div>
        </div>
      </div>

      <div
        aria-label="Choose a brand"
        className="flex snap-x snap-mandatory overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
      >
        {items.map((brand, index) => {
          const isActive = index === safeIndex;

          return (
            <button
              aria-current={isActive ? "true" : undefined}
              aria-label={`Show ${brand}`}
              className={cx(
                "relative min-w-[45%] snap-start border-r border-border px-5 py-5 text-left text-[0.6rem] font-bold uppercase tracking-[0.13em] transition-colors sm:min-w-[28%] sm:px-7 lg:min-w-0 lg:flex-1",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted hover:bg-surface hover:text-foreground",
              )}
              key={brand}
              onClick={() => goToBrand(index)}
              type="button"
            >
              <span className="mr-3 opacity-55">{String(index + 1).padStart(2, "0")}</span>
              {brand}
            </button>
          );
        })}
      </div>
    </div>
  );
}
