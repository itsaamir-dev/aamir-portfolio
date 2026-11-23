import type { MetadataRoute } from "next";
import { getAllPosts, postTime } from "@/lib/posts";
import { getOpenJobs } from "@/lib/jobs-data";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts  = getAllPosts();
  // Open jobs only; a database hiccup must never break the sitemap.
  const jobs   = await getOpenJobs().catch(() => []);
  const latest = posts.length ? new Date(postTime(posts[0])) : new Date();

  return [
    { url: SITE_URL,               lastModified: latest, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/blog`,     lastModified: latest, changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/story`,     lastModified: new Date("2026-10-27"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/learn`,     lastModified: latest,                 changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/community`, lastModified: new Date("2026-10-27"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/challenge`, lastModified: new Date("2026-10-27"), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${SITE_URL}/ebook`,     lastModified: new Date("2026-10-27"), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/resources/free-profile-websites`, lastModified: new Date("2026-10-26"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/jobs`,      lastModified: jobs[0]?.publishedAt ? new Date(jobs[0].publishedAt) : latest, changeFrequency: "daily", priority: 0.8 },
    ...jobs.map(job => ({
      url:             `${SITE_URL}/jobs/${job.slug}`,
      lastModified:    job.publishedAt ? new Date(job.publishedAt) : latest,
      changeFrequency: "weekly" as const,
      priority:        0.6,
    })),
    { url: `${SITE_URL}/sitemap`,  lastModified: latest, changeFrequency: "weekly",  priority: 0.3 },
    ...posts.map(post => ({
      url:             `${SITE_URL}/blog/${post.slug}`,
      lastModified:    new Date(postTime(post) || Date.now()),
      changeFrequency: "monthly" as const,
      priority:        post.featured ? 0.8 : 0.7,
    })),
  ];
}
