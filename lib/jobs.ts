// Job referrals: types, labels and validation shared by the apply form
// (client), the API (server) and the admin panel. No server-only imports.
import { normalizeEmail, normalizeWhatsapp } from "@/lib/waitlist";

export const EMPLOYMENT_TYPES = {
  contract:   "Contract",
  freelance:  "Freelance",
  full_time:  "Full-time",
  part_time:  "Part-time",
  internship: "Internship",
} as const;
export type EmploymentType = keyof typeof EMPLOYMENT_TYPES;

export const JOB_STATUSES = ["draft", "open", "closed"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const REVIEW_STATUSES = {
  new:         "New",
  shortlisted: "Shortlisted",
  referred:    "Referred",
  rejected:    "Not a fit",
} as const;
export type ReviewStatus = keyof typeof REVIEW_STATUSES;

export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/** A job as shown on the site (no admin-only fields). */
export type Job = {
  id: number;
  slug: string;
  title: string;
  company: string | null;
  location: string;
  employmentType: EmploymentType;
  experienceLevel: string | null;
  compensation: string | null;
  skills: string[];
  summary: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  timeline: string | null;
  startDate: string | null;  // YYYY-MM-DD
  applyBy: string | null;    // YYYY-MM-DD, inclusive
  feePaise: number;
  status: JobStatus;
  publishedAt: string | null; // ISO
};

// ─── Formatting ─────────────────────────────────────────────────────────────

export const formatFee = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
    minimumFractionDigits: paise % 100 ? 2 : 0, maximumFractionDigits: 2,
  }).format(paise / 100);

/** "2026-12-01" → "Dec 1, 2026" (date-only values, no timezone shift). */
export const formatDay = (ymd: string) =>
  new Date(`${ymd}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const companyLabel = (job: Pick<Job, "company">) => job.company?.trim() || "Confidential client";

/** Open, and the apply-by day (inclusive, IST) hasn't passed. */
export function isAcceptingApplications(job: Pick<Job, "status" | "applyBy">, now = new Date()) {
  if (job.status !== "open") return false;
  if (!job.applyBy) return true;
  const todayIST = new Date(now.getTime() + 5.5 * 3600_000).toISOString().slice(0, 10);
  return todayIST <= job.applyBy;
}

// ─── Résumé upload ──────────────────────────────────────────────────────────

// Kept under Vercel's 4.5 MB request limit with room for the rest of the form.
export const MAX_RESUME_BYTES = 4 * 1024 * 1024;
export const RESUME_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
};
export const RESUME_ACCEPT = ".pdf,.doc,.docx," + Object.keys(RESUME_TYPES).join(",");
export const RESUME_HINT = "PDF, DOC or DOCX, up to 4 MB.";

export function checkResumeFile(file: { name: string; size: number; type: string } | null): string | null {
  if (!file || file.size === 0) return "Please attach your résumé.";
  if (file.size > MAX_RESUME_BYTES) return "That file is over 4 MB. Please upload a smaller PDF.";
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  if (!RESUME_TYPES[file.type] && !["pdf", "doc", "docx"].includes(ext)) return "Please upload a PDF, DOC or DOCX file.";
  return null;
}

// ─── Application ────────────────────────────────────────────────────────────

export const PROPOSAL_MIN = 80;
export const PROPOSAL_MAX = 5000;

export type ApplicationInput = {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  experienceYears?: string;
  proposal: string;
  agree?: boolean;
};

export type ApplicationErrors = Partial<Record<keyof ApplicationInput | "resume", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Accepts "github.com/me" or a full URL; returns a normalised https URL or null. */
export function normalizeUrl(raw: string | undefined): string | null {
  const v = raw?.trim();
  if (!v) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    if (!/^https?:$/.test(url.protocol) || !url.hostname.includes(".")) return null;
    return url.toString().slice(0, 300);
  } catch { return null; }
}

export function validateApplication(input: ApplicationInput): ApplicationErrors {
  const e: ApplicationErrors = {};

  const name = input.fullName?.trim() ?? "";
  if (!name) e.fullName = "Please enter your full name.";
  else if (name.length > 100) e.fullName = "Please keep your name under 100 characters.";
  else if (/https?:|www\.|[<>]/i.test(name)) e.fullName = "Please enter just your name.";

  const email = normalizeEmail(input.email ?? "");
  if (!email) e.email = "Please enter your email address.";
  else if (email.length > 254 || !EMAIL_RE.test(email)) e.email = "Please enter a valid email address, like name@example.com.";

  if (!input.phone?.trim()) e.phone = "Please enter your WhatsApp or phone number.";
  else if (!normalizeWhatsapp(input.phone)) e.phone = "Include your country code, like +91 98765 43210.";

  if ((input.location?.trim().length ?? 0) > 100) e.location = "Please keep your location under 100 characters.";
  if (input.portfolioUrl?.trim() && !normalizeUrl(input.portfolioUrl)) e.portfolioUrl = "Please enter a valid link, like github.com/yourname.";
  if (input.linkedinUrl?.trim() && !normalizeUrl(input.linkedinUrl)) e.linkedinUrl = "Please enter a valid LinkedIn link.";

  const proposal = input.proposal?.trim() ?? "";
  if (!proposal) e.proposal = "Please write a short proposal for this job.";
  else if (proposal.length < PROPOSAL_MIN) e.proposal = `Please write at least ${PROPOSAL_MIN} characters so the client understands your fit.`;
  else if (proposal.length > PROPOSAL_MAX) e.proposal = `Please keep your proposal under ${PROPOSAL_MAX.toLocaleString("en-US")} characters.`;

  if (!input.agree) e.agree = "Please confirm you’ve read how the referral fee works.";
  return e;
}

export const EXPERIENCE_OPTIONS = ["Less than 1 year", "1–2 years", "3–5 years", "6–9 years", "10+ years"] as const;
