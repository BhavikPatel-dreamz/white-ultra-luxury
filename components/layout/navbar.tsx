"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useDialogAccessibility } from "@/hooks/use-dialog-accessibility";
import type { Category, Collection, NavItem } from "@/types/site";

type NavbarProps = {
  cartCount: number;
  onCartOpen: () => void;
  wishlistCount: number;
};

type NavigationCategory = Pick<Category, "handle" | "id" | "name" | "parentId">;
type NavigationCollection = Pick<Collection, "handle" | "image" | "name" | "tagline">;

type NavigationPayload = {
  categories: NavigationCategory[];
  collections: NavigationCollection[];
};

type MegaMenuGroup = {
  title: string;
  links: NavItem[];
};

type NavigationStatus = "loading" | "ready" | "unavailable";

const primaryNavItems = [
  { href: "/products", label: "Shop all" },
  { href: "/categories", label: "Categories" },
  { href: "/collections", label: "Collections" },
  { href: "/products?sort=new", label: "New arrivals" },
  { href: "/about", label: "Our story" },
] satisfies NavItem[];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNavigationCategory(value: unknown): value is NavigationCategory {
  return (
    isObject(value) &&
    typeof value.handle === "string" &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    (value.parentId === undefined ||
      value.parentId === null ||
      typeof value.parentId === "string")
  );
}

function isNavigationCollection(value: unknown): value is NavigationCollection {
  return (
    isObject(value) &&
    typeof value.handle === "string" &&
    typeof value.image === "string" &&
    typeof value.name === "string" &&
    typeof value.tagline === "string"
  );
}

function parseNavigationPayload(value: unknown): NavigationPayload | null {
  if (!isObject(value)) {
    return null;
  }

  const categories = Array.isArray(value.categories)
    ? value.categories.filter(isNavigationCategory)
    : [];
  const collections = Array.isArray(value.collections)
    ? value.collections.filter(isNavigationCollection)
    : [];

  if (categories.length === 0 && collections.length === 0) {
    return null;
  }

  return { categories, collections };
}

function buildMegaMenuGroups(categories: NavigationCategory[]): MegaMenuGroup[] {
  const sortedCategories = [...categories].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const columnCount = Math.min(3, Math.max(1, Math.ceil(sortedCategories.length / 5)));
  const columnSize = Math.ceil(sortedCategories.length / columnCount);

  return Array.from({ length: columnCount }, (_, columnIndex) => {
    const groupCategories = sortedCategories.slice(
      columnIndex * columnSize,
      (columnIndex + 1) * columnSize,
    );
    const firstLetter = groupCategories.at(0)?.name.charAt(0).toUpperCase() ?? "A";
    const lastLetter = groupCategories.at(-1)?.name.charAt(0).toUpperCase() ?? "Z";

    return {
      title: `Browse ${firstLetter}–${lastLetter}`,
      links: groupCategories.map((category) => ({
        href: `/categories/${category.handle}`,
        label: category.name,
      })),
    };
  }).filter((group) => group.links.length > 0);
}

