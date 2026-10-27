// Single place to edit the e-book offer. Nothing here claims the book is
// finished: `status` stays "waitlist" until it can actually be bought.

export const ebook = {
  status: "waitlist" as "waitlist" | "launched",

  title:    "The Freelancing Playbook",
  subtitle: "How to Get International Clients and Earn in USD",
  description:
    "A practical guide to positioning your skills, finding the right opportunities, writing stronger proposals, communicating with clients, and building a sustainable freelancing career.",

  /** Planned launch discount for people on the waiting list. */
  discountPercent: 90,
  /** Final terms aren't confirmed — keep true until the price and launch date are set. */
  offerIsPlanned: true,

  /** Regular price in the smallest sensible unit, e.g. 499 for ₹499. null until decided. */
  regularPrice: null as number | null,
  currency: "INR",

  /** Launch date as ISO yyyy-mm-dd. null until confirmed — never show a guessed date. */
  launchDate: null as string | null,

  highlights: [
    "Practical freelancing lessons.",
    "Finding and approaching international clients.",
    "Improving proposals and client communication.",
    "Lessons drawn from real freelancing experience.",
    "Early access to the planned launch offer.",
  ],

  audience: [
    "Developers who want to start freelancing.",
    "Designers and other skilled professionals looking for international clients.",
    "Freelancers who send proposals but rarely get replies.",
  ],
};

export const OFFER_HEADLINE = `${ebook.title} Is Coming. Get ${ebook.discountPercent}% OFF at Launch.`;

/**
 * Exact launch price after the discount, rounded to 2 decimals only.
 * ₹499 at 90% off → 49.9 (₹49.90). Never silently round to ₹49 or ₹50.
 */
export function launchPrice(regular = ebook.regularPrice, percent = ebook.discountPercent): number | null {
  if (regular == null) return null;
  return Math.round(regular * (100 - percent)) / 100;
}

export function formatPrice(amount: number, currency = ebook.currency) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, minimumFractionDigits: 2 }).format(amount);
}

export const ebookFaqs = [
  {
    q: "Is the e-book available now?",
    a: `No. ${ebook.title} is still being written. Join the waiting list and you’ll hear when it’s ready.`,
  },
  {
    q: "How much does it cost to join the waiting list?",
    a: "Nothing. Joining the waiting list is free and doesn’t require any payment.",
  },
  {
    q: `What is the ${ebook.discountPercent}% launch discount?`,
    a: `It’s a planned early-bird offer for people on the waiting list: ${ebook.discountPercent}% off the regular price at launch. The final price, launch date and offer terms haven’t been confirmed yet — they’ll be shared with the list before anything goes on sale.`,
  },
  {
    q: "Who is this e-book for?",
    a: "Mainly developers and other skilled professionals who want to start freelancing or get better at finding international clients. It isn’t a get-rich-quick guide and won’t guarantee clients or income.",
  },
  {
    q: "How will I receive launch updates?",
    a: "By email, at the address you sign up with. If you add your WhatsApp number and tick the box, I may also send launch updates there. You can unsubscribe at any time.",
  },
  {
    q: "Can I join the free WhatsApp community without buying anything?",
    a: "Yes. The Build With Aamir WhatsApp Community is free and separate from the e-book. You can join it whether or not you ever buy the book.",
  },
];
