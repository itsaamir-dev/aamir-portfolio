"use client";
import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import Icon from "@/components/Icon";
import BtnArrow from "@/components/BtnArrow";
import WhatsAppButton from "@/components/WhatsAppButton";
import { trackEvent } from "@/lib/analytics";
import {
  checkResumeFile, formatFee, validateApplication, EXPERIENCE_OPTIONS, PROPOSAL_MAX, PROPOSAL_MIN,
  RESUME_ACCEPT, RESUME_HINT, type ApplicationErrors,
} from "@/lib/jobs";

type Order = { id: string; amount: number; currency: string };
type Created =
  | { provider: "razorpay"; application: string; keyId: string; order: Order; prefill: { name: string; email: string; contact: string } }
  | { provider: "cashfree"; application: string; mode: "sandbox" | "production"; sessionId: string };
type Status = "idle" | "submitting" | "paying" | "awaiting" | "verifying" | "success";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: string, cb: (r: { error?: { description?: string } }) => void) => void };
type CashfreeResult = { error?: { message?: string }; redirect?: boolean; paymentDetails?: { paymentMessage?: string } };
type CashfreeInstance = { checkout: (o: { paymentSessionId: string; redirectTarget: "_modal" }) => Promise<CashfreeResult> };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
    Cashfree?: (o: { mode: "sandbox" | "production" }) => CashfreeInstance;
  }
}

const CHECKOUT_SRC = {
  razorpay: "https://checkout.razorpay.com/v1/checkout.js",
  cashfree: "https://sdk.cashfree.com/js/v3/cashfree.js",
} as const;
const checkoutScripts: Partial<Record<keyof typeof CHECKOUT_SRC, Promise<void>>> = {};
/** Loads the gateway's checkout script once, on demand. */
function loadCheckout(provider: keyof typeof CHECKOUT_SRC): Promise<void> {
  if (provider === "razorpay" ? window.Razorpay : window.Cashfree) return Promise.resolve();
  checkoutScripts[provider] ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = CHECKOUT_SRC[provider];
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { delete checkoutScripts[provider]; reject(new Error("checkout_load_failed")); };
    document.body.appendChild(s);
  });
  return checkoutScripts[provider]!;
}

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

const inputCls = (invalid: boolean) =>
  `mt-2 block w-full min-h-[48px] rounded-xl border bg-bg px-4 text-base text-ink placeholder:text-muted/70
   outline-none transition-[border-color,box-shadow] focus:border-ink focus:shadow-[0_0_0_4px_#D6FD70]
   ${invalid ? "border-[#C62828] dark:border-[#FF8A80]" : "border-line-strong hover:border-muted"}`;

const fmtSize = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

