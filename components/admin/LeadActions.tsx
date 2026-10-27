"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Symbol from "@/components/admin/Symbol";
import { showToast } from "@/components/admin/Snackbar";
import { removeLead, unsubscribeLead } from "@/app/admin/actions";

type Confirm = { kind: "unsubscribe" | "delete" } | null;

/** Overflow menu for one lead: copy email, mark unsubscribed, delete — destructive ones confirm first. */
export default function LeadActions({ id, name, email, unsubscribed }: { id: number; name: string; email: string; unsubscribed: boolean }) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState<Confirm>(null);
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

  useEffect(() => {
    if (confirm) dialogRef.current?.showModal(); else dialogRef.current?.close();
  }, [confirm]);

  const copy = async () => {
    setOpen(false);
    try { await navigator.clipboard.writeText(email); showToast({ ok: true, message: "Email copied" }); }
    catch { showToast({ ok: false, message: "Couldn’t copy. Select the email and copy it manually." }); }
  };

  const run = () => {
    const kind = confirm?.kind;
    start(async () => {
      const res = kind === "delete" ? await removeLead(id) : await unsubscribeLead(id);
      setConfirm(null);
      showToast(res);
    });
  };

  const item = "state-layer flex h-12 w-full items-center gap-3 px-3 text-left text-sm text-md-on-surface";

  return (
    <div ref={menuRef} className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} aria-haspopup="menu" aria-expanded={open}
              aria-label={`Actions for ${name}`}
              className="state-layer grid h-10 w-10 place-items-center rounded-full text-md-on-surface-variant">
        <Symbol name="more_vert" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-11 z-40 w-56 overflow-hidden rounded-xl bg-md-surface-container py-2 shadow-xl">
          <button role="menuitem" type="button" onClick={copy} className={item}><Symbol name="content_copy" size={20} />Copy email</button>
          {!unsubscribed && (
            <button role="menuitem" type="button" onClick={() => { setOpen(false); setConfirm({ kind: "unsubscribe" }); }} className={item}>
              <Symbol name="person_remove" size={20} />Mark as unsubscribed
            </button>
          )}
          <div className="my-1 h-px bg-md-outline-variant" />
          <button role="menuitem" type="button" onClick={() => { setOpen(false); setConfirm({ kind: "delete" }); }} className={`${item} text-md-error`}>
            <Symbol name="delete" size={20} />Delete lead
          </button>
        </div>
      )}

      {/* M3 basic dialog */}
      <dialog ref={dialogRef} onClose={() => setConfirm(null)}
              className="w-[min(100vw-2rem,28rem)] rounded-[28px] bg-md-surface-container-high p-6 text-md-on-surface backdrop:bg-black/50">
        {confirm && (
          <>
            <Symbol name={confirm.kind === "delete" ? "delete" : "person_remove"} className="mx-auto block text-md-on-surface-variant" />
            <h2 className="mt-4 text-center text-2xl font-normal">
              {confirm.kind === "delete" ? "Delete this lead?" : "Mark as unsubscribed?"}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-md-on-surface-variant">
              {confirm.kind === "delete"
                ? <>{name} ({email}) will be permanently removed from the waiting list. Use this for data-deletion requests. This can&apos;t be undone.</>
                : <>{name} won&apos;t receive launch updates or tips, and their WhatsApp and email opt-ins will be cleared. Use this when someone asks to stop hearing from you.</>}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirm(null)} className="state-layer h-10 rounded-full px-4 text-sm font-medium text-md-primary">Cancel</button>
              <button type="button" onClick={run} disabled={pending}
                      className={`state-layer h-10 rounded-full px-4 text-sm font-medium disabled:opacity-60
                                  ${confirm.kind === "delete" ? "bg-md-error text-md-on-error" : "bg-md-primary text-md-on-primary"}`}>
                {pending ? "Working…" : confirm.kind === "delete" ? "Delete" : "Unsubscribe"}
              </button>
            </div>
          </>
        )}
      </dialog>

    </div>
  );
}
