import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PlatformAdminPage() {
  const [churches, subscriptions, users, guideCount, publishedGuideCount] = await Promise.all([
    prisma.church.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { members: true, memberships: true } },
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      take: 30,
    }),
    prisma.subscription.findMany({ include: { church: { select: { name: true, slug: true, isActive: true } } }, take: 30 }),
    prisma.user.findMany({ where: { isActive: true }, include: { memberships: true }, take: 50 }),
    prisma.guidePost.count(),
    prisma.guidePost.count({ where: { published: true } }),
  ]);

  const churchCount = churches.filter((church) => church.isActive).length;
  const subscriptionCount = subscriptions.length;
  const activeUserCount = users.length;
  const inactiveChurchCount = churches.filter((church) => !church.isActive).length;
  const emptyChurchCount = churches.filter((church) => church._count.members === 0).length;
  const trialChurchCount = churches.filter((church) => church.subscriptions[0]?.status === "TRIALING").length;
  const attentionChurchs = churches.filter(
    (church) => !church.isActive || church._count.members === 0 || church.subscriptions[0]?.status === "TRIALING",
  );
  const recentChurch = churches[0] ?? null;
  const attentionChurch = attentionChurchs[0] ?? null;
  const publishedRatio = guideCount > 0 ? `${publishedGuideCount}/${guideCount}` : "0/0";

  const cards = [
    ["교회 관리", churchCount, "/platform-admin/churches", "실제 등록 교회 운영"],
    ["구독 관리", subscriptionCount, "/platform-admin/subscriptions", "플랜/상태 확인"],
    ["사용자 관리", activeUserCount, "/platform-admin/users", "가입/소속 상태 확인"],
    ["블로그", guideCount, "/guides", "콘텐츠 관리"],
  ] as const;

  const actionCards = [
    recentChurch
      ? {
          label: "방금 등록된 교회",
          title: recentChurch.name,
          note: `${recentChurch.slug} · 교인 ${recentChurch._count.members}명`,
          href: `/platform-admin/churches/${recentChurch.id}`,
          cta: "상세 보기",
        }
      : null,
    attentionChurch
      ? {
          label: "지금 확인할 교회",
          title: attentionChurch.name,
          note: `${attentionChurch.isActive ? "운영중" : "비활성"} · ${attentionChurch.subscriptions[0]?.status ?? "FREE"} · 교인 ${attentionChurch._count.members}명`,
          href: `/platform-admin/churches/${attentionChurch.id}`,
          cta: "바로 열기",
        }
      : null,
    {
      label: "블로그 관리",
      title: `발행 ${publishedRatio}`,
      note: "공개 블로그와 관리자 에디터를 연결해서 관리",
      href: "/guides",
      cta: "관리하기",
    },
    {
      label: "워크스페이스 생성",
      title: "새 교회 준비",
      note: "프로비저닝 흐름을 계속 확장할 기준 진입점",
      href: "/platform-admin/provisioning",
      cta: "열기",
    },
  ].filter(Boolean) as { label: string; title: string; note: string; href: string; cta: string }[];

  const statusRail = [
    { label: "주의 대상", value: attentionChurchs.length, note: "trial / 비활성 / 빈 데이터" },
    { label: "빈 교회", value: emptyChurchCount, note: "교인 데이터 0명" },
    { label: "비활성", value: inactiveChurchCount, note: "운영 중단 상태" },
    { label: "trial", value: trialChurchCount, note: "전환 체크 필요" },
  ] as const;

  return (
    <div className="space-y-4 text-[#111111]">
      <section className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.2em] text-white/46">PLATFORM ADMIN</p>
            <h1 className="mt-3 text-[2.2rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">플랫폼 관리자 본체</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">교회, 사용자, 구독, 블로그 상태를 보고 바로 다음 조치를 선택하는 운영 홈.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/platform-admin/churches" className="rounded-[14px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white">교회 관리</Link>
            <Link href="/guides" className="rounded-[14px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white">블로그 관리</Link>
            <Link href="/platform-admin/provisioning" className="rounded-[14px] border border-white/12 bg-white/8 px-4 py-2 text-sm font-medium text-white">새 교회 준비</Link>
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
        {statusRail.map((item) => (
          <div key={item.label} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] px-4 py-3">
            <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-[#111111]">{item.value}</p>
            <p className="mt-1 text-xs text-[#8c7a5b]">{item.note}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#efe7da] pb-4">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">NEXT ACTIONS</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">바로 처리할 작업</h2>
          </div>
          <span className="text-xs text-[#8C7A5B]">운영 우선순위</span>
        </div>
        <div className="mt-4 grid gap-3 xl:grid-cols-4">
          {actionCards.map((card) => (
            <div key={card.label} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
              <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{card.label}</p>
              <p className="mt-2 text-sm font-semibold text-[#111111]">{card.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#5f564b]">{card.note}</p>
              <Link href={card.href} className="mt-4 inline-flex rounded-[12px] border border-[#d9d2c7] bg-white px-3 py-2 text-sm font-medium text-[#111111]">
                {card.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
