import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithaamir.com";

export const metadata: Metadata = {
  title:       "Blog — Aamir Bashir",
  description: "Deep dives into Android development, full-stack architecture, freelancing, and the craft of building software that lasts.",
  alternates:  { canonical: `${SITE_URL}/blog` },

  openGraph: {
    type:        "website",
    url:         `${SITE_URL}/blog`,
    siteName:    "Aamir Bashir — Software Engineer",
    title:       "Blog — Aamir Bashir",
    description: "Deep dives into Android development, full-stack architecture, freelancing, and the craft of building software that lasts.",
    images: [{ url: `${SITE_URL}/og-blog.png`, width: 1200, height: 630 }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Blog — Aamir Bashir",
    description: "Deep dives into Android development, full-stack architecture, freelancing, and the craft of building software that lasts.",
    images:      [`${SITE_URL}/og-blog.png`],
  },

  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
