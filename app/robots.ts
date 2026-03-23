import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://soom.io.kr/sitemap.xml",
    host: "https://soom.io.kr",
  };
}
