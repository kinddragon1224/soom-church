import "./globals.css";
import type { Metadata } from "next";

const siteUrl = "https://soom.io.kr";
const siteTitle = "한국사 진로 세특 로드맵";
const siteDescription =
  "한국사를 외우는 과목에서, 내 진로를 설명하는 탐구 과목으로. 한국사 단원과 진로를 연결해 탐구보고서, 발표, 세특 주제를 설계합니다.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s | 한국사 진로 세특 로드맵" },
  description: siteDescription,
  applicationName: "한국사 진로 세특 로드맵",
  keywords: [
    "한국사 세특",
    "한국사 탐구보고서",
    "진로 세특",
    "수행평가 주제",
    "한국사 발표 주제",
    "한국사 진로",
    "탐구 주제 설계",
  ],
  alternates: { canonical: "/history-roadmap" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: `${siteUrl}/history-roadmap`,
    siteName: "한국사 진로 세특 로드맵",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: { card: "summary", title: siteTitle, description: siteDescription },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "education",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
