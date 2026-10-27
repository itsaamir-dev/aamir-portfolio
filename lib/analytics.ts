import { sendGAEvent } from "@next/third-parties/google";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Sends a GA4 event. No-op when GA isn't configured. */
export function trackEvent(name: string, params: Record<string, string | number> = {}) {
  if (!GA_ID) return;
  sendGAEvent("event", name, params);
}

/** Records a click on any "join the WhatsApp community" button. */
export function trackJoinCommunity(location: string) {
  trackEvent("join_community", { cta_location: location });
}
