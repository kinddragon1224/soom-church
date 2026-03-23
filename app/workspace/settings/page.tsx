const settingsItems = [
  { title: "워크스페이스 이름", desc: "대흥교회 청년부 워크스페이스" },
  { title: "팀원 초대", desc: "현재 팀원 4명" },
  { title: "무료 플랜 상태", desc: "기본 기능 사용 중" },
  { title: "향후 결제/플랜 확장 준비", desc: "업그레이드 포인트 설계 중" },
];

export default function WorkspaceSettingsPage() {
  return (
    <div className="flex flex-col gap-6 text-[#121212]">
      <div>
        <p className="text-xs tracking-[0.24em] text-[#8C7A5B]">SETTINGS</p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-[#121212] sm:text-[2.4rem]">설정</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5F564B] sm:text-base">워크스페이스 정보, 팀원, 무료 플랜 상태와 향후 확장 구조를 확인하는 화면입니다.</p>
      </div>

      <div className="grid gap-3">
        {settingsItems.map((item) => (
          <div key={item.title} className="rounded-[20px] border border-[#E7E0D4] bg-[#FCFBF8] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
            <p className="mt-2 text-sm text-[#5F564B]">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
