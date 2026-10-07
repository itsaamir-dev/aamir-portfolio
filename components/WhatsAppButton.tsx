"use client";
import Icon from "@/components/Icon";
import { WHATSAPP_URL } from "@/lib/site";
import { trackJoinCommunity } from "@/lib/analytics";

/**
 * The primary conversion action. `primary` marks buttons the sticky mobile
 * CTA should hide behind while they're on screen. `location` is reported to
 * analytics so you can see which button people use.
 */
export default function WhatsAppButton({
  label = "Join the free WhatsApp community",
  primary = false,
  location,
  className = "",
}: { label?: string; primary?: boolean; location: string; className?: string }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackJoinCommunity(location)}
      className={`btn-wa ${className}`}
      {...(primary ? { "data-primary-cta": "" } : {})}
    >
      <Icon name="chat" size={18} />
      {label}
    </a>
  );
}
