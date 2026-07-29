"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { Product, ProductStatusFlag } from "@/types/site";
import { ProductCard } from "@/components/sections/product-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useDialogAccessibility } from "@/hooks/use-dialog-accessibility";
import { cx } from "@/lib/utils";

type SortValue =
  | "recommended"
  | "featured"
  | "bestseller"
  | "new"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "name-asc";

type AvailabilityFilter = "all" | "in-stock" | "sold-out";
type ViewMode = "grid" | "list";

type ProductListingPageProps = {
  basePath: string;
  emptyMessage?: string;
  limit: number;
  offset: number;
  products: Product[];
};

type Option = {
  label: string;
  value: string;
};

type ListingState = {
  availability: AvailabilityFilter;
  brand: string;
  category: string;
  flavor: string;
  maxPrice: string;
  minPrice: string;
  nicotine: string;
  page: number;
  query: string;
  sort: SortValue;
  view: ViewMode;
};

const defaultState: ListingState = {
  availability: "all",
  brand: "all",
  category: "all",
  flavor: "all",
  maxPrice: "",
  minPrice: "",
  nicotine: "all",
  page: 1,
  query: "",
  sort: "recommended",
  view: "grid",
};

const validSorts: SortValue[] = [
  "recommended",
  "featured",
  "bestseller",
  "new",
  "price-asc",
  "price-desc",
  "rating-desc",
  "name-asc",
];
const validAvailability: AvailabilityFilter[] = ["all", "in-stock", "sold-out"];
const validViews: ViewMode[] = ["grid", "list"];

function uniqueOptions(values: Array<string | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort(
    (first, second) => first.localeCompare(second),
  );
}

function hasStock(product: Product) {
  return product.variants.some((variant) => variant.inStock);
}

function compareFlag(first: Product, second: Product, flag: ProductStatusFlag) {
  return Number(second.statusFlags.includes(flag)) - Number(first.statusFlags.includes(flag));
}

function compareCreatedAt(first: Product, second: Product) {
  return Date.parse(second.createdAt ?? "") - Date.parse(first.createdAt ?? "") || 0;
}

function sortProducts(items: Product[], sort: SortValue) {
  return [...items].sort((first, second) => {
    switch (sort) {
      case "featured":
        return compareFlag(first, second, "featured") || compareCreatedAt(first, second);
      case "bestseller":
        return (
          compareFlag(first, second, "bestseller") ||
          (second.reviewCount ?? 0) - (first.reviewCount ?? 0)
        );
      case "new":
        return compareFlag(first, second, "new") || compareCreatedAt(first, second);
      case "price-asc":
        return first.price - second.price;
      case "price-desc":
        return second.price - first.price;
      case "rating-desc":
        return (second.rating ?? 0) - (first.rating ?? 0);
      case "name-asc":
        return first.name.localeCompare(second.name);
      default:
        return 0;
    }
  });
}

