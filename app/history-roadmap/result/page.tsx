import type { Metadata } from "next";
import { HistoryRoadmapResultView } from "@/components/history-roadmap/history-roadmap-result";

export const metadata: Metadata = {
  title: "결과",
  description: "학생의 진로와 한국사 단원을 연결한 탐구 주제 설계 결과입니다.",
  robots: { index: false, follow: false },
};

export default function HistoryRoadmapResultPage() {
  return <HistoryRoadmapResultView />;
}
