import { getGidoWorkspaceData } from "@/lib/gido-workspace-data";

export default async function GidoDashboardPage({ churchId }: { churchId: string }) {
  const data = await getGidoWorkspaceData(churchId);
  const quickActions = [
    { href: "#member-register", label: "목원 추가" },
    { href: "#followups", label: "이번 주 챙길 사람" },
    { href: "#updates", label: "근황 기록" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-[28px] border border-[#e9e0d3] bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs tracking-[0.18em] text-[#9a8b7a]">이번 주 목장</p>
            <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.06em] text-[#111111]">오늘 필요한 것만 보는 화면</h2>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">목원 추가, 이번 주 챙길 사람, 근황 기록 세 가지부터 바로 다룹니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <a key={action.href} href={action.href} className="rounded-[14px] border border-[#111827] bg-[#111827] px-4 py-3 text-sm font-semibold text-white">
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="가정" value={data.stats.householdCount} note="등록된 가정" />
        <StatCard label="목원" value={data.stats.memberCount} note="현재 연결된 인원" />
        <StatCard label="중보" value={data.stats.prayerCount} note="이번 주 기도제목" />
        <StatCard label="함께 품는 이름" value={data.stats.contactCount} note="가족 / 전도 대상" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">
        <section id="followups" className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <Header eyebrow="이번 주 챙길 사람" title="후속 관리" count={`${data.followUps.length}건`} />
          {data.followUps.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {data.followUps.map((item) => (
                <article key={`${item.title}-${item.due}`} className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5f564b]">{item.note}</p>
                    </div>
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{item.priority}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#7a6d5c]">
                    <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">기한 {item.due}</span>
                    {item.owner ? <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">담당 {item.owner}</span> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyBox text="이번 주 후속으로 따로 뺀 항목이 아직 없습니다." />
          )}
        </section>

        <section id="updates" className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <Header eyebrow="최근 공유한 내용" title="근황 기록" count={`${data.updates.length}건`} />
          {data.updates.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {data.updates.map((item) => (
                <article key={`${item.title}-${item.due ?? "none"}`} className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
                  <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#5f564b]">{item.body}</p>
                  {item.note ? <p className="mt-3 text-sm leading-6 text-[#5f564b]">{item.note}</p> : null}
                  {item.due ? <div className="mt-3"><span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#7a6d5c]">일정 {item.due}</span></div> : null}
                </article>
              ))}
            </div>
          ) : (
            <EmptyBox text="아직 적어둔 근황 기록이 없습니다." />
          )}
        </section>
      </section>

      <section id="member-register" className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <Header eyebrow="새 사람 연결" title="목원 추가" />
        <div className="mt-4 grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["이름", "홍길동"],
              ["배우자 / 가정", "홍길동 / 김숨"],
              ["출생연도", "87"],
              ["상태", "정기 참석 / 새로 연결 / 확인 필요"],
            ].map(([label, placeholder]) => (
              <label key={label} className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
                <p className="text-xs text-[#8c7a5b]">{label}</p>
                <input readOnly placeholder={placeholder} className="mt-3 w-full rounded-[12px] border border-[#e6dfd5] bg-white px-3 py-2 text-sm text-[#111111] placeholder:text-[#a19384]" />
              </label>
            ))}
            <label className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4 sm:col-span-2">
              <p className="text-xs text-[#8c7a5b]">메모</p>
              <textarea readOnly placeholder="건강, 예배, 관계 메모를 짧게 남깁니다" className="mt-3 min-h-[96px] w-full rounded-[12px] border border-[#e6dfd5] bg-white px-3 py-2 text-sm text-[#111111] placeholder:text-[#a19384]" />
            </label>
          </div>
          <div className="rounded-[20px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
            <p className="text-sm font-semibold text-[#111111]">등록은 이렇게 시작하면 돼</p>
            <ol className="mt-3 space-y-3 text-sm leading-6 text-[#5f564b]">
              <li>1. 이름과 가정만 먼저 만든다.</li>
              <li>2. 상태를 정하고 간단한 메모를 남긴다.</li>
              <li>3. 기도제목은 가정별 중보에 넣는다.</li>
              <li>4. 당장 챙길 일은 후속 관리로 뺀다.</li>
            </ol>
          </div>
        </div>
      </section>

      <section id="member-manage" className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <Header eyebrow="지금 등록된 사람" title="목원 관리" count={`${data.members.length}명`} />
        {data.members.length > 0 ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {data.members.map((member) => (
              <article key={member.id} className="rounded-[18px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{member.name}</p>
                    <p className="mt-1 text-xs text-[#7a6d5c]">{member.householdName}</p>
                  </div>
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6b5f50]">{member.birthLabel}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-[#6b5f50]">
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">{member.statusTag}</span>
                  {member.requiresFollowUp ? <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1">후속 필요</span> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyBox text="아직 등록된 목원이 없습니다." />
        )}
      </section>

      <section id="households" className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
        <Header eyebrow="가정 단위로 보기" title="가정별 중보" count={`${data.households.length}가정`} />
        {data.households.length > 0 ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {data.households.map((household) => (
              <article key={household.id} className="rounded-[20px] border border-[#ece3d5] bg-[#fcfaf6] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#111111]">{household.title}</p>
                  {household.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C6A2E]">{tag}</span>
                  ))}
                </div>
                {household.members.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {household.members.map((member) => (
                      <span key={`${household.id}-${member.name}`} className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6b5f50]">
                        {member.name} · {member.birthLabel}
                      </span>
                    ))}
                  </div>
                ) : null}
                <ul className="mt-4 space-y-2 text-sm leading-6 text-[#5F564B]">
                  {household.prayers.map((prayer) => (
                    <li key={prayer} className="flex gap-2">
                      <span className="mt-[8px] h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                      <span>{prayer}</span>
                    </li>
                  ))}
                </ul>
                {household.contacts.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {household.contacts.map((contact) => (
                      <span key={contact} className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6b5f50]">{contact}</span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyBox text="아직 가정별 중보가 없습니다." />
        )}
      </section>
    </div>
  );
}

function Header({ eyebrow, title, count }: { eyebrow: string; title: string; count?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">{eyebrow}</p>
        <h3 className="mt-2 text-lg font-semibold text-[#111111]">{title}</h3>
      </div>
      {count ? <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{count}</span> : null}
    </div>
  );
}

function StatCard({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="rounded-[22px] border border-[#e9e0d3] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      <p className="text-xs text-[#8c7a5b]">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{value}</p>
        <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-2.5 py-1 text-[11px] text-[#8c6a2e]">{note}</span>
      </div>
    </div>
  );
}

function EmptyBox({ text }: { text: string }) {
  return <div className="mt-4 rounded-[18px] border border-dashed border-[#ddd1c0] bg-[#fcfaf6] p-5 text-sm leading-6 text-[#6f6256]">{text}</div>;
}
