import "./globals.css";
import type { Metadata } from "next";

const siteUrl = "https://soom.io.kr";
const siteTitle = "숨 | AI 시대 진로 컨설팅";
const siteDescription =
  "숨(soom)은 직업상담사 관점과 기획자의 구조화 능력으로 AI 시대의 진로, 커리어 전환, 포트폴리오 설계를 돕는 컨설팅 브랜드입니다.";
const ogImage = "/blog-hero-portrait-dark.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | 숨",
  },
  description: siteDescription,
  applicationName: "숨",
  keywords: [
    "숨",
    "soom",
    "AI 진로 상담",
    "진로 컨설팅",
    "커리어 전환",
    "직업상담사",
    "AI 포트폴리오",
    "커리어 리디자인",
    "자기 상품화",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "숨",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "숨 - AI 시대 진로 컨설팅",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
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
  category: "business",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
