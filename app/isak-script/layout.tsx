import type { Metadata } from "next";

const pageUrl = "https://soom.io.kr/isak-script";
const pageTitle = "이삭영유아부 | 숨";
const pageDescription = "이삭영유아부";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/isak-script",
  },
  openGraph: {
    type: "website",
    url: pageUrl,
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: "/hero-church-main.png",
        width: 1200,
        height: 630,
        alt: "이삭영유아부",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/hero-church-main.png"],
  },
};

export default function IsakScriptLayout({ children }: { children: React.ReactNode }) {
  return children;
}
