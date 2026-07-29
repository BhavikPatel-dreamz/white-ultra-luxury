"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { Logo } from "@/components/layout/logo";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useDialogAccessibility } from "@/hooks/use-dialog-accessibility";

const ageCookie = "ember-halo-age-verified=1";

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
  const enterButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useDialogAccessibility<HTMLElement>(
    visible,
    () => setDismissed(true),
    enterButtonRef,
    { closeOnEscape: false },
  );

  useBodyScrollLock(visible);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] grid animate-[fade-in_220ms_ease-out_both] place-items-center bg-background/94 p-4 backdrop-blur-xl sm:p-7">
      <div aria-hidden="true" className="eh-grid absolute inset-0 opacity-35" />
      <section
        aria-describedby="age-gate-description"
        aria-labelledby="age-gate-title"
        aria-modal="true"
        className="relative grid w-full max-w-[60rem] animate-[modal-in_440ms_cubic-bezier(.22,1,.36,1)_both] overflow-hidden border border-foreground/20 bg-surface-elevated shadow-[0_40px_120px_rgba(0,0,0,0.68)] md:grid-cols-[0.82fr_1.18fr]"
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="relative hidden min-h-[36rem] overflow-hidden md:block">
          <Image
            alt="A premium hookah and vape collection in low light"
            className="object-cover object-[64%_center]"
            fill
            loading="eager"
            sizes="380px"
            src="/ember-halo/hero-night-ritual.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-violet/15" />
          <div className="absolute inset-x-0 bottom-0 p-7">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-primary">
              Enter responsibly
            </p>
            <p className="mt-2 max-w-xs font-accent text-2xl italic leading-tight">
              Better objects for the hours after hours.
            </p>
          </div>
        </div>

        <div className="relative flex flex-col justify-between p-6 sm:p-9 md:min-h-[36rem] md:p-12">
          <div className="flex items-center justify-between">
            <Logo className="text-xl" />
            <span className="grid size-12 place-items-center rounded-full border border-primary font-display text-sm font-bold text-primary">
              21+
            </span>
          </div>

          <div className="py-12 md:py-8">
            <p className="flex items-center gap-3 text-[0.58rem] font-bold uppercase tracking-[0.2em] text-coral">
              <span className="h-px w-8 bg-coral" />
              Age verification
            </p>
            <h1
              className="mt-5 text-balance font-display text-[clamp(2.8rem,6vw,5rem)] font-bold uppercase leading-[0.86] tracking-[-0.065em]"
              id="age-gate-title"
            >
              Are you of
              <br />
              <span className="font-accent font-medium normal-case italic text-primary">legal age?</span>
            </h1>
            <p
              className="mt-6 max-w-md text-sm leading-6 text-muted-foreground"
              id="age-gate-description"
            >
              Ember & Halo is intended only for adults aged 21 or older. By entering, you confirm
              that you meet the legal smoking age in your jurisdiction.
            </p>
          </div>

          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                className="h-13 bg-primary px-5 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground transition-[background,transform] hover:-translate-y-0.5 hover:bg-foreground"
                onClick={() => {
                  document.cookie = `${ageCookie}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
                  setDismissed(true);
                }}
                ref={enterButtonRef}
                type="button"
              >
                Yes, enter the site
              </button>
              <a
                className="grid h-13 place-items-center border border-border px-5 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:border-foreground hover:bg-secondary"
                href="https://www.google.com/"
              >
                No, take me out
              </a>
            </div>
            <p className="mt-5 text-[0.62rem] leading-5 text-muted-foreground">
              We store this choice for 30 days. Please enjoy responsibly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
