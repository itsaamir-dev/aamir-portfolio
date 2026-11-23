"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import Symbol from "@/components/admin/Symbol";
import { showToast } from "@/components/admin/Snackbar";
import { changeJobStatus, removeJob } from "@/app/admin/jobs-actions";
import type { JobStatus } from "@/lib/jobs";

/** Overflow menu for one job. Delete asks for confirmation first. */
export default function JobActions({ id, slug, title, status, applications }: {
  id: number; slug: string; title: string; status: JobStatus; applications: number;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", esc);
    menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);

  useEffect(() => { if (confirming) dialogRef.current?.showModal(); else dialogRef.current?.close(); }, [confirming]);

  const setStatus = (next: JobStatus) => { setOpen(false); start(async () => showToast(await changeJobStatus(id, next))); };
  const del = () => start(async () => { const r = await removeJob(id); setConfirming(false); showToast(r); });

  const item = "state-layer flex h-12 w-full items-center gap-3 px-3 text-left text-sm text-md-on-surface";

  return (
    <div ref={menuRef} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open} disabled={pending}
              aria-label={`Actions for ${title}`}
              className="state-layer grid h-10 w-10 place-items-center rounded-full text-md-on-surface-variant disabled:opacity-50">
        <Symbol name="more_vert" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-11 z-40 w-60 overflow-hidden rounded-xl bg-md-surface-container py-2 shadow-xl">
          <Link role="menuitem" href={`/admin/jobs/${id}`} className={item}><Symbol name="edit" size={20} />Edit job</Link>
          <Link role="menuitem" href={`/admin/applications?job=${id}`} className={item}><Symbol name="description" size={20} />View applications</Link>
          {status !== "draft" && (
            <a role="menuitem" href={`/jobs/${slug}`} target="_blank" rel="noopener noreferrer" className={item}><Symbol name="open_in_new" size={20} />Open on site</a>
          )}
          <div className="my-1 h-px bg-md-outline-variant" />
          {status !== "open"   && <button role="menuitem" type="button" onClick={() => setStatus("open")}   className={item}><Symbol name="campaign" size={20} />Publish (open)</button>}
          {status === "open"   && <button role="menuitem" type="button" onClick={() => setStatus("closed")} className={item}><Symbol name="lock" size={20} />Close applications</button>}
          {status !== "draft"  && <button role="menuitem" type="button" onClick={() => setStatus("draft")}  className={item}><Symbol name="visibility_off" size={20} />Move to drafts</button>}
          <div className="my-1 h-px bg-md-outline-variant" />
          <button role="menuitem" type="button" onClick={() => { setOpen(false); setConfirming(true); }} className={`${item} text-md-error`}>
            <Symbol name="delete" size={20} />Delete job
          </button>
        </div>
      )}

      <dialog ref={dialogRef} onClose={() => setConfirming(false)}
              className="w-[min(100vw-2rem,28rem)] rounded-[28px] bg-md-surface-container-high p-6 text-md-on-surface backdrop:bg-black/50">
        {confirming && (
          <>
            <Symbol name="delete" className="mx-auto block text-md-on-surface-variant" />
            <h2 className="mt-4 text-center text-2xl font-normal">Delete this job?</h2>
            <p className="mt-4 text-sm leading-relaxed text-md-on-surface-variant">
              “{title}” will be removed from the site
              {applications > 0 ? <>, along with its <strong className="text-md-on-surface">{applications} application{applications === 1 ? "" : "s"}</strong> and résumés</> : null}.
              Payments stay in your payment gateway’s dashboard. This can&apos;t be undone — to stop new applications, close the job instead.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirming(false)} className="state-layer h-10 rounded-full px-4 text-sm font-medium text-md-primary">Cancel</button>
              <button type="button" onClick={del} disabled={pending}
                      className="state-layer h-10 rounded-full bg-md-error px-4 text-sm font-medium text-md-on-error disabled:opacity-60">
                {pending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
