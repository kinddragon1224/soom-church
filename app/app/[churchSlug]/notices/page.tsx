import { requireWorkspaceMembership } from "@/lib/church-context";
import { getWorkspaceNotices } from "@/lib/workspace-data";
import { formatDate } from "@/lib/date";

function getNoticeDeliveryState({ pinned, index }: { pinned: boolean; index: number }) {
  if (pinned) {
    return {
      lane: "핵심 공지",
      surface: "상단 고정",
      rhythm: "예배 전 반복 노출",
      badgeClass: "bg-[#fff4df] text-[#8C6A2E]",
      note: "예배 전에도 위에 남겨두는 핵심 공지",
    };
  }

  if (index < 3) {
    return {
      lane: "이번 주 안내",
      surface: "일반 공지",
      rhythm: "오늘-주중 전달",
      badgeClass: "border border-[#e6dfd5] bg-[#fcfbf8] text-[#8C7A5B]",
      note: "지금 바로 확인할 최신 일반 공지",
    };
  }

  return {
    lane: "지난 공지",
    surface: "일반 공지",
    rhythm: "보관·재확인",
    badgeClass: "border border-[#ece6dc] bg-white text-[#9a8b7a]",
    note: "필요할 때 다시 꺼내 보는 이전 공지",
  };
}

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

  const pinnedNotices = notices.filter((notice) => notice.pinned);
  const normalNotices = notices.filter((notice) => !notice.pinned);
  const activeDeliveryNotices = normalNotices.slice(0, 3);
  const archivedNotices = normalNotices.slice(3);
  const recentNotice = notices[0];

  const actionRail = [
    {
      title: `상단 고정 ${pinnedNotices.length}건`,
      desc: pinnedNotices.length > 0 ? "예배 전 꼭 보여야 하는 공지가 위에 남아 있는지 확인합니다." : "지금 주간 핵심 공지를 하나 상단에 고정해두면 전달 누락을 줄일 수 있습니다.",
    },
    {
      title: `오늘 확인 ${Math.min(notices.length, 3)}건`,
      desc: recentNotice ? `가장 최근 공지는 ${formatDate(recentNotice.createdAt)} 등록분입니다.` : "아직 등록된 공지가 없어 새 공지 작성부터 시작하면 됩니다.",
    },
    {
      title: "이번 주 전달 리듬",
      desc: "주간 안내, 행사 공지, 리마인드를 분리해 올리는 흐름으로 맞춰둡니다.",
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
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">공지 {notices.length}건</span>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">TOTAL</p>
              <p className="mt-2 text-2xl font-semibold">{notices.length}</p>
              <p className="mt-2 text-xs text-white/60">현재 등록된 공지</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">PINNED</p>
              <p className="mt-2 text-2xl font-semibold">{pinnedNotices.length}</p>
              <p className="mt-2 text-xs text-white/60">상단 고정 공지</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">LATEST</p>
              <p className="mt-2 text-base font-semibold">{recentNotice ? formatDate(recentNotice.createdAt) : "없음"}</p>
              <p className="mt-2 text-xs text-white/60">가장 최근 등록일</p>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">QUICK VIEW</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">바로 보기</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">dense list</span>
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#111111]">상단 고정</p>
                <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{pinnedNotices.length}</span>
              </div>
              <p className="mt-2 text-xs text-[#8c7a5b]">꼭 보여야 하는 공지만 위에 남겨둡니다.</p>
            </div>
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#111111]">이번 주 전달</p>
                <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{activeDeliveryNotices.length}</span>
              </div>
              <p className="mt-2 text-xs text-[#8c7a5b]">지금 바로 안내 중인 최신 일반 공지 묶음입니다.</p>
            </div>
            <div className="rounded-[18px] border border-[#ece6dc] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#111111]">지난 공지</p>
                <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{archivedNotices.length}</span>
              </div>
              <p className="mt-2 text-xs text-[#8c7a5b]">보관 상태로 두고 필요할 때 다시 확인합니다.</p>
            </div>
          </div>
        </section>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.84fr_1.16fr]">
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

        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 border-b border-[#efe7da] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">NOTICE LIST</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">공지 목록</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-[#8C7A5B]">
              <span className="rounded-full border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-1.5">전체 {notices.length}</span>
              <span className="rounded-full border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-1.5">고정 {pinnedNotices.length}</span>
              <span className="rounded-full border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-1.5">이번 주 {activeDeliveryNotices.length}</span>
              <span className="rounded-full border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-1.5">지난 공지 {archivedNotices.length}</span>
            </div>
          </div>

          {notices.length === 0 ? (
            <div className="mt-4 rounded-[18px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] p-6 text-sm text-[#5f564b]">
              아직 표시할 공지가 없어. 공지를 만들기 시작하면 여기서 바로 운영할 수 있어.
            </div>
          ) : (
            <div className="mt-2 divide-y divide-[#f0e8dc]">
              {notices.map((notice, index) => {
                const deliveryState = getNoticeDeliveryState({ pinned: notice.pinned, index: notice.pinned ? index : normalNotices.findIndex((item) => item.id === notice.id) });

                return (
                  <div key={notice.id} className="grid gap-3 py-3 lg:grid-cols-[minmax(0,1fr)_168px_150px] lg:items-center lg:gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-[#111111]">{notice.title}</p>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] ${deliveryState.badgeClass}`}>{deliveryState.surface}</span>
                        <span className="rounded-full border border-[#ece6dc] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{deliveryState.lane}</span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm text-[#5f564b]">{notice.content}</p>
                      <p className="mt-2 text-[11px] text-[#8c7a5b]">{deliveryState.note}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#7a6d5c] lg:grid-cols-1">
                      <div className="rounded-[12px] border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-2">등록일 {formatDate(notice.createdAt)}</div>
                      <div className="rounded-[12px] border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-2">전달 {deliveryState.rhythm}</div>
                    </div>
                    <div className="flex items-center justify-between gap-3 lg:justify-end">
                      <p className="text-[11px] text-[#8c7a5b]">{notice.pinned ? "계속 상단 노출 중" : deliveryState.rhythm}</p>
                      <button
                        type="button"
                        className="inline-flex h-9 items-center justify-center rounded-[12px] border border-[#e6dfd5] bg-white px-3 text-xs font-medium text-[#111111]"
                      >
                        내용 보기
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
