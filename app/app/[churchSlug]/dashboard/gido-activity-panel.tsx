"use client";

import { useState } from "react";

type Item = {
  title: string;
  note: string;
  meta?: string;
};

export default function GidoActivityPanel({ feed, notifications }: { feed: Item[]; notifications: Item[] }) {
  const [tab, setTab] = useState<"feed" | "notifications">("feed");
  const items = tab === "feed" ? feed : notifications;

  return (
    <section className="rounded-[28px] border border-[#ebe4d8] bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-[#ece5db] bg-[#f7f5f0] p-1">
          <button
            type="button"
            onClick={() => setTab("feed")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${tab === "feed" ? "bg-white text-[#171717] shadow-sm" : "text-[#8c8175]"}`}
          >
            피드
          </button>
          <button
            type="button"
            onClick={() => setTab("notifications")}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${tab === "notifications" ? "bg-white text-[#171717] shadow-sm" : "text-[#8c8175]"}`}
          >
            알림
          </button>
        </div>
        <span className="text-xs text-[#8f8478]">{items.length}개</span>
      </div>

      <div className="mt-4 max-h-[420px] space-y-3 overflow-auto pr-1">
        {items.map((item) => (
          <article key={`${tab}-${item.title}-${item.meta ?? ""}`} className="rounded-[18px] border border-[#eee8de] bg-[#fcfbf8] p-4">
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111827] text-xs font-semibold text-white">
                soom
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111111]">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#5f564b]">{item.note}</p>
                {item.meta ? <p className="mt-2 text-xs text-[#8f8478]">{item.meta}</p> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
