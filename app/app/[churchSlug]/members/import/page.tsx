import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { importMembersCsv } from "./actions";

export default async function MemberImportPage({
  params,
  searchParams,
}: {
  params: { churchSlug: string };
  searchParams?: { done?: string };
}) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  const church = membership.church;
  const doneCount = Number(searchParams?.done ?? 0);
  const sampleCsv = `이름,성별,전화번호,이메일,교구,목장,가족,직분,상태,등록일,직업,메모\n김은혜,여,010-1111-2222,eunhye@example.com,1교구,소망 목장,김가정,집사,등록대기,2026-03-24,교사,새가족\n박진수,남,010-3333-4444,jinsu@example.com,2교구,은혜 목장,박가정,성도,새가족,2026-03-24,회사원,후속 연락 필요`;

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <p className="text-[11px] tracking-[0.2em] text-white/46">CSV IMPORT</p>
          <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">CSV로 성도를 한 번에 등록</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">이름과 전화번호를 기준으로 가져오고, 교구·목장·가족 이름은 없으면 자동으로 기본값에 추가한다.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">필수</p>
              <p className="mt-2 text-sm font-semibold">이름, 전화번호</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">자동 연결</p>
              <p className="mt-2 text-sm font-semibold">교구, 목장, 가족</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">중복 방지</p>
              <p className="mt-2 text-sm font-semibold">이름 + 전화번호</p>
            </div>
          </div>
        </div>

        <section className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">UPLOAD</p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">파일 업로드</h2>
            </div>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1 text-[11px] text-[#8C7A5B]">.csv</span>
          </div>
          {doneCount > 0 ? (
            <div className="mt-4 rounded-[18px] border border-[#d7e8dc] bg-[#eefbf3] p-4 text-sm font-semibold text-[#2d7a46]">{doneCount}명 등록 완료</div>
          ) : null}
          <form action={importMembersCsv.bind(null, params.churchSlug)} className="mt-4 grid gap-3">
            <input name="csvFile" type="file" accept=".csv,text/csv" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
            <button className="rounded-[14px] bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white">CSV 등록 실행</button>
          </form>
          <div className="mt-4 grid gap-2">
            <Link href={`/app/${church.slug}/settings#member-defaults`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-3 text-sm font-medium text-[#111111]">기본값 관리 열기</Link>
            <Link href={`/app/${church.slug}/members`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-3 text-sm font-medium text-[#111111]">사람 목록으로 이동</Link>
          </div>
        </section>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FORMAT</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">권장 CSV 형식</h2>
          </div>
          <span className="text-xs text-[#8C7A5B]">헤더 이름 기준</span>
        </div>
        <div className="mt-4 rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
          <pre className="whitespace-pre-wrap text-sm leading-6 text-[#3f3528]">{sampleCsv}</pre>
        </div>
      </section>
    </div>
  );
}
