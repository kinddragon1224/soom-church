import { readdir, readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

type ConsultationInquiry = {
  inquiryId?: string;
  receivedAt?: string;
  name?: string;
  contact?: string;
  concernType?: string;
  stage?: string;
  consultationType?: string;
  message?: string;
  referenceUrl?: string;
  preferredSchedule?: string;
  source?: string;
};

async function loadInquiries() {
  const dir = path.join(process.cwd(), "ops", "contact-inquiries");

  try {
    const files = (await readdir(dir)).filter((file) => file.endsWith(".jsonl")).sort().reverse();
    const rows: ConsultationInquiry[] = [];

    for (const file of files) {
      const content = await readFile(path.join(dir, file), "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          rows.push(JSON.parse(trimmed) as ConsultationInquiry);
        } catch {
          rows.push({
            inquiryId: `broken-${file}`,
            receivedAt: new Date().toISOString(),
            name: "읽기 실패",
            contact: "-",
            message: trimmed.slice(0, 240),
          });
        }
      }
    }

    return rows
      .sort((a, b) => new Date(b.receivedAt ?? 0).getTime() - new Date(a.receivedAt ?? 0).getTime())
      .slice(0, 100);
  } catch {
    return [];
  }
}

function formatDate(value?: string) {
  if (!value) return "-";
  return new Date(value).toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PlatformAdminInquiriesPage() {
  const inquiries = await loadInquiries();
  const latest = inquiries[0] ?? null;
  const workshopCount = inquiries.filter((item) => item.consultationType?.includes("워크숍")).length;
  const portfolioCount = inquiries.filter((item) => item.consultationType?.includes("포트폴리오")).length;

  return (
    <section className="space-y-4 text-[#111111]">
      <div className="rounded-[28px] border border-[#e5dccd] bg-[#fbfaf6] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SOOM / CAREER INQUIRIES</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#111111]">커리어 상담 신청함</h2>
            <p className="mt-2 text-sm leading-6 text-[#5f564b]">
              `/contact`에서 들어온 AI 시대 진로 컨설팅 문의를 확인하는 임시 운영함입니다. 현재는 private JSONL 파일을 읽습니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[#8C7A5B]">
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">최근 {inquiries.length}건</span>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">워크숍 {workshopCount}건</span>
            <span className="rounded-full border border-[#eadfcd] bg-white px-3 py-1.5">포트폴리오 {portfolioCount}건</span>
          </div>
        </div>
      </div>

      {latest ? (
        <section className="rounded-[24px] border border-[#d8c5ac] bg-[#fffaf2] p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
          <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">LATEST</p>
          <h3 className="mt-2 text-lg font-semibold text-[#111111]">{latest.name ?? "이름 없음"}</h3>
          <p className="mt-2 text-sm text-[#5f564b]">{latest.concernType ?? "고민 유형 없음"} · {formatDate(latest.receivedAt)}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#3f382f]">{latest.message ?? "메시지 없음"}</p>
        </section>
      ) : null}

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-2 border-b border-[#efe7da] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">INQUIRY LIST</p>
            <h3 className="mt-2 text-lg font-semibold text-[#111111]">최근 접수 목록</h3>
          </div>
          <p className="text-xs text-[#8C7A5B]">개인정보가 포함될 수 있으니 외부 공유 금지</p>
        </div>

        <div className="mt-4 grid gap-3">
          {inquiries.length === 0 ? (
            <div className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-5 text-sm leading-7 text-[#5f564b]">
              아직 접수된 상담 신청이 없습니다. `/contact` 폼 제출 후 이곳에 표시됩니다.
            </div>
          ) : (
            inquiries.map((item, index) => (
              <article key={item.inquiryId ?? `${item.receivedAt}-${index}`} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
                <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_160px] lg:items-start">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#111111]">{item.name ?? "이름 없음"}</p>
                    <p className="mt-1 break-all text-xs text-[#7a6d5c]">{item.contact ?? "연락처 없음"}</p>
                    <p className="mt-2 text-xs text-[#8c7a5b]">{formatDate(item.receivedAt)}</p>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2 text-[11px] text-[#6f6251]">
                      <span className="rounded-full border border-[#e8e0d4] bg-white px-2.5 py-1">{item.stage ?? "상황 없음"}</span>
                      <span className="rounded-full border border-[#e8e0d4] bg-white px-2.5 py-1">{item.consultationType ?? "상담 유형 없음"}</span>
                      <span className="rounded-full border border-[#e8e0d4] bg-white px-2.5 py-1">{item.concernType ?? "고민 유형 없음"}</span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#3f382f]">{item.message ?? "메시지 없음"}</p>
                    {item.referenceUrl ? <p className="mt-2 break-all text-xs text-[#8C6A2E]">참고: {item.referenceUrl}</p> : null}
                  </div>
                  <div className="rounded-[16px] border border-[#ede6d8] bg-white px-3 py-3 text-xs leading-6 text-[#6f6251]">
                    <p className="font-semibold text-[#111111]">희망 시간</p>
                    <p className="mt-1">{item.preferredSchedule || "미기재"}</p>
                    <p className="mt-3 text-[11px] text-[#9a8b7a]">{item.inquiryId ?? "접수 번호 없음"}</p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  );
}
