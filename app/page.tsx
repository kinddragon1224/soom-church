import { BrandSection } from "@/components/marketing/brand-section";
import { FooterCta } from "@/components/marketing/footer-cta";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingHero } from "@/components/marketing/hero";
import { ModuleSection } from "@/components/marketing/module-section";
import { PlatformSection } from "@/components/marketing/platform-section";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07090f] text-white">
      <MarketingHeader />
      <MarketingHero />
      <BrandSection />
      <PlatformSection />
      <ModuleSection />
      <FooterCta />
    </main>
  );
}
