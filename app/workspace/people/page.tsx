const peopleStats = [
  { label: "전체 인원", value: "128" },
  { label: "새가족", value: "14" },
  { label: "후속관리 필요", value: "9" },
  { label: "교구 미배정", value: "6" },
];

const people = [
  { name: "김은혜", tag: "새가족", status: "후속 연락 필요", owner: "김선용" },
  { name: "박준호", tag: "정착중", status: "소그룹 연결 중", owner: "사무국" },
  { name: "이수민", tag: "봉사연결", status: "미디어팀 상담", owner: "콘텐츠" },
  { name: "최다은", tag: "교구미배정", status: "배정 검토 필요", owner: "사무국" },
  { name: "정하늘", tag: "새가족", status: "첫 안내 완료", owner: "김선용" },
];

export default function WorkspacePeoplePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs tracking-[0.24em] text-white/38">PEOPLE</p>
          <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-white sm:text-[2.4rem]">사람</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/62 sm:text-base">교인, 사역자, 새가족 상태를 한 흐름 안에서 정리하는 화면입니다.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/72">상태 필터</button>
          <button type="button" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#09111f]">사람 추가</button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {peopleStats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-white/44">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">사람 상태 리스트</h2>
            <span className="text-xs text-white/44">최근 업데이트순</span>
          </div>
          <div className="mt-4 grid gap-3">
            {people.map((person) => (
              <div key={person.name} className="rounded-[18px] border border-white/10 bg-[#091122] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{person.name}</p>
                    <p className="mt-1 text-xs text-white/44">담당: {person.owner}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/68">{person.tag}</span>
                </div>
                <p className="mt-3 text-sm text-white/62">{person.status}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs tracking-[0.18em] text-white/38">FOLLOW-UP</p>
          <h2 className="mt-2 text-lg font-semibold text-white">후속관리 메모</h2>
          <div className="mt-4 grid gap-3">
            <div className="rounded-[18px] border border-white/10 bg-[#091122] p-4 text-sm text-white/72">새가족 3명에게 이번 주 안내 연락 필요</div>
            <div className="rounded-[18px] border border-white/10 bg-[#091122] p-4 text-sm text-white/72">교구 미배정 2명은 리더 회의 후 배정 예정</div>
            <div className="rounded-[18px] border border-white/10 bg-[#091122] p-4 text-sm text-white/72">봉사 연결 대기 1명은 다음 주 면담 예정</div>
          </div>
        </section>
      </div>
    </div>
  );
}
