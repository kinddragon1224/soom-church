import { BrandSection } from "@/components/marketing/brand-section";
import { FooterCta } from "@/components/marketing/footer-cta";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingHero } from "@/components/marketing/hero";
import { ModuleSection } from "@/components/marketing/module-section";
import { PlatformSection } from "@/components/marketing/platform-section";
import { ServiceOffersSection } from "@/components/marketing/service-offers-section";
import { getCurrentUserId } from "@/lib/auth";
import { getChurchBySlug, getFirstChurchByUserId } from "@/lib/church-context";
import { PLATFORM_ADMIN_EMAILS } from "@/lib/platform-admin";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const userId = getCurrentUserId();

  let action = {
    primaryHref: "/signup",
    primaryLabel: "상품 보기",
    secondaryHref: "/login",
    secondaryLabel: "숨 로그인",
    loggedIn: false,
  };

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });

    if (user && PLATFORM_ADMIN_EMAILS.includes(user.email)) {
      const demoChurch = await getChurchBySlug("daehung-ieum-dubit");
      action = {
        primaryHref: "/platform-admin",
        primaryLabel: "운영 콘솔 열기",
        secondaryHref: demoChurch ? `/app/${demoChurch.slug}/dashboard` : "/app",
        secondaryLabel: demoChurch ? "데모 워크스페이스 보기" : "워크스페이스 보기",
        loggedIn: true,
      };
    } else {
      const church = await getFirstChurchByUserId(userId);
      if (church) {
        action = {
          primaryHref: `/app/${church.slug}/dashboard`,
          primaryLabel: "진행 중인 작업 보기",
          secondaryHref: "/app",
          secondaryLabel: "워크스페이스 목록",
          loggedIn: true,
        };
      } else {
        action = {
          primaryHref: "/app",
          primaryLabel: "상품 진행 현황 보기",
          secondaryHref: "/signup",
          secondaryLabel: "도입 흐름 보기",
          loggedIn: true,
        };
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#07090f] text-white">
      <MarketingHeader action={action} />
      <MarketingHero action={action} />
      <BrandSection />
      <ServiceOffersSection />
      <PlatformSection />
      <ModuleSection />
      <FooterCta action={action} />
    </main>
  );
}
