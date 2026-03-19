import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "숨 | 교회와 사역자를 위한 콘텐츠·디자인·웹팀",
  description:
    "숨(soom)은 교회와 사역의 메시지가 더 선명하게 전달되도록 홈페이지, 디자인, 영상, 운영용 웹을 만듭니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
