import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
import { BUSINESS } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

const PATH = "/refund-policy";
export const metadata: Metadata = pageMetadata(
  PATH, "Refund & Cancellation Policy",
  "Referral fees paid on Build With Aamir are non-refundable. How cancellations, payment errors and service delivery work.",
);

const mail = <a href={`mailto:${BUSINESS.email}`} className="text-ink underline underline-offset-4">{BUSINESS.email}</a>;

const sections: LegalSection[] = [
  {
    id: "no-refunds", title: "All fees are non-refundable",
    body: <>
      <p>
        The referral fee you pay to apply for a job on {BUSINESS.website} is <strong className="text-ink">non-refundable</strong>.
        It pays for reviewing your application and, where your profile fits, referring it to the hiring team. That work starts as
        soon as your application is submitted.
      </p>
      <p>Once paid, the fee is not refunded in any of these cases, among others:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>your application is not shortlisted or referred;</li>
        <li>you are referred but not interviewed or hired;</li>
        <li>the job is filled, paused, closed or withdrawn by the hiring team;</li>
        <li>you change your mind, withdraw your application or applied by mistake;</li>
        <li>the details, résumé or proposal you submitted were incomplete or incorrect.</li>
      </ul>
      <p>You see the fee, and confirm that you understand it is non-refundable, before you pay.</p>
    </>,
  },
  {
    id: "no-guarantee", title: "No guarantee of an interview or job",
    body: <p>
      Paying the fee does not guarantee a referral, an interview, a job offer or any income. Hiring decisions are made by the hiring
      team, not by {BUSINESS.name}.
    </p>,
  },
  {
    id: "cancellation", title: "Cancellation",
    body: <>
      <p>
        A submitted (paid) application can’t be cancelled for a refund. You can still ask us to stop considering it and to delete your
        details and résumé — email {mail}.
      </p>
      <p>
        If you leave before completing payment, nothing is charged and your application isn’t submitted. Unpaid applications and their
        résumés are deleted automatically within 3 days.
      </p>
    </>,
  },
  {
    id: "payment-errors", title: "Duplicate or failed payments",
    body: <>
      <p>
        This policy doesn’t cover payment errors. If you were charged more than once for the same application, or money left your
        account but your application wasn’t submitted, email {mail} within 7 days with your payment ID or reference. We’ll check it with
        our payment provider and, if the error is confirmed, either submit your application or return the extra amount to your original
        payment method. Returned amounts usually reach you within 5–7 business days, depending on your bank.
      </p>
      <p>
        When a payment fails but money is debited, your bank or payment app normally reverses it automatically, usually within a few
        business days.
      </p>
    </>,
  },
  {
    id: "delivery", title: "Service delivery",
    body: <p>
      The referral service is delivered online; nothing is shipped. Your application is confirmed on screen as soon as payment succeeds,
      with a reference number. Reviews and referrals then happen over the following days, depending on the job.
    </p>,
  },
  {
    id: "contact", title: "Questions",
    body: <p>
      Email {mail}, or see our <Link href="/contact" className="text-ink underline underline-offset-4">contact page</Link>. Please
      include your payment ID or application reference.
    </p>,
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPage path={PATH} crumb="Refund Policy" title="Refund & Cancellation Policy" sections={sections}
      intro={<p>Short version: referral fees are non-refundable. Payment errors, like being charged twice, are always fixed.</p>} />
  );
}
