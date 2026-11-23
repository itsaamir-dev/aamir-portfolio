import "server-only";
import { getPool, ensureSchema, isDbConfigured } from "@/lib/db";
import type { EmploymentType, Job, JobStatus, PaymentStatus, ReviewStatus } from "@/lib/jobs";

export { isDbConfigured };

const JOB_COLUMNS = `
  id::int, slug, title, company, location, employment_type AS "employmentType",
  experience_level AS "experienceLevel", compensation, skills, summary, description,
  responsibilities, requirements, timeline,
  to_char(start_date, 'YYYY-MM-DD') AS "startDate", to_char(apply_by, 'YYYY-MM-DD') AS "applyBy",
  referral_fee_paise AS "feePaise", status,
  to_char(published_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "publishedAt"`;

// ─── Public site ────────────────────────────────────────────────────────────

/** Open jobs, newest first. Empty when the database isn't connected. */
export async function getOpenJobs(): Promise<Job[]> {
  if (!isDbConfigured) return [];
  await ensureSchema();
  const { rows } = await getPool().query<Job>(
    `SELECT ${JOB_COLUMNS} FROM jobs WHERE status = 'open' ORDER BY published_at DESC NULLS LAST, id DESC`,
  );
  return rows;
}

/** A published job (open or closed). Drafts are never public. */
export async function getPublicJob(slug: string): Promise<Job | null> {
  if (!isDbConfigured || !/^[a-z0-9-]{1,90}$/.test(slug)) return null;
  await ensureSchema();
  const { rows } = await getPool().query<Job>(
    `SELECT ${JOB_COLUMNS} FROM jobs WHERE slug = $1 AND status IN ('open', 'closed')`, [slug],
  );
  return rows[0] ?? null;
}

// ─── Admin: jobs ────────────────────────────────────────────────────────────

export type AdminJob = Job & { paidCount: number; pendingCount: number; revenuePaise: number; createdAt: string };

export async function listJobsAdmin(): Promise<AdminJob[]> {
  await ensureSchema();
  // Counts come from a lateral subquery so the job columns stay unqualified.
  const { rows } = await getPool().query<AdminJob>(`
    SELECT ${JOB_COLUMNS}, s."paidCount", s."pendingCount", s."revenuePaise",
           to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "createdAt"
    FROM jobs
    LEFT JOIN LATERAL (
      SELECT count(*) FILTER (WHERE payment_status = 'paid')::int    AS "paidCount",
             count(*) FILTER (WHERE payment_status = 'pending')::int AS "pendingCount",
             COALESCE(sum(fee_paise) FILTER (WHERE payment_status = 'paid'), 0)::int AS "revenuePaise"
      FROM job_applications WHERE job_applications.job_id = jobs.id
    ) s ON true
    ORDER BY CASE status WHEN 'open' THEN 0 WHEN 'draft' THEN 1 ELSE 2 END, created_at DESC`);
  return rows;
}

