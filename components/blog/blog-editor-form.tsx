import { BlogPostStatus } from "@prisma/client";

type BlogEditorValue = {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  status?: BlogPostStatus;
  contentJson?: string;
};

function parseContent(contentJson?: string) {
  try {
    const parsed = contentJson ? JSON.parse(contentJson) : null;
    return {
      hero: parsed?.hero ?? "",
      sections: [1, 2, 3].map((index) => parsed?.sections?.[index - 1] ?? { heading: "", body: "" }),
    };
  } catch {
    return {
      hero: "",
      sections: [1, 2, 3].map(() => ({ heading: "", body: "" })),
    };
  }
}

export function BlogEditorForm({
  action,
  value,
}: {
  action: (formData: FormData) => Promise<void>;
  value?: BlogEditorValue;
}) {
  const content = parseContent(value?.contentJson);

  return (
    <form action={action} className="grid gap-4">
      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="text-sm font-medium text-[#3f3528]">제목<input name="title" defaultValue={value?.title ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" /></label>
          <label className="text-sm font-medium text-[#3f3528]">슬러그<input name="slug" defaultValue={value?.slug ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" /></label>
          <label className="text-sm font-medium text-[#3f3528] lg:col-span-2">요약문<textarea name="excerpt" defaultValue={value?.excerpt ?? ""} className="mt-1 min-h-[88px] w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" /></label>
          <label className="text-sm font-medium text-[#3f3528]">대표 이미지 URL<input name="coverImageUrl" defaultValue={value?.coverImageUrl ?? ""} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" /></label>
          <label className="text-sm font-medium text-[#3f3528]">상태<select name="status" defaultValue={value?.status ?? BlogPostStatus.DRAFT} className="mt-1 w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]"><option value={BlogPostStatus.DRAFT}>초안</option><option value={BlogPostStatus.PUBLISHED}>발행</option><option value={BlogPostStatus.ARCHIVED}>보관</option></select></label>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SMART EDITOR</p>
        <h2 className="mt-2 text-lg font-semibold text-[#111111]">본문 작성</h2>
        <div className="mt-4 grid gap-4">
          <label className="text-sm font-medium text-[#3f3528]">도입 문단<textarea name="hero" defaultValue={content.hero} className="mt-1 min-h-[120px] w-full rounded-[14px] border border-[#E7E0D4] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111]" /></label>
          {content.sections.map((section, index) => (
            <div key={index} className="rounded-[18px] border border-[#ede6d8] bg-[#fcfbf8] p-4">
              <p className="text-sm font-semibold text-[#111111]">섹션 {index + 1}</p>
              <div className="mt-3 grid gap-3">
                <input name={`heading_${index + 1}`} defaultValue={section.heading} placeholder="소제목" className="rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
                <textarea name={`body_${index + 1}`} defaultValue={section.body} placeholder="본문" className="min-h-[160px] rounded-[14px] border border-[#E7E0D4] bg-white px-3 py-2.5 text-sm text-[#111111]" />
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 rounded-[14px] bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white">저장</button>
      </section>
    </form>
  );
}
