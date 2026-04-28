import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://itsaamir.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow:     "/",
        disallow:  ["/_next/", "/api/"],
      },
    ],
    sitemap:  `${SITE_URL}/sitemap.xml`,
    host:     SITE_URL,
  };
}
