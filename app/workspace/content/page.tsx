const contentStats = [
  { label: "전체 요청", value: "18" },
  { label: "기획", value: "4" },
  { label: "제작중", value: "7" },
  { label: "검토", value: "3" },
];

const contentItems = [
  { title: "설교 쇼츠 3건", state: "제작중", owner: "콘텐츠팀" },
  { title: "행사 랜딩 페이지", state: "기획", owner: "최재성" },
  { title: "유튜브 채널 구조 정리", state: "완료", owner: "김선용" },
  { title: "부활절 홍보영상", state: "검토", owner: "콘텐츠팀" },
];

const requests = [
  "주일 예배 쇼츠 편집 요청",
  "수련회 참가 신청 페이지 제작",
  "유튜브 썸네일 스타일 정리",
];

export default function WorkspaceContentPage() {
  return (
    <div className="flex flex-col gap-6 text-[#121212]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs tracking-[0.24em] text-[#8C7A5B]">CONTENT STUDIO</p>
          <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-[#121212] sm:text-[2.4rem]">콘텐츠 스튜디오</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5F564B] sm:text-base">쇼츠, 영상, 행사 페이지 같은 콘텐츠 요청과 진행 상태를 모아보는 화면입니다.</p>
        </div>
        <button type="button" className="rounded-full bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">콘텐츠 요청</button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {contentStats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-[#E7E0D4] bg-[#FCFBF8] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs text-[#8C7A5B]">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#121212]">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#121212]">콘텐츠 파이프라인</h2>
            <span className="text-xs text-[#8C7A5B]">최신순</span>
          </div>
          <div className="mt-4 grid gap-3">
            {contentItems.map((item) => (
              <div key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-[#121212]">{item.title}</p>
                    <p className="mt-1 text-xs text-[#5F564B]">담당: {item.owner}</p>
                  </div>
                  <span className="rounded-full border border-[#E7E0D4] bg-[#F6F1E5] px-3 py-1 text-[11px] text-[#8C6A2E]">{item.state}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <p className="text-xs tracking-[0.18em] text-[#8C7A5B]">RECENT REQUESTS</p>
          <div className="mt-4 grid gap-3">
            {requests.map((item) => (
              <div key={item} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4 text-sm text-[#5F564B]">{item}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
