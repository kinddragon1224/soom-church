import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

type Props = { className?: string; children: ReactNode };

const statusColorMap: Record<string, string> = {
  등록대기: "bg-slate-100 text-slate-700",
  새가족: "bg-emerald-100 text-emerald-700",
  정착중: "bg-blue-100 text-blue-700",
  목장배정완료: "bg-violet-100 text-violet-700",
  봉사연결: "bg-amber-100 text-amber-700",
  휴면: "bg-zinc-100 text-zinc-600",
  심방필요: "bg-rose-100 text-rose-700",
};

export function StatusBadge({ className, children }: Props) {
  const key = String(children);
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        statusColorMap[key] ?? "bg-slate-100 text-slate-700",
        className,
      )}
    >
      {children}
    </span>
  );
}
