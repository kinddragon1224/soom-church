import Link from "next/link";
import { GidoHouseholdView } from "@/lib/gido-workspace-data";
import { updateGidoHouseholdSettings } from "./actions";

type Props = {
  churchSlug: string;
  households: GidoHouseholdView[];
};

export default function GidoHouseholdsPage({ churchSlug, households }: Props) {
  const sortedHouseholds = [...households].sort((a, b) => {
    const orderDiff = (a.prayerOrder ?? Number.MAX_SAFE_INTEGER) - (b.prayerOrder ?? Number.MAX_SAFE_INTEGER);
    if (orderDiff !== 0) return orderDiff;
    return a.title.localeCompare(b.title, "ko-KR");
  });

  const returnPath = `/app/${churchSlug}/households`;

  return (
    <div className="flex flex-col gap-5 text-[#111111]">
      <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">G.I.D.O HOUSEHOLDS</p>
            <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[#111111]">가정</h1>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">가정별 중보, 연락 메모, 중보 순서 설정</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="가정" value={`${households.length}개`} />
            <MetricCard label="중보 설정" value={`${sortedHouseholds.filter((household) => household.prayers.length > 0).length}개`} />
            <MetricCard label="순서 설정" value={`${sortedHouseholds.filter((household) => typeof household.prayerOrder === "number").length}개`} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {sortedHouseholds.map((household) => (
          <article key={household.id} className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-[#111111]">{household.title}</p>
                <p className="mt-1 text-sm text-[#6d6259]">구성원 {household.members.length}명</p>
              </div>
              <span className="rounded-full border border-[#ebe2d5] bg-[#fcfaf6] px-3 py-1 text-[11px] text-[#6f6256]">
                {typeof household.prayerOrder === "number" ? `중보 순서 ${household.prayerOrder}` : "순서 미설정"}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {household.members.map((member) => (
                <span key={`${household.id}-${member.name}`} className="rounded-full border border-[#e4dbc9] bg-white px-2.5 py-1 text-[11px] text-[#6f6256]">
                  {member.name}
                </span>
              ))}
            </div>

            <form action={updateGidoHouseholdSettings.bind(null, churchSlug, returnPath)} className="mt-4 grid gap-3">
              <input type="hidden" name="householdId" value={household.id} />
              <label className="grid gap-2">
                <span className="text-[12px] font-medium text-[#5f564b]">중보 순서</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  name="prayerOrder"
                  defaultValue={typeof household.prayerOrder === "number" ? household.prayerOrder : ""}
                  placeholder="예: 1"
                  className="rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[12px] font-medium text-[#5f564b]">중보 기도</span>
                <textarea
                  name="prayers"
                  defaultValue={household.prayers.join("\n")}
                  placeholder="한 줄에 하나씩 입력"
                  className="min-h-[120px] rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[12px] font-medium text-[#5f564b]">연락 메모</span>
                <textarea
                  name="contacts"
                  defaultValue={household.contacts.join("\n")}
                  placeholder="한 줄에 하나씩 입력"
                  className="min-h-[96px] rounded-[12px] border border-[#E7E0D4] bg-white px-3 py-2 text-sm text-[#111111]"
                />
              </label>

              <div className="flex items-center justify-between gap-3">
                <Link href={`/app/${churchSlug}/members`} className="text-xs text-[#8C7A5B] hover:text-[#111111]">
                  목원 화면 열기
                </Link>
                <button className="rounded-[12px] bg-[#111827] px-4 py-2 text-sm font-semibold text-white">저장</button>
              </div>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#ece4d8] bg-white p-4">
      <p className="text-[11px] tracking-[0.16em] text-[#9a8b7a]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[#111111]">{value}</p>
    </div>
  );
}
