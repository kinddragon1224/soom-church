"use client";

import { useRef, useState } from "react";

type GuidePostValue = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  coverImageUrl?: string | null;
  content?: string;
  published?: boolean;
};

const fieldClass = "w-full rounded-[16px] border border-[#ddd5c8] bg-white px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#b9a88c] focus:ring-2 focus:ring-[#efe3cc]";
const chipClass = "rounded-full border border-[#e3d8c6] bg-white px-3 py-1.5 text-xs font-medium text-[#6f6252]";

export function GuidePostForm({
  action,
  value,
}: {
  action: (formData: FormData) => Promise<void>;
  value?: GuidePostValue;
}) {
  const [coverImageUrl, setCoverImageUrl] = useState(value?.coverImageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleUpload(file: File) {
    const body = new FormData();
    body.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("/api/uploads/image", { method: "POST", body });
      const data = await res.json();
      if (data.url) setCoverImageUrl(data.url);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <form action={action} className="grid gap-4 text-[#111111]">
      <input type="hidden" name="authorEmail" value="dev@soom.church" />

      <section className="sticky top-3 z-10 rounded-[24px] border border-[#e6dfd5] bg-white/95 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">BLOG STYLE EDITOR</p>
            <h2 className="mt-2 text-lg font-semibold text-[#111111]">AI 안내서 작성</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={chipClass}>제목</span>
            <span className={chipClass}>요약</span>
            <span className={chipClass}>SEO</span>
            <span className={chipClass}>대표 이미지</span>
            <span className={chipClass}>본문</span>
            <button className="rounded-[14px] bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white">저장</button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4">
          <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-7">
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">TITLE AREA</p>
            <input name="title" defaultValue={value?.title ?? ""} placeholder="제목을 입력하세요" className="mt-4 w-full border-none bg-transparent px-0 py-0 text-[2rem] font-semibold tracking-[-0.06em] text-[#111111] outline-none placeholder:text-[#b2a79a] sm:text-[2.6rem]" />
            <textarea name="excerpt" defaultValue={value?.excerpt ?? ""} placeholder="요약문을 입력하세요" className="mt-4 min-h-[88px] w-full resize-none border-none bg-transparent px-0 py-0 text-base leading-7 text-[#5f564b] outline-none placeholder:text-[#b2a79a]" />
          </section>

          <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-7">
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">COVER</p>
            <input name="coverImageUrl" value={coverImageUrl} onChange={(event) => setCoverImageUrl(event.target.value)} placeholder="대표 이미지 URL" className={`${fieldClass} mt-4`} />
            <div className="mt-4 rounded-[22px] border border-dashed border-[#d8cfbf] bg-[#fcfbf8] p-6 text-sm text-[#7b6f60]">
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-[12px] border border-[#d9d2c7] bg-white px-3 py-2 text-sm font-medium text-[#111111]">이미지 업로드</button>
                <span>{uploading ? "업로드 중..." : "5MB 이하 이미지 업로드 가능"}</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleUpload(file); }} />
            </div>
            {coverImageUrl ? <img src={coverImageUrl} alt="cover preview" className="mt-4 w-full rounded-[20px] border border-[#ece6dc] object-cover" /> : null}
          </section>

          <section className="rounded-[28px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] sm:p-7">
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">BODY</p>
            <textarea name="content" defaultValue={value?.content ?? ""} placeholder="본문을 입력하세요" className="mt-4 min-h-[520px] w-full resize-y border-none bg-transparent px-0 py-0 text-base leading-8 text-[#2d261f] outline-none placeholder:text-[#b2a79a]" />
          </section>
        </div>

        <aside className="grid gap-4">
          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">POST SETTINGS</p>
            <div className="mt-4 grid gap-3">
              <label className="text-sm font-medium text-[#3f3528]">슬러그<input name="slug" defaultValue={value?.slug ?? ""} className={`${fieldClass} mt-1`} /></label>
              <label className="flex items-center gap-2 text-sm font-medium text-[#5f564b]"><input type="checkbox" name="published" defaultChecked={value?.published} /> 발행</label>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">SEO</p>
            <div className="mt-4 grid gap-3">
              <label className="text-sm font-medium text-[#3f3528]">SEO 제목<input name="seoTitle" defaultValue={value?.seoTitle ?? ""} className={`${fieldClass} mt-1`} /></label>
              <label className="text-sm font-medium text-[#3f3528]">SEO 설명<textarea name="seoDescription" defaultValue={value?.seoDescription ?? ""} className={`${fieldClass} mt-1 min-h-[100px]`} /></label>
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e6dfd5] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-[11px] tracking-[0.18em] text-[#9a8b7a]">EDITOR GUIDE</p>
            <div className="mt-4 grid gap-3 text-sm text-[#5f564b]">
              <div className="rounded-[16px] border border-[#ece6dc] bg-[#fcfbf8] p-4">제목은 짧고 강하게, 요약문은 2~3문장으로 정리</div>
              <div className="rounded-[16px] border border-[#ece6dc] bg-[#fcfbf8] p-4">본문은 문단 단위로 쓰고, 한 문단은 너무 길지 않게 유지</div>
              <div className="rounded-[16px] border border-[#ece6dc] bg-[#fcfbf8] p-4">SEO 제목과 설명은 검색 노출 기준으로 따로 정리</div>
            </div>
          </section>
        </aside>
      </section>
    </form>
  );
}