export async function getJobById(id: number): Promise<Job | null> {
  await ensureSchema();
  const { rows } = await getPool().query<Job>(`SELECT ${JOB_COLUMNS} FROM jobs WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export type JobInput = {
  title: string; company: string | null; location: string; employmentType: EmploymentType;
  experienceLevel: string | null; compensation: string | null; skills: string[];
  summary: string; description: string; responsibilities: string | null; requirements: string | null;
  timeline: string | null; startDate: string | null; applyBy: string | null; feePaise: number; status: JobStatus;
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "job";

/** Creates a job; the slug comes from the title and gets a suffix if taken. */
export async function createJob(input: JobInput): Promise<{ id: number; slug: string }> {
  await ensureSchema();
  const db = getPool();
  const base = slugify(input.title);
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    try {
      const { rows } = await db.query<{ id: number; slug: string }>(
        `INSERT INTO jobs (slug, title, company, location, employment_type, experience_level, compensation, skills,
                           summary, description, responsibilities, requirements, timeline, start_date, apply_by,
                           referral_fee_paise, status, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17, CASE WHEN $17 = 'open' THEN now() END)
         RETURNING id::int, slug`,
        [slug, input.title, input.company, input.location, input.employmentType, input.experienceLevel, input.compensation,
         input.skills, input.summary, input.description, input.responsibilities, input.requirements, input.timeline,
         input.startDate, input.applyBy, input.feePaise, input.status],
      );
      return rows[0];
    } catch (err) {
      if ((err as { code?: string }).code !== "23505") throw err; // unique violation → try another slug
    }
  }
  throw new Error("Couldn’t create a unique link for this job");
}

/** Updates a job. The slug stays the same so shared links keep working. */
export async function updateJob(id: number, input: JobInput) {
  await ensureSchema();
  await getPool().query(
    `UPDATE jobs SET title=$2, company=$3, location=$4, employment_type=$5, experience_level=$6, compensation=$7,
            skills=$8, summary=$9, description=$10, responsibilities=$11, requirements=$12, timeline=$13,
            start_date=$14, apply_by=$15, referral_fee_paise=$16, status=$17,
            published_at = CASE WHEN $17 = 'open' AND published_at IS NULL THEN now() ELSE published_at END,
            updated_at = now()
      WHERE id = $1`,
    [id, input.title, input.company, input.location, input.employmentType, input.experienceLevel, input.compensation,
     input.skills, input.summary, input.description, input.responsibilities, input.requirements, input.timeline,
     input.startDate, input.applyBy, input.feePaise, input.status],
  );
}

export async function setJobStatus(id: number, status: JobStatus) {
  await ensureSchema();
  await getPool().query(
    `UPDATE jobs SET status = $2, updated_at = now(),
            published_at = CASE WHEN $2 = 'open' AND published_at IS NULL THEN now() ELSE published_at END
      WHERE id = $1`,
    [id, status],
  );
}

/** Deletes a job and its applications (including résumés). */
export async function deleteJob(id: number) {
  await ensureSchema();
  await getPool().query(`DELETE FROM jobs WHERE id = $1`, [id]);
}

// ─── Admin: applications ────────────────────────────────────────────────────

export type AdminApplication = {
  id: number; publicId: string; jobId: number; jobTitle: string; jobSlug: string;
  fullName: string; email: string; phone: string; location: string | null;
  portfolioUrl: string | null; linkedinUrl: string | null; experienceYears: string | null;
  proposal: string; resumeName: string; resumeSize: number;
  feePaise: number; paymentStatus: PaymentStatus; paymentProvider: string; paymentId: string | null; paidAt: string | null;
  reviewStatus: ReviewStatus; adminNotes: string | null; createdAt: string;
};

const APP_COLUMNS = `
  a.id::int, a.public_id AS "publicId", a.job_id::int AS "jobId", j.title AS "jobTitle", j.slug AS "jobSlug",
  a.full_name AS "fullName", a.email, a.phone, a.location, a.portfolio_url AS "portfolioUrl", a.linkedin_url AS "linkedinUrl",
  a.experience_years AS "experienceYears", a.proposal, a.resume_name AS "resumeName", a.resume_size AS "resumeSize",
  a.fee_paise AS "feePaise", a.payment_status AS "paymentStatus", a.payment_provider AS "paymentProvider", a.payment_id AS "paymentId",
  to_char(a.paid_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "paidAt",
  a.review_status AS "reviewStatus", a.admin_notes AS "adminNotes",
  to_char(a.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "createdAt"`;

export const APP_PAGE_SIZE = 20;
export type ApplicationQuery = { jobId?: number; payment?: PaymentStatus | "all"; review?: ReviewStatus | "all"; q?: string; page?: number };

export async function listApplications(query: ApplicationQuery) {
  await ensureSchema();
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (query.jobId) { params.push(query.jobId); clauses.push(`a.job_id = $${params.length}`); }
  if (query.payment && query.payment !== "all") { params.push(query.payment); clauses.push(`a.payment_status = $${params.length}`); }
  if (query.review && query.review !== "all") { params.push(query.review); clauses.push(`a.review_status = $${params.length}`); }
  if (query.q?.trim()) {
    params.push(`%${query.q.trim().toLowerCase()}%`);
    clauses.push(`(lower(a.full_name) LIKE $${params.length} OR a.email LIKE $${params.length} OR a.phone LIKE $${params.length})`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const page = Math.max(1, query.page ?? 1);
  const db = getPool();
  const [rows, count] = await Promise.all([
    db.query<AdminApplication>(`SELECT ${APP_COLUMNS} FROM job_applications a JOIN jobs j ON j.id = a.job_id ${where}
                                ORDER BY a.created_at DESC, a.id DESC LIMIT ${APP_PAGE_SIZE} OFFSET ${(page - 1) * APP_PAGE_SIZE}`, params),
    db.query<{ n: number }>(`SELECT count(*)::int AS n FROM job_applications a ${where}`, params),
  ]);
  return { applications: rows.rows, total: count.rows[0].n, page, pages: Math.max(1, Math.ceil(count.rows[0].n / APP_PAGE_SIZE)) };
}

export async function getResume(id: number) {
  await ensureSchema();
  const { rows } = await getPool().query<{ name: string; type: string; data: Buffer }>(
    `SELECT resume_name AS name, resume_type AS type, resume_data AS data FROM job_applications WHERE id = $1`, [id],
  );
  return rows[0] ?? null;
}

export async function updateApplicationReview(id: number, reviewStatus: ReviewStatus, adminNotes: string | null) {
  await ensureSchema();
  await getPool().query(
    `UPDATE job_applications SET review_status = $2, admin_notes = $3, updated_at = now() WHERE id = $1`,
    [id, reviewStatus, adminNotes],
  );
}

export async function markRefunded(id: number) {
  await ensureSchema();
  await getPool().query(
    `UPDATE job_applications SET payment_status = 'refunded', updated_at = now() WHERE id = $1 AND payment_status = 'paid'`, [id],
  );
}

export async function deleteApplication(id: number) {
  await ensureSchema();
  await getPool().query(`DELETE FROM job_applications WHERE id = $1`, [id]);
}

// ─── Apply + payment ────────────────────────────────────────────────────────

export async function hasPaidApplication(jobId: number, email: string) {
  const { rows } = await getPool().query(
    `SELECT 1 FROM job_applications WHERE job_id = $1 AND email = $2 AND payment_status = 'paid' LIMIT 1`, [jobId, email],
  );
  return rows.length > 0;
}

export type NewApplication = {
  jobId: number; fullName: string; email: string; phone: string; location: string | null;
  portfolioUrl: string | null; linkedinUrl: string | null; experienceYears: string | null; proposal: string;
  resumeName: string; resumeType: string; resume: Buffer; feePaise: number;
};

export async function createPendingApplication(a: NewApplication): Promise<{ id: number; publicId: string }> {
  const { rows } = await getPool().query<{ id: number; publicId: string }>(
    `INSERT INTO job_applications
       (job_id, full_name, email, phone, location, portfolio_url, linkedin_url, experience_years, proposal,
        resume_name, resume_type, resume_size, resume_data, fee_paise)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
     RETURNING id::int, public_id AS "publicId"`,
    [a.jobId, a.fullName, a.email, a.phone, a.location, a.portfolioUrl, a.linkedinUrl, a.experienceYears, a.proposal,
     a.resumeName, a.resumeType, a.resume.length, a.resume, a.feePaise],
  );
  return rows[0];
}

export async function attachOrder(id: number, provider: "razorpay" | "cashfree", orderId: string) {
  await getPool().query(
    `UPDATE job_applications SET payment_provider = $2, payment_order_id = $3, updated_at = now() WHERE id = $1`, [id, provider, orderId],
  );
}

/** The gateway order behind an application, for confirming payment server-side. */
export async function getApplicationOrder(publicId: string) {
  await ensureSchema();
  const { rows } = await getPool().query<{ provider: "razorpay" | "cashfree"; orderId: string | null; paymentStatus: PaymentStatus }>(
    `SELECT payment_provider AS provider, payment_order_id AS "orderId", payment_status AS "paymentStatus"
       FROM job_applications WHERE public_id = $1`, [publicId],
  );
  return rows[0] ?? null;
}

export async function discardApplication(id: number) {
  await getPool().query(`DELETE FROM job_applications WHERE id = $1 AND payment_status = 'pending'`, [id]);
}

export type PaidResult = { publicId: string; jobSlug: string; jobTitle: string; feePaise: number; orderId: string };

/**
 * Marks the application for this gateway order as paid. Idempotent: the
 * checkout callback and the webhook can both arrive; the second is a no-op.
 */
export async function markPaidByOrder(orderId: string, paymentId: string, publicId?: string): Promise<PaidResult | null> {
  await ensureSchema();
  const params: unknown[] = [orderId, paymentId];
  let match = "a.payment_order_id = $1";
  if (publicId) { params.push(publicId); match += ` AND a.public_id = $3`; }
  const { rows } = await getPool().query<PaidResult>(
    `WITH target AS (SELECT a.id FROM job_applications a WHERE ${match}),
          upd AS (UPDATE job_applications a SET payment_status = 'paid', payment_id = $2, paid_at = now(), updated_at = now()
                   WHERE a.id IN (SELECT id FROM target) AND a.payment_status IN ('pending', 'failed') RETURNING a.id)
     SELECT a.public_id AS "publicId", j.slug AS "jobSlug", j.title AS "jobTitle", a.fee_paise AS "feePaise", a.payment_order_id AS "orderId"
       FROM job_applications a JOIN jobs j ON j.id = a.job_id
      WHERE a.id IN (SELECT id FROM target) AND (a.payment_status = 'paid' OR a.id IN (SELECT id FROM upd))`,
    params,
  );
  return rows[0] ?? null;
}

export async function markFailedByOrder(orderId: string) {
  await ensureSchema();
  await getPool().query(
    `UPDATE job_applications SET payment_status = 'failed', updated_at = now() WHERE payment_order_id = $1 AND payment_status = 'pending'`,
    [orderId],
  );
}

/** Unpaid applications hold résumés; drop them after 3 days. */
export async function pruneUnpaid() {
  await getPool().query(
    `DELETE FROM job_applications WHERE payment_status IN ('pending', 'failed') AND created_at < now() - interval '3 days'`,
  );
}

export type JobStats = { openJobs: number; paidApplications: number; newApplications: number; revenuePaise: number };

export async function getJobStats(): Promise<JobStats> {
  await ensureSchema();
  const { rows } = await getPool().query<JobStats>(`
    SELECT (SELECT count(*)::int FROM jobs WHERE status = 'open') AS "openJobs",
           count(*) FILTER (WHERE payment_status = 'paid')::int AS "paidApplications",
           count(*) FILTER (WHERE payment_status = 'paid' AND review_status = 'new')::int AS "newApplications",
           COALESCE(sum(fee_paise) FILTER (WHERE payment_status = 'paid'), 0)::int AS "revenuePaise"
    FROM job_applications`);
  return rows[0];
}
