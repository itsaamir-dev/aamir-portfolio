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

      <header className="pt-[72px] lg:pt-[80px]">
        <div className="panel bg-surface py-14 sm:py-20">
          <div className="container-x hero-stagger">
            <p className="eyebrow">Writing &amp; Insights</p>
            <h1 className="mt-4 text-[2.75rem] font-medium leading-[1.02] tracking-[-0.055em] text-ink sm:text-6xl lg:text-[5rem]">
              The Blog
            </h1>
            <p className="lead mt-5 max-w-2xl text-muted">{BLOG_DESCRIPTION}</p>
          </div>
        </div>
      </header>

      <main className="container-x section">
        <BlogFilters posts={posts.map(toSummary)} />

        <Reveal>
          <div className="on-dark relative mt-20 flex flex-col gap-6 overflow-hidden rounded-panel bg-night px-6 py-10 text-white
                          sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[1.75rem] font-medium tracking-[-0.045em]">Learning to freelance?</h2>
              <p className="mt-2 text-base text-night-muted">{PROMISE} Join the free community.</p>
            </div>
            <WhatsAppButton location="blog_index" className="shrink-0" />
          </div>
        </Reveal>
      </main>

      <Footer />
    </>
  );
}
