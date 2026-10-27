import Navbar from "@/components/Navbar";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { ArrowOverlay } from "@/components/ui/arrow-cta";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_ID } from "@/lib/analytics";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, personSchema, jsonLd } from "@/lib/seo";

// Public site chrome: navbar, sticky WhatsApp CTA, site-wide schema and analytics.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const siteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":     "WebSite",
        "@id":       `${SITE_URL}/#website`,
        url:         SITE_URL,
        name:        SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage:  "en-US",
        publisher:   { "@id": `${SITE_URL}/#person` },
      },
      personSchema,
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteSchema) }} />
      <Navbar />
      <div id="main">{children}</div>
      {/* Keeps the sticky mobile CTA from covering the end of the page */}
      <div aria-hidden="true" className="h-[calc(72px+env(safe-area-inset-bottom))] md:hidden" />
      <StickyMobileCTA />
      {/* Cursor-to-nearest-button arrow (desktop pointers only) */}
      <ArrowOverlay />
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </>
  );
}
