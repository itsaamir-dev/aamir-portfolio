// Single source of truth for Build With Aamir copy that appears on more than
// one page. Update figures here and every page, FAQ and structured data
// follows.

// ─── COMMUNITY ──────────────────────────────────────────────────────────────
// Official invite. Can be overridden with NEXT_PUBLIC_WHATSAPP_URL.
export const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://chat.whatsapp.com/INxKzPpIDVU2R43SVo8Z4s";

export const CTA_LABEL = "Join the free WhatsApp community"; // rendered uppercase by .btn
export const PROMISE   = "Learn Freelancing. Get International Clients. Earn in USD.";
export const TRUST_LINE = "Practical lessons from real freelancing experience. No guaranteed-income promises.";

// ─── CREDIBILITY ────────────────────────────────────────────────────────────
// Current headline figure. Approximate figures keep their "~".
export const EARNINGS = "$80K+";

export const proofStats = [
  { value: EARNINGS,        label: "Earned on Upwork",       approx: false },
  { value: "~18",           label: "Completed Upwork jobs",  approx: true },
  { value: "~70%",          label: "Clients from the US",    approx: true },
  { value: "Top Rated Plus", label: "Upwork status",          approx: false },
];

export const PROOF_NOTE =
  "“~” means approximate. These are my own results, not a prediction of what anyone else will earn.";

// ─── STORY TIMELINE ─────────────────────────────────────────────────────────
export const storyTimeline = [
  { when: "September 2024",    what: "Started taking Upwork seriously" },
  { when: "First project",     what: "A MERN stack website for a Jiu Jitsu platform" },
  { when: "First payment",     what: "Approximately $3,000" },
  { when: "January 2025",      what: "A major breakthrough in my freelancing journey" },
  { when: "Year 1",            what: "Approximately $1K+ per month" },
  { when: "Year 2",            what: "Approximately $4K+ per month" },
  { when: "Current milestone", what: `${EARNINGS} earned on Upwork` },
];

// ─── 30-DAY CHALLENGE ───────────────────────────────────────────────────────
// The working content history of the 30-day journey. Add the next day here.
// `href` only when a real, public URL exists — never a placeholder.
export type ChallengeDay = {
  day: number;
  title: string;
  summary?: string;
  points?: string[];
  href?: string;
  related?: { label: string; href: string };
};

export const CHALLENGE_TOTAL = 30;

export const challengeDays: ChallengeDay[] = [
  { day: 1, title: "The Upwork milestone that started this journey" },
  { day: 2, title: "How I got my first Upwork client" },
  { day: 3, title: "Three lessons from getting my first client" },
  { day: 4, title: "Freelancing lessons and credibility" },
  { day: 5, title: "Stop sending generic proposals" },
  { day: 6, title: "Client trust and communication" },
  { day: 7, title: "Five mistakes freelancers make when applying for jobs" },
  { day: 8, title: `Crossing ${EARNINGS} on Upwork` },
  {
    day: 9,
    title: "Sending proposals but getting no replies?",
    summary:
      "Three things to review before your next application: relevance, understanding the client’s problem, and communicating your value clearly.",
    points: [
      "Apply to projects that are genuinely relevant to your skills.",
      "Address the client’s actual problem, not just the job title.",
      "Explain the value you bring clearly and specifically.",
    ],
    related: {
      label: "Related article: Upwork proposals for developers",
      href: "/blog/upwork-proposals-for-developers-that-win",
    },
  },
];

export const latestChallengeDay = challengeDays[challengeDays.length - 1];

// ─── LEARNING TOPICS ────────────────────────────────────────────────────────
// `match` groups blog posts onto the Learn page (first matching topic wins,
// in this order), so new freelancing articles appear automatically.
export const learnTopics = [
  {
    id: "proposals",
    icon: "file",
    title: "Proposals and Client Communication",
    desc: "How to understand what a client needs and communicate the value you bring.",
    match: /proposal|communicat|cover letter|\bupdates?\b/,
  },
  {
    id: "mistakes",
    icon: "x",
    title: "Freelancing Mistakes and Lessons",
    desc: "Real lessons, common mistakes and practical improvements from my own work.",
    match: /mistake|lesson|scope creep|scope-creep/,
  },
  {
    id: "pricing",
    icon: "dollar",
    title: "Pricing and Earning in USD",
    desc: "Pricing considerations, negotiation and professional client relationships. No promised numbers.",
    match: /pricing|\brates?\b|hourly|fixed price|negotiat|escrow|payment|income|profitable/,
  },
  {
    id: "profile",
    icon: "user",
    title: "Profile and Positioning",
    desc: "How to present your relevant skills and experience clearly so the right clients notice you.",
    match: /profile|positioning|top rated|portfolio/,
  },
  {
    id: "clients",
    icon: "globe",
    title: "International Client Acquisition",
    desc: "Practical ways to find suitable opportunities beyond your local market.",
    match: /client|time zone|timezones?|remote work/,
  },
  {
    id: "career",
    icon: "arrow",
    title: "Career Development",
    desc: "Building on your technical skills and developing the commercial skills freelancing needs.",
    match: /career|senior|junior|mentor|technical debt|code review|transition/,
  },
] as const;

export type LearnTopicId = (typeof learnTopics)[number]["id"];

// Display order on the site (matching order above is for classification).
export const learnTopicOrder: LearnTopicId[] = ["profile", "proposals", "clients", "pricing", "mistakes", "career"];

// ─── COMMUNITY ──────────────────────────────────────────────────────────────
export const communityBenefits = [
  "Learn practical freelancing concepts.",
  "Improve your approach to proposals and clients.",
  "Follow the 30-day content journey.",
  "Connect with people working toward similar professional goals.",
];

// ─── AUDIENCE ───────────────────────────────────────────────────────────────
export const audienceFor = [
  "Developers, designers and other skilled professionals seeking international clients.",
  "Freelancers who are new to Upwork.",
  "Freelancers who are applying but struggling to get replies.",
  "Professionals who want practical advice and honest lessons.",
];

export const audienceNotFor = [
  "People expecting guaranteed income.",
  "People seeking overnight success.",
  "People unwilling to learn, practice or improve.",
];

// ─── FAQ ────────────────────────────────────────────────────────────────────
export const faqs = [
  {
    q: "Is the WhatsApp community free?",
    a: "Yes. The Build With Aamir WhatsApp Community is free to join, and you can leave any time.",
  },
  {
    q: "Do I need to be a developer?",
    a: "No. Much of what I share comes from my own work as a software engineer, but the lessons on profiles, proposals, client communication and pricing apply to designers and other skilled professionals too.",
  },
  {
    q: `Can I earn ${EARNINGS} on Upwork too?`,
    a: `${EARNINGS} is my personal result, after 8+ years as a software engineer and roughly 1.5 years of taking Upwork seriously. It isn’t a promise or a prediction of what you will earn. Results depend on your skills, your niche, the market and the work you put in.`,
  },
  {
    q: "Can beginners join?",
    a: "Yes. Everyone starts with a first client — mine came after I started taking Upwork seriously in September 2024. The community is a good place to learn the basics and ask questions.",
  },
  {
    q: "What will I learn in the community?",
    a: "Practical freelancing concepts: presenting your profile, writing proposals that address the client’s problem, communicating with clients, finding international opportunities and thinking about pricing. You’ll also get updates from the 30-day journey. It doesn’t guarantee clients or income.",
  },
  {
    q: "How do I join?",
    a: "Tap any “Join the free WhatsApp community” button on this site. It opens the community invite in WhatsApp.",
  },
];
