import { ogCard, OG_SIZE } from "@/lib/og";
import { BLOG_TITLE } from "@/lib/seo";

export const alt         = BLOG_TITLE;
export const size        = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ eyebrow: "The Blog", title: BLOG_TITLE, footer: "By Aamir Bashir" });
}
