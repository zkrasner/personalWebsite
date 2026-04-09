import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://zkrasner.com",
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://zkrasner.com/bookshelf",
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
