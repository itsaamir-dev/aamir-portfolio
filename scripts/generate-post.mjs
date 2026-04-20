/**
 * Generates one SEO-optimised blog post via Gemini and prepends it to lib/data.ts.
 * Run: node scripts/generate-post.mjs
 * Requires: GEMINI_API_KEY env var
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, "..");
const DATA_FILE = join(ROOT, "lib", "data.ts");
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

// ── Author bio context ───────────────────────────────────────────────────────
const BIO = `
Aamir Bashir — Senior Software Engineer, 8+ years.
Skills: Kotlin, Android SDK, Flutter, Jetpack Compose, Coroutines, Flow,
        React.js, Next.js, Node.js, Laravel, REST APIs, WebSockets,
        MySQL, Firebase Firestore, SQLite, MVVM, Clean Architecture,
        Dependency Injection (Hilt/Koin), CI/CD, Google Cloud.
Experience:
  - Senior Software Engineer @ Raybit Technologies (Jul 2023–Present, Remote)
    End-to-end mobile & web apps; 25% faster delivery; led 4-engineer squad.
  - Senior Android Engineer @ CodeBrew Labs (Oct 2020–Jul 2023)
    6 production apps on Play Store (4.5+ stars); Kotlin migration cut crash rate 35%.
  - Software Engineer @ Enthralling Matrix (2019–2020)
  - Software Engineer @ Interface Technologies (2017–2019)
Projects: EmpSuite ERP, AudioBook AI (50K+ users), AI NoteTaker, Nova Cabs.
Freelance: Upwork Top Rated Plus, 100% JSS, $60K+ earned.
Writing style: First-person, candid, experience-backed, practical over theoretical.
`;

// ── SEO keyword pools per category ──────────────────────────────────────────
const SEO_KEYWORD_POOLS = {
  android:      ["Kotlin Android", "Jetpack Compose", "Android architecture MVVM", "Coroutines Flow Android", "Hilt dependency injection"],
  fullstack:    ["Node.js REST API", "Laravel backend", "React Next.js", "MySQL optimization", "WebSocket real-time"],
  ai:           ["on-device AI Android", "LLM integration mobile", "ML Kit Android", "AI app Kotlin", "GPT API integration"],
  devops:       ["CI/CD Android", "Firebase App Distribution", "GitHub Actions mobile", "Google Cloud deployment", "Docker Node.js"],
  architecture: ["Clean Architecture Android", "MVVM vs MVI", "Dependency Injection Hilt Koin", "microservices Node.js", "scalable mobile architecture"],
};

function pickCategory() {
  const cats = ["android", "android", "fullstack", "ai", "devops", "architecture", "android", "fullstack"];
  return cats[Math.floor(Math.random() * cats.length)];
}

// ── Read existing slugs/titles to avoid duplicates ──────────────────────────
function getExistingPosts(src) {
  const slugs  = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
  const titles = [...src.matchAll(/title:\s*"([^"]+)"/g)].map(m => m[1]);
  return { slugs, titles };
}

// ── Call Claude API ──────────────────────────────────────────────────────────
async function callClaude(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY env var is not set.");

  const res = await fetch(CLAUDE_API_URL, {
    method:  "POST",
    headers: {
      "Content-Type":            "application/json",
      "x-api-key":               apiKey,
      "anthropic-version":       "2023-06-01",
    },
    body: JSON.stringify({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 6000,
      messages:   [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status} ${res.statusText}: ${err}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}

// ── Strip markdown code fences from JSON response ────────────────────────────
function parseResponse(raw) {
  const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
  return JSON.parse(cleaned);
}

// ── Approximate read time ────────────────────────────────────────────────────
function readTime(html) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(5, Math.round(words / 200))} min read`;
}

// ── Format date ──────────────────────────────────────────────────────────────
function formatDate(d = new Date()) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Serialize post to TypeScript object literal ──────────────────────────────
function buildPostEntry(post) {
  const tags     = JSON.stringify(post.tags);
  const tocItems = JSON.stringify(post.tocItems)
    .replace(/^\[/, "[\n      ")
    .replace(/\]$/, "\n    ]")
    .replace(/},\{/g, "},\n      {");

  const safeContent = post.content
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

  return `  {
    slug: "${post.slug}",
    featured: false,
    icon: "${post.icon}",
    cat: "${post.cat}", catLabel: "${post.catLabel}",
    date: "${formatDate()}", readTime: "${readTime(post.content)}",
    title: "${post.title.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",
    excerpt: "${post.excerpt.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}",
    tags: ${tags},
    tocItems: ${tocItems},
    content: \`${safeContent}\`,
  },`;
}

// ── Prepend new post to blogPosts array ──────────────────────────────────────
function insertPost(src, postEntry) {
  const marker = "export const blogPosts: BlogPost[] = [";
  const idx    = src.indexOf(marker);
  if (idx === -1) throw new Error("Could not locate blogPosts array in data.ts");
  const insertAt = idx + marker.length;
  return src.slice(0, insertAt) + "\n" + postEntry + "\n" + src.slice(insertAt);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("📖  Reading lib/data.ts...");
  const src                 = readFileSync(DATA_FILE, "utf8");
  const { slugs, titles }   = getExistingPosts(src);
  const category            = pickCategory();
  const seedKeywords        = SEO_KEYWORD_POOLS[category].join(", ");

  console.log(`📝  ${slugs.length} existing posts. Category: ${category}. Calling Gemini...`);
  console.log(`🤖  Model: claude-haiku-4-5-20251001`);

  const catLabel = {
    android: "Android", fullstack: "Full-Stack", ai: "AI & Tech",
    devops: "DevOps", architecture: "Architecture",
  }[category] ?? "Full-Stack";

  const prompt = `
You are writing a deeply technical, SEO-optimised blog post for Aamir Bashir, a senior software engineer.

AUTHOR BIO:
${BIO}

TARGET CATEGORY: ${category}
TARGET SEO KEYWORDS (weave in naturally): ${seedKeywords}

EXISTING POST TITLES — pick a DIFFERENT topic, no overlap:
${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}

STRICT REQUIREMENTS:
1. Topic MUST be purely technical — about code, tools, libraries, patterns, or engineering decisions. No career advice, no freelancing tips.
2. Written in Aamir's first-person voice: candid, experience-backed, specific to his stack (Kotlin, Android, React, Node.js, Laravel, Firebase, MySQL).
3. 1000–1500 words of genuinely useful technical depth.
4. Primary keyword must appear in: title, first paragraph, and at least 2 H2 headings.
5. Include at least 2 realistic code examples (Kotlin, JavaScript, or TypeScript) with actual implementation details.
6. End with an H2 id="key-takeaways" containing 3–5 actionable bullet points.
7. Excerpt: exactly 140–155 characters, includes primary keyword, states a clear technical benefit.

HTML ELEMENTS TO USE (only these):
- <p> paragraphs
- <h2 id="section-id"> section headings (id must match tocItems exactly)
- <h3> subsection headings
- <ul><li> bullet lists
- <blockquote> for key insight pull quotes
- <strong> bold emphasis
- <em> italic
- <code> inline code
- <div class="callout-info"><p class="callout-label">📖 Label</p><p>text</p></div>
- <div class="callout-warn"><p class="callout-label">⚠️ Title</p><p>text</p></div>
- <div class="code-block" data-lang="Kotlin|JavaScript|TypeScript|Node.js|SQL"><pre><code>…</code></pre></div>
  (use &lt; and &gt; for angle brackets inside code blocks)

Respond with ONLY valid JSON — no markdown fences, no explanation, just the JSON object:
{
  "slug": "kebab-case-unique-slug",
  "icon": "single emoji relevant to topic",
  "cat": "${category}",
  "catLabel": "${catLabel}",
  "title": "Technical SEO title with primary keyword, 55-65 chars",
  "excerpt": "140-155 char meta description with primary keyword and clear technical benefit",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
  "tocItems": [{ "id": "section-id", "label": "Section Label" }],
  "content": "full HTML string with real code examples"
}
`;

  const raw = await callClaude(prompt);
  console.log("✅  Claude responded. Parsing...");

  let post;
  try {
    post = parseResponse(raw);
  } catch (e) {
    console.error("❌  JSON parse failed:", e.message);
    console.error("Raw (first 600 chars):\n", raw.slice(0, 600));
    process.exit(1);
  }

  // Guard against slug collision
  if (slugs.includes(post.slug)) {
    post.slug = `${post.slug}-${Date.now()}`;
    console.warn(`⚠️   Slug collision — new slug: ${post.slug}`);
  }

  console.log(`✨  New post: "${post.title}"`);
  console.log(`    Slug: ${post.slug}`);
  console.log(`    Tags: ${post.tags.join(", ")}`);

  const entry   = buildPostEntry(post);
  const updated = insertPost(src, entry);
  writeFileSync(DATA_FILE, updated, "utf8");
  console.log("✅  lib/data.ts updated successfully.");
}

main().catch(err => {
  console.error("❌  Fatal:", err.message);
  process.exit(1);
});
