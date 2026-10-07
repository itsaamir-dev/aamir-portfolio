import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { BlogPost } from "@/lib/data";

export type GeneratedPost = BlogPost & { publishedAt: string };

const MODEL = "claude-opus-5-5";

// Facts the model may use. Anything not listed here must not be invented.
const AUTHOR_FACTS = `
Aamir Bashir, software engineer with 8+ years of experience (Android/Kotlin, React, Next.js, Node.js, Laravel, Firebase).
Runs "Build With Aamir", a free WhatsApp community teaching freelancing, finding international clients and earning in USD.
Upwork: Top Rated Plus, $70K+ earned in about 1.5 years, ~18 jobs, ~70% of clients in the US.
Started taking Upwork seriously in September 2024. First project: a MERN stack Jiu Jitsu platform (~$3,000 first payment).
Major breakthrough January 2025. Roughly ~$1K+/month in year 1 and ~$4K+/month in year 2.
Senior Software Engineer at Raybit Technologies (Jul 2023–present, remote); Senior Android Engineer at CodeBrew Labs (2020–2023).
`;

const CATEGORIES = {
  freelance: { label: "Freelancing", keywords: "freelancing, Upwork, Upwork proposals, international clients, earn in USD, freelance pricing" },
  career:    { label: "Career",      keywords: "software engineer career, remote developer, developer growth, working with US clients" },
  android:   { label: "Android",     keywords: "Android development, Kotlin, Jetpack Compose, Android architecture" },
  fullstack: { label: "Full-Stack",  keywords: "Next.js, Node.js backend, REST API design, full-stack development" },
  ai:        { label: "AI & Tech",   keywords: "AI app development, LLM integration, on-device AI, AI for freelancers" },
} as const;

type Category = keyof typeof CATEGORIES;

// Weighted towards freelancing to match the site's focus.
const ROTATION: Category[] = ["freelance", "freelance", "freelance", "career", "android", "fullstack", "ai"];

export function pickCategory(): Category {
  return ROTATION[Math.floor(Math.random() * ROTATION.length)];
}

const POST_SCHEMA = {
  type: "object",
  properties: {
    slug:     { type: "string", description: "kebab-case, 3-8 words, includes the primary keyword" },
    icon:     { type: "string", description: "a single emoji" },
    title:    { type: "string", description: "50-62 characters, primary keyword near the start" },
    excerpt:  { type: "string", description: "meta description, 140-155 characters, includes the primary keyword and a clear benefit" },
    tags:     { type: "array", items: { type: "string" }, description: "4-6 tags" },
    tocItems: {
      type: "array",
      items: {
        type: "object",
        properties: { id: { type: "string" }, label: { type: "string" } },
        required: ["id", "label"],
        additionalProperties: false,
      },
      description: "one entry per <h2>, ids identical to the h2 id attributes",
    },
    content:  { type: "string", description: "the article body as HTML" },
  },
  required: ["slug", "icon", "title", "excerpt", "tags", "tocItems", "content"],
  additionalProperties: false,
} as const;

type RawPost = {
  slug: string; icon: string; title: string; excerpt: string;
  tags: string[]; tocItems: { id: string; label: string }[]; content: string;
};

