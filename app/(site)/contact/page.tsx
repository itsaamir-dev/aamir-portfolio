import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { BUSINESS } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const PATH = "/contact";
export const metadata: Metadata = pageMetadata(
  PATH, "Contact Us",
  "How to contact Build With Aamir about job applications, payments, privacy requests or anything else.",
);

const a = "text-ink underline underline-offset-4";

const sections: LegalSection[] = [
  {
    id: "email", title: "Email",
    body: <>
      <p>
        <a href={`mailto:${BUSINESS.email}`} className="text-[1.25rem] font-medium text-ink underline underline-offset-4">{BUSINESS.email}</a>
      </p>
      <p>We aim to reply within 2 business days.</p>
    </>,
  },
  {
    id: "topics", title: "What to include",
    body: <ul className="list-disc space-y-1 pl-5">
      <li><strong className="text-ink">Job applications:</strong> the job title and the email you applied with.</li>
      <li><strong className="text-ink">Payments:</strong> your payment ID or application reference (shown after you pay). See the{" "}
        <Link href="/refund-policy" className={a}>Refund &amp; Cancellation Policy</Link>.</li>
      <li><strong className="text-ink">Privacy and data deletion:</strong> the email you used on the site. See the{" "}
        <Link href="/privacy" className={a}>Privacy Policy</Link>.</li>
      <li><strong className="text-ink">Projects and collaborations:</strong> a short description of what you have in mind.</li>
    </ul>,
  },
  {
    id: "business", title: "Business details",
    body: <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[10rem_minmax(0,1fr)]">
      <dt className="text-muted">Business</dt><dd className="text-ink">{BUSINESS.name}</dd>
      <dt className="text-muted">Owner</dt><dd className="text-ink">{BUSINESS.owner}</dd>
      <dt className="text-muted">Country</dt><dd className="text-ink">{BUSINESS.country}</dd>
      <dt className="text-muted">Website</dt><dd className="text-ink">{BUSINESS.website}</dd>
      <dt className="text-muted">LinkedIn</dt>
      <dd><a href="https://linkedin.com/in/itsaamirbashir" target="_blank" rel="noopener noreferrer" className={a}>linkedin.com/in/itsaamirbashir</a></dd>
    </dl>,
  },
];

export default function ContactPage() {
  return (
    <LegalPage path={PATH} crumb="Contact" title="Contact Us" sections={sections}
      intro={<p>Questions about a job application, a payment, your data or working together — get in touch.</p>} />
  );
}
