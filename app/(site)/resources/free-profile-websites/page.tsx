import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Breadcrumb } from "@/components/PageHeader";
import { topProfileSites, moreProfileSites, profileTips, startingOrder } from "@/lib/resources";
import { SITE_URL, ogDefaults, jsonLd } from "@/lib/seo";
import ProfileChecklist from "./ProfileChecklist";
import ShareBar from "./ShareBar";

const PATH        = "/resources/free-profile-websites";
const TITLE       = "Free Profile Websites for Backlinks & Social Proof";
const DESCRIPTION =
  "17 free platforms where developers and freelancers should have a profile, which ones to set up first, and how to get real value from them without spamming.";

export const metadata: Metadata = {
  title:       TITLE,
  description: DESCRIPTION,
  alternates:  { canonical: PATH },
  openGraph:   { ...ogDefaults, type: "article", url: PATH, title: TITLE, description: DESCRIPTION },
  twitter:     { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const allSites = [...topProfileSites, ...moreProfileSites];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":       "Article",
      "@id":         `${SITE_URL}${PATH}#article`,
      headline:      TITLE,
      description:   DESCRIPTION,
      url:           `${SITE_URL}${PATH}`,
      image:         `${SITE_URL}${PATH}/opengraph-image`,
      inLanguage:    "en-US",
      author:        { "@id": `${SITE_URL}/#person` },
      publisher:     { "@id": `${SITE_URL}/#person` },
      isPartOf:      { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "ItemList",
      name:    "Free profile websites",
      itemListElement: allSites.map((s, i) => ({
        "@type": "ListItem", position: i + 1, name: s.name, url: s.url,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home",      item: SITE_URL },
        { "@type": "ListItem", position: 2, name: TITLE,       item: `${SITE_URL}${PATH}` },
      ],
    },
  ],
};

export default function FreeProfileWebsitesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <header className="pt-[72px] lg:pt-[80px]">
        <div className="panel bg-surface py-12 sm:py-16 lg:py-20">
          <div className="container-x hero-stagger max-w-[960px]">
            <Breadcrumb items={[{ label: "Resources" }]} />
            <p className="eyebrow mt-8">Free resource</p>
            <h1 className="h1 mt-4 max-w-[18ch] text-ink">
              Free websites for backlinks &amp; social proof
            </h1>
            <p className="lead mt-6 max-w-[40rem] text-muted">
              A practical starter list for software engineers, developers, freelancers and personal brands.
              Set these up once and clients can find and verify you anywhere they look.
            </p>
            <div className="mt-8">
              <ShareBar url={`${SITE_URL}${PATH}`} text={`${TITLE} — free starter list from Build With Aamir`} />
            </div>
          </div>
        </div>
      </header>

      <main className="container-x max-w-[960px] pb-8">

        {/* Starting order */}
        <section aria-labelledby="start" className="pt-14 sm:pt-16">
          <div className="rounded-panel bg-accent p-6 sm:p-8">
            <h2 id="start" className="text-[1.5rem] font-medium tracking-[-0.04em] text-ink">Short on time? Start with these 5</h2>
            <p className="mt-2 text-base text-ink/75">These matter most for software engineers. Add Product Hunt when you have something to launch.</p>
            <ol className="mt-6 flex flex-wrap gap-2">
              {startingOrder.map((name, i) => (
                <li key={name} className="inline-flex items-center gap-2.5 rounded-full bg-card py-1.5 pl-1.5 pr-4 text-[0.95rem] font-medium text-ink">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-mono text-xs text-on-ink">{i + 1}</span>{name}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Top 10 */}
        <section aria-labelledby="top10" className="pt-14 sm:pt-16">
          <p className="eyebrow">Top 10</p>
          <h2 id="top10" className="h2 mt-4 text-ink">Profile platforms worth your time</h2>
          <div className="mt-8">
            <ProfileChecklist sites={topProfileSites} recommended={startingOrder} />
          </div>
        </section>

        {/* More */}
        <section aria-labelledby="more" className="pt-14 sm:pt-16">
          <p className="eyebrow">More free platforms</p>
          <h2 id="more" className="h2 mt-4 text-ink">Worth adding next</h2>
          <div className="tray mt-8">
            <div className="overflow-hidden rounded-card bg-card">
              <table className="w-full text-left">
                <thead className="bg-card font-mono text-xs uppercase tracking-[0.1em] text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-4 font-medium sm:px-5">Website</th>
                    <th scope="col" className="px-2 py-4 font-medium sm:px-5">Best for</th>
                    <th scope="col" className="w-14 px-1 py-3 sm:px-3"><span className="sr-only">Link</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {moreProfileSites.map(s => (
                    <tr key={s.name}>
                      <th scope="row" className="px-4 py-4 font-medium tracking-[-0.02em] text-ink sm:px-5">{s.name}</th>
                      <td className="px-2 py-4 text-muted sm:px-5">{s.use}</td>
                      <td className="w-14 px-1 py-2 text-right sm:px-3">
                        <a href={s.url} target="_blank" rel="noopener noreferrer"
                           aria-label={`Open ${s.name}`}
                           className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink transition-colors hover:bg-accent">
                          <Icon name="external" size={18} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section aria-labelledby="tips" className="pt-14 sm:pt-16">
          <p className="eyebrow">How to get the most value</p>
          <h2 id="tips" className="h2 mt-4 text-ink">Quality beats quantity</h2>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {profileTips.map(t => (
              <li key={t.title} className="flex gap-3 rounded-card bg-surface p-5 sm:p-6">
                <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-on-ink">
                  <Icon name="check" size={14} />
                </span>
                <div>
                  <h3 className="text-lg font-medium tracking-[-0.03em] text-ink">{t.title}</h3>
                  <p className="mt-1 text-base leading-relaxed text-muted">{t.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-10 border-t border-line pt-6 text-sm text-muted">
            Free-plan features and link behaviour change over time. Check each platform’s current settings before
            relying on a particular SEO benefit.
          </p>
        </section>

        {/* CTA */}
        <section className="section pb-0 sm:pb-0 lg:pb-0">
          <div className="on-dark rounded-panel bg-night px-6 py-12 text-center text-white sm:px-10 sm:py-14">
            <h2 className="text-[1.85rem] font-medium tracking-[-0.045em]">Building your freelancing profile?</h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-night-muted">
              Get more practical lists like this, plus lessons from real client work, in the free community.
            </p>
            <div className="mt-6 flex justify-center">
              <WhatsAppButton location="resource_profiles" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
