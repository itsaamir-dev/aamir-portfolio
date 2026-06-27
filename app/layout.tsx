import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithaamir.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:  "Aamir Bashir — Senior Software Engineer",
    template: "%s | Aamir Bashir",
  },
  description:
    "Senior Software Engineer with 8+ years building Android & full-stack apps. " +
    "Kotlin · React · Node.js · Firebase · Top Rated Plus on Upwork.",
  keywords: [
    "Android Developer", "Senior Software Engineer", "Kotlin Developer",
    "Full-Stack Engineer", "React Developer", "Node.js Developer",
    "Firebase", "MVVM", "Clean Architecture", "Upwork Top Rated Plus",
    "Remote Software Engineer", "Mobile App Developer",
  ],
  authors:  [{ name: "Aamir Bashir", url: SITE_URL }],
  creator:  "Aamir Bashir",
  publisher: "Aamir Bashir",

  alternates: { canonical: SITE_URL },

  openGraph: {
    type:        "website",
    url:         SITE_URL,
    siteName:    "Aamir Bashir — Software Engineer",
    title:       "Aamir Bashir — Senior Software Engineer",
    description: "8+ years building Android & full-stack apps. Kotlin · React · Node.js · Firebase.",
    images: [{ url: `${SITE_URL}/og-blog.png`, width: 1200, height: 630 }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Aamir Bashir — Senior Software Engineer",
    description: "8+ years building Android & full-stack apps. Kotlin · React · Node.js · Firebase.",
    images:      [`${SITE_URL}/og-blog.png`],
  },

  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name:        "Aamir Bashir",
    url:         SITE_URL,
    jobTitle:    "Senior Software Engineer",
    description: "8+ years building Android and full-stack applications.",
    knowsAbout:  ["Android Development", "Kotlin", "React", "Node.js", "Firebase", "REST APIs"],
    sameAs: [
      "https://www.linkedin.com/in/aamirbashir",
      "https://www.upwork.com/freelancers/aamirbashir",
    ],
  };

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrains.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        <Cursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
