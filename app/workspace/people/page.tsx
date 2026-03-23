const people = [
  { name: "김은혜", status: "새가족", note: "후속 연락 필요" },
  { name: "박준호", status: "정착중", note: "소그룹 연결 중" },
  { name: "이수민", status: "봉사연결", note: "미디어팀 상담" },
  { name: "최다은", status: "교구미배정", note: "배정 검토 필요" },
];

export default function WorkspacePeoplePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs tracking-[0.24em] text-white/38">PEOPLE</p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-[2.4rem]">사람</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">교인, 사역자, 새가족, 리드 상태를 한 흐름 안에서 정리하는 화면입니다.</p>
      </div>
      <div className="grid gap-3">
        {people.map((person) => (
          <div key={person.name} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-base font-semibold text-white">{person.name}</p>
              <span className="rounded-full border border-white/10 bg-[#091122] px-3 py-1 text-xs text-white/68">{person.status}</span>
            </div>
            <p className="mt-2 text-sm text-white/58">{person.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
