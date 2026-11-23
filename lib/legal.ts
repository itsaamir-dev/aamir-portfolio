// Business details shown on the policy pages. Update here and every page follows.

export const LEGAL_UPDATED = "November 23, 2026";

export const BUSINESS = {
  name: "Build With Aamir",
  owner: "Aamir Bashir",
  country: "India",
  email: "aamirbashir.ahangar@gmail.com",
  website: "buildwithaamir.com",
};

export const legalPages = [
  { href: "/terms",         label: "Terms & Conditions" },
  { href: "/privacy",       label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund & Cancellation Policy" },
  { href: "/contact",       label: "Contact Us" },
] as const;