export function Navbar({ cartCount, onCartOpen, wishlistCount }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState<NavigationPayload | null>(null);
  const [navigationStatus, setNavigationStatus] =
    useState<NavigationStatus>("loading");

  const categories = navigation?.categories ?? [];
  const collections = navigation?.collections ?? [];
  const dynamicMegaMenuGroups = buildMegaMenuGroups(categories);

  useBodyScrollLock(menuOpen);

  useEffect(() => {
    const controller = new AbortController();

    async function loadNavigation() {
      try {
        const response = await fetch("/api/navigation", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          setNavigationStatus("unavailable");
          return;
        }

        const payload = parseNavigationPayload(await response.json());

        if (payload) {
          setNavigation(payload);
          setNavigationStatus("ready");
        } else {
          setNavigationStatus("unavailable");
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setNavigationStatus("unavailable");
      }
    }

    void loadNavigation();

    return () => controller.abort();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/94 backdrop-blur-xl supports-[backdrop-filter]:bg-background/86">
      <Container className="grid h-[4.6rem] grid-cols-[auto_1fr_auto] items-center gap-4 lg:h-[5.25rem] lg:grid-cols-[minmax(10rem,0.65fr)_minmax(22rem,1.4fr)_minmax(20rem,0.8fr)] lg:gap-8">
        <Logo className="text-[1.15rem] lg:text-[1.3rem]" />

        <form action="/search" className="relative hidden lg:block" method="get" role="search">
          <label className="sr-only" htmlFor="desktop-site-search">
            Search Ember & Halo
          </label>
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            name="search"
          />
          <input
            autoComplete="off"
            className="h-11 w-full border border-border bg-surface pl-11 pr-24 text-sm text-foreground outline-none transition-[border-color,background] placeholder:text-muted-foreground focus:border-primary focus:bg-surface-elevated"
            id="desktop-site-search"
            name="q"
            placeholder="Search devices, flavors, coils…"
            type="search"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border border-border px-2 py-1 text-[0.55rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Search
          </span>
        </form>

        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <details className="group relative hidden lg:block">
            <summary className="flex h-10 list-none items-center gap-2 border border-transparent px-3 text-xs font-semibold transition-colors hover:border-border hover:bg-surface">
              <Icon className="size-4" name="user" />
              <span>Account</span>
              <Icon className="size-3 transition-transform group-open:rotate-180" name="chevron-down" />
            </summary>
            <div className="absolute right-0 top-[calc(100%+0.7rem)] w-64 border border-border bg-surface-elevated p-2 shadow-[var(--shadow-soft)]">
              <p className="border-b border-border px-3 pb-3 pt-2 text-xs leading-5 text-muted-foreground">
                Sign in to view orders, saved setups and faster checkout.
              </p>
              <AccountLink href="/account" label="My account" />
              <AccountLink href="/auth" label="Sign in / register" />
              <AccountLink href="/faq" label="Help centre" />
            </div>
          </details>

          <Link
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative grid size-10 place-items-center border border-transparent transition-colors hover:border-border hover:bg-surface sm:size-11"
            href="/wishlist"
          >
            <Icon className="size-[1.1rem]" name="heart" />
            {wishlistCount > 0 ? <CountBubble count={wishlistCount} /> : null}
          </Link>

          <button
            aria-label={`Open cart, ${cartCount} items`}
            className="relative flex h-10 items-center gap-2 border border-border bg-surface px-3 text-xs font-semibold transition-[border-color,background,color] hover:border-primary hover:bg-primary hover:text-primary-foreground sm:h-11 sm:px-4"
            onClick={onCartOpen}
            type="button"
          >
            <Icon className="size-[1.05rem]" name="shopping-bag" />
            <span className="hidden sm:inline">Bag</span>
            <span className="tabular-nums">({cartCount})</span>
          </button>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label="Open menu"
            className="grid size-10 place-items-center border border-border transition-colors hover:bg-surface lg:hidden"
            onClick={() => setMenuOpen(true)}
            type="button"
          >
            <Icon className="size-[1.1rem]" name="menu" />
          </button>
        </div>
      </Container>

      <div className="relative hidden border-t border-border lg:block">
        <Container className="flex h-11 items-center justify-between gap-8">
          <nav aria-label="Primary navigation" className="flex h-full items-center gap-7">
            <details className="group static h-full">
              <summary className="flex h-full list-none items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-primary transition-colors hover:text-foreground">
                Browse
                <Icon className="size-3 transition-transform group-open:rotate-180" name="chevron-down" />
              </summary>
              <MegaMenu
                collections={collections}
                groups={dynamicMegaMenuGroups}
                status={navigationStatus}
              />
            </details>
            {primaryNavItems.map((item, index) => (
              <Link
                className="group relative flex h-full items-center text-[0.66rem] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                href={item.href}
                key={item.href}
              >
                {item.label}
                {index === 3 ? (
                  <span className="ml-2 bg-coral px-1.5 py-0.5 text-[0.48rem] text-ink">New</span>
                ) : null}
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>
          <Link
            className="inline-flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] transition-colors hover:text-primary"
            href="/#setup-guide"
          >
            Need a setup?
            <Icon className="size-3.5" name="arrow-up-right" />
          </Link>
        </Container>
      </div>

      {menuOpen ? (
        <MobileMenu
          cartCount={cartCount}
          onCartOpen={() => {
            setMenuOpen(false);
            onCartOpen();
          }}
          onClose={() => setMenuOpen(false)}
          categories={categories}
          collections={collections}
          navigationStatus={navigationStatus}
          wishlistCount={wishlistCount}
        />
      ) : null}
    </header>
  );
}

function AccountLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      className="flex items-center justify-between px-3 py-3 text-xs font-semibold transition-colors hover:bg-secondary hover:text-primary"
      href={href}
    >
      {label}
      <Icon className="size-3.5" name="arrow-up-right" />
    </Link>
  );
}

function CountBubble({ count }: { count: number }) {
  return (
    <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.55rem] font-bold leading-4 text-primary-foreground">
      {count}
    </span>
  );
}

function MegaMenu({
  collections,
  groups,
  status,
}: {
  collections: NavigationCollection[];
  groups: MegaMenuGroup[];
  status: NavigationStatus;
}) {
  const featuredCollection = collections[0];

  return (
    <div className="absolute inset-x-0 top-full border-y border-border bg-background shadow-[var(--shadow-soft)]">
      <Container className="grid min-h-72 grid-cols-[minmax(0,1fr)_20rem] gap-12 py-9">
        <div>
          <div className="mb-7 flex items-center justify-between border-b border-border pb-4">
            <div>
              <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-primary">
                Categories
              </span>
              <p className="mt-1 text-xs text-muted-foreground">Live from the store catalog</p>
            </div>
            <Link
              className="inline-flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.14em] transition-colors hover:text-primary"
              href="/categories"
            >
              View all
              <Icon className="size-3.5" name="arrow-up-right" />
            </Link>
          </div>

          {status === "loading" ? (
            <NavigationSkeleton />
          ) : groups.length > 0 ? (
            <div className="grid grid-cols-3 gap-8">
              {groups.map((group) => (
                <div key={group.title}>
                  <div className="mb-4 flex items-center gap-2 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="h-px w-5 bg-primary" />
                    {group.title}
                  </div>
                  <ul className="space-y-3">
                    {group.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-[color,transform] hover:translate-x-1 hover:text-foreground"
                          href={link.href}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <CatalogUnavailable href="/categories" label="Browse the category index" />
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-primary">
              Collections
            </span>
            <Link className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground" href="/collections">
              See all
            </Link>
          </div>

          {status === "loading" ? (
            <div aria-label="Loading collections" className="min-h-52 animate-pulse border border-border bg-surface" role="status" />
          ) : featuredCollection ? (
            <>
              <Link
                className="group relative block min-h-48 overflow-hidden border border-border"
                href={`/collections/${featuredCollection.handle}`}
              >
                <Image
                  alt={`${featuredCollection.name} collection`}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  fill
                  sizes="320px"
                  src={featuredCollection.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div>
                    <span className="text-[0.55rem] font-bold uppercase tracking-[0.16em] text-primary">
                      Featured edit
                    </span>
                    <p className="mt-1 font-display text-2xl font-bold">{featuredCollection.name}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-white/65">{featuredCollection.tagline}</p>
                  </div>
                  <Icon className="size-5 shrink-0 text-primary" name="arrow-up-right" />
                </div>
              </Link>
              {collections.length > 1 ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {collections.slice(1, 3).map((collection) => (
                    <Link
                      className="border border-border px-3 py-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
                      href={`/collections/${collection.handle}`}
                      key={collection.handle}
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <CatalogUnavailable href="/collections" label="Browse the collection index" />
          )}
        </div>
      </Container>
    </div>
  );
}

function NavigationSkeleton() {
  return (
    <div aria-label="Loading store categories" className="grid grid-cols-3 gap-8" role="status">
      {[0, 1, 2].map((column) => (
        <div className="space-y-4" key={column}>
          <div className="h-2.5 w-20 animate-pulse bg-border" />
          {[0, 1, 2, 3].map((row) => (
            <div
              className="h-3 animate-pulse bg-surface"
              key={row}
              style={{ width: `${72 + ((column + row) % 3) * 9}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function CatalogUnavailable({ href, label }: { href: string; label: string }) {
  return (
    <div className="flex min-h-36 items-center justify-between border border-dashed border-border bg-surface/40 px-6">
      <div>
        <p className="text-sm font-semibold">Catalog menu is refreshing.</p>
        <p className="mt-1 text-xs text-muted-foreground">The full index is still available.</p>
      </div>
      <Link className="inline-flex items-center gap-2 text-xs font-bold text-primary" href={href}>
        {label}
        <Icon className="size-3.5" name="arrow-up-right" />
      </Link>
    </div>
  );
}

function MobileMenu({
  cartCount,
  categories,
  collections,
  navigationStatus,
  onCartOpen,
  onClose,
  wishlistCount,
}: {
  cartCount: number;
  categories: NavigationCategory[];
  collections: NavigationCollection[];
  navigationStatus: NavigationStatus;
  onCartOpen: () => void;
  onClose: () => void;
  wishlistCount: number;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useDialogAccessibility<HTMLDivElement>(true, onClose, closeButtonRef);

  return (
    <div
      aria-label="Mobile navigation"
      aria-modal="true"
      className="fixed inset-0 z-[70] animate-[fade-in_180ms_ease-out_both] bg-background lg:hidden"
      id="mobile-navigation"
      ref={dialogRef}
      role="dialog"
      tabIndex={-1}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-[4.75rem] items-center justify-between border-b border-border px-5">
          <Logo className="text-lg" />
          <button
            aria-label="Close menu"
            className="grid size-11 place-items-center border border-border"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <Icon className="size-5" name="x" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <form action="/search" className="relative" method="get" role="search">
            <label className="sr-only" htmlFor="mobile-site-search">
              Search Ember & Halo
            </label>
            <Icon className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" name="search" />
            <input
              className="h-13 w-full border border-border bg-surface pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
              id="mobile-site-search"
              name="q"
              placeholder="What are you looking for?"
              type="search"
            />
          </form>

          <nav aria-label="Store links" className="mt-6 grid grid-cols-2 border-l border-t border-border">
            {primaryNavItems.slice(0, 4).map((item) => (
              <Link
                className="flex min-h-14 items-center justify-between border-b border-r border-border px-3 text-xs font-bold uppercase tracking-[0.1em] transition-colors hover:bg-surface"
                href={item.href}
                key={item.href}
                onClick={onClose}
              >
                {item.label}
                <Icon className="size-3" name="arrow-up-right" />
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.17em] text-primary">
              Categories
            </span>
            <Link className="text-xs text-muted-foreground underline underline-offset-4" href="/categories" onClick={onClose}>
              View all
            </Link>
          </div>
          {navigationStatus === "loading" ? (
            <div aria-label="Loading categories" className="mt-4 grid grid-cols-2 border-l border-t border-border" role="status">
              {[0, 1, 2, 3].map((item) => (
                <div className="min-h-16 animate-pulse border-b border-r border-border bg-surface" key={item} />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <nav aria-label="Product categories" className="mt-4 grid grid-cols-2 border-l border-t border-border">
              {categories.slice(0, 10).map((category, index) => (
                <Link
                  className="flex min-h-16 items-end justify-between border-b border-r border-border p-3 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
                  href={`/categories/${category.handle}`}
                  key={category.handle}
                  onClick={onClose}
                >
                  <span>{category.name}</span>
                  <span className="text-[0.55rem] opacity-55">{String(index + 1).padStart(2, "0")}</span>
                </Link>
              ))}
            </nav>
          ) : (
            <Link className="mt-4 flex items-center justify-between border border-border p-4 text-sm" href="/categories" onClick={onClose}>
              Browse the category index
              <Icon className="size-4 text-primary" name="arrow-up-right" />
            </Link>
          )}

          <div className="mt-8 flex items-center justify-between">
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.17em] text-primary">
              Collections
            </span>
            <Link className="text-xs text-muted-foreground underline underline-offset-4" href="/collections" onClick={onClose}>
              View all
            </Link>
          </div>
          {navigationStatus === "loading" ? (
            <div aria-label="Loading collections" className="mt-4 grid grid-cols-2 gap-2" role="status">
              {[0, 1].map((item) => (
                <div className="h-12 animate-pulse border border-border bg-surface" key={item} />
              ))}
            </div>
          ) : collections.length > 0 ? (
            <nav aria-label="Product collections" className="mt-4 grid grid-cols-2 gap-2">
              {collections.slice(0, 4).map((collection) => (
                <Link
                  className="flex min-h-12 items-center justify-between border border-border px-3 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
                  href={`/collections/${collection.handle}`}
                  key={collection.handle}
                  onClick={onClose}
                >
                  {collection.name}
                  <Icon className="size-3" name="arrow-up-right" />
                </Link>
              ))}
            </nav>
          ) : (
            <Link className="mt-4 flex items-center justify-between border border-border p-4 text-sm" href="/collections" onClick={onClose}>
              Browse the collection index
              <Icon className="size-4 text-primary" name="arrow-up-right" />
            </Link>
          )}

          <div className="mt-8 divide-y divide-border border-y border-border">
            <MobileUtilityLink href="/account" label="Account" onClick={onClose} value="Sign in" />
            <MobileUtilityLink href="/wishlist" label="Wishlist" onClick={onClose} value={String(wishlistCount)} />
            <button className="flex w-full items-center justify-between py-4 text-sm" onClick={onCartOpen} type="button">
              <span>Shopping bag</span>
              <span className="text-muted-foreground">{cartCount}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-border text-center text-[0.56rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="border-r border-border p-4">Adults 21+ only</span>
          <span className="p-4">Discreet delivery</span>
        </div>
      </div>
    </div>
  );
}

function MobileUtilityLink({
  href,
  label,
  onClick,
  value,
}: {
  href: string;
  label: string;
  onClick: () => void;
  value: string;
}) {
  return (
    <Link className="flex items-center justify-between py-4 text-sm" href={href} onClick={onClick}>
      <span>{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </Link>
  );
}
