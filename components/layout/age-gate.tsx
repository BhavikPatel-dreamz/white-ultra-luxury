"use client";

import { useState, useSyncExternalStore } from "react";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { Button, buttonClasses } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-title";

const ageCookie = "davinci-age-verified=1";

function getAgeGateSnapshot() {
  return typeof document !== "undefined" && !document.cookie.includes(ageCookie);
}

function subscribeAgeGate(onStoreChange: () => void) {
  const timer = window.setTimeout(onStoreChange, 0);

  return () => window.clearTimeout(timer);
}

export function AgeGate() {
  const shouldShow = useSyncExternalStore(subscribeAgeGate, getAgeGateSnapshot, () => false);
  const [dismissed, setDismissed] = useState(false);
  const visible = shouldShow && !dismissed;

  useBodyScrollLock(visible);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex animate-[fade-in_220ms_ease-out_both] items-center justify-center bg-background/96 px-6 backdrop-blur-lg">
      <div className="w-full max-w-xl animate-[modal-in_360ms_ease-out_50ms_both] border border-border bg-surface-elevated p-7 text-center shadow-[var(--shadow-soft)] md:p-10">
        <Eyebrow className="mb-6 text-primary">DaVinci age verification</Eyebrow>
        <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
          Confirm you are 21 or older.
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          This store is intended only for adults of legal age. By entering, you agree to follow
          all applicable local laws and understand that products shown here are age-restricted.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            onClick={() => {
              document.cookie = `${ageCookie}; path=/; max-age=${60 * 60 * 24 * 30}`;
              setDismissed(true);
            }}
            type="button"
          >
            Enter site
          </Button>
          <a
            className={buttonClasses("secondary")}
            href="https://google.com"
          >
            Exit
          </a>
        </div>
        <p className="mt-8 text-xs leading-5 text-muted-foreground">
          Vaping products are not for minors. We use a cookie to remember this confirmation for
          30 days.
        </p>
      </div>
    </div>
  );
}
