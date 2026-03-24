import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PlatformAdminPage() {
  const [churchCount, subscriptionCount, guideCount, publishedGuideCount, activeUserCount] = await Promise.all([
    prisma.church.count({ where: { isActive: true } }),
    prisma.subscription.count(),
    prisma.guidePost.count(),
    prisma.guidePost.count({ where: { published: true } }),
    prisma.user.count({ where: { isActive: true } }),
  ]);

  const cards = [
    ["교회 관리", churchCount, "/platform-admin/churches", "실제 등록 교회 운영"],
    ["구독 관리", subscriptionCount, "/platform-admin/subscriptions", "플랜/상태 확인"],
    ["사용자 관리", activeUserCount, "/platform-admin/users", "가입/소속 상태 확인"],
    ["AI 안내서", guideCount, "/guides", "공개 콘텐츠 관리"],
  ] as const;

  const focusRail = [
    { label: "공개 안내서", value: publishedGuideCount, note: "지금 공개중인 콘텐츠" },
    { label: "비공개 안내서", value: guideCount - publishedGuideCount, note: "초안 또는 미발행" },
    { label: "활성 교회", value: churchCount, note: "운영중 워크스페이스" },
    { label: "활성 사용자", value: activeUserCount, note: "로그인 가능한 계정" },
  ] as const;

  return (
    <div className="space-y-4 text-[#111111]">
      <section className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-white/46">PLATFORM ADMIN</p>
            <h1 className="mt-3 text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">gloo 스타일 운영 콘솔</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">실제 등록 교회, 사용자, 구독, 공개 콘텐츠를 한 화면에서 보고 바로 이동하는 플랫폼 관리자 홈.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/platform-admin/churches" className="rounded-[14px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white">교회 관리</Link>
            <Link href="/guides" className="rounded-[14px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white">AI 안내서 관리</Link>
            <Link href="/ai-guides" className="rounded-[14px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white">공개 페이지 보기</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, href, note]) => (
          <Link key={label} href={href} className="rounded-[20px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:border-[#d8c8af] hover:bg-[#fcfbf8]">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#111111]">{value}</p>
            <p className="mt-2 text-xs text-[#8c7a5b]">{note}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {focusRail.map((item) => (
          <div key={item.label} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-4 py-3">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#111111]">{item.value}</p>
            <p className="mt-1 text-xs text-[#8c7a5b]">{item.note}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
