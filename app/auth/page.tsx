import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { InputHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/section-title";

export const metadata: Metadata = {
  title: "Sign in — Ember & Halo",
  description: "Sign in or create an Ember & Halo customer account.",
};

const inputClasses = "mt-2 h-13 w-full border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";

async function previewAccount(formData: FormData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");
  const rawMode = formData.get("mode");
  const mode = rawMode === "register" ? "register" : "login";
  const valid = typeof email === "string" && email.includes("@") && typeof password === "string" && password.length >= 6;

  redirect(valid ? "/account?preview=1" : `/auth?mode=${mode}&error=1`);
}

type AuthRouteProps = {
  searchParams: Promise<{ mode?: string; error?: string }>;
};

export default async function AuthRoute({ searchParams }: AuthRouteProps) {
  const params = await searchParams;
  const isRegister = params.mode === "register";

  return (
    <>
      <Container className="py-8 md:py-14">
        <div className="grid min-h-[42rem] overflow-hidden border border-border bg-surface-elevated lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative hidden min-h-full overflow-hidden lg:block">
            <Image alt="Ember & Halo night ritual collection" className="object-cover" fill preload sizes="45vw" src="/ember-halo/collection-night-shift.png" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-10 text-white">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary">Private shelf / Members</span>
              <blockquote className="mt-5 max-w-lg font-accent text-3xl italic leading-tight">“The best rotation is the one that remembers what worked.”</blockquote>
              <div className="mt-8 grid grid-cols-3 gap-px bg-white/20 text-center">
                {["Order history", "Faster checkout", "Curated saves"].map((item) => <div className="bg-black/45 px-3 py-4 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white/75 backdrop-blur-sm" key={item}>{item}</div>)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-lg">
              <Eyebrow className="text-primary">Ember &amp; Halo account</Eyebrow>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[0.95] tracking-[-0.055em] md:text-5xl">
                {isRegister ? "Make the shelf yours." : "Welcome back to the glow."}
              </h1>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {isRegister ? "Create a private place for orders, favorites, and delivery details." : "Sign in to revisit orders, saved pieces, and your personal edit."}
              </p>

              <nav aria-label="Account access" className="mt-8 grid grid-cols-2 border border-border text-center text-xs font-semibold uppercase tracking-[0.14em]">
                <Link className={!isRegister ? "bg-primary px-4 py-3 text-primary-foreground" : "px-4 py-3 text-muted-foreground transition-colors hover:text-foreground"} href="/auth?mode=login">Sign in</Link>
                <Link className={isRegister ? "bg-primary px-4 py-3 text-primary-foreground" : "px-4 py-3 text-muted-foreground transition-colors hover:text-foreground"} href="/auth?mode=register">Create account</Link>
              </nav>

              {params.error === "1" ? <p className="mt-5 border border-[var(--coral)] p-3 text-sm text-[var(--coral)]" role="alert">Enter a valid email and a password of at least six characters.</p> : null}

              <form action={previewAccount} className="mt-7 grid gap-5">
                <input name="mode" type="hidden" value={isRegister ? "register" : "login"} />
                {isRegister ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <AuthField autoComplete="given-name" label="First name" name="firstName" placeholder="Alex" />
                    <AuthField autoComplete="family-name" label="Last name" name="lastName" placeholder="Morgan" />
                  </div>
                ) : null}
                <AuthField autoComplete="email" label="Email address" name="email" placeholder="alex@example.com" type="email" />
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground" htmlFor="password">Password</label>
                    {!isRegister ? <span className="text-xs text-muted-foreground">Recovery available when auth is connected</span> : null}
                  </div>
                  <input autoComplete={isRegister ? "new-password" : "current-password"} className={inputClasses} id="password" minLength={6} name="password" placeholder="At least 6 characters" required type="password" />
                </div>
                {isRegister ? (
                  <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-muted-foreground">
                    <input className="mt-0.5 size-4 accent-[var(--primary)]" required type="checkbox" />
                    <span>I am of legal smoking age in my jurisdiction and agree to the Terms and Privacy Policy.</span>
                  </label>
                ) : null}
                <Button className="h-13 w-full" type="submit">
                  {isRegister ? "Create demo account" : "Preview account"}
                  <Icon className="size-4" name="arrow-right" />
                </Button>
              </form>

              <div className="mt-6 flex items-start gap-3 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
                <Icon className="mt-0.5 size-4 shrink-0 text-primary" name="shield-check" />
                <p>This demo validates the form and opens a customer-dashboard preview. Connect the merchant’s identity provider before production; credentials are not stored here.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

function AuthField({ label, name, ...props }: { label: string; name: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {label}
      <input className={inputClasses} name={name} required {...props} />
    </label>
  );
}
