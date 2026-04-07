import { getMokjangStats, loadMokjangPilotData } from "@/lib/mokjang-pilot-data";

export default function GidoDashboardPage() {
  const data = loadMokjangPilotData();
  const stats = getMokjangStats(data);
  const members = data.households.flatMap((household) =>
    (household.members ?? []).map((member) => ({
      ...member,
      household: household.title,
      tags: household.tags ?? [],
      prayerCount: household.prayers.length,
      contactCount: household.contacts?.length ?? 0,
    })),
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">TODAY BOARD</p>
          <h3 className="mt-2 text-lg font-semibold text-[#111111]">오늘 먼저 볼 흐름</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <a href="#member-register" className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4 text-left">
              <p className="text-sm font-semibold text-[#111111]">목원 등록</p>
              <p className="mt-2 text-sm leading-6 text-[#5f564b]">새 목원이나 새 가정을 등록하는 자리부터 만듭니다.</p>
            </a>
            <a href="#followups" className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4 text-left">
              <p className="text-sm font-semibold text-[#111111]">후속 관리</p>
              <p className="mt-2 text-sm leading-6 text-[#5f564b]">치료 일정, 관계 연결, 믿음 회복 같은 후속 큐를 따로 봅니다.</p>
            </a>
            <a href="#updates" className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4 text-left">
              <p className="text-sm font-semibold text-[#111111]">근황 메모</p>
              <p className="mt-2 text-sm leading-6 text-[#5f564b]">기도 제목과 근황을 흩어놓지 않고 이번 주 메모로 남깁니다.</p>
            </a>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {stats.map((item) => (
            <div key={item.label} className="rounded-[22px] border border-[#e9e0d3] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
              <p className="text-xs text-[#8c7a5b]">{item.label}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{item.value}</p>
                <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-2.5 py-1 text-[11px] text-[#8c6a2e]">{item.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="member-register" className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">MEMBER REGISTER</p>
            <h3 className="mt-2 text-lg font-semibold text-[#111111]">목원 등록</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f564b]">이름, 배우자/가정, 출생연도, 상태, 간단한 메모만 먼저 넣고 시작하는 단순한 구조로 갑니다.</p>
          </div>
          <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">입력 흐름 준비</span>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["이름", "예: 홍길동"],
              ["배우자/가정", "예: 홍길동 / 김숨"],
              ["출생연도", "예: 87"],
              ["상태", "정기 참석 / 새로 연결 / 확인 필요"],
            ].map(([label, placeholder]) => (
              <label key={label} className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
                <p className="text-xs text-[#8c7a5b]">{label}</p>
                <input
                  readOnly
                  placeholder={placeholder}
                  className="mt-3 w-full rounded-[12px] border border-[#e6dfd5] bg-white px-3 py-2 text-sm text-[#111111] outline-none placeholder:text-[#a19384]"
                />
              </label>
            ))}
            <label className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4 sm:col-span-2">
              <p className="text-xs text-[#8c7a5b]">메모</p>
              <textarea
                readOnly
                placeholder="예배/건강/관계 메모를 간단히 남깁니다"
                className="mt-3 min-h-[96px] w-full rounded-[12px] border border-[#e6dfd5] bg-white px-3 py-2 text-sm text-[#111111] outline-none placeholder:text-[#a19384]"
              />
            </label>
          </div>

          <div className="rounded-[20px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
            <p className="text-sm font-semibold text-[#111111]">등록 순서</p>
            <ol className="mt-3 space-y-3 text-sm leading-6 text-[#5f564b]">
              <li>1. 이름과 가정 단위를 먼저 만든다.</li>
              <li>2. 출생연도와 상태만 짧게 넣는다.</li>
              <li>3. 기도 제목은 가정별 중보로 분리한다.</li>
              <li>4. 긴급한 건은 바로 후속 관리로 올린다.</li>
            </ol>
            <button type="button" className="mt-4 w-full rounded-[14px] border border-[#111827] bg-[#111827] px-4 py-3 text-sm font-semibold text-white">
              목원 등록 UI 먼저 완성하기
            </button>
          </div>
        </div>
      </section>

      <section id="member-manage" className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">MEMBER MANAGE</p>
            <h3 className="mt-2 text-lg font-semibold text-[#111111]">목원 관리</h3>
          </div>
          <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{members.length}명</span>
        </div>

        {members.length > 0 ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {members.map((member) => (
              <article key={`${member.household}-${member.name}`} className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{member.name}</p>
                    <p className="mt-1 text-xs text-[#7a6d5c]">{member.household}</p>
                  </div>
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6b5f50]">
                    {member.birthYear ?? "연도 없음"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#6b5f50]">
                  {member.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">{tag}</span>
                  ))}
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">기도 {member.prayerCount}</span>
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">연결 {member.contactCount}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[18px] border border-dashed border-[#ddd1c0] bg-[#fcfaf6] p-5 text-sm leading-6 text-[#6f6256]">
            아직 배포 환경에 목원 데이터가 없습니다. 먼저 목원 등록 섹션부터 채우고, 실제 데이터는 다음 단계에서 DB로 옮기면 됩니다.
          </div>
        )}
      </section>

      <section id="followups" className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FOLLOW-UP</p>
              <h3 className="mt-2 text-lg font-semibold text-[#111111]">후속 관리</h3>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{data.followUps.length}건</span>
          </div>
          <div className="mt-4 grid gap-3">
            {data.followUps.map((item) => (
              <article key={item.title} className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.priority}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.note}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#7a6d5c]">
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">기한 {item.due}</span>
                  {item.owner ? <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">담당 {item.owner}</span> : null}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div id="updates" className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">CARE UPDATES</p>
              <h3 className="mt-2 text-lg font-semibold text-[#111111]">근황 메모</h3>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{data.updates.length}건</span>
          </div>
          {data.updates.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {data.updates.map((item) => (
                <article key={item.title} className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5f564b]">{item.body}</p>
                  {item.note ? <p className="mt-3 text-sm leading-6 text-[#5f564b]">{item.note}</p> : null}
                  {item.due ? <div className="mt-3"><span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#7a6d5c]">일정 {item.due}</span></div> : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[18px] border border-dashed border-[#ddd1c0] bg-[#fcfaf6] p-5 text-sm leading-6 text-[#6f6256]">
              아직 기록된 근황 메모가 없습니다. 치료 일정, 전도 대상자 근황, 가정 상황 같은 메모를 먼저 쌓으면 됩니다.
            </div>
          )}
        </div>
      </section>

      <section id="households" className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">HOUSEHOLDS</p>
            <h3 className="mt-2 text-lg font-semibold text-[#111111]">가정별 중보</h3>
          </div>
          <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{data.groupName}</span>
        </div>

        {data.households.length > 0 ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {data.households.map((household) => (
              <article key={household.id} className="rounded-[20px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#111111]">{household.title}</p>
                  {household.tags?.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{tag}</span>
                  ))}
                </div>

                {household.members?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {household.members.map((member) => (
                      <span key={`${household.id}-${member.name}`} className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6b5f50]">
                        {member.name}{member.birthYear ? ` · ${member.birthYear}` : ""}
                      </span>
                    ))}
                  </div>
                ) : null}

                <ul className="mt-4 space-y-2 text-sm leading-6 text-[#5F564B]">
                  {household.prayers.slice(0, 5).map((prayer) => (
                    <li key={prayer} className="flex gap-2">
                      <span className="mt-[8px] h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                      <span>{prayer}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[18px] border border-dashed border-[#ddd1c0] bg-[#fcfaf6] p-5 text-sm leading-6 text-[#6f6256]">
            아직 가정별 중보 데이터가 없습니다. 목원 등록과 함께 가정 단위 메모를 먼저 만들면 이 영역이 바로 살아납니다.
          </div>
        )}
      </section>
    </div>
  );
}
