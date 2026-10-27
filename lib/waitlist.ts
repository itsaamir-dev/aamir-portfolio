// Validation shared by the waiting-list form (client) and API (server).

export type WaitlistInput = {
  firstName: string;
  email: string;
  whatsapp?: string;
  marketingConsent?: boolean;
  whatsappConsent?: boolean;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingPage?: string;
  referrer?: string;
  /** Honeypot — real people leave it empty. */
  company?: string;
};

export type FieldErrors = Partial<Record<"firstName" | "email" | "whatsapp" | "whatsappConsent", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

/** "+91 98765-43210" → "+919876543210". Returns null if it isn't a plausible international number. */
export function normalizeWhatsapp(raw: string): string | null {
  const compact = raw.trim().replace(/[\s().-]/g, "");
  if (!/^\+\d{8,15}$/.test(compact)) return null;
  return compact;
}

export function validateWaitlist(input: WaitlistInput): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.firstName?.trim() ?? "";
  if (!name) errors.firstName = "Please enter your first name.";
  else if (name.length > 60) errors.firstName = "Please keep your first name under 60 characters.";
  else if (/https?:|www\.|[<>]/i.test(name)) errors.firstName = "Please enter just your first name.";

  const email = normalizeEmail(input.email ?? "");
  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > 254 || !EMAIL_RE.test(email)) errors.email = "Please enter a valid email address, like name@example.com.";

  const phone = input.whatsapp?.trim();
  if (phone) {
    if (!normalizeWhatsapp(phone)) errors.whatsapp = "Include your country code, like +91 98765 43210.";
  } else if (input.whatsappConsent) {
    errors.whatsappConsent = "Add your WhatsApp number to get updates there.";
  }
  return errors;
}

/** Trims optional attribution strings and caps their length. */
export const clip = (v: unknown, max = 300) =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null;
