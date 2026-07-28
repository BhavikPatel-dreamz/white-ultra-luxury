"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { navItems } from "@/lib/data";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/layout/logo";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

type NavbarProps = {
  cartCount: number;
  onCartOpen: () => void;
  wishlistCount: number;
};

const searchSuggestions = [
  { label: "Portable vaporizers", href: "/search?q=portable" },
  { label: "Desktop vaporizers", href: "/search?q=desktop" },
  { label: "Accessories", href: "/search?q=accessories" },
  { label: "Replacement parts", href: "/search?q=replacement" },
];

export function Navbar({ cartCount, onCartOpen, wishlistCount }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-elevated/95 backdrop-blur supports-[backdrop-filter]:bg-surface-elevated/88">
      <Container className="grid h-[4.5rem] grid-cols-[auto_1fr_auto] items-center gap-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-7 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground md:flex">
            {navItems.map((item) => (
              <Link
                className="relative py-2 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div />

        <div className="flex items-center gap-1">
          <Button
            aria-expanded={searchOpen}
            aria-label="Search"
            className="hidden size-10 rounded-full px-0 py-0 md:inline-flex"
            onClick={() => setSearchOpen(true)}
            type="button"
            variant="ghost"
          >
            <Icon className="size-4" name="search" />
          </Button>
          <ButtonLink
            aria-label="Account"
            className="hidden size-10 rounded-full px-0 py-0 md:inline-flex"
            href="/account"
            variant="ghost"
          >
            <Icon className="size-4" name="user" />
          </ButtonLink>
          <ButtonLink
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative size-10 rounded-full px-0 py-0"
            href="/wishlist"
            variant="ghost"
          >
            <Icon className="size-4" name="heart" />
            <span className="sr-only">{wishlistCount}</span>
            {wishlistCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.6rem] leading-4 text-primary-foreground">
                {wishlistCount}
              </span>
            ) : null}
          </ButtonLink>
          <Button
            aria-label={`Cart, ${cartCount} items`}
            className="relative size-10 rounded-full px-0 py-0"
            onClick={onCartOpen}
            type="button"
            variant="ghost"
          >
            <Icon className="size-4" name="shopping-bag" />
            <span className="sr-only">{cartCount}</span>
            {cartCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.6rem] leading-4 text-primary-foreground">
                {cartCount}
              </span>
            ) : null}
          </Button>
          <Button
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="size-10 rounded-full px-0 py-0 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
            variant="ghost"
          >
            <Icon className="size-4" name={menuOpen ? "x" : "menu"} />
          </Button>
        </div>
      </Container>

      {menuOpen ? (
        <nav className="border-t border-border bg-surface-elevated py-4 md:hidden">
          <Container className="flex flex-col gap-4 text-sm">
            <button
              className="flex items-center gap-3 rounded-[var(--radius)] border border-border px-4 py-3 text-left"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              type="button"
            >
              <Icon className="size-4" name="search" />
              Search store
            </button>
            {navItems.map((item) => (
              <Link className="py-1" href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link className="py-1" href="/account" onClick={() => setMenuOpen(false)}>
              Account
            </Link>
            <Link className="py-1" href="/wishlist" onClick={() => setMenuOpen(false)}>
              Wishlist
            </Link>
          </Container>
        </nav>
      ) : null}
      <SearchOverlay onClose={() => setSearchOpen(false)} open={searchOpen} />
    </header>
  );
}

function SearchOverlay({ onClose, open }: { onClose: () => void; open: boolean }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) {
      return;
    }

    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
    onClose();
  }

  return (
    <div
      aria-label="Search store"
      aria-modal="true"
      className="fixed inset-0 z-50 animate-[fade-in_180ms_ease-out_both] bg-background/92 px-4 py-4 backdrop-blur-md sm:px-6 sm:py-8"
      role="dialog"
    >
      <div className="mx-auto flex h-full max-w-3xl flex-col">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Logo />
          <Button aria-label="Close search" className="size-10 rounded-full px-0 py-0" onClick={onClose} type="button" variant="ghost">
            <Icon className="size-4" name="x" />
          </Button>
        </div>

        <form className="mt-10" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="site-search">
            Search products
          </label>
          <div className="flex items-center gap-3 border-b border-foreground/25 pb-4">
            <Icon className="size-5 text-muted-foreground" name="search" />
            <input
              className="min-w-0 flex-1 bg-transparent font-display text-3xl text-foreground outline-none placeholder:text-muted-foreground md:text-5xl"
              id="site-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search devices, accessories"
              ref={inputRef}
              type="search"
              value={query}
            />
          </div>
        </form>

        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_14rem]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Suggestions
            </div>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {query.trim() ? (
                <Link
                  className="flex items-center justify-between py-4 text-sm transition-colors hover:text-primary"
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                >
                  Search for &quot;{query.trim()}&quot;
                  <Icon className="size-4" name="arrow-up-right" />
                </Link>
              ) : null}
              {searchSuggestions.map((suggestion) => (
                <Link
                  className="flex items-center justify-between py-4 text-sm transition-colors hover:text-primary"
                  href={suggestion.href}
                  key={suggestion.href}
                  onClick={onClose}
                >
                  {suggestion.label}
                  <Icon className="size-4" name="arrow-up-right" />
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t border-border pt-5 text-sm text-muted-foreground md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div className="font-semibold text-foreground">Need help?</div>
            <p className="mt-2 leading-6">
              Browse products by setup, compatibility, availability, and price.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
