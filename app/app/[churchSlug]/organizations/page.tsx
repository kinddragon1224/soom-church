import { requireWorkspaceMembership } from "@/lib/church-context";
import { getChurchOrganizationOverview } from "@/lib/organization-data";

export default async function ChurchOrganizationsPage({ params }: { params: { churchSlug: string } }) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  const church = membership.church;
  const { labels, units } = await getChurchOrganizationOverview(church.id);

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <p className="text-[11px] tracking-[0.2em] text-white/46">ORGANIZATION STRUCTURE</p>
          <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-[2.7rem]">
            교회별 용어로 조직을
            <br />
            유연하게 구성합니다
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
            교구, 부서, 사역, 선교회처럼 교회마다 다른 용어를 그대로 쓰되 내부 구조는 중립적으로 관리하는 화면입니다.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">조직 수</p>
              <p className="mt-2 text-2xl font-semibold">{units.length}</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">용어 수</p>
              <p className="mt-2 text-2xl font-semibold">{labels.length}</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">교회</p>
              <p className="mt-2 text-sm font-semibold">{church.name}</p>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">LABELS</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">현재 용어</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">church terms</span>
          </div>
          <div className="mt-4 grid gap-3">
            {labels.map((label) => (
              <div key={label.id} className="rounded-[18px] border border-[#ece6dc] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#111111]">{label.singular}</p>
                  <span className="rounded-full border border-[#e6dfd5] bg-white px-2.5 py-1 text-[11px] text-[#8C7A5B]">{label.type}</span>
                </div>
                <p className="mt-2 text-sm text-[#5f564b]">복수형: {label.plural ?? label.singular}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">ORGANIZATION LIST</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">조직 구조</h2>
          </div>
          <button className="rounded-[12px] bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white">조직 추가</button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#FBF9F4] text-[#8C7A5B]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">이름</th>
                <th className="px-4 py-3 text-left font-medium">유형</th>
                <th className="px-4 py-3 text-left font-medium">상위 조직</th>
                <th className="px-4 py-3 text-left font-medium">연결 인원</th>
                <th className="px-4 py-3 text-left font-medium">하위 조직</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id} className="border-t border-[#f1eadf] text-[#111111]">
                  <td className="px-4 py-3 font-medium">{unit.name}</td>
                  <td className="px-4 py-3 text-[#5f564b]">{unit.type}</td>
                  <td className="px-4 py-3 text-[#5f564b]">{unit.parent?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-[#5f564b]">{unit._count.memberLinks}</td>
                  <td className="px-4 py-3 text-[#5f564b]">{unit._count.children}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
