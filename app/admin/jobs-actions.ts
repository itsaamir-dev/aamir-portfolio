"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import {
  createJob, deleteApplication, deleteJob, getJobById, markRefunded, setJobStatus, updateApplicationReview, updateJob, type JobInput,
} from "@/lib/jobs-data";
import { EMPLOYMENT_TYPES, JOB_STATUSES, REVIEW_STATUSES, type EmploymentType, type JobStatus, type ReviewStatus } from "@/lib/jobs";
import type { ActionResult } from "@/app/admin/actions";

/** Server actions are public endpoints — re-check the session in each one. */
async function requireAdmin() {
  if (!(await verifySessionToken(cookies().get(ADMIN_COOKIE)?.value))) throw new Error("Unauthorized");
}

/** Refresh every page that shows jobs. */
function revalidateJobs(slug?: string) {
  revalidatePath("/jobs");
  if (slug) revalidatePath(`/jobs/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin", "layout");
}

// ─── Job form ───────────────────────────────────────────────────────────────

export type JobFormState = { error?: string; fieldErrors?: Partial<Record<keyof JobInput | "fee", string>> };

const text = (fd: FormData, key: string, max: number) => {
  const v = String(fd.get(key) ?? "").replace(/\r\n/g, "\n").trim();
  return v ? v.slice(0, max) : null;
};
const day = (fd: FormData, key: string) => {
  const v = String(fd.get(key) ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
};

function parseJob(fd: FormData): { input?: JobInput; errors: JobFormState["fieldErrors"] } {
  const errors: NonNullable<JobFormState["fieldErrors"]> = {};

  const title = text(fd, "title", 140);
  if (!title) errors.title = "Add a job title.";
  const summary = text(fd, "summary", 300);
  if (!summary) errors.summary = "Add a one- or two-line summary for the job card.";
  const description = text(fd, "description", 12_000);
  if (!description) errors.description = "Describe the role.";

  const employmentType = String(fd.get("employmentType") ?? "") as EmploymentType;
  if (!(employmentType in EMPLOYMENT_TYPES)) errors.employmentType = "Choose a job type.";
  const status = String(fd.get("status") ?? "draft") as JobStatus;
  if (!JOB_STATUSES.includes(status)) errors.status = "Choose a status.";

  const feeRaw = String(fd.get("fee") ?? "").replace(/[,₹\s]/g, "");
  const fee = Number(feeRaw);
  if (!feeRaw || !Number.isFinite(fee)) errors.fee = "Enter the referral fee in rupees, e.g. 499.";
  else if (fee < 1) errors.fee = "The fee must be at least ₹1 (the payment gateway’s minimum).";
  else if (fee > 500_000) errors.fee = "That fee looks too high. Enter it in rupees, not paise.";

  const startDate = day(fd, "startDate");
  const applyBy = day(fd, "applyBy");
  if (startDate && applyBy && applyBy > startDate) errors.applyBy = "The apply-by date is after the start date.";

  const skills = Array.from(new Set(
    String(fd.get("skills") ?? "").split(/[,\n]/).map(s => s.trim()).filter(Boolean).map(s => s.slice(0, 40)),
  )).slice(0, 20);

  if (Object.keys(errors).length) return { errors };
  return {
    errors,
    input: {
      title: title!, company: text(fd, "company", 120), location: text(fd, "location", 120) ?? "Remote", employmentType,
      experienceLevel: text(fd, "experienceLevel", 120), compensation: text(fd, "compensation", 120), skills,
      summary: summary!, description: description!, responsibilities: text(fd, "responsibilities", 8000),
      requirements: text(fd, "requirements", 8000), timeline: text(fd, "timeline", 4000),
      startDate, applyBy, feePaise: Math.round(fee * 100), status,
    },
  };
}

/** Creates or updates a job from the admin form. */
export async function saveJob(_: JobFormState, fd: FormData): Promise<JobFormState> {
  await requireAdmin();
  const { input, errors } = parseJob(fd);
  if (!input) return { error: "Please fix the highlighted fields.", fieldErrors: errors };

  const id = Number(fd.get("id"));
  let slug: string;
  try {
    if (id) {
      const existing = await getJobById(id);
      if (!existing) return { error: "This job no longer exists." };
      await updateJob(id, input);
      slug = existing.slug;
    } else {
      slug = (await createJob(input)).slug;
    }
  } catch (err) {
    console.error("[admin/jobs] save failed:", (err as Error).message);
    return { error: "Couldn’t save this job. Check the database connection and try again." };
  }
  revalidateJobs(slug);
  redirect(`/admin/jobs?saved=${encodeURIComponent(input.title.slice(0, 60))}`);
}

// ─── Job list actions ───────────────────────────────────────────────────────

export async function changeJobStatus(id: number, status: JobStatus): Promise<ActionResult> {
  await requireAdmin();
  if (!JOB_STATUSES.includes(status)) return { ok: false, message: "Unknown status." };
  try {
    const job = await getJobById(id);
    if (!job) return { ok: false, message: "This job no longer exists." };
    await setJobStatus(id, status);
    revalidateJobs(job.slug);
    return { ok: true, message: status === "open" ? "Job published" : status === "closed" ? "Applications closed" : "Moved to drafts" };
  } catch {
    return { ok: false, message: "Couldn’t update this job. Check the database connection and try again." };
  }
}

export async function removeJob(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    const job = await getJobById(id);
    await deleteJob(id);
    revalidateJobs(job?.slug);
    return { ok: true, message: "Job and its applications deleted" };
  } catch {
    return { ok: false, message: "Couldn’t delete this job. Check the database connection and try again." };
  }
}

// ─── Applications ───────────────────────────────────────────────────────────

export async function saveReview(id: number, reviewStatus: ReviewStatus, notes: string): Promise<ActionResult> {
  await requireAdmin();
  if (!(reviewStatus in REVIEW_STATUSES)) return { ok: false, message: "Unknown status." };
  try {
    await updateApplicationReview(id, reviewStatus, notes.trim().slice(0, 4000) || null);
    revalidatePath("/admin", "layout");
    return { ok: true, message: `Marked as ${REVIEW_STATUSES[reviewStatus].toLowerCase()}` };
  } catch {
    return { ok: false, message: "Couldn’t save. Check the database connection and try again." };
  }
}

/** Records a refund made in the payment gateway’s dashboard. Doesn't move money itself. */
export async function recordRefund(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await markRefunded(id);
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Marked as refunded" };
  } catch {
    return { ok: false, message: "Couldn’t update this application." };
  }
}

export async function removeApplication(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await deleteApplication(id);
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Application and résumé deleted" };
  } catch {
    return { ok: false, message: "Couldn’t delete this application." };
  }
}