function buildPrompt(category: Category, existingTitles: string[]) {
  const { label, keywords } = CATEGORIES[category];
  return `Write one new blog post for buildwithaamir.com, the personal site of Aamir Bashir.

<author_facts>
${AUTHOR_FACTS.trim()}
</author_facts>

<category>${label}</category>
<seed_keywords>${keywords}</seed_keywords>

<existing_titles>
${existingTitles.map(t => `- ${t}`).join("\n")}
</existing_titles>

Requirements:
- Pick a topic with clear search intent that none of the existing titles already covers, including near-duplicates that would compete for the same search.
- 1,200-1,800 words, first person, candid and practical. Readers are developers and other skilled professionals who want to freelance or grow their careers.
- Use only the author facts above for personal claims. Don't invent clients, earnings, percentages, dates, user counts or anecdotes with specific numbers. General experience ("in my client work I've seen…") is fine.
- Never promise income or guarantee results.
- Primary keyword in the title, the first paragraph and at least two <h2> headings.
- 4-7 <h2 id="..."> sections; finish with <h2 id="key-takeaways">Key Takeaways</h2> and a 3-5 item list.
- For technical categories include at least one realistic code example.

Allowed HTML only: <p>, <h2 id>, <h3>, <ul>, <ol>, <li>, <blockquote>, <strong>, <em>, <code>,
<div class="callout-info"><p class="callout-label">Label</p><p>text</p></div>,
<div class="callout-warn"><p class="callout-label">Label</p><p>text</p></div>,
<div class="code-block" data-lang="Language"><pre><code>code with &lt; and &gt; escaped</code></pre></div>.
No <h1>, links, images, scripts, styles or inline event handlers.`;
}

/** Defence in depth: the HTML is rendered with dangerouslySetInnerHTML. */
function sanitize(html: string): string {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|form|input|link|meta)[\s\S]*?(<\/\s*\1\s*>|\/?>)/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, "")
    .replace(/<\/?h1[^>]*>/gi, "");
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function readTime(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(4, Math.round(words / 220))} min read`;
}

function validate(raw: RawPost): string[] {
  const problems: string[] = [];
  if (raw.title.length < 20 || raw.title.length > 80) problems.push(`title length ${raw.title.length}`);
  if (raw.excerpt.length < 100 || raw.excerpt.length > 180) problems.push(`excerpt length ${raw.excerpt.length}`);
  if (raw.content.length < 4000) problems.push(`content too short (${raw.content.length} chars)`);
  if (raw.tocItems.length < 3) problems.push("fewer than 3 sections");
  for (const { id } of raw.tocItems) {
    if (!raw.content.includes(`id="${id}"`)) problems.push(`toc id "${id}" missing from content`);
  }
  return problems;
}

export async function generatePost(opts: {
  existingTitles: string[];
  existingSlugs:  Set<string>;
  category?:      Category;
}): Promise<GeneratedPost> {
  const category = opts.category ?? pickCategory();
  const client   = new Anthropic(); // reads ANTHROPIC_API_KEY

  const stream = client.beta.messages.stream({
    model:      MODEL,
    max_tokens: 64000,
    betas:      ["server-side-fallback-2026-07-01"],
    fallbacks:  "default",
    output_config: {
      effort: "high",
      format: { type: "json_schema", schema: POST_SCHEMA },
    },
    messages: [{ role: "user", content: buildPrompt(category, opts.existingTitles) }],
  });
  const message = await stream.finalMessage();

  if (message.stop_reason === "refusal") throw new Error("Model declined to write this post.");
  if (message.stop_reason === "max_tokens") throw new Error("Post was cut off at max_tokens.");

  const text = message.content.flatMap(b => (b.type === "text" ? [b.text] : [])).join("");
  const raw  = JSON.parse(text) as RawPost;

  const problems = validate(raw);
  if (problems.length) throw new Error(`Generated post failed validation: ${problems.join("; ")}`);

  let slug = slugify(raw.slug || raw.title);
  for (let n = 2; opts.existingSlugs.has(slug); n++) slug = `${slugify(raw.slug)}-${n}`;

  const now     = new Date();
  const content = sanitize(raw.content);

  return {
    slug,
    featured:    false,
    icon:        raw.icon,
    cat:         category,
    catLabel:    CATEGORIES[category].label,
    date:        now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }),
    publishedAt: now.toISOString(),
    readTime:    readTime(content),
    title:       raw.title.trim(),
    excerpt:     raw.excerpt.trim(),
    tags:        raw.tags.slice(0, 6),
    tocItems:    raw.tocItems,
    content,
  };
}
