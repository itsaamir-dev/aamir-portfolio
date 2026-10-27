import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import WhatsAppButton from "@/components/WhatsAppButton";
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

      <header className="border-b border-line bg-bg pb-12 pt-28 sm:pb-16 sm:pt-36">
        <div className="container-x max-w-[880px]">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-accent-light">Resources</span>
          </nav>
          <h1 className="mt-6 text-[2.1rem] font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Free websites for backlinks &amp; social proof
          </h1>
          <p className="lead mt-5 text-muted">
            A practical starter list for software engineers, developers, freelancers and personal brands.
            Set these up once and clients can find and verify you anywhere they look.
          </p>
          <div className="mt-8">
            <ShareBar url={`${SITE_URL}${PATH}`} text={`${TITLE} — free starter list from Build With Aamir`} />
          </div>
        </div>
      </header>

      <main className="container-x max-w-[880px] pb-8">

        {/* Starting order */}
        <section aria-labelledby="start" className="pt-14 sm:pt-16">
          <div className="card relative overflow-hidden">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0"
                 style={{ background: "radial-gradient(ellipse 70% 90% at 0% 0%, rgba(57,245,106,0.08), transparent 70%)" }} />
            <div className="relative">
              <h2 id="start" className="text-xl font-bold text-ink">Short on time? Start with these 5</h2>
              <p className="mt-2 text-base text-muted">These matter most for software engineers. Add Product Hunt when you have something to launch.</p>
              <ol className="mt-5 flex flex-wrap gap-2">
                {startingOrder.map((name, i) => (
                  <li key={name} className="inline-flex items-center gap-2 rounded-lg border border-line bg-bg px-3 py-2 text-[0.95rem] font-medium text-ink">
                    <span className="text-sm font-bold text-accent-light">{i + 1}</span>{name}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Top 10 */}
        <section aria-labelledby="top10" className="pt-14 sm:pt-16">
          <p className="eyebrow">Top 10</p>
          <h2 id="top10" className="h2 mt-3 text-ink">Profile platforms worth your time</h2>
          <div className="mt-8">
            <ProfileChecklist sites={topProfileSites} recommended={startingOrder} />
          </div>
        </section>

        {/* More */}
        <section aria-labelledby="more" className="pt-14 sm:pt-16">
          <p className="eyebrow">More free platforms</p>
          <h2 id="more" className="h2 mt-3 text-ink">Worth adding next</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-line">
            <table className="w-full text-left">
              <thead className="bg-surface text-sm text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-5">Website</th>
                  <th scope="col" className="px-2 py-3 font-semibold sm:px-5">Best for</th>
                  <th scope="col" className="w-14 px-1 py-3 sm:px-3"><span className="sr-only">Link</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {moreProfileSites.map(s => (
                  <tr key={s.name}>
                    <th scope="row" className="px-4 py-4 font-semibold text-ink sm:px-5">{s.name}</th>
                    <td className="px-2 py-4 text-muted sm:px-5">{s.use}</td>
                    <td className="w-14 px-1 py-2 text-right sm:px-3">
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                         aria-label={`Open ${s.name}`}
                         className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-accent-light hover:bg-surface hover:text-ink">
                        <Icon name="external" size={18} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tips */}
        <section aria-labelledby="tips" className="pt-14 sm:pt-16">
          <p className="eyebrow">How to get the most value</p>
          <h2 id="tips" className="h2 mt-3 text-ink">Quality beats quantity</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {profileTips.map(t => (
              <li key={t.title} className="flex gap-3">
                <Icon name="check" size={20} className="mt-1 shrink-0 text-wa" />
                <div>
                  <h3 className="text-lg font-semibold text-ink">{t.title}</h3>
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
          <div className="rounded-2xl border border-line bg-surface px-6 py-10 text-center sm:px-10">
            <h2 className="text-2xl font-bold text-ink">Building your freelancing profile?</h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-muted">
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
