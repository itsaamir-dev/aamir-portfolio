import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/data";
import BlogPostClient from "./BlogPostClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithaamir.com";

export async function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post) return {};

  const postUrl   = `${SITE_URL}/blog/${post.slug}`;
  const ogImage   = `${SITE_URL}/og-blog.png`;
  const metaTitle = `${post.title} | Aamir Bashir`;
  const isoDate   = new Date(post.date).toISOString().split("T")[0];

  return {
    title:       metaTitle,
    description: post.excerpt,
    keywords:    post.tags,
    authors:     [{ name: "Aamir Bashir", url: SITE_URL }],
    alternates:  { canonical: postUrl },

    openGraph: {
      type:          "article",
      url:           postUrl,
      title:         post.title,
      description:   post.excerpt,
      siteName:      "Aamir Bashir — Software Engineer",
      publishedTime: isoDate,
      authors:       ["Aamir Bashir"],
      tags:          post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },

    twitter: {
      card:        "summary_large_image",
      title:       post.title,
      description: post.excerpt,
      images:      [ogImage],
    },

    robots: {
      index: true, follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post     = blogPosts.find(p => p.slug === params.slug);
  if (!post) notFound();

  const allPosts = blogPosts;
  const idx      = allPosts.indexOf(post);
  const prev     = allPosts[idx + 1] ?? null;
  const next     = allPosts[idx - 1] ?? null;
  const related  = allPosts.filter(p => p.slug !== post.slug && p.cat === post.cat).slice(0, 3);

  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id":           `${postUrl}#article`,
        headline:        post.title,
        description:     post.excerpt,
        keywords:        post.tags.join(", "),
        url:             postUrl,
        image:           `${SITE_URL}/og-blog.png`,
        datePublished:   isoDate,
        dateModified:    isoDate,
        inLanguage:      "en-US",
        author: {
          "@type": "Person",
          name:   "Aamir Bashir",
          url:    SITE_URL,
          sameAs: [
            "https://www.linkedin.com/in/aamirbashir",
            "https://www.upwork.com/freelancers/aamirbashir",
          ],
        },
        publisher: {
          "@type": "Person",
          name:    "Aamir Bashir",
          url:     SITE_URL,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
      },
      {
        "@type": "BreadcrumbList",
        "@id":   `${postUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home",     item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog",     item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient post={post} prev={prev} next={next} related={related} />
    </>
  );
}
