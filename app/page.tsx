import { CatalogSection } from "@/components/sections/catalog-section";
import { CategoryNavSection } from "@/components/sections/category-nav-section";
import { ComparisonCta } from "@/components/sections/comparison-cta";
import { CraftSection } from "@/components/sections/craft-section";
import { FeatureStrip } from "@/components/sections/feature-strip";
import { HeroSection } from "@/components/sections/hero-section";
import { NewsletterSection } from "@/components/sections/newsletter-section";
import { ProductsSection } from "@/components/sections/products-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { SiteShell } from "@/components/layout/site-shell";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <SiteShell>
      <HeroSection />
      <CategoryNavSection />
      <CatalogSection />
      <ProductsSection />
      <CraftSection />
      <ComparisonCta />
      <FeatureStrip />
      <TestimonialsSection />
      <NewsletterSection />
    </SiteShell>
  );
}
