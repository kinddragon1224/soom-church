import "./globals.css";
import type { Metadata } from "next";

const siteUrl = "https://soom.io.kr";
const siteTitle = "숨 | AI 시대 진로·직업·커리어 방향 진단";
const siteDescription = "숨은 학생 진로, 20대 커리어, 중장년 후반전 커리어를 AI 시대의 직업 변화 속에서 읽고 다음 행동으로 정리하는 방향 진단 서비스입니다.";
const ogImage = "/blog-hero-portrait-dark.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: "%s | 숨" },
  description: siteDescription,
  applicationName: "숨",
  keywords: [
    "숨",
    "soom",
    "AI 진로",
    "AI 커리어",
    "직업상담",
    "진로 방향",
    "재취업",
    "이력서",
    "고교학점제",
    "커리어 전환",
    "중장년 커리어",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "숨",
    title: siteTitle,
    description: siteDescription,
    images: [{ url: ogImage, width: 1200, height: 630, alt: "숨 - AI 시대 진로·직업·커리어 방향 진단" }],
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
