import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const bodyFont = localFont({
  display: "swap",
  src: "./fonts/dm-sans-latin.woff2",
  variable: "--font-eh-sans",
  weight: "100 1000",
});

const displayFont = localFont({
  display: "swap",
  src: "./fonts/archivo-latin.woff2",
  variable: "--font-eh-display",
  weight: "100 900",
});

const accentFont = localFont({
  display: "swap",
  src: [
    {
      path: "./fonts/cormorant-garamond-latin-normal.woff2",
      style: "normal",
      weight: "500 600",
    },
    {
      path: "./fonts/cormorant-garamond-latin-italic.woff2",
      style: "italic",
      weight: "500 600",
    },
  ],
  variable: "--font-eh-accent",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ember & Halo — Objects for the After Hours",
    template: "%s · Ember & Halo",
  },
  description:
    "A premium edit of vape devices, e-liquids, hookahs, flavors and after-hours essentials for adults of legal age.",
  keywords: [
    "premium vape store",
    "hookah",
    "vape kits",
    "e-liquids",
    "pod systems",
    "hookah accessories",
  ],
  openGraph: {
    title: "Ember & Halo — Objects for the After Hours",
    description:
      "Premium vape, hookah and flavor — independently selected for better sessions.",
    type: "website",
    siteName: "Ember & Halo",
    images: [
      {
        url: "/ember-halo/hero-night-ritual.png",
        width: 2048,
        height: 1152,
        alt: "A modern hookah and vape edit in ultraviolet light",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ember & Halo — Objects for the After Hours",
    description: "Premium vape, hookah and flavor for the modern ritual.",
    images: ["/ember-halo/hero-night-ritual.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#090b10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${bodyFont.variable} ${displayFont.variable} ${accentFont.variable} h-full antialiased`}
      lang="en"
    >
      <body className="min-h-full bg-background font-sans text-foreground">{children}</body>
    </html>
  );
}
