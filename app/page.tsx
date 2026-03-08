import { FeatureCards } from "@/components/marketing/feature-cards";
import { MarketingHero } from "@/components/marketing/hero";
import { TrustStrip } from "@/components/marketing/trust-strip";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10">
      <MarketingHero />
      <TrustStrip />
      <FeatureCards />
    </main>
  );
}
