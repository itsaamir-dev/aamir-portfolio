import Reveal from "@/components/RevealOnScroll";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getAllPosts, toSummary, isoDate } from "@/lib/posts";
import { PROMISE } from "@/lib/site";
import { SITE_URL, BLOG_TITLE, BLOG_DESCRIPTION, jsonLd } from "@/lib/seo";
import BlogFilters from "./BlogFilters";

export default function BlogPage() {
  const posts = getAllPosts();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":     "Blog",
        "@id":       `${SITE_URL}/blog#blog`,
        url:         `${SITE_URL}/blog`,
        name:        BLOG_TITLE,
        description: BLOG_DESCRIPTION,
        inLanguage:  "en-US",
        isPartOf:    { "@id": `${SITE_URL}/#website` },
        author:      { "@id": `${SITE_URL}/#person` },
        blogPost: posts.slice(0, 20).map(p => ({
          "@type":       "BlogPosting",
          headline:      p.title,
          url:           `${SITE_URL}/blog/${p.slug}`,
          datePublished: isoDate(p),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <header className="border-b border-line bg-bg pb-12 pt-32 sm:pb-16 sm:pt-36">
        <div className="container-x">
          <p className="eyebrow">Writing &amp; Insights</p>
          <h1 className="mt-4 text-[2.25rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            The Blog
          </h1>
          <p className="lead mt-5 max-w-2xl text-muted">{BLOG_DESCRIPTION}</p>
        </div>
      </header>

      <main className="container-x section">
        <BlogFilters posts={posts.map(toSummary)} />

        <Reveal>
          <div className="relative mt-16 overflow-hidden rounded-2xl border border-line bg-surface px-6 py-10 sm:px-10
                          flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Learning to freelance?</h2>
              <p className="mt-2 text-base text-muted">{PROMISE} Join the free community.</p>
            </div>
            <WhatsAppButton className="shrink-0" />
          </div>
        </Reveal>
      </main>

      <Footer />
    </>
  );
}
