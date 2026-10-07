// ─── COMMUNITY ──────────────────────────────────────────────────────────────
// Can be overridden with NEXT_PUBLIC_WHATSAPP_URL.
export const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://chat.whatsapp.com/INxKzPpIDVU2R43SVo8Z4s";

export const PROMISE = "Learn Freelancing. Get International Clients. Earn in USD.";

// ─── PROOF ──────────────────────────────────────────────────────────────────
// Approximate by design — keep the "~" where the number is approximate.
export const proofStats = [
  { value: "$70K+",      label: "Earned on Upwork" },
  { value: "~18",        label: "Upwork jobs" },
  { value: "~70%",       label: "US clients" },
  { value: "Top Rated+", label: "Upwork status" },
];

// ─── STORY TIMELINE ─────────────────────────────────────────────────────────
export const storyTimeline = [
  { when: "September 2024", what: "Started taking Upwork seriously" },
  { when: "First project",  what: "A MERN stack Jiu Jitsu platform" },
  { when: "~$3,000",        what: "First Upwork payment" },
  { when: "January 2025",   what: "Major breakthrough" },
  { when: "Year 1",         what: "~$1K+ per month" },
  { when: "Year 2",         what: "~$4K+ per month" },
  { when: "Today",          what: "$70K+ earned on Upwork" },
];

// ─── 30-DAY CHALLENGE ───────────────────────────────────────────────────────
// Only list days that have actually been published. Add `href` when a day
// has a post or video to link to.
export const challengeDays: { day: number; title: string; href?: string }[] = [
  { day: 1, title: "Building With Aamir" },
];

// ─── FAQ ────────────────────────────────────────────────────────────────────
export const faqs = [
  {
    q: "Is the community really free?",
    a: "Yes. Joining the WhatsApp community costs nothing.",
  },
  {
    q: "Do I need to be a developer?",
    a: "No. Most of what I share comes from my own work as a software engineer, but the ideas about profiles, proposals, clients and pricing apply to most skills people sell on Upwork.",
  },
  {
    q: "Will I earn $70K+ too?",
    a: "There's no guarantee. $70K+ is what I earned, on top of 8+ years as an engineer and a lot of trial and error. I share what worked for me so you can adapt it. Your results depend on your skills, your niche and the effort you put in.",
  },
  {
    q: "I've never freelanced. Is it too early?",
    a: "No. Everyone starts with a first client. I got mine in September 2024. The community is a good place to learn how to approach that first step.",
  },
  {
    q: "How do I join?",
    a: "Tap any “Join the free WhatsApp community” button on this page. It opens the invite in WhatsApp.",
  },
];
