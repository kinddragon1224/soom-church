import type { MetadataRoute } from "next";

const siteUrl = "https://soom.io.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/history-roadmap", "/history-roadmap/result"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/history-roadmap/result" ? "monthly" : "weekly",
    priority: route === "/history-roadmap/result" ? 0.4 : 1,
  }));
}
