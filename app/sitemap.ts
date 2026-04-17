import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aamirbashir.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url:             SITE_URL,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        1.0,
    },
    {
      url:             `${SITE_URL}/blog`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        0.9,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url:             `${SITE_URL}/blog/${post.slug}`,
    lastModified:    new Date(post.date),
    changeFrequency: "monthly" as const,
    priority:        post.featured ? 0.9 : 0.7,
  }));

  return [...staticPages, ...blogPages];
}
