import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DaVinci \u2014 Precision Vaporizers, Engineered",
  description:
    "Premium portable and desktop vaporizers with ceramic airpaths, 1\u00b0 precision temperature control, and a 10-year warranty.",
  openGraph: {
    title: "DaVinci \u2014 Precision Vaporizers, Engineered",
    description:
      "Premium portable and desktop vaporizers with ceramic airpaths, 1\u00b0 precision temperature control, and a 10-year warranty.",
    type: "website",
    images: [
      {
        url: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/33d47cc3-893d-4618-8980-4fbb6614858b/id-preview-24c57021--1324f714-14f8-40de-ba1b-e0e5141430dd.lovable.app-1784611363017.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DaVinci \u2014 Precision Vaporizers, Engineered",
    description:
      "Premium portable and desktop vaporizers with ceramic airpaths, 1\u00b0 precision temperature control, and a 10-year warranty.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/33d47cc3-893d-4618-8980-4fbb6614858b/id-preview-24c57021--1324f714-14f8-40de-ba1b-e0e5141430dd.lovable.app-1784611363017.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background font-sans text-foreground">{children}</body>
    </html>
  );
}
