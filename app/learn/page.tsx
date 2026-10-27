import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Icon, { IconName } from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import FinalCTA from "@/components/sections/FinalCTA";
import { learnTopics, learnTopicOrder } from "@/lib/site";
import { postsByTopic } from "@/lib/learn";
import { SITE_URL, pageMetadata, breadcrumb, jsonLd } from "@/lib/seo";

const PATH  = "/learn";
const TITLE = "Learn Freelancing: Upwork Proposals, Clients & Pricing";
const DESC  =
  "Free, practical freelancing lessons organised by topic: Upwork profile and positioning, proposals, finding international clients, pricing in USD, common mistakes and career growth.";

export const metadata: Metadata = pageMetadata(PATH, TITLE, DESC);

const PER_TOPIC = 6;

export default function LearnPage() {
  const groups = postsByTopic();
  const topics = learnTopicOrder.map(id => learnTopics.find(t => t.id === id)!);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":     "CollectionPage",
        "@id":       `${SITE_URL}${PATH}#webpage`,
        url:         `${SITE_URL}${PATH}`,
        name:        TITLE,
        description: DESC,
        isPartOf:    { "@id": `${SITE_URL}/#website` },
      },
      breadcrumb(PATH, "Learn"),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <PageHeader crumb="Learn" eyebrow="Free Learning Resources" title="Learn the Practical Side of Freelancing">
        <p>
          Free articles and resources, grouped by the problems freelancers actually run into. Everything here is from
          my own work — practical lessons, not promises.
        </p>
      </PageHeader>

      <main>
        {/* Topic index */}
        <nav aria-label="Topics" className="border-b border-line bg-bg">
          <ul className="container-x flex max-w-[880px] flex-wrap gap-2 py-6">
            {topics.map(t => (
              <li key={t.id}>
                <a href={`#${t.id}`}
                   className="inline-flex min-h-[44px] items-center rounded-[10px] border border-line px-4 text-[0.95rem] font-medium text-muted hover:border-[#3A4047] hover:text-ink">
                  {t.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="container-x max-w-[880px] divide-y divide-line">
          {topics.map(topic => {
            const posts = groups[topic.id];
            return (
              <section key={topic.id} id={topic.id} aria-labelledby={`${topic.id}-h`} className="scroll-mt-24 py-14 sm:py-16">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[rgba(57,245,106,0.10)] text-accent-light">
                    <Icon name={topic.icon as IconName} size={22} />
                  </span>
                  <div>
                    <h2 id={`${topic.id}-h`} className="text-2xl font-bold text-ink sm:text-3xl">{topic.title}</h2>
                    <p className="mt-2 text-base leading-relaxed text-muted">{topic.desc}</p>
                  </div>
                </div>

                {topic.id === "profile" && (
                  <TrackedLink
                    href="/resources/free-profile-websites"
                    event="learn_resource_click"
                    params={{ topic: topic.id, resource: "free_profile_websites" }}
                    className="card group mt-8 flex items-center justify-between gap-4 border-[rgba(57,245,106,0.35)] transition-colors hover:border-accent"
                  >
                    <span>
                      <span className="text-sm font-semibold uppercase tracking-[0.1em] text-accent-light">Free resource</span>
                      <span className="mt-1 block text-lg font-semibold text-ink">17 free profile websites for backlinks &amp; social proof</span>
                      <span className="mt-1 block text-base text-muted">Where to have a profile, what to set up first, and a checklist to track it.</span>
                    </span>
                    <Icon name="arrow" size={20} className="shrink-0 text-accent-light transition-transform group-hover:translate-x-1" />
                  </TrackedLink>
                )}

                {posts.length > 0 ? (
                  <ul className="mt-8 divide-y divide-line rounded-2xl border border-line">
                    {posts.slice(0, PER_TOPIC).map(p => (
                      <li key={p.slug}>
                        <TrackedLink
                          href={`/blog/${p.slug}`}
                          event="learn_resource_click"
                          params={{ topic: topic.id, resource: p.slug }}
                          className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface"
                        >
                          <span>
                            <span className="block text-base font-semibold text-ink sm:text-lg">{p.title}</span>
                            <span className="mt-1 block text-sm text-muted">{p.readTime}</span>
                          </span>
                          <Icon name="arrow" size={18} className="shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent-light" />
                        </TrackedLink>
                      </li>
                    ))}
                  </ul>
                ) : topic.id !== "profile" && (
                  <p className="mt-8 rounded-2xl border border-dashed border-line px-5 py-6 text-base text-muted">
                    Articles on this topic are on the way. The latest lessons go to the community first.
                  </p>
                )}

                {posts.length > PER_TOPIC && (
                  <p className="mt-4 text-sm text-muted">
                    Showing {PER_TOPIC} of {posts.length}.{" "}
                    <TrackedLink href="/blog" event="learn_resource_click" params={{ topic: topic.id, resource: "blog" }}
                                 className="font-semibold text-accent-light underline underline-offset-4">
                      Browse all articles
                    </TrackedLink>
                  </p>
                )}
              </section>
            );
          })}
        </div>

        <section aria-label="About these resources" className="border-t border-line bg-bg">
          <p className="container-x max-w-[880px] py-8 text-sm text-muted">
            Everything on this page is free. There are no paid courses or products right now.
          </p>
        </section>

        <FinalCTA location="learn_final" />
      </main>

      <Footer />
    </>
  );
}
