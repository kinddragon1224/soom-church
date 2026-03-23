"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navSections = [
  {
    title: "workspace",
    items: [
      { href: "/workspace", label: "홈", hint: "운영 요약" },
      { href: "/workspace/people", label: "사람", hint: "후속관리" },
      { href: "/workspace/notices", label: "커뮤니케이션", hint: "공지 흐름" },
      { href: "/workspace/tasks", label: "작업 흐름", hint: "팀 마감" },
      { href: "/workspace/content", label: "콘텐츠 스튜디오", hint: "제작 파이프라인" },
    ],
  },
  {
    title: "system",
    items: [{ href: "/workspace/settings", label: "설정", hint: "도입 구조" }],
  },
];

const utilityLinks = [
  { href: "/pricing", label: "상품 구조" },
  { href: "/contact", label: "도입 문의" },
  { href: "/ai-guides", label: "블로그" },
];

const pulseItems = [
  { label: "오늘 후속 연락", value: "3건", tone: "gold" },
  { label: "예약 공지", value: "4건", tone: "slate" },
  { label: "콘텐츠 검토", value: "2건", tone: "slate" },
];

const activeRoute = {
  "/workspace": { title: "운영 홈", desc: "지금 처리해야 할 흐름을 한 화면에서 정리합니다." },
  "/workspace/people": { title: "사람 흐름", desc: "새가족부터 정착과 봉사 연결까지 상태를 관리합니다." },
  "/workspace/notices": { title: "커뮤니케이션", desc: "대상별 공지와 예약 발송 흐름을 맞춥니다." },
  "/workspace/tasks": { title: "작업 흐름", desc: "사역팀이 마감까지 놓치지 않도록 보드를 공유합니다." },
  "/workspace/content": { title: "콘텐츠 스튜디오", desc: "설교·행사 요청을 결과물까지 한 파이프라인으로 연결합니다." },
  "/workspace/settings": { title: "워크스페이스 설정", desc: "도입 상태와 팀 기본값을 정리합니다." },
} as const;

