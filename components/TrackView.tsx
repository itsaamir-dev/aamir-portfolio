"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/** Sends `event` once, the first time at least 40% of the children are visible. */
export default function TrackView({ event, params, children, className }: {
  event: string; params?: Record<string, string>; children: ReactNode; className?: string;
}) {
  const ref   = useRef<HTMLDivElement>(null);
  const fired = useRef(false);
  const latest = useRef({ event, params });
  latest.current = { event, params };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !fired.current) {
        fired.current = true;
        trackEvent(latest.current.event, latest.current.params);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}
