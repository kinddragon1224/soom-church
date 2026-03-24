type GuidePostValue = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  content?: string;
  published?: boolean;
};

const fieldClass = "mt-1 w-full rounded-[14px] border border-[#d9d2c7] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[#111111] outline-none transition focus:border-[#b9a88c] focus:bg-white";

export function GuidePostForm({
  action,
  value,
}: {
  action: (formData: FormData) => Promise<void>;
  value?: GuidePostValue;
}) {
  return (
    <form action={action} className="grid gap-4 rounded-[24px] border border-[#e6dfd5] bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-5">
      <div>
        <h2 className="text-lg font-semibold text-[#111111]">안내서 작성</h2>
        <p className="mt-2 text-sm text-[#5f564b]">공개 AI 안내서 탭에 직접 연결되는 글쓰기 폼입니다.</p>
      </div>
      <input type="hidden" name="authorEmail" value="dev@soom.church" />
      <label className="text-sm font-medium text-[#3f3528]">제목<input name="title" defaultValue={value?.title ?? ""} className={fieldClass} /></label>
      <label className="text-sm font-medium text-[#3f3528]">슬러그<input name="slug" defaultValue={value?.slug ?? ""} className={fieldClass} /></label>
      <label className="text-sm font-medium text-[#3f3528]">요약문<textarea name="excerpt" defaultValue={value?.excerpt ?? ""} className={`${fieldClass} min-h-[100px]`} /></label>
      <label className="text-sm font-medium text-[#3f3528]">커버 이미지 URL<input name="coverImageUrl" defaultValue={value?.coverImageUrl ?? ""} className={fieldClass} /></label>
      <label className="text-sm font-medium text-[#3f3528]">본문<textarea name="content" defaultValue={value?.content ?? ""} className={`${fieldClass} min-h-[320px]`} /></label>
      <label className="flex items-center gap-2 text-sm font-medium text-[#5f564b]"><input type="checkbox" name="published" defaultChecked={value?.published} /> 발행</label>
      <button className="rounded-[14px] bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white">저장</button>
    </form>
  );
}
