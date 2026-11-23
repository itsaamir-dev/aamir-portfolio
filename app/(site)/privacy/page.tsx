import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { BUSINESS } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const PATH = "/privacy";
export const metadata: Metadata = pageMetadata(
  PATH, "Privacy Policy",
  "What personal data Build With Aamir collects, why, who it’s shared with, how long it’s kept and how to have it deleted.",
);

const a = "text-ink underline underline-offset-4";
const mail = <a href={`mailto:${BUSINESS.email}`} className={a}>{BUSINESS.email}</a>;

const sections: LegalSection[] = [
  {
    id: "who", title: "Who we are",
    body: <p>
      {BUSINESS.website} is run by {BUSINESS.owner} ({BUSINESS.name}), based in {BUSINESS.country}. We are responsible for the personal
      data described here and handle it in line with India’s Digital Personal Data Protection Act, 2023. Contact: {mail}.
    </p>,
  },
  {
    id: "collect", title: "What we collect",
    body: <>
      <p><strong className="text-ink">When you apply for a job:</strong> your name, email, WhatsApp or phone number, location (optional),
        portfolio and LinkedIn links (optional), experience, your résumé file and your proposal.</p>
      <p><strong className="text-ink">When you pay a referral fee:</strong> the payment provider’s order and payment IDs, the amount and
        the payment status. Card, UPI and bank details are entered on, and kept by, the payment provider — we never receive them.</p>
      <p><strong className="text-ink">When you join the e-book waiting list:</strong> your first name, email and, if you give it, your
        WhatsApp number.</p>
      <p><strong className="text-ink">Automatically, when you visit a page:</strong> the page address, the site that linked you here,
        your device type and browser, and your approximate location (country, region and city) worked out from your IP address by our
        hosting provider. We don’t store your IP address: visits are counted with a one-way code that changes every day, so we can tell how
        many people visited without identifying anyone. We also use Google Analytics for similar anonymous statistics, and a one-way hash
        of your IP address to limit abuse of forms. Your light/dark theme choice is stored in your own browser. No advertising cookies are used.</p>
    </>,
  },
  {
    id: "use", title: "How we use it",
    body: <ul className="list-disc space-y-1 pl-5">
      <li>to review your application and refer it to the hiring team;</li>
      <li>to confirm your payment and keep records required for accounting and tax;</li>
      <li>to contact you about your application, the waiting list or something you asked us;</li>
      <li>to keep the site secure and prevent spam and fraud;</li>
      <li>to understand how the site is used and improve it.</li>
    </ul>,
  },
  {
    id: "share", title: "Who we share it with",
    body: <>
      <p>We don’t sell your personal data. We share it only with:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong className="text-ink">The hiring team</strong> for the job you applied to, if we refer you — your application details, résumé and proposal;</li>
        <li><strong className="text-ink">Payment providers</strong> (Cashfree Payments, Razorpay) to process your payment;</li>
        <li><strong className="text-ink">Service providers</strong> that run the site for us: Vercel (hosting), Neon (database) and Google Analytics;</li>
        <li>authorities, when the law requires it.</li>
      </ul>
      <p>Some of these providers may store data on servers outside India.</p>
    </>,
  },
  {
    id: "retention", title: "How long we keep it",
    body: <ul className="list-disc space-y-1 pl-5">
      <li>Applications that are never paid, and their résumés, are deleted automatically within 3 days.</li>
      <li>Paid applications are kept while the job and any referral are in progress, and afterwards so we can consider you for similar roles, until you ask us to delete them.</li>
      <li>Payment records are kept as long as accounting and tax law requires, even if the application itself is deleted.</li>
      <li>Waiting-list details are kept until the e-book launches or you ask to be removed.</li>
      <li>Page-visit statistics are kept for about 13 months, then deleted.</li>
    </ul>,
  },
  {
    id: "rights", title: "Your choices and rights",
    body: <p>
      You can ask to see, correct or delete your personal data, or withdraw your consent, by emailing {mail}. We’ll respond within 30 days.
      Deleting an application doesn’t make the referral fee refundable (see the{" "}
      <Link href="/refund-policy" className={a}>Refund &amp; Cancellation Policy</Link>). If you’re unhappy with how we handled your
      request, you can complain to the Data Protection Board of India.
    </p>,
  },
  {
    id: "security", title: "Security",
    body: <p>
      The site uses HTTPS. Résumés can only be downloaded by a signed-in administrator, and payments are handled by PCI-DSS compliant
      providers. No system is perfectly secure, but we limit who can access your data and keep only what we need.
    </p>,
  },
  {
    id: "children", title: "Children",
    body: <p>The site’s services are for people aged 18 and over. We don’t knowingly collect data from children.</p>,
  },
  {
    id: "changes", title: "Changes",
    body: <p>We’ll update this page if how we handle personal data changes. The date at the top shows the latest version.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage path={PATH} crumb="Privacy" title="Privacy Policy" sections={sections}
      intro={<p>What we collect, why, who sees it, how long we keep it, and how to have it deleted.</p>} />
  );
}
