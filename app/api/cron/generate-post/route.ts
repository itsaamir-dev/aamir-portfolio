import { getAllPosts } from "@/lib/posts";
import { generatePost } from "@/lib/blog-generator";
import { createFile, listDir } from "@/lib/github";
import { rejectUnauthorized } from "@/lib/cron-auth";

// Writing a long post at high effort can take a couple of minutes.
export const maxDuration = 300;
export const dynamic     = "force-dynamic";

/**
 * Vercel Cron: writes one new blog post with Claude and commits it to
 * content/posts/<slug>.json. The push triggers a production deploy.
 * Add ?dryRun=1 to generate and return the post without committing.
 */
export async function GET(req: Request) {
  const denied = rejectUnauthorized(req);
  if (denied) return denied;

  const dryRun = new URL(req.url).searchParams.has("dryRun");

  try {
    // Posts in this deployment, plus any committed since it was built.
    const deployed  = getAllPosts();
    const committed = (await listDir("content/posts")).map(f => f.replace(/\.json$/, ""));
    const existingSlugs  = new Set([...deployed.map(p => p.slug), ...committed]);
    const existingTitles = [...deployed.map(p => p.title), ...committed.map(s => s.replace(/-/g, " "))];

    const post = await generatePost({ existingTitles, existingSlugs });

    if (dryRun) return Response.json({ ok: true, dryRun: true, post });

    const commitUrl = await createFile(
      `content/posts/${post.slug}.json`,
      JSON.stringify(post, null, 2) + "\n",
      `chore(blog): add "${post.title}"`,
    );

    return Response.json({ ok: true, slug: post.slug, title: post.title, commitUrl });
  } catch (err) {
    console.error("[cron/generate-post]", err);
    return Response.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
