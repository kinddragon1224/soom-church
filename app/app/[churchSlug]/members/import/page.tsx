import Link from "next/link";
import { requireWorkspaceMembership } from "@/lib/church-context";
import { importMembersCsv, previewMembersCsv } from "./actions";

type PreviewRow = {
  rowNumber: number;
  name: string;
  phone: string;
  districtName: string;
  groupName: string;
  householdName: string;
  statusTag: string;
  result: "ready" | "duplicate" | "invalid";
  reason: string;
};

const CSV_COLUMNS = [
  { name: "이름", required: true, note: "성도 이름" },
  { name: "전화번호", required: true, note: "중복 확인 기준" },
  { name: "성별", required: false, note: "남 / 여 / male / female" },
  { name: "이메일", required: false, note: "선택 입력" },
  { name: "교구", required: false, note: "없으면 자동 생성" },
  { name: "목장", required: false, note: "교구와 함께 연결" },
  { name: "가족", required: false, note: "없으면 자동 생성" },
  { name: "직분", required: false, note: "예: 집사, 성도" },
  { name: "상태", required: false, note: "비우면 등록대기" },
  { name: "등록일", required: false, note: "비우면 오늘" },
  { name: "직업", required: false, note: "현재 직업" },
  { name: "메모", required: false, note: "운영 메모" },
] as const;

