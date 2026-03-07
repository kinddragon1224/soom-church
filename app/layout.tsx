import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "숨 관리자",
  description: "교회 교적/행정 운영 허브",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