function matchesQuery(product: Product, query: string) {
  if (!query) {
    return true;
  }

  return [
    product.name,
    product.brand,
    product.subtitle,
    product.shortDescription,
    ...product.collectionNames,
    ...product.categoryNames,
    ...product.flavors,
    ...product.nicotineStrengths,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase()
    .includes(query.toLowerCase());
}

function filterProducts(products: Product[], state: ListingState) {
  const minimum = state.minPrice === "" ? Number.NEGATIVE_INFINITY : Number(state.minPrice);
  const maximum = state.maxPrice === "" ? Number.POSITIVE_INFINITY : Number(state.maxPrice);

  return products.filter((product) => {
    if (!matchesQuery(product, state.query.trim())) return false;
    if (state.category !== "all" && !product.categoryNames.includes(state.category)) return false;
    if (state.brand !== "all" && product.brand !== state.brand) return false;
    if (state.flavor !== "all" && !product.flavors.includes(state.flavor)) return false;
    if (state.nicotine !== "all" && !product.nicotineStrengths.includes(state.nicotine)) {
      return false;
    }
    if (product.price < minimum || product.price > maximum) return false;
    if (state.availability === "in-stock" && !hasStock(product)) return false;
    if (state.availability === "sold-out" && hasStock(product)) return false;
    return true;
  });
}

function readState(searchParams: URLSearchParams, fallbackPage: number): ListingState {
  const sort = searchParams.get("sort");
  const availability = searchParams.get("availability");
  const view = searchParams.get("view");
  const rawPage = Number(searchParams.get("page") ?? fallbackPage);

  return {
    availability:
      availability && validAvailability.includes(availability as AvailabilityFilter)
        ? (availability as AvailabilityFilter)
        : "all",
    brand: searchParams.get("brand") || "all",
    category: searchParams.get("category") || "all",
    flavor: searchParams.get("flavor") || "all",
    maxPrice: searchParams.get("max") || "",
    minPrice: searchParams.get("min") || "",
    nicotine: searchParams.get("nicotine") || "all",
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
    query: searchParams.get("q") || "",
    sort: sort && validSorts.includes(sort as SortValue) ? (sort as SortValue) : "recommended",
    view: view && validViews.includes(view as ViewMode) ? (view as ViewMode) : "grid",
  };
}

function stateToParams(params: URLSearchParams, state: ListingState) {
  const entries: Array<[keyof ListingState, string]> = [
    ["query", "q"],
    ["sort", "sort"],
    ["category", "category"],
    ["brand", "brand"],
    ["flavor", "flavor"],
    ["nicotine", "nicotine"],
    ["availability", "availability"],
    ["minPrice", "min"],
    ["maxPrice", "max"],
    ["view", "view"],
  ];

  for (const [stateKey, paramKey] of entries) {
    const value = state[stateKey];
    const fallback = defaultState[stateKey];

    if (value && value !== fallback) params.set(paramKey, String(value));
    else params.delete(paramKey);
  }

  if (state.page > 1) params.set("page", String(state.page));
  else params.delete("page");
}

export function ProductListingClient({
  basePath,
  emptyMessage = "Nothing matches that combination. Try opening the filters up a little.",
  limit,
  offset,
  products,
}: ProductListingPageProps) {
  const initialPage = Math.max(1, Math.floor(offset / limit) + 1);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [state, setState] = useState(() =>
    readState(new URLSearchParams(searchParams.toString()), initialPage),
  );
  const [searchDraft, setSearchDraft] = useState(state.query);
  const filterCloseButtonRef = useRef<HTMLButtonElement>(null);
  const filterDialogRef = useDialogAccessibility<HTMLElement>(
    filtersOpen,
    () => setFiltersOpen(false),
    filterCloseButtonRef,
  );

  useBodyScrollLock(filtersOpen);

  useEffect(() => {
    function handlePopState() {
      const nextState = readState(new URLSearchParams(window.location.search), initialPage);
      setState(nextState);
      setSearchDraft(nextState.query);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [initialPage]);

  const categoryOptions = uniqueOptions(products.flatMap((product) => product.categoryNames));
  const brandOptions = uniqueOptions(products.map((product) => product.brand));
  const flavorOptions = uniqueOptions(products.flatMap((product) => product.flavors));
  const nicotineOptions = uniqueOptions(
    products.flatMap((product) => product.nicotineStrengths),
  );
  const availablePrices = products.map((product) => product.price).filter((price) => price > 0);
  const priceFloor = availablePrices.length ? Math.floor(Math.min(...availablePrices)) : 0;
  const priceCeiling = availablePrices.length ? Math.ceil(Math.max(...availablePrices)) : 500;
  const filteredProducts = useMemo(
    () => filterProducts(products, state),
    [products, state],
  );
  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, state.sort),
    [filteredProducts, state.sort],
  );
  const visibleProducts = sortedProducts.slice(0, state.page * limit);
  const hasMore = visibleProducts.length < sortedProducts.length;
  const activeFilterCount = [
    state.query.trim(),
    state.category !== "all",
    state.brand !== "all",
    state.flavor !== "all",
    state.nicotine !== "all",
    state.availability !== "all",
    state.minPrice,
    state.maxPrice,
  ].filter(Boolean).length;

  function updateUrl(nextState: ListingState) {
    const params = new URLSearchParams(window.location.search);
    stateToParams(params, nextState);
    const queryString = params.toString();
    window.history.replaceState(
      null,
      "",
      `${pathname || basePath}${queryString ? `?${queryString}` : ""}`,
    );
  }

  function updateState(patch: Partial<ListingState>, resetPage = false) {
    setState((current) => {
      const nextState = { ...current, ...patch, ...(resetPage ? { page: 1 } : {}) };
      updateUrl(nextState);
      return nextState;
    });
  }

  function clearFilters() {
    setSearchDraft("");
    updateState(
      {
        availability: "all",
        brand: "all",
        category: "all",
        flavor: "all",
        maxPrice: "",
        minPrice: "",
        nicotine: "all",
        query: "",
      },
      true,
    );
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateState({ query: searchDraft.trim() }, true);
  }

  const filterPanelProps = {
    activeFilterCount,
    brandOptions,
    categoryOptions,
    clearFilters,
    flavorOptions,
    nicotineOptions,
    onSearchSubmit: submitSearch,
    priceCeiling,
    priceFloor,
    searchDraft,
    setSearchDraft,
    state,
    updateFilter: (patch: Partial<ListingState>) => updateState(patch, true),
  };

  return (
    <>
      <section className="bg-background">
        <Container className="grid gap-8 py-7 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:items-start lg:py-12">
          <aside className="sticky top-28 hidden lg:block">
            <FilterPanel {...filterPanelProps} />
          </aside>

          <div className="min-w-0">
            <div className="sticky top-[4.45rem] z-30 -mx-5 border-y border-border bg-background/90 px-5 py-3 backdrop-blur-xl md:-mx-8 md:px-8 lg:static lg:mx-0 lg:border-x-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:pt-0">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  aria-expanded={filtersOpen}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:border-primary lg:hidden"
                  onClick={() => setFiltersOpen(true)}
                  type="button"
                >
                  <Icon className="size-4" name="sliders-horizontal" />
                  Filter
                  {activeFilterCount ? (
                    <span className="grid size-5 place-items-center rounded-full bg-primary text-[0.62rem] text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </button>

                <p aria-live="polite" className="mr-auto text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{sortedProducts.length}</span>{" "}
                  {sortedProducts.length === 1 ? "result" : "results"}
                </p>

                <label className="relative">
                  <span className="sr-only">Sort products</span>
                  <select
                    className="h-11 appearance-none rounded-full border border-border bg-surface-elevated py-0 pl-4 pr-10 text-xs font-semibold text-foreground outline-none transition-colors hover:border-primary focus:border-primary"
                    onChange={(event) =>
                      updateState({ sort: event.target.value as SortValue }, true)
                    }
                    value={state.sort}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="featured">Featured first</option>
                    <option value="bestseller">Best sellers</option>
                    <option value="new">Newest</option>
                    <option value="rating-desc">Top rated</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="name-asc">Name: A–Z</option>
                  </select>
                  <Icon
                    className="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                    name="chevron-down"
                  />
                </label>

                <ViewToggle
                  onChange={(view) => updateState({ view })}
                  value={state.view}
                />
              </div>
            </div>

            {visibleProducts.length ? (
              <div
                className={cx(
                  "mt-7",
                  state.view === "grid"
                    ? "grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4"
                    : "grid gap-4",
                )}
              >
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    index={index}
                    key={product.id}
                    layout={state.view}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <NoResults
                clearFilters={clearFilters}
                emptyMessage={emptyMessage}
                hasFilters={activeFilterCount > 0}
              />
            )}

            {hasMore ? (
              <div className="mt-14 border-t border-border pt-8 text-center">
                <p className="mb-4 text-xs text-muted-foreground">
                  Showing {visibleProducts.length} of {sortedProducts.length}
                </p>
                <Button
                  className="min-w-48 rounded-full"
                  onClick={() => updateState({ page: state.page + 1 })}
                  type="button"
                  variant="secondary"
                >
                  Load more
                  <Icon className="size-4 rotate-90" name="arrow-right" />
                </Button>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {filtersOpen ? (
        <>
          <button
            aria-label="Close filters"
            className="fixed inset-0 z-50 bg-foreground/65 backdrop-blur-sm lg:hidden"
            onClick={() => setFiltersOpen(false)}
            type="button"
          />
          <aside
            aria-label="Product filters"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90svh] overflow-y-auto rounded-t-[2rem] border border-border bg-background px-5 pb-8 pt-5 shadow-2xl animate-[sheet-in_260ms_cubic-bezier(.22,1,.36,1)_both] lg:hidden"
            ref={filterDialogRef}
            role="dialog"
            tabIndex={-1}
          >
            <div className="mb-4 flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  Refine the edit
                </p>
                <h2 className="mt-1 font-display text-2xl">Filters</h2>
              </div>
              <button
                aria-label="Close filters"
                className="grid size-11 place-items-center rounded-full border border-border"
                onClick={() => setFiltersOpen(false)}
                ref={filterCloseButtonRef}
                type="button"
              >
                <Icon className="size-4" name="x" />
              </button>
            </div>
            <FilterPanel {...filterPanelProps} compact />
            <Button
              className="mt-5 w-full rounded-full"
              onClick={() => setFiltersOpen(false)}
              type="button"
            >
              Show {sortedProducts.length} products
            </Button>
          </aside>
        </>
      ) : null}
    </>
  );
}

function FilterPanel({
  activeFilterCount,
  brandOptions,
  categoryOptions,
  clearFilters,
  compact = false,
  flavorOptions,
  nicotineOptions,
  onSearchSubmit,
  priceCeiling,
  priceFloor,
  searchDraft,
  setSearchDraft,
  state,
  updateFilter,
}: {
  activeFilterCount: number;
  brandOptions: string[];
  categoryOptions: string[];
  clearFilters: () => void;
  compact?: boolean;
  flavorOptions: string[];
  nicotineOptions: string[];
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  priceCeiling: number;
  priceFloor: number;
  searchDraft: string;
  setSearchDraft: (value: string) => void;
  state: ListingState;
  updateFilter: (patch: Partial<ListingState>) => void;
}) {
  return (
    <div className={cx("overflow-hidden", compact ? "" : "border-t border-border")}>
      {!compact ? (
        <div className="flex items-center justify-between border-b border-border py-4">
          <div>
            <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-primary">
              Curate your shelf
            </p>
            <h2 className="mt-1 font-display text-xl">Refine</h2>
          </div>
          {activeFilterCount ? (
            <button
              className="text-xs font-semibold text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary"
              onClick={clearFilters}
              type="button"
            >
              Clear {activeFilterCount}
            </button>
          ) : null}
        </div>
      ) : activeFilterCount ? (
        <button
          className="mb-2 text-xs font-semibold text-primary"
          onClick={clearFilters}
          type="button"
        >
          Clear all ({activeFilterCount})
        </button>
      ) : null}

      <form className="border-b border-border py-5" onSubmit={onSearchSubmit}>
        <label className="text-[0.65rem] font-semibold uppercase tracking-[0.16em]" htmlFor={compact ? "catalog-search-mobile" : "catalog-search"}>
          Search within results
        </label>
        <div className="mt-3 flex h-11 overflow-hidden rounded-full border border-border bg-surface-elevated focus-within:border-primary">
          <input
            className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
            id={compact ? "catalog-search-mobile" : "catalog-search"}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Product, flavor, brand"
            type="search"
            value={searchDraft}
          />
          <button
            aria-label="Apply search"
            className="grid w-11 place-items-center text-muted-foreground transition-colors hover:text-primary"
            type="submit"
          >
            <Icon className="size-4" name="search" />
          </button>
        </div>
      </form>

      <FilterSelect
        label="Category"
        onChange={(category) => updateFilter({ category })}
        options={categoryOptions.map((value) => ({ label: value, value }))}
        value={state.category}
      />
      <FilterSelect
        label="Brand"
        onChange={(brand) => updateFilter({ brand })}
        options={brandOptions.map((value) => ({ label: value, value }))}
        value={state.brand}
      />
      <PriceFilter
        ceiling={priceCeiling}
        floor={priceFloor}
        maxPrice={state.maxPrice}
        minPrice={state.minPrice}
        onChange={(minPrice, maxPrice) => updateFilter({ maxPrice, minPrice })}
      />
      <FilterSelect
        emptyLabel="No flavor options in this edit"
        label="Flavor"
        onChange={(flavor) => updateFilter({ flavor })}
        options={flavorOptions.map((value) => ({ label: value, value }))}
        value={state.flavor}
      />
      <FilterSelect
        emptyLabel="Not applicable to this edit"
        label="Nicotine strength"
        onChange={(nicotine) => updateFilter({ nicotine })}
        options={nicotineOptions.map((value) => ({ label: value, value }))}
        value={state.nicotine}
      />
      <FilterSelect
        label="Availability"
        onChange={(availability) =>
          updateFilter({ availability: availability as AvailabilityFilter })
        }
        options={[
          { label: "Ready to ship", value: "in-stock" },
          { label: "Sold out", value: "sold-out" },
        ]}
        value={state.availability}
      />
    </div>
  );
}

function FilterSelect({
  emptyLabel,
  label,
  onChange,
  options,
  value,
}: {
  emptyLabel?: string;
  label: string;
  onChange: (value: string) => void;
  options: Option[];
  value: string;
}) {
  return (
    <details className="group border-b border-border py-5" open>
      <summary className="flex cursor-pointer list-none items-center justify-between text-[0.67rem] font-semibold uppercase tracking-[0.16em] [&::-webkit-details-marker]:hidden">
        {label}
        <Icon className="size-3.5 transition-transform group-open:rotate-180" name="chevron-down" />
      </summary>
      <div className="mt-4">
        {options.length ? (
          <label className="relative block">
            <span className="sr-only">Choose {label.toLowerCase()}</span>
            <select
              className="h-11 w-full appearance-none rounded-full border border-border bg-surface-elevated py-0 pl-4 pr-10 text-sm outline-none transition-colors hover:border-primary focus:border-primary"
              onChange={(event) => onChange(event.target.value)}
              value={value}
            >
              <option value="all">All {label.toLowerCase()}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon
              className="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
              name="chevron-down"
            />
          </label>
        ) : (
          <p className="text-xs leading-5 text-muted-foreground">{emptyLabel}</p>
        )}
      </div>
    </details>
  );
}

function PriceFilter({
  ceiling,
  floor,
  maxPrice,
  minPrice,
  onChange,
}: {
  ceiling: number;
  floor: number;
  maxPrice: string;
  minPrice: string;
  onChange: (minimum: string, maximum: string) => void;
}) {
  return (
    <details className="group border-b border-border py-5" open>
      <summary className="flex cursor-pointer list-none items-center justify-between text-[0.67rem] font-semibold uppercase tracking-[0.16em] [&::-webkit-details-marker]:hidden">
        Price
        <Icon className="size-3.5 transition-transform group-open:rotate-180" name="chevron-down" />
      </summary>
      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <label className="relative">
          <span className="sr-only">Minimum price</span>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
          <input
            className="h-11 w-full rounded-full border border-border bg-surface-elevated pl-7 pr-2 text-sm tabular-nums outline-none focus:border-primary"
            max={ceiling}
            min={floor}
            onChange={(event) => onChange(event.target.value, maxPrice)}
            placeholder={String(floor)}
            type="number"
            value={minPrice}
          />
        </label>
        <span className="h-px w-3 bg-border" />
        <label className="relative">
          <span className="sr-only">Maximum price</span>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
          <input
            className="h-11 w-full rounded-full border border-border bg-surface-elevated pl-7 pr-2 text-sm tabular-nums outline-none focus:border-primary"
            max={ceiling}
            min={floor}
            onChange={(event) => onChange(minPrice, event.target.value)}
            placeholder={String(ceiling)}
            type="number"
            value={maxPrice}
          />
        </label>
      </div>
    </details>
  );
}

function ViewToggle({
  onChange,
  value,
}: {
  onChange: (value: ViewMode) => void;
  value: ViewMode;
}) {
  return (
    <div className="hidden h-11 items-center rounded-full border border-border bg-surface-elevated p-1 sm:flex">
      {(["grid", "list"] as const).map((mode) => (
        <button
          aria-label={`${mode === "grid" ? "Grid" : "List"} view`}
          aria-pressed={value === mode}
          className={cx(
            "grid size-8 place-items-center rounded-full transition-colors",
            value === mode ? "bg-foreground text-background" : "text-muted-foreground",
          )}
          key={mode}
          onClick={() => onChange(mode)}
          type="button"
        >
          {mode === "grid" ? (
            <span aria-hidden="true" className="grid grid-cols-2 gap-0.5">
              {Array.from({ length: 4 }).map((_, index) => (
                <span className="size-1 rounded-[1px] bg-current" key={index} />
              ))}
            </span>
          ) : (
            <span aria-hidden="true" className="grid gap-0.5">
              {Array.from({ length: 3 }).map((_, index) => (
                <span className="h-px w-3 bg-current" key={index} />
              ))}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function NoResults({
  clearFilters,
  emptyMessage,
  hasFilters,
}: {
  clearFilters: () => void;
  emptyMessage: string;
  hasFilters: boolean;
}) {
  return (
    <div className="mt-7 flex min-h-[28rem] flex-col items-center justify-center border border-dashed border-border bg-surface px-6 text-center">
      <span className="grid size-14 place-items-center rounded-full border border-border bg-background">
        <Icon className="size-5 text-primary" name="search" />
      </span>
      <h2 className="mt-6 font-display text-3xl">No match in this edit</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{emptyMessage}</p>
      {hasFilters ? (
        <Button className="mt-7 rounded-full" onClick={clearFilters} type="button" variant="secondary">
          Reset filters
        </Button>
      ) : null}
    </div>
  );
}
