import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/blogData";
import { CATEGORY_SLUGS } from "@/lib/sablonlarData";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://digitaldavetiyem.com";

  const blogUrls = ARTICLES.map((a) => ({
    url: `${base}/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const sablonlarUrls = (
    Object.keys(CATEGORY_SLUGS) as (keyof typeof CATEGORY_SLUGS)[]
  ).map((slug) => ({
    url: `${base}/sablonlar/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/create`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogUrls,
    {
      url: `${base}/sablonlar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...sablonlarUrls,
  ];
}
