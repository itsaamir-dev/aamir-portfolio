import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPost, toSummary, isoDate } from "@/lib/posts";
import { SITE_URL, AUTHOR, ogDefaults, personSchema, jsonLd } from "@/lib/seo";
import BlogPostClient from "./BlogPostClient";

// Every post is prerendered; unknown slugs 404 instead of rendering on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};

  const path      = `/blog/${post.slug}`;
  const published = isoDate(post);

  return {
    title:       post.title,
    description: post.excerpt,
    keywords:    post.tags,
    authors:     [{ name: AUTHOR, url: SITE_URL }],
    alternates:  { canonical: path },

    openGraph: {
      ...ogDefaults,
      type:          "article",
      url:           path,
      title:         post.title,
      description:   post.excerpt,
      publishedTime: published,
      modifiedTime:  published,
      authors:       [AUTHOR],
      section:       post.catLabel,
      tags:          post.tags,
    },

    twitter: {
      card:        "summary_large_image",
      title:       post.title,
      description: post.excerpt,
    },
  };
}

function wordCount(html: string) {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const all     = getAllPosts();
  const idx     = all.findIndex(p => p.slug === post.slug);
  const prev    = all[idx + 1] ?? null;   // older
  const next    = all[idx - 1] ?? null;   // newer
  const related = all.filter(p => p.slug !== post.slug && p.cat === post.cat).slice(0, 3);

  const postUrl   = `${SITE_URL}/blog/${post.slug}`;
  const published = isoDate(post);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":          "BlogPosting",
        "@id":            `${postUrl}#article`,
        headline:         post.title,
        description:      post.excerpt,
        keywords:         post.tags.join(", "),
        articleSection:   post.catLabel,
        wordCount:        wordCount(post.content),
        url:              postUrl,
        image:            `${postUrl}/opengraph-image`,
        datePublished:    published,
        dateModified:     published,
        inLanguage:       "en-US",
        author:           personSchema,
        publisher:        { "@id": `${SITE_URL}/#person` },
        isPartOf:         { "@id": `${SITE_URL}/blog#blog` },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      <BlogPostClient
        post={post}
        prev={prev && toSummary(prev)}
        next={next && toSummary(next)}
        related={related.map(toSummary)}
      />
    </>
  );
}
