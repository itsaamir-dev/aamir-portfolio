import { ogCard, OG_SIZE } from "@/lib/og";
import { getPublicJob } from "@/lib/jobs-data";
import { EMPLOYMENT_TYPES } from "@/lib/jobs";

export const alt         = "Job opening on Build With Aamir";
export const size        = OG_SIZE;
export const contentType = "image/png";
export const revalidate  = 300;

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);
/** The card font (Space Grotesk) has no ₹ or ≈ glyphs; £ $ € are fine. */
const glyphSafe = (s: string) => s.replace(/₹\s?/g, "INR ").replace(/≈\s?/g, "~");
/** Keep short parentheticals like "(3 Openings)" on one line. */
const keepParens = (s: string) => s.replace(/\(([^)]{1,24})\)/g, m => m.replace(/ /g, "\u00a0"));

/** Share card for a job, in the same style as blog posts (WhatsApp, LinkedIn, X previews). */
export default async function Image({ params }: { params: { slug: string } }) {
  const job = await getPublicJob(params.slug).catch(() => null);
  if (!job) return ogCard({ eyebrow: "Jobs", title: "Remote jobs & referrals", footer: "Build With Aamir" });
  // Location + pay when they fit on one line; otherwise pay (what people look for first).
  const both = [job.location, job.compensation].filter(Boolean).join(" · ");
  const facts = both.length <= 58 ? both : job.compensation || job.location || "";
  return ogCard({
    eyebrow: job.status === "closed" ? "Applications closed" : `Hiring · ${EMPLOYMENT_TYPES[job.employmentType]}`,
    title:   keepParens(glyphSafe(job.title)),
    footer:  clip(glyphSafe(facts) || "Apply on Build With Aamir", 58),
  });
}
