// Single source of truth for site-wide SEO values.

export const SITE_URL  = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithaamir.com").replace(/\/$/, "");
export const SITE_NAME = "Build With Aamir";
export const AUTHOR    = "Aamir Bashir";

export const SITE_TITLE = "Build With Aamir | Learn Freelancing & Get International Clients";
export const SITE_DESCRIPTION =
  "Learn freelancing, improve your Upwork proposals, and discover practical ways to find international clients. Follow Aamir's journey and join the free WhatsApp community.";

export const BLOG_TITLE = "Freelancing & Software Engineering Blog";
export const BLOG_DESCRIPTION =
  "Practical articles on freelancing, Upwork, pricing and international clients, plus Android, full-stack and AI engineering from real client work.";

export const SAME_AS = [
  "https://linkedin.com/in/itsaamirbashir",
  "https://github.com/itsaamir-dev",
  "https://www.upwork.com/freelancers/aamirbashir",
];

export const KEYWORDS = [
  "Build With Aamir", "Aamir Bashir", "freelancing", "learn freelancing", "Upwork",
  "Upwork Top Rated Plus", "international clients", "earn in USD", "freelance software engineer",
  "freelancing community", "Android developer", "full-stack developer",
];

export const personSchema = {
  "@type": "Person",
  "@id":    `${SITE_URL}/#person`,
  name:     AUTHOR,
  url:      SITE_URL,
  image:    `${SITE_URL}/hero-portrait.png`,
  jobTitle: "Senior Software Engineer & Freelancer",
  description:
    "Software engineer with 8+ years of experience and Top Rated Plus Upwork freelancer ($80K+ earned), documenting how to build a freelancing career.",
  knowsAbout: ["Freelancing", "Upwork", "Android Development", "Kotlin", "React", "Node.js", "Next.js"],
  sameAs: SAME_AS,
};

/** Serialise JSON-LD safely for a <script> tag. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Next.js replaces (not merges) a page's openGraph object — spread these in. */
export const ogDefaults = {
  siteName: SITE_NAME,
  locale:   "en_US",
} as const;

/** Metadata for an inner page: unique title/description, canonical and OG. */
export function pageMetadata(path: string, title: string, description: string) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph:  { ...ogDefaults, type: "website" as const, url: path, title, description },
    twitter:    { card: "summary_large_image" as const, title, description },
  };
}

/** Breadcrumb JSON-LD for a page one level below home. */
export function breadcrumb(path: string, name: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name,         item: `${SITE_URL}${path}` },
    ],
  };
}