const moduleCards = [
  { href: "/workspace/people", label: "사람", value: "후속관리 9건", note: "48시간 안에 연락이 필요한 흐름", tone: "slate" },
  { href: "/workspace/notices", label: "공지", value: "예약 4건", note: "수요일·주말 발송 점검 필요", tone: "gold" },
  { href: "/workspace/tasks", label: "작업", value: "오늘 마감 2건", note: "체크리스트와 검토가 연결된 상태", tone: "slate" },
  { href: "/workspace/content", label: "콘텐츠", value: "검토 1건", note: "썸네일 승인 후 바로 배포 가능", tone: "slate" },
] as const;

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = activeRoute[pathname as keyof typeof activeRoute] ?? activeRoute["/workspace"];

  return (
    <main className="min-h-screen bg-[#F4F0E8] text-[#121212]">
      <div className="grid min-h-screen lg:grid-cols-[296px_1fr]">
        <aside className="border-b border-[#1b2740] bg-[#0F172A] px-4 py-5 text-white lg:min-h-full lg:border-b-0 lg:border-r">
          <div className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:flex-col lg:py-1">
            <div className="flex items-start justify-between gap-3 px-1">
              <div>
                <Link href="/workspace" className="font-display text-[1.6rem] font-semibold tracking-[-0.08em] text-white">
                  SOOM workspace
                </Link>
                <p className="mt-2 text-xs text-white/52">교회 운영과 실행을 한곳에서 정리하는 허브</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/50">DEMO</span>
            </div>

            <div className="mt-6 rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
              <p className="text-[11px] tracking-[0.18em] text-white/38">CURRENT WORKSPACE</p>
              <p className="mt-2 text-sm font-semibold text-white">대흥교회 청년부</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/58">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">무료 플랜</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">팀원 4명</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">월요일 운영 모드</span>
              </div>
              <div className="mt-4 rounded-[18px] border border-[#C8A96B]/20 bg-[#C8A96B]/10 px-3 py-3">
                <p className="text-[11px] tracking-[0.16em] text-[#E7D7B1]">WORKSPACE HEALTH</p>
                <p className="mt-2 text-sm font-medium text-white">기본 도입 단계 진행중</p>
                <p className="mt-2 text-xs leading-5 text-white/54">사람 상태 체계와 공지 흐름을 맞추면 운영 시작선이 정리됩니다.</p>
              </div>
              <div className="mt-4 grid gap-2">
                {pulseItems.map((item) => (
                  <div key={item.label} className="rounded-[16px] border border-white/8 bg-[#111c33] px-3 py-3">
                    <p className="text-[11px] text-white/40">{item.label}</p>
                    <div className="mt-1 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{item.value}</p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] ${
                          item.tone === "gold" ? "bg-[#C8A96B]/18 text-[#E7D7B1]" : "bg-white/8 text-white/62"
                        }`}
                      >
                        live
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {navSections.map((section) => (
                <div key={section.title}>
                  <p className="px-2 text-[11px] uppercase tracking-[0.18em] text-white/28">{section.title}</p>
                  <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                    {section.items.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`rounded-[16px] px-3 py-3 text-sm transition ${
                            active
                              ? "bg-[#C8A96B] text-[#121212] shadow-[0_10px_24px_rgba(200,169,107,0.25)]"
                              : "text-white/72 hover:bg-white/6 hover:text-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className={`font-medium ${active ? "font-semibold" : ""}`}>{item.label}</p>
                              <p className={`mt-1 text-[11px] ${active ? "text-[#3f3216]" : "text-white/36"}`}>{item.hint}</p>
                            </div>
                            {active ? <span className="text-[10px] uppercase tracking-[0.18em]">now</span> : null}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
              <p className="text-[11px] tracking-[0.18em] text-white/38">SHORTCUTS</p>
              <div className="mt-3 grid gap-2">
                {utilityLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-[14px] border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm text-white/74 transition hover:bg-white/8 hover:text-white">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3 lg:mt-auto">
              <div className="rounded-[18px] border border-[#C8A96B]/20 bg-[#C8A96B]/10 p-4">
                <p className="text-xs tracking-[0.18em] text-[#E7D7B1]">UPGRADE</p>
                <p className="mt-2 text-sm font-medium text-white">무료로 시작하고, 운영이 자리 잡히면 확장하세요</p>
                <p className="mt-2 text-xs leading-5 text-white/54">사람 관리, 공지, 작업 흐름, 콘텐츠 요청까지 같은 구조로 이어집니다.</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 bg-[#F4F0E8]">
          <div className="border-b border-[#E3D9C9] bg-[#FBF9F4] px-5 py-4 sm:px-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">SOOM WORKSPACE</p>
                  <h1 className="mt-2 text-[1.9rem] font-semibold tracking-[-0.05em] text-[#121212]">{current.title}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F564B]">{current.desc}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-[#8C7A5B]">
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">대흥교회 청년부</span>
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">무료 플랜</span>
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">팀원 4명</span>
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">월요일 운영 모드</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/" className="inline-flex min-h-10 items-center justify-center rounded-[12px] border border-[#E7E0D4] bg-white px-4 text-sm font-medium text-[#121212]">
                  홈으로
                </Link>
                <Link href="/pricing" className="inline-flex min-h-10 items-center justify-center rounded-[12px] border border-[#E7E0D4] bg-white px-4 text-sm font-medium text-[#121212]">
                  상품 보기
                </Link>
                <Link href="/signup" className="inline-flex min-h-10 items-center justify-center rounded-[12px] bg-[#0F172A] px-4 text-sm font-semibold text-white">
                  무료로 시작하기
                </Link>
              </div>
            </div>

            <div className="mt-5 grid gap-3 xl:grid-cols-4">
              {moduleCards.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-[20px] border p-4 transition ${
                      active
                        ? "border-[#C8A96B] bg-[#fff8ea] shadow-[0_12px_30px_rgba(200,169,107,0.16)]"
                        : "border-[#E7E0D4] bg-white hover:border-[#d8ccb8] hover:bg-[#fffdf8]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] tracking-[0.18em] text-[#8C7A5B]">{item.label}</p>
                        <p className="mt-2 text-sm font-semibold text-[#121212]">{item.value}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] ${
                          active
                            ? "bg-[#C8A96B] text-[#2f2513]"
                            : item.tone === "gold"
                              ? "bg-[#fff4df] text-[#8C6A2E]"
                              : "bg-[#f3f4f6] text-[#5f564b]"
                        }`}
                      >
                        {active ? "현재" : "live"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#5F564B]">{item.note}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 p-5 sm:p-7">{children}</div>
        </section>
      </div>
    </main>
  );
}
