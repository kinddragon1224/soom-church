import type { MetadataRoute } from "next";

const siteUrl = "https://soom.io.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/features",
    "/pricing",
    "/contact",
    "/ai-guides",
    "/login",
    "/signup",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
