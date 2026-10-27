import "server-only";
import { getAllPosts, toSummary, type BlogSummary } from "@/lib/posts";
import { learnTopics, type LearnTopicId } from "@/lib/site";

const FREELANCING_CATS = new Set(["freelance", "career"]);

/** Groups freelancing and career articles under the Learn topics (first match wins). */
export function postsByTopic(): Record<LearnTopicId, BlogSummary[]> {
  const groups = Object.fromEntries(learnTopics.map(t => [t.id, [] as BlogSummary[]])) as Record<LearnTopicId, BlogSummary[]>;

  for (const post of getAllPosts()) {
    if (!FREELANCING_CATS.has(post.cat)) continue;
    const haystack = `${post.title} ${post.slug.replace(/-/g, " ")}`.toLowerCase();
    const topic = learnTopics.find(t => t.match.test(haystack)) ?? learnTopics.find(t => t.id === "career")!;
    groups[topic.id].push(toSummary(post));
  }
  return groups;
}
