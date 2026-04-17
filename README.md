# Aamir Bashir — Portfolio (Next.js 14)

Personal portfolio & blog built with **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
aamir-portfolio/
├── app/
│   ├── layout.tsx          # Root layout (fonts, Navbar, Cursor)
│   ├── page.tsx            # Home page (all sections)
│   ├── globals.css         # Global styles + Tailwind
│   └── blog/
│       ├── page.tsx        # Blog listing page
│       └── [slug]/
│           ├── page.tsx         # Static blog post (SSG)
│           └── BlogPostClient.tsx  # Client-side interactive features
├── components/
│   ├── Cursor.tsx          # Custom animated cursor
│   ├── Navbar.tsx          # Sticky navbar with active link detection
│   ├── Footer.tsx          # Site footer
│   ├── BlogCard.tsx        # Featured + grid blog card components
│   ├── RevealOnScroll.tsx  # Intersection Observer reveal wrapper
│   └── sections/
│       ├── Hero.tsx        # Hero with animated stats
│       ├── About.tsx       # About + Upwork metrics card
│       ├── Skills.tsx      # Skills grid
│       ├── Experience.tsx  # Timeline
│       ├── Projects.tsx    # Filterable projects grid (client)
│       ├── Freelance.tsx   # Upwork highlight section
│       └── Contact.tsx     # Contact links + form
└── lib/
    └── data.ts             # All portfolio data (skills, experience, projects, blog posts)
```

## ✨ Features

- **Next.js 14 App Router** with Server & Client Components
- **Static Site Generation (SSG)** for all blog posts via `generateStaticParams`
- **TypeScript** throughout
- **Tailwind CSS** with custom design tokens (navy/gold palette)
- **Google Fonts** loaded via `next/font/google` (Playfair Display, DM Sans, JetBrains Mono)
- **Custom animated cursor** with lag effect
- **Intersection Observer** scroll reveal animations
- **Filterable projects** grid (client-side, zero dependencies)
- **Blog listing** with category filters
- **Single blog post** with: reading progress bar, sticky TOC, related posts, prev/next navigation, copy link
- **Responsive** — mobile-first, collapses gracefully

## 📝 Customising Content

All portfolio data lives in **`lib/data.ts`**. Edit skills, experience, projects, and blog posts there.

To add a real blog post:
1. Add a new entry to the `blogPosts` array in `lib/data.ts`
2. The route `/blog/your-slug` will be generated automatically
3. Edit `app/blog/[slug]/BlogPostClient.tsx` to render post body content (or integrate MDX)

## 🌐 Deployment

Deploy to **Vercel** in one command:

```bash
npx vercel
```

Or push to GitHub and connect the repo to [vercel.com](https://vercel.com) for automatic deployments.

## 🔧 Tech Stack

| Tech | Version |
|------|---------|
| Next.js | 14.2.5 |
| React | 18 |
| TypeScript | 5 |
| Tailwind CSS | 3.4 |
