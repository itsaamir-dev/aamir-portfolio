"use client";
import { useEffect, useState } from "react";
import Symbol from "@/components/admin/Symbol";

type Toast = { ok: boolean; message: string; id: number };
const EVENT = "admin:toast";

/** Show an M3 snackbar from anywhere in the admin (survives the caller unmounting). */
export function showToast(t: { ok: boolean; message: string }) {
  window.dispatchEvent(new CustomEvent<Toast>(EVENT, { detail: { ...t, id: Date.now() } }));
}

export default function Snackbar() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const on = (e: Event) => setToast((e as CustomEvent<Toast>).detail);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-6">
      {toast && (
        <div key={toast.id}
             className="pointer-events-auto flex min-h-12 w-full max-w-sm items-center gap-3 rounded-[4px] bg-md-inverse-surface px-4 py-3
                        text-sm text-md-inverse-on-surface shadow-xl">
          <Symbol name={toast.ok ? "check_circle" : "error"} size={20} />
          <span className="flex-1">{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss"
                  className="state-layer -mr-2 grid h-10 w-10 place-items-center rounded-full">
            <Symbol name="close" size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
