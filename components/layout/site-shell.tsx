import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import {
  SiteHeader,
  SiteOverlays,
} from "@/components/layout/site-interactions";
import { SiteProviders } from "@/components/layout/site-providers";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <SiteProviders>
      <div className="relative flex min-h-screen flex-col bg-background">
        <a
          className="fixed left-4 top-4 z-[120] -translate-y-24 bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-transform focus:translate-y-0"
          href="#main-content"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <SiteHeader />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
        <SiteOverlays />
      </div>
    </SiteProviders>
  );
}
