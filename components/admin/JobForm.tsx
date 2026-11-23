"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Symbol from "@/components/admin/Symbol";
import { Card, CardTitle } from "@/components/admin/parts";
import { saveJob, type JobFormState } from "@/app/admin/jobs-actions";
import { EMPLOYMENT_TYPES, type Job } from "@/lib/jobs";

const FORMAT_HINT = "Leave a blank line between paragraphs. Start lines with “- ” for bullet points.";

const field = (invalid?: boolean) =>
  `mt-1.5 block w-full rounded-xl border bg-transparent px-4 py-3 text-base text-md-on-surface outline-none transition-colors
   placeholder:text-md-on-surface-variant/70 focus:border-2 focus:border-md-primary focus:px-[15px] focus:py-[11px]
   ${invalid ? "border-md-error" : "border-md-outline"}`;

function Field({ name, label, hint, error, children }: { name: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`job-${name}`} className="text-sm font-medium text-md-on-surface">{label}</label>
      {children}
      {error
        ? <p id={`job-${name}-error`} className="mt-1.5 flex items-center gap-1 text-sm text-md-error"><Symbol name="error" size={16} />{error}</p>
        : hint && <p id={`job-${name}-hint`} className="mt-1.5 text-sm text-md-on-surface-variant">{hint}</p>}
    </div>
  );
}

function Submit({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
            className="state-layer inline-flex h-12 items-center gap-2 rounded-full bg-md-primary px-6 text-sm font-medium text-md-on-primary disabled:opacity-60">
      <Symbol name="check" size={20} />{pending ? "Saving…" : editing ? "Save changes" : "Create job"}
    </button>
  );
}

