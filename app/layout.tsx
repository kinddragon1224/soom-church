import "./globals.css";
import type { Metadata } from "next";

const siteUrl = "https://soom.io.kr";
const siteTitle = "숨 | 교회와 사역자를 위한 콘텐츠·디자인·웹팀";
const siteDescription = "숨(soom)은 교회와 사역의 메시지가 더 선명하게 전달되도록 홈페이지, 디자인, 영상, 운영용 웹을 만듭니다.";
const ogImage = "/hero-church-main.png";

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
    "교회 홈페이지",
    "교회 디자인",
    "교회 영상",
    "교회 웹사이트",
    "사역 디자인",
    "교회 브랜딩",
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
        alt: "숨 - 교회와 사역자를 위한 콘텐츠·디자인·웹팀",
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
