import type { MetadataRoute } from "next";
import { getAllPosts, postTime } from "@/lib/posts";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts  = getAllPosts();
  const latest = posts.length ? new Date(postTime(posts[0])) : new Date();

  return [
    { url: SITE_URL,               lastModified: latest, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/blog`,     lastModified: latest, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/sitemap`,  lastModified: latest, changeFrequency: "weekly",  priority: 0.3 },
    ...posts.map(post => ({
      url:             `${SITE_URL}/blog/${post.slug}`,
      lastModified:    new Date(postTime(post) || Date.now()),
      changeFrequency: "monthly" as const,
      priority:        post.featured ? 0.8 : 0.7,
    })),
  ];
}
