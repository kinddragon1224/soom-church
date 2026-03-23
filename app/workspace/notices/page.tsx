const notices = [
  { title: "주일 예배 안내", state: "발행중" },
  { title: "수련회 신청 오픈", state: "예약" },
  { title: "청년부 모임 공지", state: "초안" },
];

export default function WorkspaceNoticesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs tracking-[0.24em] text-white/38">NOTICES</p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-[2.4rem]">공지</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">주요 공지를 작성하고, 발행 상태를 관리하는 화면입니다.</p>
      </div>
      <div className="grid gap-3">
        {notices.map((notice) => (
          <div key={notice.title} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-white">{notice.title}</p>
              <span className="rounded-full border border-white/10 bg-[#091122] px-3 py-1 text-xs text-white/68">{notice.state}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
