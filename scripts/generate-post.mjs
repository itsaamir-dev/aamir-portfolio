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
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

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
  android:   ["Android development", "Kotlin", "Jetpack Compose", "Android architecture", "MVVM Android"],
  fullstack: ["REST API design", "Node.js backend", "Laravel", "full-stack development", "API performance"],
  ai:        ["AI Android app", "machine learning mobile", "on-device AI", "LLM integration", "AI app development"],
  freelance: ["freelance software engineer", "Upwork Android developer", "remote developer India", "tech freelancing"],
  career:    ["software engineer career", "senior developer tips", "Android developer growth", "tech career advice"],
};

function pickCategory() {
  const cats = ["android", "android", "fullstack", "ai", "freelance", "career"];
  return cats[Math.floor(Math.random() * cats.length)];
}

// ── Read existing slugs/titles to avoid duplicates ──────────────────────────
function getExistingPosts(src) {
  const slugs  = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
  const titles = [...src.matchAll(/title:\s*"([^"]+)"/g)].map(m => m[1]);
  return { slugs, titles };
}

// ── Call Gemini ──────────────────────────────────────────────────────────────
async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY env var is not set.");

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.75, maxOutputTokens: 6000 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status} ${res.statusText}: ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ── Strip markdown code fences from Gemini JSON response ────────────────────
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
  console.log(`🔗  Endpoint: ${GEMINI_URL}`);

  const prompt = `
You are writing an SEO-optimised blog post for Aamir Bashir, a senior software engineer.

AUTHOR BIO:
${BIO}

TARGET CATEGORY: ${category}
TARGET SEO KEYWORDS (use naturally in the content): ${seedKeywords}

EXISTING POST TITLES — do NOT repeat these topics:
${titles.map((t, i) => `${i + 1}. ${t}`).join("\n")}

REQUIREMENTS:
1. Choose a UNIQUE topic that is NOT covered by any existing post above.
2. Write 1000–1500 words of real, useful, first-person content.
3. Include the primary keyword naturally in: the title, the first paragraph, at least 2 H2 headings.
4. The excerpt must be 140–155 characters (Google meta description length) — make it compelling with a clear benefit.
5. End with an H2 "Key Takeaways" section with 3–5 bullet points (boosts Google featured-snippet chance).
6. Include at least one realistic code example in a code block (if category is android/fullstack/ai).

HTML ELEMENTS TO USE (only these):
- <p> paragraphs
- <h2 id="section-id"> section headings (id must match tocItems exactly)
- <h3> subsection headings
- <ul><li> bullet lists
- <blockquote> pull quotes
- <strong> bold emphasis
- <em> golden italic
- <code> inline code
- <div class="callout-info"><p class="callout-label">📖 Label</p><p>text</p></div>
- <div class="callout-warn"><p class="callout-label">⚠️ Title</p><p>text</p></div>
- <div class="code-block" data-lang="Language"><pre><code>code</code></pre></div>
  (use &lt; and &gt; for angle brackets inside code)

Respond with ONLY valid JSON (no markdown fences), matching this exact schema:
{
  "slug": "kebab-case-slug",
  "icon": "single emoji",
  "cat": "${category}",
  "catLabel": "Android|Full-Stack|AI & Tech|Freelancing|Career",
  "title": "SEO-friendly title with primary keyword (55-65 chars)",
  "excerpt": "Compelling meta description 140-155 chars — include primary keyword and clear benefit",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
  "tocItems": [{ "id": "section-id", "label": "Section Label" }],
  "content": "full HTML string"
}
`;

  const raw = await callGemini(prompt);
  console.log("✅  Gemini responded. Parsing...");

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
