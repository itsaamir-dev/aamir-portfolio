import { sendGAEvent } from "@next/third-parties/google";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Records a click on any "join the WhatsApp community" button. No-op without GA. */
export function trackJoinCommunity(location: string) {
  if (!GA_ID) return;
  sendGAEvent("event", "join_community", { cta_location: location });
}
