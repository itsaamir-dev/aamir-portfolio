import type { Metadata } from "next";
import Hero          from "@/components/sections/Hero";
import Proof         from "@/components/sections/Proof";
import Story         from "@/components/sections/Story";
import Learn         from "@/components/sections/Learn";
import Community     from "@/components/sections/Community";
import Challenge     from "@/components/sections/Challenge";
import WhoShouldJoin from "@/components/sections/WhoShouldJoin";
import FAQ           from "@/components/sections/FAQ";
import FinalCTA      from "@/components/sections/FinalCTA";
import Footer        from "@/components/Footer";
import { faqs } from "@/lib/site";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, ogDefaults, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title:      { absolute: SITE_TITLE },
  alternates: { canonical: "/" },
  openGraph:  { ...ogDefaults, type: "website", url: "/", title: SITE_TITLE, description: SITE_DESCRIPTION },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type":    "WebPage",
      "@id":      `${SITE_URL}/#webpage`,
      url:        SITE_URL,
      name:       SITE_TITLE,
      isPartOf:   { "@id": `${SITE_URL}/#website` },
      about:      { "@id": `${SITE_URL}/#person` },
      primaryImageOfPage: `${SITE_URL}/hero-portrait.png`,
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      "@id":   `${SITE_URL}/#faq`,
      mainEntity: faqs.map(({ q, a }) => ({
        "@type": "Question",
        name:    q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(homeSchema) }} />
      <Hero />
      <Proof />
      <Story />
      <Learn />
      <Community />
      <Challenge />
      <WhoShouldJoin />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
