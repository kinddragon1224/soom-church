import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "숨 | 교회 운영 워크스페이스 플랫폼",
  description: "숨은 교회별 워크스페이스에서 교적·신청·공지·후속관리를 운영하는 SaaS 플랫폼입니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
