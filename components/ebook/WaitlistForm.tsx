"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";
import BtnArrow from "@/components/BtnArrow";
import { trackEvent } from "@/lib/analytics";
import { validateWaitlist, type FieldErrors } from "@/lib/waitlist";

type Status = "idle" | "submitting" | "success" | "error";

/** Reads UTM params, landing page and referrer — never personal data. */
function attribution() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource:   params.get("utm_source")   ?? undefined,
    utmMedium:   params.get("utm_medium")   ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
    landingPage: window.location.origin + window.location.pathname,
    referrer:    document.referrer || undefined,
  };
}

const inputCls = (invalid: boolean) =>
  `mt-2 block w-full min-h-[48px] rounded-xl border bg-white px-4 text-base text-ink placeholder:text-[#8A8A8A]
   outline-none transition-[border-color,box-shadow] focus:border-ink focus:shadow-[0_0_0_4px_#D6FD70]
   ${invalid ? "border-[#C62828]" : "border-[#D9D9D9] hover:border-[#BDBDBD]"}`;

export default function WaitlistForm({ source, className = "" }: { source: string; className?: string }) {
  const [status, setStatus]   = useState<Status>("idle");
  const [errors, setErrors]   = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [hasPhone, setHasPhone] = useState(false);
  const started   = useRef(false);
  const inFlight  = useRef(false);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef   = useRef<HTMLParagraphElement>(null);

  useEffect(() => { if (status === "success") successRef.current?.focus(); }, [status]);

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("ebook_waitlist_form_start", { source });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inFlight.current) return; // guards double clicks / Enter mashing

    const fd = new FormData(e.currentTarget);
    const payload = {
      firstName:        String(fd.get("firstName") ?? ""),
      email:            String(fd.get("email") ?? ""),
      whatsapp:         String(fd.get("whatsapp") ?? ""),
      marketingConsent: fd.get("marketingConsent") === "on",
      whatsappConsent:  fd.get("whatsappConsent") === "on",
      company:          String(fd.get("company") ?? ""),
      source,
      ...attribution(),
    };

    trackEvent("ebook_waitlist_submit", { source });

    const fieldErrors = validateWaitlist(payload);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) {
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      trackEvent("ebook_waitlist_error", { source, error_type: "validation" });
      const first = Object.keys(fieldErrors)[0];
      (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    inFlight.current = true;
    setStatus("submitting");
    setMessage("");
    try {
      const res  = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
        trackEvent("ebook_waitlist_success", { source });
      } else {
        setErrors(data.fieldErrors ?? {});
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        trackEvent("ebook_waitlist_error", { source, error_type: res.status === 429 ? "rate_limited" : `http_${res.status}` });
        errorRef.current?.focus();
      }
    } catch {
      setStatus("error");
      setMessage("We couldn’t reach the server. Check your connection and try again.");
      trackEvent("ebook_waitlist_error", { source, error_type: "network" });
    } finally {
      inFlight.current = false;
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className={`rounded-card bg-white p-5 outline-none sm:p-7 ${className}`}>
        <p className="text-[1.75rem] font-medium tracking-[-0.045em] text-ink">You&apos;re on the list!</p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Thanks for joining. You&apos;ll receive updates when the Freelancing Playbook is ready and when the
          early-access offer is announced.
        </p>
        <p className="mt-6 text-sm text-muted">While you wait, learn with others for free:</p>
        <WhatsAppButton location={`ebook_success_${source}`} className="mt-3" />
      </div>
    );
  }

  const submitting = status === "submitting";
  const err = (id: keyof FieldErrors) => errors[id] && (
    <p id={`${source}-${id}-error`} className="mt-2 text-sm font-medium text-[#C62828]">{errors[id]}</p>
  );
  const describedBy = (id: keyof FieldErrors, extra?: string) =>
    [errors[id] ? `${source}-${id}-error` : "", extra ?? ""].filter(Boolean).join(" ") || undefined;

  return (
    <form noValidate onSubmit={onSubmit} onFocus={onStart} aria-busy={submitting}
          className={`relative rounded-card bg-white p-5 sm:p-7 ${className}`}>
      <p className="text-base text-muted">Get updates about the e-book launch and early-access offer.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${source}-firstName`} className="text-sm font-semibold text-ink">First name</label>
          <input id={`${source}-firstName`} name="firstName" type="text" autoComplete="given-name" required
                 aria-invalid={Boolean(errors.firstName)} aria-describedby={describedBy("firstName")}
                 className={inputCls(Boolean(errors.firstName))} />
          {err("firstName")}
        </div>
        <div>
          <label htmlFor={`${source}-email`} className="text-sm font-semibold text-ink">Email address</label>
          <input id={`${source}-email`} name="email" type="email" inputMode="email" autoComplete="email" required
                 aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")}
                 className={inputCls(Boolean(errors.email))} />
          {err("email")}
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={`${source}-whatsapp`} className="text-sm font-semibold text-ink">
          WhatsApp number <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id={`${source}-whatsapp`} name="whatsapp" type="tel" inputMode="tel" autoComplete="tel"
               placeholder="+91 98765 43210"
               onChange={e => setHasPhone(e.currentTarget.value.trim().length > 0)}
               aria-invalid={Boolean(errors.whatsapp)} aria-describedby={describedBy("whatsapp", `${source}-whatsapp-hint`)}
               className={inputCls(Boolean(errors.whatsapp))} />
        <p id={`${source}-whatsapp-hint`} className="mt-2 text-sm text-muted">Include your country code.</p>
        {err("whatsapp")}
      </div>

      {/* Optional, unchecked, and separate from joining the list */}
      <fieldset className="mt-6 space-y-3">
        <legend className="sr-only">Optional updates</legend>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="marketingConsent" className="mt-0.5 h-5 w-5 shrink-0 accent-[#131313]" />
          <span>Also email me other Build With Aamir freelancing tips. <span className="text-[#767676]">(Optional)</span></span>
        </label>
        {hasPhone && (
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
              <input type="checkbox" name="whatsappConsent"
                     aria-describedby={describedBy("whatsappConsent")}
                     className="mt-0.5 h-5 w-5 shrink-0 accent-[#131313]" />
              <span>Send me e-book launch updates on WhatsApp too. <span className="text-[#767676]">(Optional)</span></span>
            </label>
            {err("whatsappConsent")}
          </div>
        )}
      </fieldset>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>Company <input type="text" name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {status === "error" && message && (
        <p ref={errorRef} tabIndex={-1} role="alert"
           className="mt-6 rounded-xl border border-[#F3B7B7] bg-[#FDECEC] px-4 py-3 text-sm font-medium text-[#B71C1C] outline-none">
          {message}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-dark mt-6 w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto">
        {submitting ? "Saving…" : "Get on the waiting list"}
        <BtnArrow tone="lime" />
      </button>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Your information will be used to send relevant e-book and launch updates. You can unsubscribe from marketing
        emails at any time. Joining is free — no payment required.
      </p>
    </form>
  );
}
