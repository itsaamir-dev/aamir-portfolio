import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import {
  SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, AUTHOR, KEYWORDS, ogDefaults,
} from "@/lib/seo";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

// Display face for headings.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

// Geist Mono (SIL OFL) for buttons, navigation and section labels.
const geistMono = localFont({
  src: "./fonts/GeistMono-Medium.ttf",
  weight: "500",
  variable: "--font-geist-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor:  "#FFFFFF",
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

// Shared shell for the public site — app/(site) — and the admin panel — app/admin.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable} ${geistMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
