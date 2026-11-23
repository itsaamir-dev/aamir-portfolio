"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Sends one page-view beacon per page (including client-side navigations). No cookies. */
export default function TrackPageView() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (!pathname) return;
    // The real referrer only applies to the first page; later pages came from this site.
    const referrer = first.current ? document.referrer : "";
    first.current = false;
    const body = JSON.stringify({ path: pathname, referrer });
    try {
      if (!navigator.sendBeacon?.("/api/track", new Blob([body], { type: "application/json" }))) {
        fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
      }
    } catch { /* never affect the page */ }
  }, [pathname]);
  return null;
}
