import { getMokjangStats, loadMokjangPilotData } from "@/lib/mokjang-pilot-data";

export default function GidoDashboardPage() {
  const data = loadMokjangPilotData();
  const stats = getMokjangStats(data);

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[22px] border border-[#e9e0d3] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
            <p className="text-xs text-[#8c7a5b]">{item.label}</p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-[#111111]">{item.value}</p>
              <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-2.5 py-1 text-[11px] text-[#8c6a2e]">{item.delta}</span>
            </div>
          </div>
        ))}
      </section>

      <section id="followups" className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[26px] border border-[#e9e0d3] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FOLLOW-UP</p>
              <h3 className="mt-2 text-lg font-semibold text-[#111111]">이번 주 바로 챙길 일</h3>
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
              <h3 className="mt-2 text-lg font-semibold text-[#111111]">최근 근황 메모</h3>
            </div>
            <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">{data.updates.length}건</span>
          </div>
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

              {household.contacts?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {household.contacts.map((contact) => (
                    <span key={contact} className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#6b5f50]">{contact}</span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
