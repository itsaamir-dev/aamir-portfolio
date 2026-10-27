import type { Metadata } from "next";
import { BLOG_TITLE, BLOG_DESCRIPTION, ogDefaults } from "@/lib/seo";

export const metadata: Metadata = {
  title:       BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates:  { canonical: "/blog" },
  openGraph:   { ...ogDefaults, type: "website", url: "/blog", title: BLOG_TITLE, description: BLOG_DESCRIPTION },
  twitter:     { card: "summary_large_image", title: BLOG_TITLE, description: BLOG_DESCRIPTION },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
