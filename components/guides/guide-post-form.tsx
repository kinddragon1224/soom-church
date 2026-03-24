type GuidePostValue = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  content?: string;
  published?: boolean;
};

export function GuidePostForm({
  action,
  value,
}: {
  action: (formData: FormData) => Promise<void>;
  value?: GuidePostValue;
}) {
  return (
    <form action={action} className="grid gap-4 rounded-xl border border-border bg-white p-4 sm:p-5">
      <div>
        <h2 className="text-base font-semibold">안내서 작성</h2>
        <p className="mt-2 text-sm text-muted-foreground">공개 AI 안내서 탭에 바로 연결되는 글쓰기 폼이야.</p>
      </div>
      <input type="hidden" name="authorEmail" value="dev@soom.church" />
      <label className="text-sm font-medium">제목<input name="title" defaultValue={value?.title ?? ""} className="mt-1 w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="text-sm font-medium">슬러그<input name="slug" defaultValue={value?.slug ?? ""} className="mt-1 w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="text-sm font-medium">요약문<textarea name="excerpt" defaultValue={value?.excerpt ?? ""} className="mt-1 min-h-[88px] w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="text-sm font-medium">커버 이미지 URL<input name="coverImageUrl" defaultValue={value?.coverImageUrl ?? ""} className="mt-1 w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="text-sm font-medium">본문<textarea name="content" defaultValue={value?.content ?? ""} className="mt-1 min-h-[320px] w-full rounded-md border border-border px-3 py-2" /></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="published" defaultChecked={value?.published} /> 발행</label>
      <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">저장</button>
    </form>
  );
}
