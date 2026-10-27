import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Icon, { IconName } from "@/components/Icon";
import TrackedLink from "@/components/TrackedLink";
import FinalCTA from "@/components/sections/FinalCTA";
import EbookBanner from "@/components/ebook/EbookBanner";
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
        <nav aria-label="Topics" className="sticky top-16 z-30 bg-bg/90 backdrop-blur-md lg:top-[72px]">
          <ul className="container-x flex max-w-[960px] gap-2 overflow-x-auto py-4 [scrollbar-width:none] sm:flex-wrap">
            {topics.map(t => (
              <li key={t.id} className="shrink-0">
                <a href={`#${t.id}`} className="chip">
                  {t.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="container-x max-w-[960px] divide-y divide-line">
          {topics.map(topic => {
            const posts = groups[topic.id];
            return (
              <section key={topic.id} id={topic.id} aria-labelledby={`${topic.id}-h`} className="scroll-mt-40 py-14 sm:py-16">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-ink">
                    <Icon name={topic.icon as IconName} size={22} />
                  </span>
                  <div>
                    <h2 id={`${topic.id}-h`} className="text-[1.75rem] font-medium leading-tight tracking-[-0.045em] text-ink sm:text-[2.25rem]">{topic.title}</h2>
                    <p className="mt-2 text-base leading-relaxed text-muted">{topic.desc}</p>
                  </div>
                </div>

                {topic.id === "profile" && (
                  <TrackedLink
                    href="/resources/free-profile-websites"
                    event="learn_resource_click"
                    params={{ topic: topic.id, resource: "free_profile_websites" }}
                    className="group mt-8 flex items-center justify-between gap-4 rounded-panel bg-accent p-6 text-ink transition-colors hover:bg-accent-strong sm:p-7"
                  >
                    <span>
                      <span className="font-mono text-xs uppercase tracking-[0.12em]">Free resource</span>
                      <span className="mt-1.5 block text-xl font-medium tracking-[-0.035em]">17 free profile websites for backlinks &amp; social proof</span>
                      <span className="mt-1 block text-base text-ink/75">Where to have a profile, what to set up first, and a checklist to track it.</span>
                    </span>
                    <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-on-ink transition-transform group-hover:rotate-45">
                      <Icon name="external" size={18} />
                    </span>
                  </TrackedLink>
                )}

                {posts.length > 0 ? (
                  <ul className="tray mt-8 space-y-1">
                    {posts.slice(0, PER_TOPIC).map(p => (
                      <li key={p.slug}>
                        <TrackedLink
                          href={`/blog/${p.slug}`}
                          event="learn_resource_click"
                          params={{ topic: topic.id, resource: p.slug }}
                          className="group flex items-center justify-between gap-4 rounded-2xl bg-card px-5 py-4 transition-colors hover:bg-accent"
                        >
                          <span>
                            <span className="block text-base font-medium tracking-[-0.02em] text-ink sm:text-lg">{p.title}</span>
                            <span className="mt-1 block text-sm text-muted">{p.readTime}</span>
                          </span>
                          <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-ink transition-colors group-hover:bg-ink group-hover:text-on-ink">
                            <Icon name="arrow" size={16} />
                          </span>
                        </TrackedLink>
                      </li>
                    ))}
                  </ul>
                ) : topic.id !== "profile" && (
                  <p className="mt-8 rounded-panel border border-dashed border-line-strong px-5 py-6 text-base text-muted">
                    Articles on this topic are on the way. The latest lessons go to the community first.
                  </p>
                )}

                {posts.length > PER_TOPIC && (
                  <p className="mt-4 text-sm text-muted">
                    Showing {PER_TOPIC} of {posts.length}.{" "}
                    <TrackedLink href="/blog" event="learn_resource_click" params={{ topic: topic.id, resource: "blog" }}
                                 className="link">
                      Browse all articles
                    </TrackedLink>
                  </p>
                )}
              </section>
            );
          })}
        </div>

        <section aria-label="About these resources">
          <div className="container-x max-w-[960px] pt-6">
            <EbookBanner location="learn" />
          </div>
          <p className="container-x max-w-[960px] pb-14 pt-6 text-sm text-muted">
            Everything on this page is free. The upcoming e-book is the only paid product planned, and its waiting list is free to join.
          </p>
        </section>

        <FinalCTA location="learn_final" />
      </main>

      <Footer />
    </>
  );
}
