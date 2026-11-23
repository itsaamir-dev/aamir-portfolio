"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Symbol from "@/components/admin/Symbol";
import { showToast } from "@/components/admin/Snackbar";
import { recordRefund, removeApplication, saveReview } from "@/app/admin/jobs-actions";
import { REVIEW_STATUSES, type PaymentStatus, type ReviewStatus } from "@/lib/jobs";

/** Review status + private notes, and the destructive actions behind a confirm. */
export default function ApplicationActions({ id, name, review, notes, payment }: {
  id: number; name: string; review: ReviewStatus; notes: string | null; payment: PaymentStatus;
}) {
  const [status, setStatus] = useState<ReviewStatus>(review);
  const [text, setText] = useState(notes ?? "");
  const [confirm, setConfirm] = useState<"refund" | "delete" | null>(null);
  const [pending, start] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dirty = status !== review || text !== (notes ?? "");

  useEffect(() => { if (confirm) dialogRef.current?.showModal(); else dialogRef.current?.close(); }, [confirm]);

  const save = () => start(async () => showToast(await saveReview(id, status, text)));
  const run = () => {
    const kind = confirm;
    start(async () => {
      const r = kind === "delete" ? await removeApplication(id) : await recordRefund(id);
      setConfirm(null);
      showToast(r);
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <p id={`review-${id}`} className="text-sm font-medium text-md-on-surface">Review status</p>
        <div role="radiogroup" aria-labelledby={`review-${id}`} className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(REVIEW_STATUSES) as ReviewStatus[]).map(s => {
            const on = s === status;
            return (
              <button key={s} type="button" role="radio" aria-checked={on} onClick={() => setStatus(s)}
                      className={`state-layer inline-flex h-8 items-center gap-1 rounded-lg px-3 text-sm font-medium
                                  ${on ? "bg-md-secondary-container text-md-on-secondary-container" : "border border-md-outline text-md-on-surface-variant"}`}>
                {on && <Symbol name="check" size={18} />}{REVIEW_STATUSES[s]}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor={`notes-${id}`} className="text-sm font-medium text-md-on-surface">Private notes</label>
        <textarea id={`notes-${id}`} rows={3} value={text} onChange={e => setText(e.target.value)} maxLength={4000}
                  placeholder="Only you can see these."
                  className="mt-1.5 block w-full rounded-xl border border-md-outline bg-transparent px-4 py-3 text-sm text-md-on-surface outline-none
                             placeholder:text-md-on-surface-variant/70 focus:border-2 focus:border-md-primary focus:px-[15px] focus:py-[11px]" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={save} disabled={!dirty || pending}
                className="state-layer inline-flex h-10 items-center gap-2 rounded-full bg-md-primary px-5 text-sm font-medium text-md-on-primary disabled:opacity-40">
          <Symbol name="check" size={18} />{pending && !confirm ? "Saving…" : "Save"}
        </button>
        <span className="flex-1" />
        {payment === "paid" && (
          <button type="button" onClick={() => setConfirm("refund")}
                  className="state-layer inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-md-primary">
            <Symbol name="payments" size={18} />Mark refunded
          </button>
        )}
        <button type="button" onClick={() => setConfirm("delete")}
                className="state-layer inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-md-error">
          <Symbol name="delete" size={18} />Delete
        </button>
      </div>

      <dialog ref={dialogRef} onClose={() => setConfirm(null)}
              className="w-[min(100vw-2rem,28rem)] rounded-[28px] bg-md-surface-container-high p-6 text-md-on-surface backdrop:bg-black/50">
        {confirm && (
          <>
            <Symbol name={confirm === "delete" ? "delete" : "payments"} className="mx-auto block text-md-on-surface-variant" />
            <h2 className="mt-4 text-center text-2xl font-normal">{confirm === "delete" ? "Delete this application?" : "Mark as refunded?"}</h2>
            <p className="mt-4 text-sm leading-relaxed text-md-on-surface-variant">
              {confirm === "delete"
                ? <>{name}’s application and résumé will be permanently deleted. Use this for data-deletion requests. The payment record stays in your payment gateway. This can&apos;t be undone.</>
                : <>This only records the refund here. Issue the refund itself from the payment in your Cashfree or Razorpay dashboard first.</>}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirm(null)} className="state-layer h-10 rounded-full px-4 text-sm font-medium text-md-primary">Cancel</button>
              <button type="button" onClick={run} disabled={pending}
                      className={`state-layer h-10 rounded-full px-4 text-sm font-medium disabled:opacity-60
                                  ${confirm === "delete" ? "bg-md-error text-md-on-error" : "bg-md-primary text-md-on-primary"}`}>
                {pending ? "Working…" : confirm === "delete" ? "Delete" : "Mark refunded"}
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
