"use client";

import { useId, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { cx } from "@/lib/utils";

type NewsletterFormProps = {
  variant: "footer" | "home";
};

export function NewsletterForm({ variant }: NewsletterFormProps) {
  const fieldId = useId();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const isHome = variant === "home";

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <div
        className={cx(
          "flex min-h-14 items-center gap-3 border px-4 text-sm",
          isHome
            ? "border-ink/30 bg-ink text-cream"
            : "border-primary/40 bg-primary/10 text-foreground",
        )}
        role="status"
      >
        <Icon className="size-4 shrink-0 text-primary" name="check" />
        <span>
          You’re on the list{email ? `, ${email}` : ""}. Watch for the next after-hours memo.
        </span>
      </div>
    );
  }

  return (
    <form
      className={cx(
        "grid gap-3 sm:grid-cols-[1fr_auto]",
        isHome && "mt-7",
      )}
      onSubmit={subscribe}
    >
      <label className="sr-only" htmlFor={fieldId}>
        Email address
      </label>
      <input
        autoComplete="email"
        className={cx(
          "h-14 px-4 text-sm outline-none",
          isHome
            ? "border border-ink/30 bg-transparent text-ink placeholder:text-ink/55 focus:border-ink"
            : "border-b border-foreground/35 bg-transparent px-1 text-base text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary",
        )}
        id={fieldId}
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder={isHome ? "you@email.com" : "Email address"}
        required
        type="email"
        value={email}
      />
      <button
        className={cx(
          "h-14 px-7 text-[0.65rem] font-bold uppercase tracking-[0.14em] transition-[background,transform] hover:-translate-y-0.5",
          isHome
            ? "bg-ink text-cream hover:bg-violet"
            : "bg-primary text-primary-foreground hover:bg-foreground",
        )}
        type="submit"
      >
        {isHome ? "Join the night list" : "Join the list"}
      </button>
    </form>
  );
}
