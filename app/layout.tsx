import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_ID } from "@/lib/analytics";
import {
  SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, AUTHOR, KEYWORDS, personSchema, ogDefaults, jsonLd,
} from "@/lib/seo";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor:  "#0B0D10",
  viewportFit: "cover", // enables env(safe-area-inset-*) for the sticky CTA
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:  SITE_TITLE,
    template: `%s | ${AUTHOR}`,
  },
  description: SITE_DESCRIPTION,
  keywords:    KEYWORDS,
  applicationName: SITE_NAME,
  authors:   [{ name: AUTHOR, url: SITE_URL }],
  creator:   AUTHOR,
  publisher: AUTHOR,
  category:  "education",

  alternates: {
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${SITE_NAME} — Blog` }] },
  },

  openGraph: {
    ...ogDefaults,
    type:        "website",
    title:       SITE_TITLE,
    description: SITE_DESCRIPTION,
  },

  twitter: {
    card:        "summary_large_image",
    title:       SITE_TITLE,
    description: SITE_DESCRIPTION,
  },

  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(siteSchema) }}
        />
      </head>
      <body className="font-sans">
        <Navbar />
        {children}
        {/* Keeps the sticky mobile CTA from covering the end of the page */}
        <div aria-hidden="true" className="h-[calc(76px+env(safe-area-inset-bottom))] bg-bg md:hidden" />
        <StickyMobileCTA />
      </body>
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
