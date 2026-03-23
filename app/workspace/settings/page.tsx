const settingsItems = [
  "워크스페이스 이름",
  "팀원 초대",
  "무료 플랜 상태",
  "향후 결제/플랜 확장 준비",
];

export default function WorkspaceSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs tracking-[0.24em] text-white/38">SETTINGS</p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-[2.4rem]">설정</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">워크스페이스 정보, 팀원, 무료 플랜 상태와 향후 확장 구조를 확인하는 화면입니다.</p>
      </div>
      <div className="grid gap-3">
        {settingsItems.map((item) => (
          <div key={item} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4 text-sm text-white/72">{item}</div>
        ))}
      </div>
    </div>
  );
}
