import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { getWorkspaceNotices } from "@/lib/workspace-data";
import { formatDate } from "@/lib/date";

export default async function ChurchNoticesPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) {
    return (
      <section className="rounded-[24px] border border-[#E7E0D4] bg-white p-5 text-[#121212] shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
        <h2 className="text-lg font-semibold">접근 권한이 없어</h2>
        <p className="mt-2 text-sm text-[#5F564B]">워크스페이스 선택 화면으로 돌아가 다시 시도해줘.</p>
      </section>
    );
  }

  const church = membership.church;
  const notices = await getWorkspaceNotices(church.id);

  const pinnedCount = notices.filter((notice) => notice.pinned).length;
  const recentCount = notices.length;

  const actionRail = [
    {
      title: `상단 고정 ${pinnedCount}건`,
      desc: "가장 중요한 공지가 위에 잘 보이는지 먼저 확인합니다.",
      href: `#`,
    },
    {
      title: `최근 공지 ${recentCount}건`,
      desc: "이번 주 전달 흐름을 한 번에 점검합니다.",
      href: `#`,
    },
    {
      title: "공지 리듬 정리",
      desc: "주간 공지와 행사 공지를 나눠서 관리할 준비를 합니다.",
      href: `#`,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] tracking-[0.2em] text-white/46">NOTICE WORKSPACE</p>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.7rem]">
                공지와 전달 흐름을
                <br />
                한눈에 정리합니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                중요한 공지, 최근 공지, 전달 리듬을 한 화면에서 보고 바로 다음 액션으로 이어지는 실사용 공지 화면입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[240px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">{church.name}</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">notices</span>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">TOTAL</p>
              <p className="mt-2 text-2xl font-semibold">{recentCount}</p>
              <p className="mt-2 text-xs text-white/60">현재 등록된 공지</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">PINNED</p>
              <p className="mt-2 text-2xl font-semibold">{pinnedCount}</p>
              <p className="mt-2 text-xs text-white/60">상단 고정 공지</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">FLOW</p>
              <p className="mt-2 text-2xl font-semibold">1</p>
              <p className="mt-2 text-xs text-white/60">공지 운영 리듬</p>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">QUICK VIEW</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">바로 보기</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">notices</span>
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#111111]">상단 고정 공지</p>
                <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{pinnedCount}</span>
              </div>
            </div>
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#111111]">최근 공지</p>
                <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{recentCount}</span>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.86fr_1.14fr]">
        <div className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ACTION RAIL</p>
                <h2 className="mt-2 text-lg font-semibold text-[#111111]">지금 먼저 할 일</h2>
              </div>
              <span className="text-xs text-[#8C7A5B]">운영 우선순위</span>
            </div>
            <div className="mt-4 grid gap-3">
              {actionRail.map((item) => (
                <div key={item.title} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">NOTICE LIST</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">공지 목록</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">최근 공지 순</span>
          </div>
          <div className="mt-4 grid gap-3">
            {notices.length === 0 ? (
              <div className="rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">
                아직 표시할 공지가 없어. 공지를 만들기 시작하면 여기서 바로 운영할 수 있어.
              </div>
            ) : (
              notices.map((notice) => (
                <div key={notice.id} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#111111]">{notice.title}</p>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] ${notice.pinned ? "bg-[#fff4df] text-[#8C6A2E]" : "border border-[#e6dfd5] bg-white text-[#8C7A5B]"}`}>
                          {notice.pinned ? "상단고정" : "일반"}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b] line-clamp-2">{notice.content}</p>
                      <p className="mt-1 text-[11px] text-[#9a8b7a]">등록일 {formatDate(notice.createdAt)}</p>
                    </div>
                    <div className="grid gap-2 text-[11px] text-[#7a6d5c] sm:min-w-[180px]">
                      <div className="rounded-[12px] border border-[#e6dfd5] bg-white px-3 py-2">다음 단계: 전달 확인</div>
                      <div className="rounded-[12px] border border-[#e6dfd5] bg-white px-3 py-2">상태: {notice.pinned ? "고정됨" : "일반"}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