export default function ApplyForm({ jobSlug, jobTitle, feePaise, gateway = "our payment partner" }: {
  jobSlug: string; jobTitle: string; feePaise: number; gateway?: string;
}) {
  const [status, setStatus]   = useState<Status>("idle");
  const [errors, setErrors]   = useState<ApplicationErrors>({});
  const [message, setMessage] = useState("");
  const [resume, setResume]   = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [proposalLen, setProposalLen] = useState(0);
  const [created, setCreated] = useState<Created | null>(null);
  const [reference, setReference] = useState("");
  const fileRef    = useRef<HTMLInputElement>(null);
  const formRef    = useRef<HTMLFormElement>(null);
  const alertRef   = useRef<HTMLParagraphElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const started    = useRef(false);
  const fee = formatFee(feePaise);

  useEffect(() => { if (status === "success") successRef.current?.focus(); }, [status]);

  // Back from a full-page Cashfree checkout (in-app browsers can't show the popup).
  useEffect(() => {
    const url = new URL(window.location.href);
    const application = url.searchParams.get("application");
    if (!application || !/^[a-f0-9]{32}$/.test(application)) return;
    url.searchParams.delete("application");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    confirmCashfree(application, true).then(paid => {
      if (!paid) fail("We didn’t receive your payment, so your application wasn’t submitted. Please fill in the form again to retry.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fail = (msg: string, fieldErrors: ApplicationErrors = {}) => {
    setErrors(fieldErrors);
    setMessage(msg);
    const first = Object.keys(fieldErrors)[0];
    requestAnimationFrame(() => {
      const el = first ? (formRef.current?.elements.namedItem(first) as HTMLElement | null) : null;
      (el ?? alertRef.current)?.focus();
    });
  };

  const pickFile = (file: File | null) => {
    setResume(file);
    if (fileRef.current && file) {
      // Keep the hidden input in sync for drag-and-drop.
      const dt = new DataTransfer(); dt.items.add(file); fileRef.current.files = dt.files;
    }
    const err = file ? checkResumeFile(file) : null;
    setErrors(e => { const next = { ...e }; if (err) next.resume = err; else delete next.resume; return next; });
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) pickFile(file);
  };

  const paidOk = (reference: string) => {
    setReference(reference);
    setStatus("success");
    trackEvent("job_payment_success", { job: jobSlug, value: feePaise / 100, currency: "INR" });
  };

  /**
   * Asks the server (which asks Cashfree) whether the order is paid. Retries a
   * few times because banks can take a moment to confirm. Returns true if paid.
   */
  async function confirmCashfree(application: string, persistent: boolean): Promise<boolean> {
    setStatus("verifying");
    const tries = persistent ? 5 : 1;
    for (let i = 0; i < tries; i++) {
      try {
        const res = await fetch("/api/jobs/verify", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: "cashfree", application }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) { paidOk(data.reference); return true; }
        if (!data.pending && res.status !== 502) break;
      } catch { /* network hiccup — retry */ }
      if (i < tries - 1) await wait(2000);
    }
    setStatus("awaiting");
    return false;
  }

  /** Opens Cashfree's checkout popup for an existing order (first attempt or retry). */
  async function payCashfree(c: Extract<Created, { provider: "cashfree" }>) {
    const result = await window.Cashfree!({ mode: c.mode }).checkout({ paymentSessionId: c.sessionId, redirectTarget: "_modal" });
    if (result.redirect) return; // full-page checkout; we pick up again on return
    if (result.paymentDetails) {
      // Finished — paid or failed. Only the server's answer counts.
      if (!(await confirmCashfree(c.application, true))) {
        trackEvent("job_payment_failed", { job: jobSlug });
        fail("Your payment didn’t go through. You can try again — your application is saved.");
      }
      return;
    }
    // Closed the popup (or an error). Check once in case they paid just before closing.
    if (await confirmCashfree(c.application, false)) return;
    trackEvent("job_payment_dismissed", { job: jobSlug });
    if (result.error?.message && !/closed|cancel/i.test(result.error.message)) {
      fail(`${result.error.message}. You can try again — your application is saved.`);
    }
  }

  /** Opens the gateway's checkout for an existing order (first attempt or retry). */
  async function pay(c: Created) {
    setStatus("paying");
    setMessage("");
    try {
      await loadCheckout(c.provider);
    } catch {
      setStatus("awaiting");
      fail("The payment window couldn’t load. Check your connection or turn off ad blockers, then try again.");
      return;
    }
    if (c.provider === "cashfree") { await payCashfree(c); return; }
    const rzp = new window.Razorpay!({
      key: c.keyId,
      order_id: c.order.id,
      amount: c.order.amount,
      currency: c.order.currency,
      name: "Build With Aamir",
      description: `Referral fee · ${jobTitle}`.slice(0, 250),
      prefill: c.prefill,
      notes: { application: c.application },
      theme: { color: "#131313" },
      handler: (r: RazorpayResponse) => verify(c, r),
      modal: {
        ondismiss: () => {
          setStatus(s => (s === "verifying" || s === "success" ? s : "awaiting"));
          trackEvent("job_payment_dismissed", { job: jobSlug });
        },
      },
    });
    rzp.on("payment.failed", r => {
      trackEvent("job_payment_failed", { job: jobSlug });
      setMessage(`Payment failed${r.error?.description ? `: ${r.error.description}` : ""}. You can try again — your application is saved.`);
    });
    rzp.open();
  }

  async function verify(c: Extract<Created, { provider: "razorpay" }>, r: RazorpayResponse) {
    setStatus("verifying");
    try {
      const res = await fetch("/api/jobs/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application: c.application, orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        paidOk(data.reference);
      } else {
        setStatus("awaiting");
        fail(`${data.error ?? "We couldn’t confirm your payment."} Payment ID: ${r.razorpay_payment_id}`);
      }
    } catch {
      setStatus("awaiting");
      fail(`We couldn’t reach the server to confirm your payment. It will update automatically. Payment ID: ${r.razorpay_payment_id}`);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting" || status === "paying") return;
    if (created) { pay(created); return; } // already saved — just retry the payment

    const fd = new FormData(e.currentTarget);
    const input = {
      fullName: String(fd.get("fullName") ?? ""), email: String(fd.get("email") ?? ""), phone: String(fd.get("phone") ?? ""),
      location: String(fd.get("location") ?? ""), portfolioUrl: String(fd.get("portfolioUrl") ?? ""),
      linkedinUrl: String(fd.get("linkedinUrl") ?? ""), experienceYears: String(fd.get("experienceYears") ?? ""),
      proposal: String(fd.get("proposal") ?? ""), agree: fd.get("agree") === "on",
    };
    const fieldErrors = validateApplication(input);
    const resumeErr = checkResumeFile(resume);
    if (resumeErr) fieldErrors.resume = resumeErr;
    trackEvent("job_apply_submit", { job: jobSlug });
    if (Object.keys(fieldErrors).length) {
      fail("Please check the highlighted fields.", fieldErrors);
      trackEvent("job_apply_error", { job: jobSlug, error_type: "validation" });
      return;
    }

    fd.set("job", jobSlug);
    if (resume) fd.set("resume", resume);
    setStatus("submitting");
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/jobs/apply", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus("idle");
        fail(data.error ?? (res.status === 413 ? "Your résumé is too large. Please upload a file under 4 MB." : "Something went wrong. Please try again."),
             data.fieldErrors ?? {});
        trackEvent("job_apply_error", { job: jobSlug, error_type: `http_${res.status}` });
        return;
      }
      setCreated(data);
      pay(data);
    } catch {
      setStatus("idle");
      fail("We couldn’t reach the server. Check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="tray outline-none">
        <div className="tray-card sm:!p-9">
          <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-ink">
            <Icon name="check" size={24} />
          </span>
          <h3 className="mt-5 text-[1.75rem] font-medium tracking-[-0.04em] text-ink">Application submitted</h3>
          <p className="mt-2 text-base leading-relaxed text-muted">
            Your application for <strong className="font-semibold text-ink">{jobTitle}</strong> and the {fee} referral fee went through.
            Your reference is <strong className="font-mono text-ink">{reference}</strong> — keep it for any questions.
          </p>
          <ol className="mt-6 space-y-2">
            {["Your résumé and proposal are reviewed against the role.",
              "If your profile fits, it’s referred directly to the hiring team.",
              "You’ll hear back by email or WhatsApp with next steps."].map((t, i) => (
              <li key={t} className="flex gap-3 rounded-2xl bg-surface p-3.5 text-base text-ink">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs text-on-ink">{i + 1}</span>
                <span className="pt-0.5">{t}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted">While you wait, learn with others in the free community:</p>
          <WhatsAppButton location={`job_success_${jobSlug}`} className="mt-3" />
        </div>
      </div>
    );
  }

  const busy = status === "submitting" || status === "paying" || status === "verifying";
  const err = (id: keyof ApplicationErrors) => errors[id] && (
    <p id={`apply-${id}-error`} className="mt-2 text-sm font-medium text-[#C62828] dark:text-[#FF8A80]">{errors[id]}</p>
  );
  const describedBy = (id: keyof ApplicationErrors, extra?: string) =>
    [errors[id] ? `apply-${id}-error` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;
  const label = "text-sm font-semibold text-ink";
  const optional = <span className="font-normal text-muted">(optional)</span>;
  const locked = Boolean(created); // details are saved; only the payment is outstanding

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-busy={busy}
          onFocus={() => { if (!started.current) { started.current = true; trackEvent("job_apply_start", { job: jobSlug }); } }}
          className="tray">
      <fieldset disabled={locked || busy} className="tray-card space-y-6 sm:!p-9">
        <legend className="sr-only">Your details</legend>

        {/* Step 1 — details */}
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-muted">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-on-ink">1</span> Your details
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="apply-fullName" className={label}>Full name</label>
              <input id="apply-fullName" name="fullName" autoComplete="name" required
                     aria-invalid={Boolean(errors.fullName)} aria-describedby={describedBy("fullName")} className={inputCls(Boolean(errors.fullName))} />
              {err("fullName")}
            </div>
            <div>
              <label htmlFor="apply-email" className={label}>Email</label>
              <input id="apply-email" name="email" type="email" inputMode="email" autoComplete="email" required
                     aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} className={inputCls(Boolean(errors.email))} />
              {err("email")}
            </div>
            <div>
              <label htmlFor="apply-phone" className={label}>WhatsApp or phone</label>
              <input id="apply-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+91 98765 43210"
                     aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone", "apply-phone-hint")} className={inputCls(Boolean(errors.phone))} />
              <p id="apply-phone-hint" className="mt-2 text-sm text-muted">Include your country code.</p>
              {err("phone")}
            </div>
            <div>
              <label htmlFor="apply-location" className={label}>Location {optional}</label>
              <input id="apply-location" name="location" autoComplete="address-level2" placeholder="City, country"
                     aria-invalid={Boolean(errors.location)} aria-describedby={describedBy("location")} className={inputCls(Boolean(errors.location))} />
              {err("location")}
            </div>
            <div>
              <label htmlFor="apply-portfolioUrl" className={label}>Portfolio or GitHub {optional}</label>
              <input id="apply-portfolioUrl" name="portfolioUrl" inputMode="url" autoComplete="url" placeholder="github.com/yourname"
                     aria-invalid={Boolean(errors.portfolioUrl)} aria-describedby={describedBy("portfolioUrl")} className={inputCls(Boolean(errors.portfolioUrl))} />
              {err("portfolioUrl")}
            </div>
            <div>
              <label htmlFor="apply-linkedinUrl" className={label}>LinkedIn {optional}</label>
              <input id="apply-linkedinUrl" name="linkedinUrl" inputMode="url" placeholder="linkedin.com/in/yourname"
                     aria-invalid={Boolean(errors.linkedinUrl)} aria-describedby={describedBy("linkedinUrl")} className={inputCls(Boolean(errors.linkedinUrl))} />
              {err("linkedinUrl")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="apply-experienceYears" className={label}>Relevant experience {optional}</label>
              <select id="apply-experienceYears" name="experienceYears" defaultValue="" className={`${inputCls(false)} appearance-none`}>
                <option value="">Select</option>
                {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2 — résumé */}
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-muted">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-on-ink">2</span> Résumé
          </p>
          <label htmlFor="apply-resume"
                 onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
                 className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-colors
                             focus-within:border-ink ${dragging ? "border-ink bg-accent/30" : errors.resume ? "border-[#C62828] dark:border-[#FF8A80]" : "border-line-strong hover:border-muted"}`}>
            <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink">
              <Icon name={resume && !errors.resume ? "check" : "upload"} size={20} />
            </span>
            {resume ? (
              <span className="text-base font-medium text-ink">{resume.name} <span className="font-normal text-muted">· {fmtSize(resume.size)}</span></span>
            ) : (
              <span className="text-base font-medium text-ink">Drop your résumé here, or <span className="underline underline-offset-4">browse</span></span>
            )}
            <span id="apply-resume-hint" className="text-sm text-muted">{resume ? "Click to choose a different file." : RESUME_HINT}</span>
            <input ref={fileRef} id="apply-resume" name="resume" type="file" accept={RESUME_ACCEPT} className="sr-only"
                   aria-invalid={Boolean(errors.resume)} aria-describedby={describedBy("resume", "apply-resume-hint")}
                   onChange={e => pickFile(e.currentTarget.files?.[0] ?? null)} />
          </label>
          {err("resume")}
        </div>

        {/* Step 3 — proposal */}
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-muted">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-on-ink">3</span> Proposal
          </p>
          <label htmlFor="apply-proposal" className={`${label} mt-4 block`}>Why are you a good fit for this role?</label>
          <textarea id="apply-proposal" name="proposal" rows={7} required maxLength={PROPOSAL_MAX}
                    placeholder="Mention relevant projects, what you’d do first, and your availability."
                    onChange={e => setProposalLen(e.currentTarget.value.trim().length)}
                    aria-invalid={Boolean(errors.proposal)} aria-describedby={describedBy("proposal", "apply-proposal-count")}
                    className={`${inputCls(Boolean(errors.proposal))} py-3 leading-relaxed`} />
          <p id="apply-proposal-count" className={`mt-2 text-sm ${proposalLen > 0 && proposalLen < PROPOSAL_MIN ? "text-ink" : "text-muted"}`} aria-live="polite">
            {proposalLen < PROPOSAL_MIN
              ? `${proposalLen} / ${PROPOSAL_MIN} characters minimum`
              : `${proposalLen.toLocaleString("en-US")} / ${PROPOSAL_MAX.toLocaleString("en-US")} characters`}
          </p>
          {err("proposal")}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
            <input type="checkbox" name="agree" aria-invalid={Boolean(errors.agree)} aria-describedby={describedBy("agree")}
                   className="mt-0.5 h-5 w-5 shrink-0 accent-ink" />
            <span>
              I understand the <strong className="font-semibold text-ink">{fee} referral fee</strong> is charged to submit this application,
              and that it doesn’t guarantee an interview or a job.
            </span>
          </label>
          {err("agree")}
        </div>

        {/* Honeypot: hidden from people and assistive tech */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>Company <input type="text" name="company" tabIndex={-1} autoComplete="off" /></label>
        </div>
      </fieldset>

      <div className="px-4 pb-4 pt-2 sm:px-7 sm:pb-6">
        {message && (
          <p ref={alertRef} tabIndex={-1} role="alert"
             className="mb-4 rounded-xl border border-[#F3B7B7] bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#B71C1C] outline-none
                        dark:border-[#5C2B2B] dark:bg-[#2A1515] dark:text-[#FFB4AB]">
            {message}
          </p>
        )}
        {locked && status === "awaiting" && (
          <p className="mb-4 text-sm text-muted">Your details and résumé are saved. Complete the payment to submit your application.</p>
        )}
        <button type="submit" disabled={busy} className="btn-dark w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto">
          <Icon name="lock" size={16} />
          {status === "submitting" ? "Saving your application…"
            : status === "paying" ? "Opening secure payment…"
            : status === "verifying" ? "Confirming payment…"
            : locked ? `Complete payment of ${fee}`
            : `Pay ${fee} & submit application`}
          {!busy && <BtnArrow tone="lime" />}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Payments are processed securely by {gateway} (UPI, cards, net banking and wallets). Your details are used only to review and refer
          your application.
        </p>
      </div>
    </form>
  );
}
