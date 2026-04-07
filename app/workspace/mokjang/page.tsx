import { getMokjangStats, loadMokjangPilotData } from "@/lib/mokjang-pilot-data";

const weeklyChecklist = [
  "이번 주 중보 제목을 공유하고 함께 읽기",
  "오랜만에 안 보인 가정과 치료 일정 먼저 확인하기",
  "전도 대상자 근황은 다음 행동과 함께 남기기",
  "긴급한 일정은 날짜 기준으로 후속 큐에 따로 빼기",
];

const priorityTone = {
  높음: "border-[#e9c9c9] bg-[#fff7f7] text-[#8f3d3d]",
  중간: "border-[#eadfcd] bg-[#fff9ef] text-[#8C6A2E]",
  낮음: "border-[#d9e7d6] bg-[#f6fbf4] text-[#40683f]",
} as const;

export default function WorkspaceMokjangPage() {
  const data = loadMokjangPilotData();
  const stats = getMokjangStats(data);

  return (
    <div className="flex flex-col gap-6 text-[#121212]">
      <section className="grid gap-4 xl:grid-cols-[1.16fr_0.84fr]">
        <div className="overflow-hidden rounded-[30px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] tracking-[0.2em] text-white/46">MOKJANG PILOT</p>
                <span className="rounded-full border border-white/12 bg-white/8 px-2.5 py-1 text-[10px] text-white/70">로컬 전용 중보 데이터</span>
              </div>
              <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-[2.8rem]">
                {data.groupName}
                <br />
                기도와 후속 흐름을 한 화면에서 봅니다
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
                {data.prayerTitle} · {data.meetingDate}
                <br />
                가정별 중보, 함께 품는 이름, 근황 메모, 후속 연락을 흩어놓지 않고 목장 운영 흐름으로 묶습니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[280px] lg:justify-end">
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">가정 {data.households.length}</span>
              <span className="rounded-full border border-[#d4af37]/25 bg-[#d4af37]/12 px-3 py-1.5 text-xs text-[#f1dfb2]">후속 {data.followUps.length}</span>
              <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/76">근황 {data.updates.length}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-[1fr_240px]">
            <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 sm:p-5">
              <p className="text-[11px] tracking-[0.18em] text-white/42">THIS WEEK CHECKLIST</p>
              <div className="mt-4 grid gap-2 text-sm text-white/82 sm:grid-cols-2">
                {weeklyChecklist.map((item) => (
                  <div key={item} className="rounded-[16px] border border-white/10 bg-[#0f1a30] px-3 py-3">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-white px-5 text-sm font-semibold text-[#09111f]">
                중보 기록 정리
              </button>
              <button type="button" className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-white/14 bg-white/5 px-5 text-sm font-medium text-white">
                후속 연락 큐 보기
              </button>
            </div>
          </div>
        </div>

        <section className="rounded-[30px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FOLLOW-UP QUEUE</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">이번 주 바로 챙길 사람</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">우선순위</span>
          </div>
          <div className="mt-4 grid gap-3">
            {data.followUps.map((item) => (
              <div key={item.title} className="rounded-[18px] border border-[#ece6dc] bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.note}</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] ${priorityTone[item.priority]}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#7a6d5c]">
                  <span className="rounded-full border border-[#e6dfd5] bg-[#fcfbf8] px-2.5 py-1">기한 {item.due}</span>
                  {item.owner ? <span className="rounded-full border border-[#e6dfd5] bg-[#fcfbf8] px-2.5 py-1">담당 {item.owner}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[20px] border border-[#E7E0D4] bg-[#FCFBF8] p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
            <p className="text-xs text-[#8C7A5B]">{item.label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-[#121212]">{item.value}</p>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#8C7A5B]">HOUSEHOLDS</p>
              <h2 className="mt-2 text-lg font-semibold text-[#121212]">가정별 중보</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">실제 목장 데이터</span>
          </div>
          <div className="mt-4 grid gap-3">
            {data.households.map((household) => (
              <article key={household.id} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#121212]">{household.title}</p>
                  {household.tags?.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#e6dfd5] bg-[#f8f2e5] px-2.5 py-1 text-[11px] text-[#8C6A2E]">
                      {tag}
                    </span>
                  ))}
                </div>

                {household.members?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {household.members.map((member) => (
                      <span key={`${household.id}-${member.name}`} className="rounded-full border border-[#e6dfd5] bg-[#fcfbf8] px-3 py-1 text-[11px] text-[#6b5f50]">
                        {member.name}
                        {member.birthYear ? ` · ${member.birthYear}` : ""}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_220px]">
                  <div>
                    <p className="text-xs text-[#8C7A5B]">기도제목</p>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-[#5F564B]">
                      {household.prayers.map((prayer) => (
                        <li key={prayer} className="flex gap-2">
                          <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                          <span>{prayer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[16px] border border-[#ece5d8] bg-[#fcfbf8] p-3">
                    <p className="text-xs text-[#8C7A5B]">함께 품는 이름</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(household.contacts?.length ? household.contacts : ["없음"]).map((contact) => (
                        <span key={contact} className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6b5f50]">
                          {contact}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#E7E0D4] bg-[#FCFBF8] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#8C7A5B]">CARE UPDATES</p>
              <h2 className="mt-2 text-lg font-semibold text-[#121212]">근황과 돌봄 메모</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">최근 공유</span>
          </div>
          <div className="mt-4 grid gap-3">
            {data.updates.map((item) => (
              <article key={item.title} className="rounded-[18px] border border-[#ECE5D8] bg-white p-4">
                <p className="text-sm font-semibold text-[#121212]">{item.title}</p>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5F564B]">{item.body}</p>
                {item.note ? <p className="mt-3 text-sm leading-6 text-[#5F564B]">{item.note}</p> : null}
                {item.due ? (
                  <div className="mt-3">
                    <span className="rounded-full border border-[#e6dfd5] bg-[#fcfbf8] px-2.5 py-1 text-[11px] text-[#7a6d5c]">일정 {item.due}</span>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
