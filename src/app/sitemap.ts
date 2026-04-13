import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://zkrasner.com",
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://zkrasner.com/projects",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://zkrasner.com/bookshelf",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projects.map((p) => ({
      url: `https://zkrasner.com/projects/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
