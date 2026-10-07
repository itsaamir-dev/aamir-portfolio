import Icon from "@/components/Icon";
import { WHATSAPP_URL } from "@/lib/site";

/**
 * The primary conversion action. `primary` marks buttons the sticky mobile
 * CTA should hide behind while they're on screen.
 */
export default function WhatsAppButton({
  label = "Join the free WhatsApp community",
  primary = false,
  className = "",
}: { label?: string; primary?: boolean; className?: string }) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-wa ${className}`}
      {...(primary ? { "data-primary-cta": "" } : {})}
    >
      <Icon name="chat" size={18} />
      {label}
    </a>
  );
}
