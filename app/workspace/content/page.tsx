const contentItems = [
  { title: "설교 쇼츠 3건", state: "제작중" },
  { title: "행사 랜딩 페이지", state: "기획" },
  { title: "유튜브 채널 구조 정리", state: "완료" },
];

export default function WorkspaceContentPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs tracking-[0.24em] text-white/38">CONTENT</p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-[2.4rem]">콘텐츠</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">쇼츠, 영상, 행사 페이지 같은 콘텐츠 요청과 진행 상태를 모아보는 화면입니다.</p>
      </div>
      <div className="grid gap-3">
        {contentItems.map((item) => (
          <div key={item.title} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-white">{item.title}</p>
              <span className="rounded-full border border-white/10 bg-[#091122] px-3 py-1 text-xs text-white/68">{item.state}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
