import { BrandSection } from "@/components/marketing/brand-section";
import { FooterCta } from "@/components/marketing/footer-cta";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingHero } from "@/components/marketing/hero";
import { ModuleSection } from "@/components/marketing/module-section";
import { PlatformSection } from "@/components/marketing/platform-section";
import { getCurrentUserId } from "@/lib/auth";
import { getFirstChurchByUserId } from "@/lib/church-context";
import { PLATFORM_ADMIN_EMAILS } from "@/lib/platform-admin";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const userId = getCurrentUserId();

  let action = {
    primaryHref: "/signup",
    primaryLabel: "숨 시작하기",
    secondaryHref: "/login",
    secondaryLabel: "숨 로그인",
    loggedIn: false,
  };

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });

    if (user && PLATFORM_ADMIN_EMAILS.includes(user.email)) {
      action = {
        primaryHref: "/platform-admin",
        primaryLabel: "플랫폼 콘솔로 이동",
        secondaryHref: "/app",
        secondaryLabel: "워크스페이스 보기",
        loggedIn: true,
      };
    } else {
      const church = await getFirstChurchByUserId(userId);
      if (church) {
        action = {
          primaryHref: `/app/${church.slug}/dashboard`,
          primaryLabel: "내 워크스페이스로 이동",
          secondaryHref: "/app",
          secondaryLabel: "워크스페이스 목록",
          loggedIn: true,
        };
      } else {
        action = {
          primaryHref: "/app",
          primaryLabel: "워크스페이스 연결",
          secondaryHref: "/signup",
          secondaryLabel: "온보딩 보기",
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
      <PlatformSection />
      <ModuleSection />
      <FooterCta action={action} />
    </main>
  );
}