/** Create / edit a job. Text areas accept plain text (paragraphs + "- " bullets). */
export default function JobForm({ job }: { job?: Job }) {
  const [state, action] = useFormState<JobFormState, FormData>(saveJob, {});
  const errors = state.fieldErrors ?? {};
  const formRef = useRef<HTMLFormElement>(null);

  // Move focus to the first problem after a failed save (once per save attempt).
  useEffect(() => {
    const first = Object.keys(state.fieldErrors ?? {})[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }, [state]);

  const a11y = (name: keyof NonNullable<JobFormState["fieldErrors"]>, hasHint = false) => ({
    id: `job-${name}`, name,
    "aria-invalid": Boolean(errors[name]) || undefined,
    "aria-describedby": errors[name] ? `job-${name}-error` : hasHint ? `job-${name}-hint` : undefined,
  });

  return (
    <form ref={formRef} action={action} noValidate className="space-y-4 pb-24">
      {job && <input type="hidden" name="id" value={job.id} />}

      {state.error && (
        <p role="alert" className="flex items-center gap-2 rounded-2xl bg-md-error-container px-4 py-3 text-sm text-md-on-error-container">
          <Symbol name="error" size={20} />{state.error}
        </p>
      )}

      <Card data-anim aria-labelledby="basics-h">
        <CardTitle id="basics-h" sub="Shown at the top of the job page and on the job card">Basics</CardTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field name="title" label="Job title" error={errors.title}>
              <input {...a11y("title")} defaultValue={job?.title} placeholder="Senior React Native Developer" className={field(Boolean(errors.title))} />
            </Field>
          </div>
          <Field name="company" label="Company or client" hint="Leave empty to show “Confidential client”.">
            <input {...a11y("company", true)} defaultValue={job?.company ?? ""} className={field()} />
          </Field>
          <Field name="location" label="Location" hint="e.g. Remote (US hours), Remote — India, Bengaluru">
            <input {...a11y("location", true)} defaultValue={job?.location ?? "Remote"} className={field()} />
          </Field>
          <Field name="employmentType" label="Job type" error={errors.employmentType}>
            <select {...a11y("employmentType")} defaultValue={job?.employmentType ?? "contract"} className={field(Boolean(errors.employmentType))}>
              {Object.entries(EMPLOYMENT_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Field>
          <Field name="experienceLevel" label="Experience level" hint="e.g. Mid-level (3+ years)">
            <input {...a11y("experienceLevel", true)} defaultValue={job?.experienceLevel ?? ""} className={field()} />
          </Field>
          <Field name="compensation" label="Pay" hint="Free text, e.g. $30–40/hr or ₹1.2L/month">
            <input {...a11y("compensation", true)} defaultValue={job?.compensation ?? ""} className={field()} />
          </Field>
          <Field name="skills" label="Skills" hint="Comma-separated, e.g. React Native, TypeScript, Firebase">
            <input {...a11y("skills", true)} defaultValue={job?.skills.join(", ") ?? ""} className={field()} />
          </Field>
          <div className="sm:col-span-2">
            <Field name="summary" label="Summary" hint="One or two lines for the job card and search results." error={errors.summary}>
              <textarea {...a11y("summary", true)} rows={2} maxLength={300} defaultValue={job?.summary} className={field(Boolean(errors.summary))} />
            </Field>
          </div>
        </div>
      </Card>

      <Card data-anim aria-labelledby="details-h">
        <CardTitle id="details-h" sub={FORMAT_HINT}>Job details</CardTitle>
        <div className="grid gap-5">
          <Field name="description" label="About the role" error={errors.description}>
            <textarea {...a11y("description")} rows={8} defaultValue={job?.description} className={field(Boolean(errors.description))} />
          </Field>
          <Field name="responsibilities" label="What they’ll do (optional)">
            <textarea {...a11y("responsibilities")} rows={5} defaultValue={job?.responsibilities ?? ""} placeholder={"- Build new features in the mobile app\n- Review pull requests"} className={field()} />
          </Field>
          <Field name="requirements" label="What you’re looking for (optional)">
            <textarea {...a11y("requirements")} rows={5} defaultValue={job?.requirements ?? ""} placeholder={"- 3+ years with React Native\n- Comfortable with US time-zone overlap"} className={field()} />
          </Field>
        </div>
      </Card>

      <Card data-anim aria-labelledby="timeline-h">
        <CardTitle id="timeline-h" sub="Dates are optional — without an apply-by date the job stays open until you close it">Timeline</CardTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field name="timeline" label="Project timeline (optional)" hint="Duration, milestones or hours, e.g. “3 months, ~30 hrs/week, likely extension”.">
              <textarea {...a11y("timeline", true)} rows={3} defaultValue={job?.timeline ?? ""} className={field()} />
            </Field>
          </div>
          <Field name="startDate" label="Start date">
            <input {...a11y("startDate")} type="date" defaultValue={job?.startDate ?? ""} className={field()} />
          </Field>
          <Field name="applyBy" label="Apply by" hint="Last day to apply (inclusive, India time)." error={errors.applyBy}>
            <input {...a11y("applyBy", true)} type="date" defaultValue={job?.applyBy ?? ""} className={field(Boolean(errors.applyBy))} />
          </Field>
        </div>
      </Card>

      <Card data-anim aria-labelledby="publish-h">
        <CardTitle id="publish-h" sub="Applicants pay this online (UPI, cards, net banking) to submit an application">Referral fee &amp; publishing</CardTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="fee" label="Referral fee (₹)" hint="In rupees, e.g. 499." error={errors.fee}>
            <input {...a11y("fee", true)} inputMode="decimal" defaultValue={job ? String(job.feePaise / 100) : ""} placeholder="499" className={field(Boolean(errors.fee))} />
          </Field>
          <Field name="status" label="Status" error={errors.status}>
            <select {...a11y("status")} defaultValue={job?.status ?? "draft"} className={field(Boolean(errors.status))}>
              <option value="draft">Draft — not visible on the site</option>
              <option value="open">Open — visible and accepting applications</option>
              <option value="closed">Closed — visible, applications closed</option>
            </select>
          </Field>
        </div>
      </Card>

      {/* Sticky actions */}
      <div className="fixed inset-x-0 bottom-20 z-20 border-t border-md-outline-variant bg-md-surface-container/95 px-4 py-3 backdrop-blur lg:bottom-0 lg:left-24">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-2">
          <Link href="/admin/jobs" className="state-layer inline-flex h-12 items-center rounded-full px-5 text-sm font-medium text-md-primary">Cancel</Link>
          <Submit editing={Boolean(job)} />
        </div>
      </div>
    </form>
  );
}
