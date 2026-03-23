const noticeStats = [
  { label: "전체 공지", value: "12" },
  { label: "발행중", value: "5" },
  { label: "예약", value: "3" },
  { label: "초안", value: "4" },
];

const notices = [
  { title: "주일 예배 안내", state: "발행중", channel: "문자" },
  { title: "수련회 신청 오픈", state: "예약", channel: "카카오톡" },
  { title: "청년부 모임 공지", state: "초안", channel: "푸시" },
  { title: "봉사자 리마인드", state: "발행중", channel: "문자" },
];

export default function WorkspaceNoticesPage() {
  return (
    <div className="flex flex-col gap-6 text-[#121212]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs tracking-[0.24em] text-[#8C7A5B]">NOTICES</p>
          <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-[#121212] sm:text-[2.4rem]">공지</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5F564B] sm:text-base">주요 공지를 작성하고, 발행 상태를 관리하는 화면입니다.</p>
        </div>
        <button type="button" className="rounded-full bg-[#176B4D] px-4 py-2 text-sm font-semibold text-white">공지 작성</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {noticeStats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-[#E7E0D4] bg-[#FCFBF8] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs text-[#8C7A5B]">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#121212]">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#121212]">공지 리스트</h2>
          <span className="text-xs text-[#8C7A5B]">채널 포함</span>
        </div>
        <div className="mt-4 grid gap-3">
          {notices.map((notice) => (
            <div key={notice.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[#121212]">{notice.title}</p>
                  <p className="mt-1 text-xs text-[#5F564B]">채널: {notice.channel}</p>
                </div>
                <span className="rounded-full border border-[#E7E0D4] bg-[#F6F1E5] px-3 py-1 text-xs text-[#8C6A2E]">{notice.state}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
