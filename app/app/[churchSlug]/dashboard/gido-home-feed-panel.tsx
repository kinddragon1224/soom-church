"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

export type GidoHomePanelItem = {
  key: string;
  label: string;
  title: string;
  body: string;
  href: string;
  meta?: string;
  tone?: "navy" | "green" | "amber" | "purple";
};

export default function GidoHomeFeedPanel({
  feedItems,
  notificationItems,
}: {
  feedItems: GidoHomePanelItem[];
  notificationItems: GidoHomePanelItem[];
}) {
  const [tab, setTab] = useState<"feed" | "notifications">(feedItems.length > 0 ? "feed" : "notifications");

  const items = useMemo(() => (tab === "feed" ? feedItems : notificationItems), [feedItems, notificationItems, tab]);
  const emptyText = tab === "feed" ? "최근 공유할 흐름이 아직 없어." : "지금 띄울 알림이 아직 없어.";

  return (
    <article className="rounded-[26px] border border-[#eee7dc] bg-white p-5 shadow-[0_6px_18px_rgba(15,23,42,0.03)] lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-[#ece5db] bg-[#f7f5f0] p-1">
          <TabButton active={tab === "feed"} onClick={() => setTab("feed")}>
            Feed
          </TabButton>
          <TabButton active={tab === "notifications"} onClick={() => setTab("notifications")}>
            Notifications
          </TabButton>
        </div>
        <span className="text-[11px] text-[#8f8478]">{items.length} items</span>
      </div>

      <div className="mt-4 space-y-2.5">
        {items.length === 0 ? (
          <EmptyBox text={emptyText} compact />
        ) : (
          items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="block rounded-[16px] border border-[#f0ebe3] bg-[#fcfbf8] p-4 transition hover:border-[#e4dacb] hover:bg-white"
            >
              <div className="flex items-start gap-3">
                <span className={`mt-1.5 inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${toneClass(item.tone)}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#e4dbc9] bg-white px-2 py-0.5 text-[10px] text-[#6f6256]">{item.label}</span>
                    {item.meta ? <span className="text-[10px] text-[#9a8b7a]">{item.meta}</span> : null}
                  </div>
                  <p className="mt-2 text-[13px] font-semibold text-[#111111]">{item.title}</p>
                  <p className="mt-1 text-[13px] leading-6 text-[#5f564b]">{item.body}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </article>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition ${active ? "bg-white text-[#171717] shadow-sm" : "text-[#8c8175] hover:text-[#3d372f]"}`}
    >
      {children}
    </button>
  );
}

function toneClass(tone?: GidoHomePanelItem["tone"]) {
  switch (tone) {
    case "green":
      return "bg-[#2d6d46]";
    case "amber":
      return "bg-[#b7791f]";
    case "purple":
      return "bg-[#7c4dff]";
    default:
      return "bg-[#111827]";
  }
}

function EmptyBox({ text, compact = false }: { text: string; compact?: boolean }) {
  return <div className={`rounded-[16px] border border-dashed border-[#dccfb9] bg-[#fcfbf8] text-[13px] text-[#5f564b] ${compact ? "p-4" : "p-6"}`}>{text}</div>;
}
