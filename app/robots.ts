import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/kof-afk-64-korea", "/kof-afk-bisa-guide"],
    },
    sitemap: "https://soom.io.kr/sitemap.xml",
    host: "https://soom.io.kr",
  };
}
