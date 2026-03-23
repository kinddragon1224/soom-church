import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";

export const dynamic = "force-dynamic";
export const preferredRegion = "sin1";

const navSections = [
  {
    title: "workspace",
    items: [
      { key: "dashboard", label: "홈", href: "dashboard", hint: "운영 요약" },
      { key: "members", label: "사람", href: "members", hint: "교인과 상태" },
      { key: "applications", label: "신청", href: "applications", hint: "접수와 처리" },
      { key: "notices", label: "공지", href: "notices", hint: "전달 흐름" },
    ],
  },
  {
    title: "system",
    items: [{ key: "settings", label: "설정", href: "settings", hint: "워크스페이스 기본값" }],
  },
] as const;

export default async function ChurchWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { churchSlug: string };
}) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);

  if (!membership) {
    return (
      <div className="min-h-screen bg-[#EDE6D8] p-4 sm:p-6">
        <div className="mx-auto w-full max-w-2xl rounded-[28px] border border-[#DDD1BE] bg-[#FBF9F4] p-6 text-[#121212] shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <h1 className="text-xl font-semibold">이 워크스페이스에 접근할 권한이 없어</h1>
          <p className="mt-2 text-sm text-[#5F564B]">다른 워크스페이스를 선택하거나 관리자에게 문의해줘.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link href="/app" className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-white">워크스페이스 선택</Link>
            <Link href="/signup" className="rounded-[12px] border border-[#DDD1BE] px-4 py-2 text-[#121212]">회원가입</Link>
          </div>
        </div>
      </div>
    );
  }

  const church = membership.church;
  const base = `/app/${church.slug}`;

  return (
    <main className="min-h-screen bg-[#EDE6D8] text-[#121212] lg:h-dvh lg:min-h-0 lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-full lg:min-h-0 lg:grid-cols-[296px_minmax(0,1fr)] lg:gap-3 lg:p-3">
        <aside className="border-b border-[#1b2740] bg-[#0F172A] px-4 py-5 text-white lg:h-full lg:min-h-0 lg:overflow-y-auto lg:rounded-[28px] lg:border lg:border-[#16233b] lg:shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
          <div className="lg:flex lg:min-h-full lg:flex-col lg:py-1">
            <div className="flex items-start justify-between gap-3 px-1">
              <div>
                <Link href={`${base}/dashboard`} className="font-display text-[1.6rem] font-semibold tracking-[-0.08em] text-white">
                  SOOM workspace
                </Link>
                <p className="mt-2 text-xs text-white/52">교회 운영과 실행을 한곳에서 정리하는 허브</p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.16em] text-white/50">LIVE</span>
            </div>

            <div className="mt-6 rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
              <p className="text-[11px] tracking-[0.18em] text-white/38">CURRENT WORKSPACE</p>
              <p className="mt-2 text-sm font-semibold text-white">{church.name}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/58">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">무료 플랜</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">실사용 워크스페이스</span>
              </div>
              <div className="mt-4 rounded-[18px] border border-[#C8A96B]/20 bg-[#C8A96B]/10 px-3 py-3">
                <p className="text-[11px] tracking-[0.16em] text-[#E7D7B1]">WORKSPACE HEALTH</p>
                <p className="mt-2 text-sm font-medium text-white">운영 시작선 정리중</p>
                <p className="mt-2 text-xs leading-5 text-white/54">사람, 신청, 공지 흐름을 먼저 실사용 기준으로 맞추는 단계야.</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {navSections.map((section) => (
                <div key={section.title}>
                  <p className="px-2 text-[11px] uppercase tracking-[0.18em] text-white/28">{section.title}</p>
                  <div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.key}
                        href={`${base}/${item.href}`}
                        className="rounded-[16px] px-3 py-3 text-sm text-white/72 transition hover:bg-white/6 hover:text-white"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="mt-1 text-[11px] text-white/36">{item.hint}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[20px] border border-white/8 bg-white/[0.04] p-4">
              <p className="text-[11px] tracking-[0.18em] text-white/38">SHORTCUTS</p>
              <div className="mt-3 grid gap-2">
                <Link href="/" className="rounded-[14px] border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm text-white/74 transition hover:bg-white/8 hover:text-white">홈으로</Link>
                <Link href="/app" className="rounded-[14px] border border-white/8 bg-white/[0.03] px-3 py-2.5 text-sm text-white/74 transition hover:bg-white/8 hover:text-white">워크스페이스 선택</Link>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 bg-[#F4F0E8] lg:h-full lg:min-h-0 lg:overflow-y-auto lg:rounded-[30px] lg:border lg:border-[#DDD1BE] lg:bg-[#F4F0E8] lg:shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[#E3D9C9] bg-[#FBF9F4] px-5 py-4 sm:px-7 lg:sticky lg:top-0 lg:z-20 lg:rounded-t-[30px]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">SOOM WORKSPACE</p>
                  <h1 className="mt-2 text-[1.9rem] font-semibold tracking-[-0.05em] text-[#121212]">{church.name}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5F564B]">실제 교회 운영을 위해 사람, 신청, 공지 흐름을 한곳에서 관리하는 워크스페이스</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-[#8C7A5B]">
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">Asia/Seoul</span>
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">교회 운영 모드</span>
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1">실사용 기준 개발중</span>
                </div>
              </div>
              <div className="flex flex-col items-stretch gap-3 lg:min-w-[380px] lg:items-end">
                <div className="flex w-full max-w-[420px] items-center gap-2 rounded-[16px] border border-[#E7E0D4] bg-white px-3 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                  <span className="text-sm text-[#8C7A5B]">⌘K</span>
                  <span className="text-sm text-[#7B6F60]">교인, 신청, 공지, 설정을 빠르게 찾기</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8C7A5B]">
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1.5">실사용 워크스페이스</span>
                  <span className="rounded-full border border-[#E7E0D4] bg-white px-3 py-1.5">owner</span>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 p-5 sm:p-7">{children}</div>
        </section>
      </div>
    </main>
  );
}
