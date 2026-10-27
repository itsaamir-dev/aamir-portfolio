"use client";
import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * next/link that also sends a GA4 event on click, e.g.
 * <TrackedLink href="/learn" event="learn_resource_click" params={{ topic: "pricing" }}>
 */
export default function TrackedLink({
  event, params, onClick, ...props
}: ComponentProps<typeof Link> & { event: string; params?: Record<string, string | number> }) {
  return (
    <Link
      {...props}
      onClick={e => { trackEvent(event, params); onClick?.(e); }}
    />
  );
}
