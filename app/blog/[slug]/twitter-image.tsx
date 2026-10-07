import { ogCard, OG_SIZE } from "@/lib/og";
import { getAllPosts, getPost } from "@/lib/posts";

export const alt         = "Blog post by Aamir Bashir";
export const size        = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  return ogCard({
    eyebrow: post?.catLabel ?? "Blog",
    title:   post?.title ?? "Build With Aamir",
    footer:  `Aamir Bashir${post ? ` · ${post.readTime}` : ""}`,
  });
}
