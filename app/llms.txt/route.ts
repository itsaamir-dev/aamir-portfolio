import { blogPosts } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildwithaamir.com";

export const dynamic = "force-static";

export function GET() {
  const blogList = blogPosts
    .map(p => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`)
    .join("\n");

  const body = `# Aamir Bashir — Senior Software Engineer

> Personal portfolio and technical blog of Aamir Bashir, a Senior Software Engineer with 8+ years of experience building Android and full-stack applications.

## About

Aamir Bashir is a Top Rated Plus freelancer on Upwork with $70K+ earned, based in India and open to remote work with US/EU clients. He specialises in Android development (Kotlin, Jetpack Compose, MVVM, Clean Architecture), full-stack web development (React, Next.js, Node.js, Laravel), and AI/LLM integration in mobile apps.

- Website: ${SITE_URL}
- Blog: ${SITE_URL}/blog
- Sitemap: ${SITE_URL}/sitemap.xml

## Expertise

- Android Development: Kotlin, Jetpack Compose, Coroutines, Hilt, Room, WorkManager, MVVM, Clean Architecture
- Full-Stack: React, Next.js, Node.js, Laravel, REST APIs, GraphQL
- AI & Mobile AI: On-device LLM inference, TensorFlow Lite, MediaPipe, LLM quantization, TTS integration
- Backend: Node.js, Express, Fastify, PostgreSQL, Firebase, MySQL
- DevOps: CI/CD, GitHub Actions, Firebase, Google Cloud
- Freelancing: Upwork Top Rated Plus, client retention, contract negotiation, remote team management

## Experience

- Senior Software Engineer at Raybit Technologies (Jul 2023 – Present, Remote)
- Senior Android Engineer at CodeBrew Labs (Oct 2020 – Jul 2023, Chandigarh)
- Android Developer at Tekrevol (Mar 2018 – Sep 2020, India)

## Notable Projects

- EmpSuite — Enterprise ERP platform (HR, payroll, attendance, finance)
- AudioBook AI — PDF & EPUB to audio converter (50K+ users)
- AI NoteTaker — Real-time meeting transcription and summarisation app
- Nova Cabs — Ride-hailing platform with live tracking
- HealthConnect — Telemedicine app with video consultations
- Multi-Vendor Food Platform — Marketplace with Stripe split payouts

## Blog Posts

${blogList}

## Contact

For project inquiries, collaborations, or freelance engagements, visit ${SITE_URL}#contact.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