export default async function MemberImportPage({
  params,
  searchParams,
}: {
  params: { churchSlug: string };
  searchParams?: { done?: string; skipped?: string; failed?: string; payload?: string; preview?: string; error?: string };
}) {
  const { membership } = await requireWorkspaceMembership(params.churchSlug);
  if (!membership) return null;

  const church = membership.church;
  const doneCount = Number(searchParams?.done ?? 0);
  const skippedCount = Number(searchParams?.skipped ?? 0);
  const failedText = searchParams?.failed ? decodeURIComponent(searchParams.failed) : "";
  const payload = searchParams?.payload ?? "";
  const previewRows: PreviewRow[] = searchParams?.preview
    ? JSON.parse(Buffer.from(searchParams.preview, "base64url").toString("utf8"))
    : [];
  const sampleCsv = `이름,성별,전화번호,이메일,교구,목장,가족,직분,상태,등록일,직업,메모\n김은혜,여,010-1111-2222,eunhye@example.com,1교구,소망 목장,김가정,집사,등록대기,2026-03-24,교사,새가족\n박진수,남,010-3333-4444,jinsu@example.com,2교구,은혜 목장,박가정,성도,새가족,2026-03-24,회사원,후속 연락 필요`;
  const templateHref = `data:text/csv;charset=utf-8,${encodeURIComponent(sampleCsv)}`;

  return (
    <div className="flex flex-col gap-6 text-[#111111]">
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#e1d7c7] bg-[linear-gradient(135deg,#10192d_0%,#17233d_55%,#243252_100%)] p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:p-7">
          <p className="text-[11px] tracking-[0.2em] text-white/46">CSV IMPORT</p>
          <h1 className="mt-3 text-[2.1rem] font-semibold leading-[0.98] tracking-[-0.06em] text-white">CSV로 성도를 한 번에 등록</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/66 sm:text-base">업로드 전에 등록 가능 여부를 먼저 확인하고, 중복과 누락 행을 분리해서 본 뒤 실행합니다.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">필수</p>
              <p className="mt-2 text-sm font-semibold">이름, 전화번호</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">미리보기</p>
              <p className="mt-2 text-sm font-semibold">등록 가능 여부 확인</p>
            </div>
            <div className="rounded-[18px] border border-white/10 bg-white/8 p-4">
              <p className="text-[11px] tracking-[0.16em] text-white/48">자동 연결</p>
              <p className="mt-2 text-sm font-semibold">교구, 목장, 가족</p>
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
          {doneCount > 0 ? <div className="mt-4 rounded-[18px] border border-[#d7e8dc] bg-[#eefbf3] p-4 text-sm font-semibold text-[#2d7a46]">{doneCount}명 등록 완료 · 중복 {skippedCount}건 건너뜀</div> : null}
          {searchParams?.error === "empty" ? <div className="mt-4 rounded-[18px] border border-[#f0c9c9] bg-[#fff2f2] p-4 text-sm font-semibold text-[#9a4a4a]">비어 있는 CSV 파일입니다.</div> : null}
          <form action={previewMembersCsv.bind(null, params.churchSlug)} className="mt-4 grid gap-3">
            <input name="csvFile" type="file" accept=".csv,text/csv" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
            <button className="rounded-[14px] bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white">CSV 미리보기</button>
          </form>
          <div className="mt-4 grid gap-2">
            <a href={templateHref} download="members-import-template.csv" className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-3 text-sm font-medium text-[#111111]">CSV 템플릿 다운로드</a>
            <Link href={`/app/${church.slug}/settings#member-defaults`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-3 text-sm font-medium text-[#111111]">기본값 관리 열기</Link>
            <Link href={`/app/${church.slug}/members`} className="rounded-[14px] border border-[#E7E0D4] bg-white px-4 py-3 text-sm font-medium text-[#111111]">사람 목록으로 이동</Link>
          </div>
        </section>
      </section>

      {previewRows.length > 0 ? (
        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">PREVIEW</p>
              <h2 className="mt-2 text-lg font-semibold text-[#111111]">등록 미리보기</h2>
            </div>
            <span className="text-xs text-[#8C7A5B]">{previewRows.length} rows</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#FBF9F4] text-[#8C7A5B]">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">행</th>
                  <th className="px-4 py-3 text-left font-medium">이름</th>
                  <th className="px-4 py-3 text-left font-medium">전화번호</th>
                  <th className="px-4 py-3 text-left font-medium">교구/목장</th>
                  <th className="px-4 py-3 text-left font-medium">상태</th>
                  <th className="px-4 py-3 text-left font-medium">결과</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr key={`${row.rowNumber}-${row.name}-${row.phone}`} className="border-t border-[#f1eadf]">
                    <td className="px-4 py-3 text-[#5f564b]">{row.rowNumber}</td>
                    <td className="px-4 py-3 font-medium text-[#111111]">{row.name || "-"}</td>
                    <td className="px-4 py-3 text-[#5f564b]">{row.phone || "-"}</td>
                    <td className="px-4 py-3 text-[#5f564b]">{row.districtName || "미정"} / {row.groupName || "미정"}</td>
                    <td className="px-4 py-3 text-[#5f564b]">{row.statusTag}</td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] ${row.result === "ready" ? "bg-[#eefbf3] text-[#2d7a46]" : row.result === "duplicate" ? "bg-[#fff7e8] text-[#8C6A2E]" : "bg-[#fff2f2] text-[#9a4a4a]"}`}>{row.reason}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form action={importMembersCsv.bind(null, params.churchSlug)} className="mt-4">
            <input type="hidden" name="payload" value={payload} />
            <button className="rounded-[14px] bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white">미리보기 기준으로 등록 실행</button>
          </form>
        </section>
      ) : null}

      {failedText ? (
        <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">FAILED ROWS</p>
          <h2 className="mt-2 text-lg font-semibold text-[#111111]">등록 실패 행</h2>
          <pre className="mt-4 whitespace-pre-wrap rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4 text-sm leading-6 text-[#3f3528]">{failedText}</pre>
        </section>
      ) : null}

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">COLUMN GUIDE</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">컬럼 가이드</h2>
          </div>
          <span className="text-xs text-[#8C7A5B]">필수/선택 입력</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {CSV_COLUMNS.map((column) => (
            <div key={column.name} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#111111]">{column.name}</p>
                <span className={`rounded-full px-2.5 py-1 text-[11px] ${column.required ? "bg-[#fff7e8] text-[#8C6A2E]" : "bg-white text-[#8C7A5B] border border-[#e6dfd5]"}`}>{column.required ? "필수" : "선택"}</span>
              </div>
              <p className="mt-2 text-sm text-[#5f564b]">{column.note}</p>
            </div>
          ))}
        </div>
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
