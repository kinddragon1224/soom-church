import "./globals.css";
import type { Metadata } from "next";

const siteUrl = "https://soom.io.kr";
const siteTitle = "더루멘 | AI 시대 진로 포지션 체크";
const siteDescription = "더루멘은 직업 이름보다 먼저 AI 시대의 역할 위치를 봅니다. 도구 운용자, 결과 제작자, 맥락 해석자, 문제 발견자, 관계 조율자 중 어디에 가까운지 확인합니다.";
const ogImage = "/blog-hero-portrait-dark.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s | 더루멘" },
  description: siteDescription,
  applicationName: "더루멘",
  keywords: [
    "더루멘",
    "THE LUMEN",
    "soom",
    "AI 진로",
    "AI 시대 진로 포지션",
    "진로 포지션",
    "미래 포지션 설계",
    "직업상담",
    "도구 운용자",
    "결과 제작자",
    "맥락 해석자",
    "문제 발견자",
    "관계 조율자",
    "고교학점제",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "더루멘",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "더루멘 - AI 시대 진로 포지션 체크" }],
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription, images: [ogImage] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  category: "business",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
