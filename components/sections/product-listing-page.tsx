"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { Product, ProductStatusFlag } from "@/types/site";
import { ProductCard } from "@/components/sections/product-card";
import { Button, buttonClasses } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
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

type StockFilter = "all" | "in-stock" | "sold-out";

type ProductListingPageProps = {
  basePath: string;
  count: number;
  description: string;
  emptyMessage?: string;
  eyebrow: string;
  limit: number;
  offset: number;
  products: Product[];
  title: string;
};

type Option = {
  label: string;
  value: string;
};

type ListingState = {
  category: string;
  collection: string;
  page: number;
  query: string;
  sort: SortValue;
  status: ProductStatusFlag | "all";
  stock: StockFilter;
};

const defaultState: ListingState = {
  category: "all",
  collection: "all",
  page: 1,
  query: "",
  sort: "recommended",
  status: "all",
  stock: "all",
};

const statusLabels: Record<ProductStatusFlag, string> = {
  bestseller: "Bestseller",
  featured: "Featured",
  new: "New",
  sale: "Sale",
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

const validStatuses: Array<ProductStatusFlag | "all"> = [
  "all",
  "featured",
  "bestseller",
  "new",
  "sale",
];

const validStocks: StockFilter[] = ["all", "in-stock", "sold-out"];

function getUniqueOptions(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((first, second) =>
    first.localeCompare(second),
  );
}

function hasStock(product: Product) {
  return product.variants.some((variant) => variant.inStock);
}

function compareFlag(first: Product, second: Product, flag: ProductStatusFlag) {
  const firstRank = first.statusFlags.includes(flag) ? 1 : 0;
  const secondRank = second.statusFlags.includes(flag) ? 1 : 0;

  return secondRank - firstRank;
}

function compareCreatedAt(first: Product, second: Product) {
  const firstDate = first.createdAt ? Date.parse(first.createdAt) : 0;
  const secondDate = second.createdAt ? Date.parse(second.createdAt) : 0;

  return secondDate - firstDate;
}

function sortProducts(items: Product[], sort: SortValue) {
  return [...items].sort((first, second) => {
    if (sort === "featured") {
      return compareFlag(first, second, "featured") || compareCreatedAt(first, second);
    }

    if (sort === "bestseller") {
      return (
        compareFlag(first, second, "bestseller") ||
        (second.reviewCount ?? 0) - (first.reviewCount ?? 0)
      );
    }

    if (sort === "new") {
      return compareFlag(first, second, "new") || compareCreatedAt(first, second);
    }

    if (sort === "price-asc") {
      return first.price - second.price;
    }

    if (sort === "price-desc") {
      return second.price - first.price;
    }

    if (sort === "rating-desc") {
      return (second.rating ?? 0) - (first.rating ?? 0);
    }

    if (sort === "name-asc") {
      return first.name.localeCompare(second.name);
    }

    return 0;
  });
}

function productMatchesQuery(product: Product, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    product.name,
    product.subtitle,
    product.shortDescription,
    ...product.collectionNames,
    ...product.categoryNames,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function filterProducts({
  category,
  collection,
  products,
  query,
  status,
  stock,
}: {
  category: string;
  collection: string;
  products: Product[];
  query: string;
  status: ProductStatusFlag | "all";
  stock: StockFilter;
}) {
  return products.filter((product) => {
    if (!productMatchesQuery(product, query)) {
      return false;
    }

    if (status !== "all" && !product.statusFlags.includes(status)) {
      return false;
    }

    if (collection !== "all" && !product.collectionNames.includes(collection)) {
      return false;
    }

    if (category !== "all" && !product.categoryNames.includes(category)) {
      return false;
    }

    if (stock === "in-stock" && !hasStock(product)) {
      return false;
    }

    if (stock === "sold-out" && hasStock(product)) {
      return false;
    }

    return true;
  });
}

function buildSortOptions(products: Product[]) {
  const options: Option[] = [{ label: "Recommended", value: "recommended" }];
  const hasFlag = (flag: ProductStatusFlag) =>
    products.some((product) => product.statusFlags.includes(flag));

  if (hasFlag("featured")) {
    options.push({ label: "Featured", value: "featured" });
  }

  if (hasFlag("bestseller")) {
    options.push({ label: "Bestseller", value: "bestseller" });
  }

  if (hasFlag("new")) {
    options.push({ label: "New arrivals", value: "new" });
  }

  if (products.some((product) => product.rating)) {
    options.push({ label: "Top rated", value: "rating-desc" });
  }

  return [
    ...options,
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Name: A to Z", value: "name-asc" },
  ];
}

function readState(searchParams: URLSearchParams, fallbackPage: number): ListingState {
  const sort = searchParams.get("sort");
  const status = searchParams.get("status");
  const stock = searchParams.get("stock");
  const rawPage = Number(searchParams.get("page") ?? fallbackPage);

  return {
    category: searchParams.get("category") || "all",
    collection: searchParams.get("collection") || "all",
    page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
    query: searchParams.get("q") || "",
    sort: sort && validSorts.includes(sort as SortValue) ? (sort as SortValue) : "recommended",
    status:
      status && validStatuses.includes(status as ProductStatusFlag | "all")
        ? (status as ProductStatusFlag | "all")
        : "all",
    stock: stock && validStocks.includes(stock as StockFilter) ? (stock as StockFilter) : "all",
  };
}

function stateToParams(params: URLSearchParams, state: ListingState) {
  const entries: Array<[keyof ListingState, string]> = [
    ["query", "q"],
    ["sort", "sort"],
    ["status", "status"],
    ["collection", "collection"],
    ["category", "category"],
    ["stock", "stock"],
  ];

  entries.forEach(([stateKey, paramKey]) => {
    const value = state[stateKey];
    const defaultValue = defaultState[stateKey];

    if (value && value !== defaultValue) {
      params.set(paramKey, String(value));
    } else {
      params.delete(paramKey);
    }
  });

  if (state.page > 1) {
    params.set("page", String(state.page));
  } else {
    params.delete("page");
  }
}

export function ProductListingPage({
  basePath,
  count,
  description,
  emptyMessage = "Nothing matches those filters.",
  eyebrow,
  limit,
  offset,
  products,
  title,
}: ProductListingPageProps) {
  const initialPage = Math.max(1, Math.floor(offset / limit) + 1);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [state, setState] = useState(() =>
    readState(new URLSearchParams(searchParams.toString()), initialPage),
  );
  const [searchDraft, setSearchDraft] = useState(state.query);

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

  const statusOptions = (["featured", "bestseller", "new", "sale"] as const).filter((flag) =>
    products.some((product) => product.statusFlags.includes(flag)),
  );
  const collectionOptions = getUniqueOptions(
    products.flatMap((product) => product.collectionNames),
  );
  const categoryOptions = getUniqueOptions(products.flatMap((product) => product.categoryNames));
  const sortOptions = buildSortOptions(products);
  const filteredProducts = useMemo(
    () =>
      filterProducts({
        category: state.category,
        collection: state.collection,
        products,
        query: state.query.trim(),
        status: state.status,
        stock: state.stock,
      }),
    [products, state.category, state.collection, state.query, state.status, state.stock],
  );
  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, state.sort),
    [filteredProducts, state.sort],
  );
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / limit));
  const safeCurrentPage = Math.min(state.page, totalPages);
  const pageStart = (safeCurrentPage - 1) * limit;
  const pageProducts = sortedProducts.slice(pageStart, pageStart + limit);
  const activeFilterCount = [
    state.query.trim(),
    state.status !== "all",
    state.collection !== "all",
    state.category !== "all",
    state.stock !== "all",
  ].filter(Boolean).length;

  function updateUrl(nextState: ListingState) {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    stateToParams(params, nextState);
    const queryString = params.toString();
    window.history.replaceState(null, "", `${pathname || basePath}${queryString ? `?${queryString}` : ""}`);
  }

  function updateState(patch: Partial<ListingState>) {
    setState((current) => {
      const nextState = {
        ...current,
        ...patch,
      };

      updateUrl(nextState);
      return nextState;
    });
  }

  function updateFilter(patch: Partial<ListingState>) {
    updateState({ ...patch, page: 1 });
  }

  function clearFilters() {
    setSearchDraft("");
    updateFilter({
      category: "all",
      collection: "all",
      query: "",
      sort: "recommended",
      status: "all",
      stock: "all",
    });
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateFilter({ query: searchDraft.trim() });
  }

  return (
    <>
      <section className="border-b border-border bg-background">
        <Container className="pb-10 pt-16 md:pb-12 md:pt-20">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>
        </Container>
      </section>

      <section>
        <Container className="grid gap-8 py-8 lg:grid-cols-[260px_1fr] lg:items-start lg:py-10">
          <aside className="sticky top-28 hidden lg:block">
            <FilterPanel
              activeFilterCount={activeFilterCount}
              categoryOptions={categoryOptions}
              clearFilters={clearFilters}
              collectionOptions={collectionOptions}
              onSearchSubmit={submitSearch}
              searchDraft={searchDraft}
              setSearchDraft={setSearchDraft}
              state={state}
              statusOptions={statusOptions}
              updateFilter={updateFilter}
            />
          </aside>

          <div className="min-w-0">
            <div className="sticky top-[4.5rem] z-30 -mx-5 border-y border-border bg-background/92 px-5 py-3 backdrop-blur md:-mx-8 md:px-8 lg:static lg:mx-0 lg:border-x-0 lg:border-t-0 lg:bg-transparent lg:px-0 lg:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  aria-expanded={filtersOpen}
                  className="lg:hidden"
                  onClick={() => setFiltersOpen(true)}
                  type="button"
                  variant="secondary"
                >
                  <Icon className="size-4" name="sliders-horizontal" />
                  Filters
                  {activeFilterCount > 0 ? (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[0.65rem] text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </Button>

                <div className="text-xs text-muted-foreground">
                  {sortedProducts.length === count
                    ? `${count} products`
                    : `${sortedProducts.length} of ${count} products`}
                </div>

                <label className={buttonClasses("secondary", "cursor-pointer px-3 py-2")}>
                  <Icon className="size-4" name="arrow-up-down" />
                  <select
                    aria-label="Sort products"
                    className="border-0 bg-transparent text-sm text-foreground focus:outline-none"
                    onChange={(event) => updateFilter({ sort: event.target.value as SortValue })}
                    value={state.sort}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {pageProducts.length === 0 ? (
              <NoResults
                clearFilters={clearFilters}
                emptyMessage={emptyMessage}
                hasFilters={activeFilterCount > 0}
              />
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-4">
                {pageProducts.map((product, index) => (
                  <ProductCard index={index} key={product.id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 ? (
              <nav
                aria-label="Product pagination"
                className="mt-12 flex items-center justify-center gap-3 text-sm"
              >
                <button
                  className={buttonClasses("secondary", safeCurrentPage <= 1 ? "pointer-events-none opacity-40" : "")}
                  disabled={safeCurrentPage <= 1}
                  onClick={() => updateState({ page: Math.max(1, safeCurrentPage - 1) })}
                  type="button"
                >
                  Previous
                </button>

                <span className="text-xs text-muted-foreground">
                  Page {safeCurrentPage} of {totalPages}
                </span>

                <button
                  className={buttonClasses("secondary", safeCurrentPage >= totalPages ? "pointer-events-none opacity-40" : "")}
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => updateState({ page: Math.min(totalPages, safeCurrentPage + 1) })}
                  type="button"
                >
                  Next
                </button>
              </nav>
            ) : null}
          </div>
        </Container>
      </section>

      {filtersOpen ? (
        <>
          <button
            aria-label="Close filters"
            className="fixed inset-0 z-50 animate-[fade-in_180ms_ease-out_both] bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setFiltersOpen(false)}
            type="button"
          />
          <aside
            aria-label="Product filters"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[88svh] overflow-y-auto rounded-t-[var(--radius)] border border-border bg-surface-elevated p-5 shadow-[var(--shadow-soft)] animate-[sheet-in_260ms_cubic-bezier(.22,1,.36,1)_both] lg:hidden"
            role="dialog"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <Eyebrow>Filters</Eyebrow>
                <div className="mt-1 text-sm text-muted-foreground">
                  {activeFilterCount} active
                </div>
              </div>
              <Button aria-label="Close filters" className="size-10 rounded-full px-0 py-0" onClick={() => setFiltersOpen(false)} type="button" variant="ghost">
                <Icon className="size-4" name="x" />
              </Button>
            </div>
            <FilterPanel
              activeFilterCount={activeFilterCount}
              categoryOptions={categoryOptions}
              clearFilters={clearFilters}
              collectionOptions={collectionOptions}
              onSearchSubmit={submitSearch}
              searchDraft={searchDraft}
              setSearchDraft={setSearchDraft}
              state={state}
              statusOptions={statusOptions}
              updateFilter={updateFilter}
            />
          </aside>
        </>
      ) : null}
    </>
  );
}

function FilterPanel({
  activeFilterCount,
  categoryOptions,
  clearFilters,
  collectionOptions,
  onSearchSubmit,
  searchDraft,
  setSearchDraft,
  state,
  statusOptions,
  updateFilter,
}: {
  activeFilterCount: number;
  categoryOptions: string[];
  clearFilters: () => void;
  collectionOptions: string[];
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  searchDraft: string;
  setSearchDraft: (value: string) => void;
  state: ListingState;
  statusOptions: ProductStatusFlag[];
  updateFilter: (patch: Partial<ListingState>) => void;
}) {
  return (
    <div className="space-y-6 rounded-[var(--radius)] border border-border bg-surface-elevated p-5">
      <div className="flex items-center justify-between">
        <Eyebrow>Refine</Eyebrow>
        {activeFilterCount > 0 ? (
          <button
            className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
            onClick={clearFilters}
            type="button"
          >
            Clear
          </button>
        ) : null}
      </div>

      <form className="space-y-2" onSubmit={onSearchSubmit}>
        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground" htmlFor="catalog-search">
          Search
        </label>
        <div className="flex overflow-hidden rounded-[var(--radius)] border border-border bg-background">
          <input
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            id="catalog-search"
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Name, category, tag"
            type="search"
            value={searchDraft}
          />
          <button
            aria-label="Apply search"
            className="grid size-11 place-items-center border-l border-border text-muted-foreground transition-colors hover:text-primary"
            type="submit"
          >
            <Icon className="size-4" name="search" />
          </button>
        </div>
      </form>

      {statusOptions.length > 0 ? (
        <FilterSelect
          label="Status"
          onChange={(value) => updateFilter({ status: value as ProductStatusFlag | "all" })}
          options={statusOptions.map((flag) => ({
            label: statusLabels[flag],
            value: flag,
          }))}
          value={state.status}
        />
      ) : null}

      {collectionOptions.length > 1 ? (
        <FilterSelect
          label="Collection"
          onChange={(value) => updateFilter({ collection: value })}
          options={collectionOptions.map((option) => ({
            label: option,
            value: option,
          }))}
          value={state.collection}
        />
      ) : null}

      {categoryOptions.length > 1 ? (
        <FilterSelect
          label="Category"
          onChange={(value) => updateFilter({ category: value })}
          options={categoryOptions.map((option) => ({
            label: option,
            value: option,
          }))}
          value={state.category}
        />
      ) : null}

      <FilterSelect
        label="Availability"
        onChange={(value) => updateFilter({ stock: value as StockFilter })}
        options={[
          { label: "In stock", value: "in-stock" },
          { label: "Sold out", value: "sold-out" },
        ]}
        value={state.stock}
      />
    </div>
  );
}

function FilterSelect({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: Option[];
  value: string;
}) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {label}
      <select
        className={cx(
          "h-11 rounded-[var(--radius)] border border-border bg-background px-3 text-sm normal-case tracking-normal text-foreground outline-none transition-colors",
          "focus:border-primary",
        )}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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
    <div className="mt-6 flex min-h-[24rem] flex-col items-center justify-center rounded-[var(--radius)] border border-border bg-surface-elevated px-6 py-20 text-center">
      <Icon className="size-8 text-muted-foreground" name="search" />
      <h2 className="mt-5 font-display text-2xl font-semibold">No matching products</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {emptyMessage}
      </p>
      {hasFilters ? (
        <Button className="mt-6" onClick={clearFilters} type="button" variant="secondary">
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
